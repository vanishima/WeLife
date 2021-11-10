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

// It may look clearer if you separate the routes into /users, /moments, etc.

/* GET different page. */
router.get("/", async (req, res) => {
  if (req.isAuthenticated()) res.render("general.html");
  else res.render("index.html");
});

// router.get("/momentDB", checkAuthenticated, async (req, res) => {
router.get("/momentDB", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const files = await momentDB.getFiles();
      const loginUser = await req.user;
      res.send({ files: files, user: loginUser.firstname });
    } catch (e) {
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
    res.status(401).send({ err: e });
  }
});

// I like how you direct the user to different pages
// based on the result of authentication
// User sign in
router.post(
  "/signin",
  passport.authenticate("local", {
    successRedirect: "/index.html",
    failureRedirect: "/signin.html",
    failureFlash: true,
  })
);

/* User Sign-Up Request. */
router.post("/signup", async (req, res) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const newUserData = {
      id: Date.now().toString(),
      username: req.body.username,
      password: hashPassword,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    };
    const insertRes = await momentDB.createCredential(newUserData);
    if (insertRes === "Success") {
      res.status(200).send();
    } else {
      res.status(401).send();
    }
  } catch (e) {
    res.redirect("/signup.html");
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
      const loginUser = await req.user;
      const files = await momentDB.getMyOwnFiles({ name: loginUser.username });
      res.send({ files: files, user: loginUser.firstname });
    } catch (e) {
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
      id: Date.now().toString(),
      name: loginUser.username,
      title: req.body.title,
      content: req.body.content,
      like: 0,
    };
    momentDB.createFile(newPostData);
    res.redirect("/general.html");

    res.sendStatus(200);
  } catch (e) {
    res.status(400).send({ err: e });
  }
});

/* Edit a moment to DB */
router.post("/editPost", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const id = req.body.id;
      await momentDB.deleteMyOwnFiles({ id: id });
      res.redirect("./post.html");
    } catch (e) {
      res.status(401).send({ err: e });
    }
  } else {
    res.status(401).send();
  }
});

/* Delete a moment */
router.post("/deletePost", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const id = req.body.id;
      await momentDB.deleteMyOwnFiles({ id: id });
      res.redirect("./home.html");
    } catch (e) {
      res.status(401).send({ err: e });
    }
  } else {
    res.status(401).send();
  }
});

/* Add like to posts  */
router.post("/likePost", async (req, res) => {
  try {
    const id = req.body.id;
    await momentDB.addLikes(id);
    res.redirect("./general.html");
  } catch (e) {
    res.status(400).send({ err: e });
  }
});

module.exports = router;
