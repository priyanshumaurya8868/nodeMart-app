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
const flash = require("connect-flash");
const multer = require("multer");
const MONGOBD_URI = process.env.mongoDB_uri

app.set("view engine", "ejs");
app.set("views", "views");

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true); //for acceptance
  } else {
    cb(null, false); // rejection
  }
};

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({
  storage : fileStorage,
  fileFilter :fileFilter
}).single('image'));
app.use(express.static(path.join(__dirname, "public")));
app.use('/images', express.static(path.join(__dirname, 'images')));

// const store = new MongoDBStore({
//   uri: MONGOBD_URI,
//   collection: "sessions",
// });
//create instance after initialization of session
const csrfProtection = csrf();

app.use(
  session({
    secret: "my_secret_str",
    resave: false,
    saveUninitialized: false,
    // store: store,
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
    .catch((err) => {
      next(err);
    });
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
app.get("/500", errorController.get500);

app.use(errorController.get404);

// for sync -> use try/catch
// async -> use then/catch

// whenever we call next and pass and arg  into it, then
// for that express automatically look  for the middleware of 4 params, instead of 3 one
app.use((error, req, res, next) => {
  // res.status(error.httpStatusCode).render(...);
  // res.redirect('/500');
  console.log(error);
  res.status(500).render("500", {
    pageTitle: "Error!",
    path: "/500",
    isAuthenticated: req.isLoggedIn,
  });
});

mongoose
  .connect(MONGOBD_URI)
  .then((result) => {
    app.listen(process.env.PORT ||3000);
  })
  .catch((err) => {
    console.log(err);
  });
