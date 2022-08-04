const express = require("express");
const router = express.Router();
const path = require("path");
const admindata = require("./admin");

router.get("/", (req, res, next) => {
  console.log("shop.js " + admindata.products.map((item) => item.title));
  //...using pug
  // res.render('shop',{prods: admindata.products, pageTitle : "Shop", route : "/"})

  //...using handlebars
  // const products = admindata.products
  // res.render('shop', {
  //     prods: products,
  //     pageTitle: 'Shop',
  //     route: '/',
  //     hasProducts: products.length > 0,
  //     activeShop: true,
  //     productCSS: true
  //   });

  //...using ejs
  res.render("shop", {
    prods: admindata.products,
    pageTitle: "shop",
    route: "/",
  });
});

module.exports = router;
