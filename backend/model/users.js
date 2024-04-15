const connection = require("../utilities/connection");
const ObjectId = require('mongodb').ObjectId; 
const userDB = {}
const bcrypt = require('bcryptjs');

userDB.checkLoginUser = async (payload) => {
  let data;
    if(payload.role == 'user'){
      const collection = await connection.getUsers();
      data = await collection.findOne({"email" : payload.email},{_id : 0});
    }
    else if(payload.role == 'artist'){
      const collection = await connection.getArtist();
      data = await collection.findOne({"email" : payload.email},{_id : 0});
    }
    else if(payload.role == 'tag' || userData.role == 'admin'){
      const collection = await connection.getTag();
      data = await collection.findOne({"email" : payload.email},{_id : 0});
    }
    else{
      let res = {
        status : 204,
        data : 'Invalid role'
      }
      return res
    }
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