const fs = require('fs'); // Import the 'fs' module for file system operations

// Middleware function for logging errors
let errorLogger = (err, req, res, next) => {
    // Check if there is an error
    if (err) {
        // Append the error message and stack trace to a file named 'ErrorLogger.txt'
        fs.appendFile('ErrorLogger.txt', new Date() + "-" + err.stack + "\n", (error) => {
            // If there's an error while logging the error, log a message to the console
            if (error) {
                console.log("Failed in Logging Error");
            }
        });
        
        // Set the HTTP response status based on the error status or default to 500 (Internal Server Error)
        if (err.status) {
            res.status(err.status); // Set status based on error status
        } else {
            res.status(500); // Default to 500 (Internal Server Error)
        }
        
        // Send a JSON response with the error message
        res.json({"message": err.message});
    }
    
    next(); // Call the next middleware in the chain
}

module.exports = errorLogger; // Export the errorLogger middleware function