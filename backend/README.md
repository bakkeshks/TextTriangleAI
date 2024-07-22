# TextTriangleAI Backend

This repository contains the backend part of the TextTriangleAI project, built with Node.js, Express, and MongoDB, Google Gemini API, AssemblyAI API

## Installation

Follow these steps to download, install dependencies, and run the backend project.

### Prerequisites

Make sure you have the following installed:

- Node.js (version 18 or higher)
- npm (Node Package Manager)
- MongoDB (make sure it's running locally or adjust the URI accordingly)
- LLM: [Google Gemini API Key & Account](https://ai.google.dev) 
- Speech to Text API: [AssemblyAI API Key & Account](https://www.assemblyai.com)

### Clone the Repository

Clone the TextTriangleAI repository from GitHub:

```bash
git clone https://github.com/your-username/TextTriangleAI.git
cd TextTriangleAI/backend
```
### Install Dependencies
Install the necessary dependencies using npm:
```bash
npm install
```
### Configuration (.env)
Add Gemini AI, AssemblyAI, JWT (random no) to a .env file in the root of the backend directory and add the following environment variables:
```bash
ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here
GEMINIAI_API_KEY=your_geminiapi_api_key_here
JWT_SECRET=7c6f1f6e064d6f9f9f4b2e6faa1d57e4
```
Adjust the values for ASSEMBLYAI_API_KEY, GEMINIAI_API_KEY, and JWT_SECRET with your actual API keys and JWT secret.

### MongoDB Configuration
In the config/db.js file, configure your MongoDB connection URI:
```javascript
module.exports = {
  uri: "mongodb://localhost:27017/videotoblog",
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};
```
Make sure the MongoDB URI (uri) matches your local MongoDB setup or your cloud database URL.
### Running the Server
To run the backend server locally, use the following command:

```bash
npm start
```
This starts the Node.js server.
















