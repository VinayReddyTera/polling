const connection = require("../utilities/connection");
const ObjectId = require('mongodb').ObjectId; 
const userDB = {}
const bcrypt = require('bcryptjs');
const setUpData = require('../utilities/setupData.json');
const adminData = require('../utilities/adminData.json');

userDB.checkLoginUser = async (payload) => {
  const collection = await connection.getUsers();
  let data = await collection.findOne({"email" : payload.email},{_id : 0});
  if (data) {
    let res = {
      status : 200,
      data : 'User exist'
    }
    return res
  }
  else{
    let res = {
      status : 204,
      data : "User Doesn't Exist"
    }
    return res
  }
}

module.exports = userDB