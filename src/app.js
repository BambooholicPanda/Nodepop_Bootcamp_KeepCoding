var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

// requiring the file will execute it
require("./lib/connectMongoose");
require("./routes/api/adverts");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// main page
app.use("/", require("./routes/index"));

// API
app.use("/images", require("./routes/images"));

app.use("/api", require("./routes/api/adverts"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);

  // if it is a request to the API, it responds in JSON format
  if (
    req.originalUrl.startsWith("/api/") ||
    req.originalUrl.startsWith("/images/")
  ) {
    res.json({
      errorName: err.name,
      errorStatus: err.status,
      errorMessage: err.message,
      errorStack: err.stack,
    });
    return;
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.render("error");
});

module.exports = app;
