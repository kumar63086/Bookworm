const mongoose=require("mongoose")

const dotenv = require('dotenv');
dotenv.config();

const connectDb= async ()=>{

    try {
     const connet= await   mongoose.connect(process.env.MONGODB_URI)
        console.log(`Database connected successfully...! ${connet.connection.host}`)
    } catch (error) {
        console.log(error.message);
        process.exit(1); // Exit process with failure
    }
}

module.exports= connectDb;