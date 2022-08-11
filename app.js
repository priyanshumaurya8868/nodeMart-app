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
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require('connect-flash');

const MONGOBD_URI = "mongodb://localhost:27017/storeApi";

app.set("view engine", "ejs");
app.set("views", "views");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

const store = new MongoDBStore({
  uri: MONGOBD_URI,
  collection: "sessions",
});
//create instance after initialization of session
const csrfProtection = csrf();

app.use(
  session({
    secret: "my_secret_str",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
//use after session init
app.use(csrfProtection);
app.use(flash()); //uses session behind the sceens


app.use((req, res, next) => {
  //modifying request object for other middlewares with session
  req.isLoggedIn = req.session.isLoggedIn;
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

//things u want them to avaliable for all the rendering views
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGOBD_URI)
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
