const mongoose = require("mongoose");

const schemaSellOnMongo = new mongoose.Schema(
    {
        user:{type:Object, required:true},
        cart:{type:Array, required:true},
        total:{ type: String, required: true},
    }, {
    timestamps: true
}
)

module.exports= schemaSellOnMongo