const express = require('express')
const router = express.Router()
const path = require('path')
const admindata = require('./admin')


router.get("/", (req,res,next)=>{
    console.log("shop.js "+ admindata.products.map(item => item.title))
    res.render('shop',{prods: admindata.products, pageTitle : "Shop", route : "/"})
})

module.exports = router