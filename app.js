if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");
let credentials = require("./db/pseudoCredentialDB.json");
const flash = require("express-flash");
const session = require("express-session");
const passport = require("passport");
const methodOverride = require("method-override");

const initializePassport = require("./public/javascripts/passport-config");

initializePassport(
  passport,
  (username) => credentials.find((user) => user.username === username),
  (id) => credentials.find((user) => user.id === id)
);

// initializePassport(
//   passport,
//   (username) => {
//     for (let user of credentials) {
//       if (user.username === username) {
//         return user;
//       }
//     }
//     return undefined;
//   },
//   (id) => {
//     for (let user of credentials) {
//       if (user.id === id) {
//         return user;
//       }
//     }
//     return undefined;
//   }
// );

let indexRouter = require("./routes/index");

let app = express();

app.set("view engine", "ejs");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

app.use("/", indexRouter);

module.exports = app;
