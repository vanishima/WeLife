let express = require("express");
let router = express.Router();

const momentDB = require("../model/momentDB.js");
const bcrypt = require("bcrypt");
const passport = require("passport");

const initializePassport = require("../public/javascripts/passport-config");

initializePassport(
  passport,
  (username) => momentDB.findUser({ username: username }),
  (id) => momentDB.findUser({ id: id })
);

/* GET different page. */
router.get("/", async (req, res) => {
  if (req.isAuthenticated()) res.render("general.html");
  else res.render("index.html");
});

// router.get("/momentDB", checkAuthenticated, async (req, res) => {
router.get("/momentDB", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      console.log("The DB ", momentDB);
      const files = await momentDB.getFiles();
      const loginUser = await req.user;
      res.send({ files: files, user: loginUser.firstname });
    } catch (e) {
      console.log("Error: ", e);
      res.status(401).send({ err: e });
    }
  } else {
    res.status(401).send();
  }
});

router.get("/getUser", async (req, res) => {
  try {
    const loginUser = await req.user;
    if (loginUser == undefined) {
      res.status(401).send();
    }
    res.send(loginUser);
  } catch (e) {
    console.log("Error: ", e);
    res.status(401).send({ err: e });
  }
});

// User sign in
router.post(
  "/signin",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/index.html",
    failureRedirect: "/signin.html",
    failureFlash: true,
  })
);

/* User Sign-Up Request. */
router.post("/signup", checkNotAuthenticated, async (req, res) => {
  try {
    console.log("Creating new user ", req);
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const newUserData = {
      id: Date.now().toString(),
      username: req.body.username,
      password: hashPassword,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    };
    momentDB.createCredential(newUserData);
    console.log(newUserData);
    res.redirect("/signin.html");
  } catch (e) {
    console.log("Error signing up new user: ", e);
    res.redirect("/signup");
  }
});

/* User Log-Out Request. */
router.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/index.html");
});

/* Get User's homepage to show thier own posts */
router.get("/myOwnPosts", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      console.log("The DB ", momentDB);
      const loginUser = await req.user;
      const files = await momentDB.getMyOwnFiles({ name: loginUser.username });
      res.send({ files: files, user: loginUser.firstname });
    } catch (e) {
      console.log("Error: ", e);
      res.status(401).send({ err: e });
    }
  } else {
    res.status(401).send();
  }
});

/* Post a new moment to DB */
router.post("/post", async (req, res) => {
  try {
    const loginUser = await req.user;
    const newPostData = {
      name: loginUser.username,
      title: req.body.title,
      content: req.body.content,
      like: 0,
    };
    momentDB.createFile(newPostData);
    res.redirect("/general.html");
    console.log("Create post successful! Redirect...");

    res.sendStatus(200);
  } catch (e) {
    console.error("Error", e);
    res.status(400).send({ err: e });
  }
});

/* Edit a moment to DB */
router.post("/editPost", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      console.log("The DB ", momentDB);
      const title = req.body.title;
      const newContent = {
        content: req.body.content,
      };
      const post = await momentDB.editMyOwnFiles({
        title: title,
        content: newContent,
      });
      res.send({ post: post });
      res.sendStatus(200);
    } catch (e) {
      console.log("Error: ", e);
      res.status(401).send({ err: e });
    }
  } else {
    res.status(401).send();
  }
});

/* Delete a moment */
router.delete("/deletePost", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      console.log("The DB ", momentDB);
      const title = req.body.title;
      const post = await momentDB.deleteMyOwnFiles({ title: title });
      res.send({ post: post });
      res.sendStatus(200);
    } catch (e) {
      console.log("Error: ", e);
      res.status(401).send({ err: e });
    }
  } else {
    res.status(401).send();
  }
});

/* Add like to posts  */
router.post("/likePost", async (req, res) => {
  try {
    const title = req.body.title;
    const likes = await momentDB.addLikes(title);
    res.send({ likes: likes });
    console.log("Add new likes for the post.");
    res.sendStatus(200);
  } catch (e) {
    console.error("Error", e);
    res.status(400).send({ err: e });
  }
});

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

module.exports = router;
