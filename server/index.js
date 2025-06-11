const app= require("./app")
const connectDB= require("./src/config/db")
const dotenv= require("dotenv")
dotenv.config()


const port= process.env.PORT || 5000
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
    connectDB()
})