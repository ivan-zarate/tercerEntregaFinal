const schemaUserOnMongo= require("../../schemas/user/schemaUser.js");
const mongoose = require("mongoose");

const usersMongoDAO=mongoose.model('users', schemaUserOnMongo);

module.exports=usersMongoDAO