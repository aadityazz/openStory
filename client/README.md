# Open Story

Open Story is an application that allows users to register, login, and engage with a community of storytellers. Users can read stories posted by others, create their own stories, and even generate images using AI if they don't have one. The application utilizes React.js for the frontend, MongoDB for the database, Node.js and Express.js for backend functionality, Cloudinary for cloud storage, and OpenAI for AI-generated images.

## Features

- User Registration: Users can create an account by registering with their email and password.

- User Login: Registered users can log in to the application using their credentials.

- Read Stories: Users can browse and read stories posted by other members of the community.

- Create Stories: Users can create their own stories by providing a title, summary, story content, and an optional image.

- AI-Generated Images: If a user doesn't have an image for their story, they can choose to generate one using AI. This feature is powered by OpenAI APIs.

- Cloud Storage: All images are stored in Cloudinary, a cloud storage service.

- MongoDB Integration: All stories are stored in MongoDB, providing a reliable and scalable database solution.

## Known Issues

The application currently has some bugs related to image handling. These issues will be addressed and resolved in future updates to enhance the user experience.

## Technologies Used

- React.js: A JavaScript library for building user interfaces.

- MongoDB: A document-oriented NoSQL database.

- Node.js: A JavaScript runtime environment for server-side applications.

- Express.js: A web application framework for Node.js.

- Cloudinary: A cloud-based image and video management service.

- OpenAI: An artificial intelligence platform used for generating images.

## Contributing

Open Story is an open-source project, and contributions from the community are welcome. If you'd like to contribute, please follow these steps:

1. Fork the repository.

2. Create a new branch for your contribution.

3. Make the necessary changes and commit them.

4. Push your changes to your branch in the forked repository.

5. Submit a pull request, detailing the changes you've made.

Please ensure that your contributions align with the project's guidelines and coding standards.

## Getting Started

To get started with Open Story, follow these steps:

1. Clone the repository: `git clone <repository-url>`

2. Install the dependencies: `npm install`

3. Set up the environment variables. You will need to provide the necessary credentials for MongoDB, Cloudinary, and OpenAI.

4. Start the application: `npm start`

## License

Open Story is released under the [MIT License](https://opensource.org/licenses/MIT).
