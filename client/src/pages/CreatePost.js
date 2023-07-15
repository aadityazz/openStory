import 'react-quill/dist/quill.snow.css';
import { useState } from "react";
import { Navigate } from "react-router-dom";
import Editor from "../Editor";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState(null);
  const [generatingImg, setGeneratingImg] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [generated, setGenerated] = useState(null);

  const generateImage = async () => {
    if (title) {
      try {
        setGeneratingImg(true);
        const response = await fetch('https://openstories.onrender.com/api/v1/dalle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: title,
          }),
        });

        const data = await response.json();
        setGenerated(data.photo); // Update the state with the generated image URL
      } catch (err) {
        console.error(err);
        toast.error('Failed to generate image. Please try again.');
      } finally {
        setGeneratingImg(false);
      }
    } else {
      toast.warn('Please provide a title for the prompt.');
    }
  };

  const createNewPost = async (ev) => {
    ev.preventDefault();

    if (!files && !generated) {
      alert('Please upload a file or generate an image.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('summary', summary);
    formData.append('content', content);
    if (files) {
      formData.append('file', files[0]);
    } else if (generated) {
      formData.append('generatedImage', generated); // Append the generated image URL as a new field in the form data
    }

    try {
      const response = await fetch('https://openstories.onrender.com/post', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (response.ok) {
        setRedirect(true);
      } else {
        console.log('Error:', response.status);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to create post. Please try again.');
    }
  };

  if (redirect) {
    return <Navigate to={'/'} />;
  }

  return (
      <form onSubmit={createNewPost}>
        <input
            type="text"
            name="title"
            placeholder="Title"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
        />

        <input
            type="text"
            name="summary"
            placeholder="Summary"
            value={summary}
            onChange={(ev) => setSummary(ev.target.value)}
        />
        <input type="file" onChange={(ev) => setFiles(ev.target.files)} />

        {files ? (
            <div>
              <img style={{ width: '300px', height: '300px' }}
                  src={URL.createObjectURL(files[0])} alt="Uploaded" />
            </div>
        ) : (
            <div>
              {generated && (
                  <img
                      style={{ width: '300px', height: '300px' }}
                      src={`data:image/jpeg;base64,${generated}`}
                      alt="Generated"
                  />
              )}
              {!generated && (
                  <button type="button" onClick={generateImage} disabled={generatingImg}>
                    {generatingImg ? 'Generating...' : 'Generate Image'}
                  </button>
              )}
            </div>
        )}

        <Editor value={content} onChange={setContent} />
        <button style={{ marginTop: '5px' }}>Create post</button>
      </form>
  );
}



