const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


const fs = require("fs");
const Process = require("process");

const { Configuration, OpenAIApi } = require('openai');
const cloudinary = require('cloudinary').v2;

require('dotenv').config();

cloudinary.config({
  cloud_name: Process.env.CLOUD_NAME ,
  api_key: Process.env.API_KEY ,
  api_secret: Process.env.API_SECRET ,
});


const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');


process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
});

const uploadMiddleware = multer({
  storage,
  limits: {
    fieldSize: 10 * 1024 * 1024,
  },
});


const salt = bcrypt.genSaltSync(10);
const secret = "asdfe45we45w345wegw345werjktjwertkj";

const app = express();

app.use(cors({ credentials: true, origin: 'https://open-stories-fte-demo.netlify.app' }));
app.use(express.json());
app.use(cookieParser());

const configuration = new Configuration({
  apiKey: Process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

let generatedURL = null;

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });

  if (!userDoc) {
    // User not found
    return res.status(400).json('User not found');
  }

  const passOk = bcrypt.compareSync(password, userDoc.password);

  if (passOk) {
    // Password is correct, generate and set JWT token as a cookie
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie('token', token).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    // Password is incorrect
    res.status(400).json('Wrong credentials');
  }
});


app.get('/profile', (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});

app.post('/logout', (req, res) => {
  res.cookie('token', '').json('ok');
});

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
  try {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to verify token' });
      }
      console.log(req.body)
      const { title, summary, content } = req.body;
      const file = req.file;
      const generatedImage = `data:image/jpeg;base64,${req.body.generatedImage}`; // Get the generated image URL from the request

      let cover;

      if (file) {
        // If the file is present, upload it to Cloudinary and get the URL
        const photoUrl = await cloudinary.uploader.upload(file.path);
        cover = photoUrl.url;
      } else if (generatedImage) {
        // If the generatedImage is present, use it directly as the cover URL
        cover = generatedImage;
      } else {
        return res.status(400).json({ message: 'Missing required parameter - file or generatedImage' });
      }

      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover,
        author: info.id,
      });

      res.json(postDoc);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create post' });
  }
});




app.put('/post/:id', async (req, res) => {
  try {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
      const { id } = req.params; // Get the post ID from the URL parameter
      const { summary, content } = req.body;
      const postDoc = await Post.findById(id);
      const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(400).json('You are not the author');
      }
      postDoc.summary = summary;
      postDoc.content = content;
      await postDoc.save();
      res.json(postDoc);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json('Failed to update post');
  }
});



app.get('/post', async (req, res) => {
  res.json(
      await Post.find()
          .populate('author', ['username'])
          .sort({ createdAt: -1 })
          .limit(20)
  );
});

app.get('/post/:id', async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']);
  res.json(postDoc);
});


app.use('/api/v1/dalle', async (req, res, next) => {
   if (req.method === 'GET') {
     res.status(200).json({ message: 'Hello from DALL-E!' });
   } else if (req.method === 'POST') {
     try {
       const { prompt } = req.body;
       console.log('Prompt:', prompt);
       const aiResponse = await openai.createImage({
         prompt,
         n: 1,
         size: '512x512',
         response_format: 'b64_json',
       });
       console.log('AI Response:', aiResponse.data);
       const image = aiResponse.data.data[0].b64_json;
       generatedURL = image;
       res.status(200).json({ photo: image });
    } catch (error) {
      console.error(error);
      res
          .status(500)
          .send(error?.response?.data?.error?.message || 'Something went wrong');
    }
  } else {
    next();
  }
});

const connectDB = (url) => {
  mongoose.set('strictQuery', true);
  mongoose.connect(url)
      .then(() => console.log('connected to mongo'))
      .catch((err) => {
        console.error('failed to connect with mongo');
        console.error(err);
      });
}

connectDB("mongodb+srv://adigpt0022:Aaditya%4002@cluster0.phufnze.mongodb.net/?retryWrites=true&w=majority");

app.listen(4000);
