const bodyParser = require('body-parser')
const { application } = require('express')
const express = require('express')
const app = express()
const path = require('path')
const adminRoute = require('./routes/admin')
const shopRoute = require('./routes/shop')
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname,'public')))

app.use("/admin",adminRoute)
app.use("/",shopRoute)
app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname,'views','404Page.html'))
})

app.listen(3000)