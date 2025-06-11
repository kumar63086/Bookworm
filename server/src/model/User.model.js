const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
   Username: {
        type: String,
        required: true,
        unique: true,

    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    ProfileImage: {
        type: String,
        default:""
    },


},{
    timestamps: true,
}
);
const User= mongoose.model("User",userSchema)
module.exports= User;