const bodyParser = require("body-parser");
const morgan = require("morgan");
const express = require("express");
const app = express();
const path = require("path");
const adminroute = require("./routes/admin");
const shopRoute = require("./routes/shop");
const errorController = require('./controllers/error');

app.set('view engine', 'ejs')
app.set("views", "views");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
app.use("/admin", adminroute);
app.use("/", shopRoute);

app.use(errorController.get404);

app.listen(3000);
