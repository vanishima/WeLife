let express = require("express");
let router = express.Router();

// const momentDB = require("../db/momentDB.js");
let momentDB = require("../db/pseudoMomentDB.json");
// let credentials = require("../db/pseudoCredentialDB.json");
const credentials = [];
const fs = require("fs");
const bcrypt = require("bcrypt");
const passport = require("passport");

const initializePassport = require("../public/javascripts/passport-config");

initializePassport(
  passport,
  (username) => credentials.find((user) => user.username === username),
  (id) => credentials.find((user) => user.id === id)
);

/* GET home page. */
router.get("/", checkAuthenticated, function (req, res) {
  res.render("index", { title: "Express" });
});

router.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("signin.ejs");
});

router.get("/signup", checkNotAuthenticated, (req, res) => {
  res.render("signup.ejs");
});

router.get("/home", checkAuthenticated, (req, res) => {
  res.render("home.ejs");
});

router.get("/post", checkAuthenticated, (req, res) => {
  res.render("post.ejs");
});

router.get("/general", checkAuthenticated, (req, res) => {
  res.render("general.ejs");
});

router.get("/momentDB", checkAuthenticated, (req, res) => {
  res.send(momentDB);
});

/* User auth */
function auth(req, res) {
  if (!req.session.username) {
    res.status(401).send({ err: "user not signed in" });
    return false;
  }
  return true;
}

router.post(
  "/signin",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

/* User Sign-Up Request. */
router.post("/signup", checkNotAuthenticated, async (req, res) => {
  try {
    console.log("Creating new user ", req);
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    credentials.push({
      id: Date.now().toString(),
      username: req.body.username,
      password: hashPassword,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });
    // credentials = JSON.stringify(credentials);

    // fs.writeFile("./db/pseudoCredentialDB.json", credentials, (err) => {
    //   if (err) {
    //     res.status(400).send({ err: err });
    //     console.log("Error registering new user");
    //   }
    // });
    res.redirect("/login");
  } catch (e) {
    console.log("Error signing up new user: ", e);
    // res.status(400).send({ err: e });
    res.redirect("/signup");
  }
  console.log(credentials);
});

/* User Log-Out Request. */
router.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

/* Get User's homepage to show thier own posts */
router.get("/myPosts", async (req, res) => {
  try {
    console.log("Getting data from db and send it to reload.");
  } catch (e) {
    console.log("Error getting data: ", e);
    res.status(400).send({ err: e });
  }
});

/* Post a new moment to DB */
router.post("/postMoment", async (req, res) => {
  try {
    if (!auth(req, res)) {
      return;
    }
    // get username from session and add username to data object
    const username = req.session.username;

    // parse data into correct format
    // const dataJson = JSON.parse(JSON.stringify(req.body));
    const dataObject = {};
    dataObject.username = username;
    dataObject.title = "";
    dataObject.image = "";
    dataObject.content = "";
    dataObject.time = "";

    // insert data into db
    momentDB.addMomentData(dataObject);

    res.sendStatus(200);
  } catch (e) {
    console.error("Error", e);
    res.status(400).send({ err: e });
  }
});

/* Delete a moment */
router.post("/deletePost", async (req, res) => {
  try {
    if (!auth(req, res)) {
      return;
    }
    const username = req.session.username;
    const postId = req.body.post_id;

    await momentDB.deleteFromPosts(username, postId);
    res.sendStatus(200);
  } catch (e) {
    console.error("Error", e);
    res.status(400).send({ err: e });
  }
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

module.exports = router;
