const express = require("express");
const path = require("path");
const router = express.Router();
const products = [];

router.get("/add-product", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "views", "add-products.html"));
});

router.post("/add-product", (req, res, next) => {
    products.push(req.body) 
  res.redirect("/");
});

exports.router = router;
exports.products = products;
