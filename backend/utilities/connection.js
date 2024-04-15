const { Schema } = require("mongoose");
const Mongoose = require("mongoose");
Mongoose.Promise = global.Promise;
Mongoose.set('strictQuery', true);
const url = process.env.MONGO_URL;
const moment = require('moment');

const users = Schema({
    name:String,
    email:String,
    password:String,
    role:String,
    createdOn: {
         type: Date,
         default: moment().format("YYYY-MM-DD HH:mm:ss")
    }
},{collection : "users"});

const nominee = Schema({
    name:String,
    votes: Number,
    createdOn: {
         type: Date,
         default: moment().format("YYYY-MM-DD HH:mm:ss")
    }
},{collection : "nominee"});

let collection = {}

collection.getUsers = () => {
    return Mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true}).then((database)=>{
        return database.model('users',users)
    }).catch((error)=>{
        let err = new Error("Could not connect to database " + error);
        err.status = 500;
        throw err;
    })
}

collection.getNominees = () => {
    return Mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true}).then((database)=>{
        return database.model('nominee',nominee)
    }).catch((error)=>{
        let err = new Error("Could not connect to database " + error);
        err.status = 500;
        throw err;
    })
}

module.exports = collection