const express = require("express");
const sellsRoutes = express.Router();
const cartsMongoDAO = require("../../daos/carts/daoCartMongo.js");
const sellsMongoDAO = require("../../daos/sells/daoSellMongo.js");
const validateCart = require("../../middlewares/validateCart.js");
const { transporter, adminEmail } = require("../../nodemailer/gmail.js");
const { twilioWapp, adminWapp, twilioClient } = require("../../twilio/twilio.js");

sellsRoutes.post("/sells", validateCart, async (req, res) => {
    try {
        const { username, name, addres, age, telphone } = req.body;
        const user = {
            username,
            name,
            addres,
            age,
            telphone
        }
        const productsInCart = await cartsMongoDAO.find();
        if (!productsInCart) {
            return res.status(400).send("Carrito no encontrado");
        }
        if (productsInCart.length === 0) {
            return res.status(200).send("Aun no tienes productos en el carrito");
        }
        const total = productsInCart.reduce((acc, product) => acc + (product.price * product.amount), 0);
        const sell = {
            user: user,
            cart: productsInCart,
            total,
        }
        const newSell = new sellsMongoDAO(sell);
        //newSell.save();
        const emailTemplate = `<div>
        <h1>Nuevo orden compra ${newSell._id}</h1>
        <section>${productsInCart}</section>
        </div>`;

        const mailOptions = {
            from: adminEmail,
            to: adminEmail,
            subject: `Nuevo pedido de ${name} mail: ${username}`,
            html: emailTemplate
        };
        await twilioClient.messages.create({
            from: twilioWapp,
            to: adminWapp,
            body: `Nuevo pedido de ${name} mail: ${username}`
        });
        await transporter.sendMail(mailOptions);
        return res.status(200).send(newSell);
    } catch (error) {
        return res.status(400).send({
            error: `An error occurred trying to read carts ${error.message}`,
        });
    }
})

module.exports = sellsRoutes;