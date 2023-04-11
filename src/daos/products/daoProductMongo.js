const schemaProductOnMongo= require("../../schemas/product/schemaProductMongo.js");
const mongoose = require("mongoose");

const productsMongoDAO=mongoose.model('products', schemaProductOnMongo);

module.exports=productsMongoDAO
