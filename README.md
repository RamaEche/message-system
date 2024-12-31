# Text Message System
![Badge status](https://img.shields.io/badge/STATUS-ALFA-green)

This web application is a basic messaging system, super easy to deploy and modify any functionality. It is built with the MERN stack (MongoDB, Express.js, React, and Node.js) along with other technologies such as a file manager (Cloudinary), Vite, WebSockets, and JWT (JSON Web Token). Currently, it has some measures in place to prevent web attacks (hashed passwords in the database or SSL/TLS certificate), although there are still some small vulnerabilities.

![Text Message System - Brave 12_31_2024 6_34_39 PM](https://github.com/user-attachments/assets/7725e709-38a4-44f3-8404-21af6646f075)
![Text Message System - Brave 12_31_2024 5_45_36 PM](https://github.com/user-attachments/assets/7d2a238a-afd2-4828-b21a-ee9c212b821e)
![Text Message System - Brave 12_31_2024 6_37_35 PM](https://github.com/user-attachments/assets/5e45491b-4515-44c8-bba4-75a97e019726)

## Index
1. [Production Instance](#production-instance)
2. [Features](#features)
3. [Project Deployment](#project-deployment)
    * [Local Environment](#local-environment)
    * [Build on Render.com](#build-on-rendercom)
4. [Modify Project](#modify-project)

### Production Instance
Currently, a public instance of the project can be accessed at [https://message-system-build.onrender.com/](https://message-system-build.onrender.com/). The application is currently running on Render with a free plan, so when a request is made after several minutes of inactivity, the server takes approximately 50 seconds to respond🌍.

When the application is started, it will take about 50 seconds to load!

### Features
This messaging system includes the basics to function properly. Some of its main features are:
* A system to send text messages and emojis 😀 (with in-app notifications).
* A system that notifies when a user is online or offline.
* A system to search for known or new users.
* A system to create groups (with user roles).
* A system to schedule users (with different names).
* Profile customization (description, name, and profile picture).
* Group customization (change description, name, photo).

### Project Deployment
To deploy the project, two methods are explained and tested: one for the local environment and one for production with Render. Render was used to build the project, but it can be done in many ways using other services.

#### Local Environment
To run the app in a local environment💻, go to "message-system-bd/.env" and fill it in with the following data:
```
PORT: 3000
CLIENT_URL: http://localhost:5173/
JWT_SECRET_KEY: (To generate a JWT secret key, use: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

TMPDIR=(Path + "\message-system-bd\uploads")

MONGODB_URL=(MongoDB Atlas or local URI with "mongodb://localhost:27017")

CD_API_KEY=(Cloudinary API key)
CD_API_SECRET=(Cloudinary API secret)
CD_NAME=(Cloudinary API account name)
```

To run the app, download the dependencies and in the terminal with the path "\message-system-bd", use:
```
npm run dev
```
And in another terminal, with the path "\message-system-fd", use:
```
npm run dev
```

#### Build on Render.com
To build the application, follow the steps in the "/build_web_app.txt" file to combine the frontend and backend so that it can run on a Node.js instance on Render. Create a database in MongoDB Atlas, Render, and Cloudinary. The build you created is in "/build". Inside this folder, create a private GitHub repository with the .gitignore containing🧱:
```
# Logs
message-system-bd/client/node_modules
message-system-bd/client/public
message-system-bd/client/src
message-system-bd/client/.env
message-system-bd/client/.eslintrc.cjs
message-system-bd/client/.eslintrc.json
message-system-bd/client/index.html
message-system-bd/client/package-lock.json
message-system-bd/client/package.json
message-system-bd/client/vite.config.js
message-system-bd/node_modules
message-system-bd/.env

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

```
Once the build repository is created on GitHub, you can configure Render to deploy from the GitHub repository. The only thing left to configure is the environment variables for the backend (the frontend ones should already be set). For this, in the environment settings, configure the following keys with their respective values:
- CD_API_KEY: (Cloudinary API key)
- CD_API_SECRET: (Cloudinary API secret)
- CD_NAME: (Cloudinary API account name)
- CLIENT_URL: (URL of the web app)
- JWT_SECRET_KEY: (To generate a secret key for JWT, use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- MONGODB_URL: (MongoDB Atlas URI)
- PORT: 443 (for HTTPS)

In the `.env` files, the distinction is made between CLIENT_URL and SERVER_URL because, during development, the app is split into two parts (Express.js and Vite) and accessed through different ports. However, when deployed on Render, the same URL is used for both.

### Modify Project
The message-system-bd folder handles the backend, and message-system-fd handles the frontend🔧.

In message-system-fd:
Inside "src/pages", you will find "LogIn.jsx", "RestorePassword.jsx", and "SignIn.jsx", where user authentication and password modification are handled. In "src/pages/Home.jsx", the majority of the app is managed. There are two sections used to display the components (on mobile, they switch and occupy the same space). The rest of the components are organized in folders hierarchically, from most relevant to least relevant ("organisms", "molecules", "atoms"). Additionally, the "controllers" folder is responsible for error handling and determining the viewport height.

In message-system-bd:
The web app communicates using the HTTP(s) protocol or WebSocket. Most requests from unauthenticated users are made via HTTP(s) in "message-system-bd/routes", while authenticated users use WebSockets (sending messages, user information, creating groups) in "message-system-bd/webSocket". There are some exceptions, such as image uploads (for simplicity, HTTPS with multipart/form-data is used). HTTP connections are managed in index.js, while WebSocket connections are handled in "message-system-bd/webSocket/ChatWebSocket.js".
