const connection = require("../utilities/connection");
const ObjectId = require('mongodb').ObjectId; 
const userDB = {}
const bcrypt = require('bcryptjs');
const setUpData = require('../utilities/setupData.json');

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

userDB.register = async (data1) => {
  const collection = await connection.getUsers();
  const salt = await bcrypt.genSalt(10);
  const hashpassword = await bcrypt.hash(data1.password, salt);
  let userData = {
    name : data1.name,
    email : data1.email,
    password : hashpassword
  }
  let data = await collection.create(userData);
  if(data){
    let res = {
      status : 200,
      data : 'Successfully registered'
    }
    return res
  }
  else{
    let res = {
      status : 204,
      data : 'Unable to register'
    }
    return res
  }
}

userDB.checkPassword = async (data1) => {
  const collection = await connection.getUsers();
  const data = await collection.findOne({"email" : data1.email});
  const checkPassword = await bcrypt.compare(data1.password,data.password);
  if (checkPassword) {
    let userData = {
      status: 200,
      data:{
      name : data.name,
      email : data.email,
      role : data.role,
      _id : data._id
    }
  }
    return userData;
  }
  else{
    let res = {
      status : 204,
      data : 'Incorrect Password'
    }
    return res
  }
}

userDB.setupData = async () => {
  const collection = await connection.getNominees();
  let data = await collection.find({},{_id : 0});
  if (data.length == 0) {
    let insert = await collection.insertMany(setUpData);
    if(insert.length == setUpData.length){
      let res = {
        status : 200,
        data : 'Successfully inserted data'
      }
      return res
    }
    else{
      let res = {
        status : 204,
        data : 'Unable to insert data'
      }
      return res
    }
  }
  else{
    let res = {
      status : 204,
      data : "Nominees already present"
    }
    return res
  }
}

userDB.clearData = async () => {
  const collection = await connection.getNominees();
  let data = await collection.deleteMany({},{_id : 0});
  if (data.deletedCount == setUpData.length) {
    let insert = await collection.insertMany(setUpData);
    if(insert.length == setUpData.length){
      let res = {
        status : 200,
        data : 'Data successfully reset'
      }
      return res
    }
    else{
      let res = {
        status : 204,
        data : 'Unable cleared data but unable to insert new data'
      }
      return res
    }
  }
  else{
    let res = {
      status : 204,
      data : "Unable to reset nominees"
    }
    return res
  }
}

userDB.fetchNominees = async () => {
  const collection = await connection.getNominees();
  let data = await collection.find({},{name:1});
  if (data.length > 0) {
    let res = {
      status : 200,
      data : data
    }
    return res
  }
  else{
    let res = {
      status : 204,
      data : "No Nominees present, contact admin"
    }
    return res
  }
}

userDB.pollNow = async (id) => {
  const collection = await connection.getNominees();
  let data = await collection.updateOne(
    { _id:new ObjectId(id) },
    { $inc: { votes: 1 } }
  );
  if (data.modifiedCount == 1) {
    let res = {
      status : 200,
      data : 'Successfully took vote'
    }
    return res
  }
  else{
    let res = {
      status : 204,
      data : "Unable to take vote"
    }
    return res
  }
}

userDB.fetchDashboardData = async () => {
  const collection = await connection.getNominees();
  let data = await collection.find({},{createdOn:0,__v:0});
  if (data.length > 0) {
    let totalCount = 0
    for(let i of data){
      totalCount += i.votes
    }
    let res = {
      status : 200,
      data : data,
      totalCount : totalCount
    }
    return res
  }
  else{
    let res = {
      status : 204,
      data : "No nominees created yet!"
    }
    return res
  }
}

module.exports = userDB