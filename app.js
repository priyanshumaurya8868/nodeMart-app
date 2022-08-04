const bodyParser = require("body-parser");
const morgan = require("morgan");
const express = require("express");
const app = express();
const path = require("path");
const admindata = require("./routes/admin");
const shopRoute = require("./routes/shop");

app.set('view engine', 'ejs')
app.set("views", "views");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
app.use("/admin", admindata.router);
app.use("/", shopRoute);

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "views", "404Page.html"));
});

app.listen(3000);
