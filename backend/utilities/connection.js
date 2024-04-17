const { Schema } = require("mongoose");
const Mongoose = require("mongoose");
const moment = require('moment');

// Set Mongoose to use global promises
Mongoose.Promise = global.Promise;

// Set Mongoose to strict query mode
Mongoose.set('strictQuery', true);

// Get the MongoDB connection URL from environment variables
const url = process.env.MONGO_URL;

// Define the schema for the 'users' collection
const users = Schema({
    name: String,
    email: String,
    password: String,
    role: { type: String, default: 'admin' }, // Default role is 'admin'
    createdOn: {
         type: Date,
         default: moment().format("YYYY-MM-DD HH:mm:ss") // Default creation date using current date and time
    }
}, { collection: "users" }); // Specify the collection name as 'users'

// Define the schema for the 'nominee' collection
const nominee = Schema({
    name: String,
    votes: Number,
    createdOn: {
         type: Date,
         default: moment().format("YYYY-MM-DD HH:mm:ss") // Default creation date using current date and time
    }
}, { collection: "nominee" }); // Specify the collection name as 'nominee'

// Object to hold collection functions
let collection = {};

// Function to get the 'users' collection model
collection.getUsers = () => {
    return Mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((database) => {
        return database.model('users', users); // Return the 'users' collection model
    })
    .catch((error) => {
        // If connection fails, create and throw an error
        let err = new Error("Could not connect to database " + error);
        err.status = 500;
        throw err;
    });
}

// Function to get the 'nominee' collection model
collection.getNominees = () => {
    return Mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((database) => {
        return database.model('nominee', nominee); // Return the 'nominee' collection model
    })
    .catch((error) => {
        // If connection fails, create and throw an error
        let err = new Error("Could not connect to database " + error);
        err.status = 500;
        throw err;
    });
}

module.exports = collection;