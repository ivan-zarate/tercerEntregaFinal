const express = require("express");
const cartsInMongo = express.Router();
const cartsMongoDAO = require("../../daos/carts/daoCartMongo.js")
const productsMongoDAO = require("../../daos/products/daoProductMongo.js")
const validateBody = require("../../middlewares/validateBody.js");
const logger = require("../../../logger.js");

cartsInMongo.use((req, res, next) => {
    logger.info("Time: ", Date.now());
    next();
});

cartsInMongo.get("/cart-products", async (req, res) => {
    try {
        const productsInCart = await cartsMongoDAO.find();
        if (!productsInCart) {
            return res.status(400).send("Carrito no encontrado");
        }
        if (productsInCart.length === 0) {
            return res.status(200).send("Aun no tienes productos en el carrito");
        }
        return res.status(200).send(productsInCart);

    } catch (error) {
        return res.status(400).send({
            error: `An error occurred trying to read carts ${error.message}`,
        });
    }
});


cartsInMongo.post("/cart-products/:_id", async (req, res) => {
    const productToFind = await productsMongoDAO.find(req.params);
    console.log("back id", req.params);
    if (!productToFind) {
        return res.status(400).send("Producto no encontrado");
    }
    const { name, description, code, url, price, stock } = productToFind[0];
    const isInCart = await cartsMongoDAO.findOne({ name });
    if (!isInCart) {
        const newProductInCart = new cartsMongoDAO({ name, description, code, url, price, stock, amount: 1 });
        await productsMongoDAO.findByIdAndUpdate(
            productToFind[0]._id,
            { incart: true },
            { new: true }
        )
            .then((product) => {
                newProductInCart.save();
                res.send(product)
            })
            .catch((error) => {
                return res.status(400).send({
                    error: `An error occurred trying to read carts ${error.message}`,
                })
            })
    }
    else if (isInCart) {
        res.status(400).send("El producto ya esta en el carrito")
    }
});

cartsInMongo.put("/cart-products/:_id", async (req, res) => {
    const productToFind = await cartsMongoDAO.findById(req.params);
    let { amount } = productToFind;
    const { query } = req.query;
    console.log("productToFind", productToFind);
    if (!productToFind) {
        return res.status(400).send("Producto no encontrado");
    }
    else if (productToFind && query === "add") {
        await cartsMongoDAO.findByIdAndUpdate(productToFind._id,
            { amount: amount + 1 },
            { new: true }
        ).then((product) => {
            res.send(`Se actualizo la cantidad en ${product.amount} del producto ${product.name}`)
        })
    }
    else if (productToFind && query === "del") {
        await cartsMongoDAO.findByIdAndUpdate(productToFind._id,
            { amount: amount - 1 },
            { new: true }
        ).then((product) => {
            res.send(`Se actualizo la cantidad en ${product.amount} del producto ${product.name}`)
        })
    }
    else {
        res.status(400).send("Ocurrio un error")
    }
});

cartsInMongo.delete("/cart-products/:_id", async (req, res) => {
    try {
        const productInCart = await cartsMongoDAO.findById(req.params)

        if (!productInCart) {
            return res.status(400).send("Producto no encontrado");
        }
        const productToFind = await productsMongoDAO.findOne({ name: productInCart.name });
        console.log("productToFind", productToFind);
        let { _id, incart } = productToFind;
        await cartsMongoDAO.findByIdAndDelete(req.params);
        await productsMongoDAO.findByIdAndUpdate(_id,
            { incart: false },
            { new: true }
        ).then((product) => {
            res.status(200).send(`El producto ${product.name} fue eliminado del carrito`);
        })
    } catch (error) {
        return res.status(400).send({
            error: `An error occurred trying to read carts ${error.message}`,
        });
    }
});


module.exports = cartsInMongo;