const schemaCartOnMongo= require("../../schemas/cart/schemaCartMongo.js");
const mongoose = require("mongoose");

const cartsMongoDAO=mongoose.model('carts', schemaCartOnMongo);

module.exports=cartsMongoDAO