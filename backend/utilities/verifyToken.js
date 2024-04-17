const jwt = require('jsonwebtoken');

// Middleware function to verify JWT token
let verifyToken = (req, res, next) => {
    try {
        // Extract token from request headers
        const token = req.headers?.authorization;

        // If token is missing
        if (!token) {
            let response = {
                status: 204,
                data: 'You are not Authenticated'
            };
            // Send response with status 400 and the message
            res.status(400).json(response);
        } else {
            // Verify the token using the JWT secret
            jwt.verify(token, process.env.JWT_Secret, (err, user) => {
                // If token is invalid or expired
                if (err) {
                    let response = {
                        status: 204,
                        data: 'Session Expired'
                    };
                    // Send response with status 400 and the message
                    res.status(400).json(response);
                } else {
                    // If token is valid, set the user in the request object
                    req.user = user;
                    // Move to the next middleware or route handler
                    next();
                }
            });
        }
    } catch (err) {
        // If an error occurs during the process
        let response = {
            status: 204,
            data: err.message
        };
        // Send response with the error message
        res.json(response);
    }
};

module.exports = verifyToken;