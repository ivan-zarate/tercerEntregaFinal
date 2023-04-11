const nodemailer= require("nodemailer");

const adminEmail="ivan23.zarate25@gmail.com";
const adminPassword="lxdhqmuixshvtbsl";

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', 
    port: 587,
    auth: { 
        user: adminEmail,
        pass: adminPassword
    },
    //importante para agregar seguridad al canal de comunicacion
    secure:false,
    tls:{
        rejectUnauthorized:false
    }
});

module.exports = {transporter,adminEmail}