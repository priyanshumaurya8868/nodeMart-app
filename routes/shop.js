const express = require('express')
const router = express.Router()
const path = require('path')
const admindata = require('./admin')


router.get("/", (req,res,next)=>{
    console.log("shop.js "+ admindata.products.map(item => item.title))
    res.sendFile(path.join(__dirname,"../",'views','shop.html'))
})

module.exports = router