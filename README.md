# polling

## Overview

Provide a brief overview of the project.

## Frontend (Angular)

### Installation and Setup

```bash
# Navigate to the frontend folder of the project
cd frontend

# Install node modules
npm i

# If installation fails, try:
# npm i --legacy-peer-deps

# Run the Angular application
ng serve -o

# Build the Angular project for production
ng build --configuration=production

## Backend (Node.js and Express.js)

### Installation and Setup

# Navigate to the backend folder of the project
cd backend

# Install required packages and set up the .env file
npm i

# Start the backend server
# If using node:
node index.js

# If using nodemon (preferred way, if installed):
nodemon index.js

### Database Setup

- For the database:
  - If MongoDB is installed locally, use the local MongoDB URL:
    ```
    mongodb://localhost:27017/votes
    ```
  - Otherwise, use any MongoDB cloud database URL.

### Hosting Frontend with Backend

- You can place the Angular dist folder in the backend folder to serve the frontend Angular app from the backend as well.
- To do this:
  1. Build the Angular project for production:
     ```
     ng build --configuration=production
     ```
  2. Copy the contents of the `dist` folder generated by the Angular build.
  3. Paste the copied contents into a folder within the backend directory, for example, `backend/dist`.
  4. Configuration is already done for hosting angular project from backend in index.js file
  5. Access your Angular app through the backend URL.
