const userDB = require('../model/users');

const userService = {};

// Function to handle user login
userService.login = (data) => {
  return userDB.checkLoginUser(data).then((userData) => {
      // If user exists
      if (userData.status == 200) {
        // Check user password
        return userDB.checkPassword(data).then((authData) => {
            return authData; // Return authentication data
        });
      } else {
        return userData; // User doesn't exist error
      }
  });
}

// Function to handle user registration
userService.register = (data) => {
    return userDB.checkLoginUser(data).then((userData) => {
        // If user doesn't exist
        if (userData.status == 204 && userData.data == "User Doesn't Exist") {
            // Register the user
            return userDB.register(data).then((isCreated) => {
                return isCreated; // Return registration status
            });
        } else {
          // If user already exists
          if (userData.status == 200) {
            let res = {
              status: 204,
              data: "User already exists, try logging in!" // Error message
            };
            return res; // Return error response
          }
          return userData; // error
        }
    });
}

// Function to send email
userService.sendMail = (payload) => {
  // Create a nodemailer transporter
  let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: process.env.mailId, // Email address
          pass: process.env.pass // Email password
      }
  });

  // Define email options
  let mailOptions = {
      from: process.env.mailId, // Sender email address
      to: payload.email, // Recipient email address
      subject: payload.subject, // Email subject
      cc: payload?.cc, // CC email address (optional)
      html: payload.body // HTML email body
  }

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.log(error); // Log error if email sending fails
      } else {
          console.log('ok'); // Log success message if email is sent successfully
      }
  });
}

module.exports = userService;