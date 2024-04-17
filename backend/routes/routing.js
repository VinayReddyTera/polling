const express = require("express");
const router = express.Router();
const userservice = require("../service/users");
const jwt = require('jsonwebtoken');
const verifyToken = require("../utilities/verifyToken");
const validate = require("../utilities/validateData");
const userDB = require('../model/users');

// api to login users
router.post('/login', (req, res, next) => {
  // Check if required fields are missing in the request body
  if (!req.body.email || !req.body.password) {
    let response = {
      status: 204,
      data: 'Required fields missing'
    };
    return res.json(response);
  }
  // Check if the email format is invalid
  else if (!validate.validateEmail(req.body.email)) {
    let response = {
      status: 204,
      data: 'Invalid email format'
    };
    return res.json(response);
  }
  // If all validations pass, proceed with login
  else {
    // Call the login function from the userService module, passing the request body
    userservice.login(req.body)
      .then((data) => {
        // If login is successful
        if (data.status == 200) {
          // Generate JWT token with user data and expiration time
          const expirationTime = Math.floor(Date.now() / 1000) + 21600; // 6 hours expiration time
          const token = jwt.sign({ data: data.data, exp: expirationTime }, process.env.JWT_Secret);
          
          // Prepare response object with status, data, and token
          let obj = {
            status: data.status,
            data: data.data,
            token: token
          };
          res.status(200).json(obj); // Send JSON response with success and token
        }
        // If login fails
        else {
          // Prepare response object with status, data, and empty token
          let obj = {
            status: data.status,
            data: data.data,
            token: ''
          };
          return res.json(obj); // Send JSON response with failure
        }
      })
      .catch((err) => {
        next(err); // Forward error to the error handling middleware
      });
  }
});


// api to register users
router.post('/register', (req, res, next) => {
  // Check if required fields are missing in the request body
  if (!req.body.email || !req.body.name || !req.body.password) {
    let response = {
      status: 204,
      data: 'Required fields missing'
    };
    return res.json(response);
  }
  // Check if the email format is invalid
  else if (!validate.validateEmail(req.body.email)) {
    let response = {
      status: 204,
      data: 'Invalid email format'
    };
    return res.json(response);
  }
  // Check if the name format is invalid
  else if (!validate.validateName(req.body.name)) {
    let response = {
      status: 204,
      data: 'Invalid Name format'
    };
    return res.json(response);
  }
  // Check if the data format is invalid (potentially indicating XSS attack)
  else if (!validate.validateXss(req.body.name)) {
    let response = {
      status: 204,
      data: 'Invalid data format'
    };
    return res.json(response);
  }
  // If all validations pass, proceed with registration
  else {
    userservice.register(req.body)
      .then((data) => {
        return res.json(data);
      })
      .catch((err) => {
        next(err);
      });
  }
});

// api to setup data (creating nominees if they are not present)
// here verifyToken is a middleware used to authorize api's, such that only authenticated users can consume api
router.get('/setupData',verifyToken,(req,res,next)=>{
  userDB.setupData().then((data)=>{
      res.status(200).json(data)
    }).catch((err)=>{
      next(err)
  })
})

// api to clear data (used to delete reset data)
router.delete('/clearData',verifyToken,(req,res,next)=>{
  userDB.clearData().then((data)=>{
      res.status(200).json(data)
    }).catch((err)=>{
      next(err)
  })
})

// api to fetch nominees
router.get('/fetchNominees',(req,res,next)=>{
  userDB.fetchNominees().then((data)=>{
      res.status(200).json(data)
    }).catch((err)=>{
      next(err)
  })
})

// api to poll for nominees
router.post('/pollNow',(req,res,next)=>{
  userDB.pollNow(req.body._id).then((data)=>{
      res.status(200).json(data)
    }).catch((err)=>{
      next(err)
  })
})

// api to fetch dashboard data to display for admin
router.get('/fetchDashboardData',verifyToken,(req,res,next)=>{
  userDB.fetchDashboardData().then((data)=>{
      res.status(200).json(data)
    }).catch((err)=>{
      next(err)
  })
})

module.exports = router