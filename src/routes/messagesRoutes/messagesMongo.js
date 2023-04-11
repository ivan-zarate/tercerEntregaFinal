const express = require("express");
const chatInMongo = express.Router();
const messagesMongoDAO=require("../../daos/messages/daoMessagesMongo.js")
const validateBody = require("../../middlewares/validateBody.js");
const logger=require("../../../logger.js");

chatInMongo.use((req, res, next) => {
  logger.info("Time: ", Date.now());
  next();
});

chatInMongo.post("/messages", express.json(), async (req, res) => {

    try {
        const message = await messagesMongoDAO(req.body);
        message.save();
        return res.status(200).send(message);
      } catch (error) {
        return res.status(400).send({
          error: `An error occurred trying to read messages ${error.message}`,
        });
      }
    });
  
  module.exports = chatInMongo;