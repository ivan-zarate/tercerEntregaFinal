const mongoose = require("mongoose");

const schemaUserOnMongo = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        password: {type: String, required: true},
        name: {type: String, required: true},
        addres: {type: String, required: true},
        age: {type: Number, required: true},
        telphone: {type: String, required: true},
        avatar: {type:String , required: true},
    }, {
    timestamps: true
}
)

module.exports= schemaUserOnMongo