const express = require("express");
const logger = require("../../../logger.js");
const { transporter, adminEmail } = require("../../nodemailer/gmail.js");
const mailRoute = express.Router();

const emailTemplate = `<div>
        <h1>Bienvenido!!</h1>
        <img src="https://fs-prod-cdn.nintendo-europe.com/media/images/10_share_images/portals_3/2x1_SuperMarioHub.jpg" style="width:250px"/>
        <p>Ya puedes empezar a usar nuestros servicios</p>
        <a href="http://127.0.0.1:5500/server-backend/src/public/index.html">Explorar</a>
</div>`;

const userEmail = "ivan.pruebasCoder@gmail.com";//Agregar correo del usuario al que enviamos el correo

//Estructura del correo
const mailOptions = {
    from: adminEmail,//quien envia el correo
    to: userEmail,//receptor del correo
    subject: "correo enviado desde node",//asunto del correo
    html: emailTemplate
};

mailRoute.post("/email", async (req, res) => {
    try {
        await transporter.sendMail(mailOptions);
        res.send(`se envio el mensaje a ${userEmail}`);
    } catch (error) {
        res.send(error);
    }
});

module.exports = mailRoute;