const Sequelize = require("sequelize");
const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  //....traditional method
  // Product.create({
  // title : title,
  // imageUrl : imageUrl,
  // description : description,
  // price : price,
  // userId : req.user.id
  // })

  //... sice req.user is  not normal js obj, but a sequelize
  req.user
    .createProduct({
      title: title,
      imageUrl: imageUrl,
      description: description,
      price: price,
    }) //here u  dont need to explicitly define userId
    .then((result) => {
      res.redirect("/");
      console.log("product added!!");
    })
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findByPk(prodId)
    .then((product) => {
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  //... normal approach
  // Product.findByPk(prodId)

  //... via  association
  res.user
    .getProduct({ where: { id: prodId } })
    .then((product) => {
      (product.title = updatedTitle),
        (product.imageUrl = updatedImageUrl),
        (product.price = updatedPrice),
        (product.description = updatedDesc);
      return product.save(); //update
    })
    .then((result) => {
      console.log("UPDATED PRODUCT!");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  // Product.findAll()

  // ... via Association
  req.user
    .getProducts()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;

  req.user
    .getProduct({ where: { id: productId } })
    .then((product) => {
      product.destroy();
    })
    .then((result) => {
      console.log("DESTROYED PRODUCT");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
