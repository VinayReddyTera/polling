const connection = require("../utilities/connection");
const ObjectId = require('mongodb').ObjectId; 
const bcrypt = require('bcryptjs');
const setUpData = require('../utilities/setupData.json');
const userDB = {};

// Function to check if a user exists by email
userDB.checkLoginUser = async (payload) => {
  // Get the 'users' collection
  const collection = await connection.getUsers();
  // Find user data by email
  let data = await collection.findOne({"email" : payload.email},{_id : 0});
  // If user exists
  if (data) {
    let res = {
      status : 200,
      data : 'User exist' // Success message
    }
    return res; // Return response
  }
  else {
    let res = {
      status : 204,
      data : "User Doesn't Exist" // Error message
    }
    return res; // Return response
  }
}

// Function to register a new user
userDB.register = async (data1) => {
  // Get the 'users' collection
  const collection = await connection.getUsers();
  // Generate hashed password
  const salt = await bcrypt.genSalt(10);
  const hashpassword = await bcrypt.hash(data1.password, salt);
  // Prepare user data
  let userData = {
    name : data1.name,
    email : data1.email,
    password : hashpassword
  }
  // Insert user data into the collection
  let data = await collection.create(userData);
  // If registration is successful
  if(data){
    let res = {
      status : 200,
      data : 'Successfully registered' // Success message
    }
    return res; // Return response
  }
  else {
    let res = {
      status : 204,
      data : 'Unable to register' // Error message
    }
    return res; // Return response
  }
}

// Function to check user password during login
userDB.checkPassword = async (data1) => {
  // Get the 'users' collection
  const collection = await connection.getUsers();
  // Find user data by email
  const data = await collection.findOne({"email" : data1.email});
  // Compare passwords
  const checkPassword = await bcrypt.compare(data1.password, data.password);
  // If password matches
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
    return userData; // Return user data
  }
  else {
    let res = {
      status : 204,
      data : 'Incorrect Password' // Error message
    }
    return res; // Return response
  }
}

// Function to initialize/setup nominee data
userDB.setupData = async () => {
  // Get the 'nominee' collection
  const collection = await connection.getNominees();
  // Find existing nominee data
  let data = await collection.find({},{_id : 0});
  // If no nominee data is found
  if (data.length == 0) {
    // Insert setup data into the collection
    let insert = await collection.insertMany(setUpData);
    // If insertion is successful
    if(insert.length == setUpData.length){
      let res = {
        status : 200,
        data : 'Successfully inserted data' // Success message
      }
      return res; // Return response
    }
    else {
      let res = {
        status : 204,
        data : 'Unable to insert data' // Error message
      }
      return res; // Return response
    }
  }
  else {
    let res = {
      status : 204,
      data : "Nominees already present" // Error message
    }
    return res; // Return response
  }
}

// Function to clear nominee data
userDB.clearData = async () => {
  // Get the 'nominee' collection
  const collection = await connection.getNominees();
  // Delete all nominee data
  let data = await collection.deleteMany({},{_id : 0});
  // If deletion is successful
  if (data.deletedCount == setUpData.length) {
    // Reinsert setup data into the collection
    let insert = await collection.insertMany(setUpData);
    // If reinsertion is successful
    if(insert.length == setUpData.length){
      let res = {
        status : 200,
        data : 'Data successfully reset' // Success message
      }
      return res; // Return response
    }
    else {
      let res = {
        status : 204,
        data : 'Unable cleared data but unable to insert new data' // Error message
      }
      return res; // Return response
    }
  }
  else {
    let res = {
      status : 204,
      data : "Unable to reset nominees" // Error message
    }
    return res; // Return response
  }
}

// Function to fetch all nominees
userDB.fetchNominees = async () => {
  // Get the 'nominee' collection
  const collection = await connection.getNominees();
  // Find all nominee data
  let data = await collection.find({},{name:1});
  // If nominee data is found
  if (data.length > 0) {
    let res = {
      status : 200,
      data : data // Return nominee data
    }
    return res; // Return response
  }
  else {
    let res = {
      status : 204,
      data : "No Nominees present, contact admin" // Error message
    }
    return res; // Return response
  }
}

// Function to increment vote count for a nominee
userDB.pollNow = async (id) => {
  // Get the 'nominee' collection
  const collection = await connection.getNominees();
  // Update vote count for the specified nominee (here we consider mongodb generated unique id)
  let data = await collection.updateOne(
    { _id:new ObjectId(id) },
    { $inc: { votes: 1 } }
  );
  // If vote is successfully incremented
  if (data.modifiedCount == 1) {
    let res = {
      status : 200,
      data : 'Successfully took vote' // Success message
    }
    return res; // Return response
  }
  else {
    let res = {
      status : 204,
      data : "Unable to take vote" // Error message
    }
    return res; // Return response
  }
}

// Function to fetch dashboard data (nominees and total votes)
userDB.fetchDashboardData = async () => {
  // Get the 'nominee' collection
  const collection = await connection.getNominees();
  // Find all nominee data (excluding unnecessary fields fields)
  let data = await collection.find({},{createdOn:0,__v:0});
  // If nominee data is found
  if (data.length > 0) {
    // Calculate total vote count
    let totalCount = 0
    for(let i of data){
      totalCount += i.votes
    }
    let res = {
      status : 200,
      data : data, // Return nominee data
      totalCount : totalCount // Return total vote count
    }
    return res; // Return response
  }
  else {
    let res = {
      status : 204,
      data : "No nominees created yet!" // Error message
    }
    return res; // Return response
  }
}

module.exports = userDB;