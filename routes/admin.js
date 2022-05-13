const express = require('express')
const path  = require('path')
const router = express.Router()
const rootDir = require('../utils/path')


router.use("/add-product", (req,res,next)=>{
    res.sendFile(path.join(rootDir,'views','add-products.html'))
})

router.post("/product",(req,res,next)=>{
 console.log(req.body)
 console.log("hi")
 res.redirect("/")
})

module.exports = router