const express = require("express");
const logger = require("../../../logger.js");
const productsInMongo = express.Router();
const productsMongoDAO=require("../../daos/products/daoProductMongo.js")
const validateBody = require("../../middlewares/validateBody.js");
const validateUser = require("../../middlewares/validateUser.js");


productsInMongo.use((req, res, next) => {
  logger.info("Time: ", Date.now());
  next();
});

productsInMongo.get("/products", async (req, res) => {
  try {
    const readProducts= await productsMongoDAO.find();
    if(readProducts){
      logger.info("Productos encontrados con exito")
      return res.status(200).send(readProducts);
    }
    else{
      logger.info("No hay productos")
      return res.status(200).send("No hay productos");
    }
    
  } catch (error) {
    logger.error(error.message)
    return res.status(400).send({
      error: `An error occurred trying to read products ${error.message}`,
    });
  }
});

productsInMongo.post("/products", validateBody,validateUser, async (req, res) => {
  try {
      
    const newProduct = new productsMongoDAO(req.body);
    const test=newProduct.save();
    return res.status(200).send(test);
  } catch (error) {
    logger.error(error.message)
    return res.status(400).send({
      error: `An error occurred trying to read products ${error.message}`,
    });
  }
});

productsInMongo.put("/products/:_id", validateBody,validateUser,  async (req, res) => {
    try {
      const result = await productsMongoDAO.updateOne(req.params,req.body);
      return res.status(200).send(result);
    } catch (error) {
      return res.status(400).send({
        error: `An error occurred trying to read products ${error.message}`,
      });
    }
  });

productsInMongo.delete("/products/:code", validateUser, async (req, res) => {
    try {
      const result = await productsMongoDAO.deleteOne(req.params);
      return res.status(200).send(result);
    } catch (error) {
      return res.status(400).send({
        error: `An error occurred trying to read products ${error.message}`,
      });
    }
  });
  

module.exports = productsInMongo;