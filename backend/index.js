require('dotenv').config(); // Load environment variables from a .env file
const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/routing');
// const myErrorLogger = require('./utilities/errorLogger'); // Logger for errors
// const myRequestLogger = require('./utilities/requestLogger'); // Logger for requests
const cors = require("cors"); // Middleware for handling Cross-Origin Resource Sharing (CORS)
const app = express();
const path = require('path');

// Enable CORS for all routes
app.use(cors());

// Parse incoming request bodies in a middleware before your handlers
app.use(bodyParser.json());

// Create an HTTP server instance using the Express app
const httpServer = require('http').createServer(app);

// Initialize socket.io and attach it to the HTTP server
const io = require('socket.io')(httpServer, {
  cors: { origin: '*' } // Allow connections from all origins
});

// Socket.io event handlers
io.on('connection', (socket) => {
  console.log('a user connected');

  // Handle 'message' event
  socket.on('message', (message) => {
    console.log(message)
    io.emit('message', message); // Broadcast the received message to all connected clients
  });

  socket.on('disconnect', () => {
    console.log('a user disconnected!');
  });
});

// Middleware to set CORS headers for all routes
app.use(function(req, res, next) {
     res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Methods", "DELETE, PUT");
     res.header(
       "Access-Control-Allow-Headers",
       "Origin, X-Requested-With, Content-Type, Accept"
     );
     next();
});

// Mount the router at the root path
app.use('/', router);

// Serve static files from the 'dist' directory (front end code)
app.use(express.static(path.join(__dirname + '/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

const port = process.env.PORT || 1204;

// Start the server
httpServer.listen(port, () => {
  console.log(`server listening on port ${port}`);
});

module.exports = app;