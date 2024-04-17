const fs = require('fs'); // Import the 'fs' module for file system operations

// Middleware function for logging HTTP requests
let requestLogger = (req, res, next) => {
    // Construct the log message with current date, HTTP method, and request URL
    let logMessage = "" + new Date() + " " + req.method + req.url + "\n";
    
    // Append the log message to a file named 'RequestLogger.txt'
    fs.appendFile('RequestLogger.txt', logMessage, (err) => {
        if (err) return next(err); // Pass any error to the next middleware
    });
    
    next(); // Call the next middleware in the chain
}

module.exports = requestLogger; // Export the requestLogger middleware function