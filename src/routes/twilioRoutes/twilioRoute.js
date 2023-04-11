const express = require("express");
const logger = require("../../../logger.js");
const {twilioWapp, adminWapp, twilioClient} = require("../../twilio/twilio.js");
const twilioRoute = express.Router();

twilioRoute.post("/wapp-twilio",async(req,res)=>{
    try {
        //crear el mensaje que vamos a enviar a traves de twilio
        const info = await twilioClient.messages.create({
            from:twilioWapp,
            to:adminWapp,
            body:"La compra solicitada esta en proceso"
        });
        console.log(info);
        res.send(`El mensaje de whatsapp se envio correctamente`);
    } catch (error) {
        res.send(error);
    }
});

module.exports = twilioRoute;