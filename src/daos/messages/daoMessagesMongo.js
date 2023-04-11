const schemaMessageOnMongo= require("../../schemas/messages/schemaMessagesMongo.js");
const mongoose = require("mongoose");

const messagesMongoDAO=mongoose.model('messages', schemaMessageOnMongo);

module.exports=messagesMongoDAO
