const express= require("express")
const app= express()
const cors= require("cors")
const dotenv= require("dotenv")
const authRoutes=require('./src/Routes/authRoutes')
const booksRoutes=require('./src/Routes/bookRoutes')
dotenv.config()
app.use(express.json())
app.use(cors())
app.use (express.urlencoded({extended:true}))
app.use(express.static("public"))
app.get("/",(req,res)=>{
    res.send("Hello World")
})
app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/books",booksRoutes)
module.exports= app;