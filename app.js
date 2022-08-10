const bodyParser = require("body-parser");
const morgan = require("morgan");
const express = require("express");
const app = express();
const path = require("path");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const errorController = require("./controllers/error");
const mongoose = require("mongoose");
const User = require("./models/user");
const session = require("express-session");
const MongoDBStore = require('connect-mongodb-session')(session)

const MONGOBD_URI = "mongodb://localhost:27017/storeApi"

app.set("view engine", "ejs");
app.set("views", "views");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

const store = new MongoDBStore({
  uri : MONGOBD_URI,
  collection : "sessions"
})

app.use(
  session({ secret: "my_secret_str", resave: false, saveUninitialized: false,store :store })
);

app.use((req,res,next)=>{
  //modifying request object for other middlewares with session
  req.isLoggedIn = req.session.isLoggedIn;
  next()
})

app.use((req, res, next) => {
  User.findById("62f24a620bd12089f26f90b2")
    .then((user) => {
      console.log(user);
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGOBD_URI)
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Max",
          email: "max@test.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
