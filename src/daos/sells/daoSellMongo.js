const schemaSellOnMongo= require("../../schemas/sells/schemaSellMongo.js");
const mongoose = require("mongoose");

const sellsMongoDAO=mongoose.model('sells', schemaSellOnMongo);

module.exports=sellsMongoDAO
