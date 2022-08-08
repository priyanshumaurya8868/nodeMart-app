const bodyParser = require("body-parser");
const morgan = require("morgan");
const express = require("express");
const app = express();
const path = require("path");
const adminroute = require("./routes/admin");
const shopRoute = require("./routes/shop");
const errorController = require("./controllers/error");
const sequelize = require("./utils/database");
const Product = require("./models/product");
const User = require("./models/user");
const Car = require("./models/cart");
const CartItem = require("./models/cart-item");
const Cart = require("./models/cart");
const OrderItem = require("./models/order-item");
const Order = require("./models/order");

app.set("view engine", "ejs");
app.set("views", "views");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminroute);
app.use("/", shopRoute);

app.use(errorController.get404);

// The A. belongsTo(B) association means that a One-To-One relationship exists between A and B ,
// with the foreign key being defined in the source model ( A ).
//  The A. hasMany(B) association means that a One-To-Many relationship exists between A and B ,
//  with the foreign key being defined in the target model ( B ).
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product); //optional

User.hasOne(Cart);

// The Sequelize belongsToMany() method is used to create a Many-To-Many association between two tables.
// Two tables that have a Many-To-Many relationship require a third table that acts as the junction or join table.
//  Each record in the junction table will keep track of the primary keys of both models.
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

// sequelize.sync() will not just create tables for our models but also define
// the relations in our database as we define them here.
sequelize
  // .sync()
  .sync({force : true})
  .then((result) => {
    // console.log(result);
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({
        name: "Shruti",
        email: "priyanshruti@love.com",
      });
    }
    return user;
  })
  .then((user) => {
    // console.log(user);
    return user.createCart();
  })
  .then((cart) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
