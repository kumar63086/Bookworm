const express =require("express")
const router=express.Router()
const authMiddleware=require('../middlewares/authmiddleware')

const {createbook,getAllbooks,deleteBook,updatebooks,getIdbooke}=require("../controller/books.controlle")

router.get('/allbooks',getAllbooks)


module.exports=router