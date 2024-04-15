const express = require("express");
const router = express.Router();
const userservice = require("../service/users");
const jwt = require('jsonwebtoken');
const verifyToken = require("../utilities/verifyToken");
const validate = require("../utilities/validateData");

// api to login users
router.post('/login',(req,res,next)=>{
  if(!req.body.email || !req.body.password){
    let response = {
      status : 204,
      data : 'Required fields missing'
    }
    return res.json(response)
  }
  else if(!validate.validateEmail(req.body.email)){
    let response = {
      status : 204,
      data : 'Invalid email format'
    }
    return res.json(response)
  }
  else{
    userservice.login(req.body).then((data)=>{
      if(data.status == 200){
        const expirationTime = Math.floor(Date.now() / 1000) + 21600;
        const token = jwt.sign({data:data.data,exp : expirationTime},process.env.JWT_Secret);
        let obj = {
            status : data.status,
            data : data.data,
            token : token
          }
        res.status(200).json(obj)
      }
      else{
        let obj = {
          status : data.status,
          data : data.data,
          token : ''
        }
        return res.json(obj)
      }
      }).catch((err)=>{
        next(err)
    })
  }
})

// api to register users
router.post('/register',(req,res,next)=>{
  if(!req.body.email
    || !req.body.name
    || !req.body.password
    ){
    let response = {
      status : 204,
      data : 'Required fields missing'
    }
    return res.json(response)
  }
  else if(!validate.validateEmail(req.body.email)){
    let response = {
      status : 204,
      data : 'Invalid email format'
    }
    return res.json(response)
  }
  else if(!validate.validateName(req.body.name)){
    let response = {
      status : 204,
      data : 'Invalid Name format'
    }
    return res.json(response)
  }
  else if(!validate.validateXss(req.body.name)){
    let response = {
      status : 204,
      data : 'Invalid data format'
    }
    return res.json(response)
  }
  else{
    userservice.register(req.body).then((data)=>{
      return res.json(data)
    }).catch((err)=>{
      next(err)
    })
  }
})

// api to setup data
router.get('/setupData',(req,res,next)=>{
  userservice.setupData().then((data)=>{
      res.status(200).json(data)
      return res.json(obj)
    }).catch((err)=>{
      next(err)
  })
})

module.exports = router