const express = require("express");
const path = require("path");
const router = express.Router();
const products = [];

router.get("/add-product", (req, res, next) => {
  //...sending static html file
  // res.sendFile(path.join(__dirname, "../", "views", "add-product.html"));

  //...using pug template engine
  //  res.render('add-product',{pageTitle : "Shop", route : "/admin/add-product"})

  //...using handlebars template engine
  res.render("add-product", {
    pageTitle: "Add Product",
    route: "/admin/add-product",
    formCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
});

router.post("/add-product", (req, res, next) => {
  products.push(req.body);
  res.redirect("/");
});

exports.router = router;
exports.products = products;
