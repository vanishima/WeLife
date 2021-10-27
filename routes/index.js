let express = require("express");
let router = express.Router();

const momentDB = require("../db/momentDB.js");

const bcrypt = require("bcrypt");
const saltRounds = 10;

/* GET home page. */
router.get("/", function (req, res) {
  res.render("index", { title: "Express" });
});

// User auth
function auth(req, res) {
  if (!req.session.username) {
    res.status(401).send({ err: "user not signed in" });
    return false;
  }
  return true;
}

/* User Sign-In Request. */
router.post("/userSignIn", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    // ask db to validate this user
    const hash = await momentDB.getPassword(username);

    // user does not exist
    if (hash == null) {
      res.status(401).send({ signin: "user not found" });
    } else {
      const match = await bcrypt.compare(password, hash);
      if (match == true) {
        req.session.username = username;
        res.sendStatus(200);
      } else {
        res.status(401).send({ signin: "wrong password" });
      }
    }
  } catch (e) {
    res.status(400).send({ err: e });
  }
});

/* User Sign-Up Request. */
router.post("/userSignUp", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;

    // hash password and save to db
    await bcrypt.hash(password, saltRounds, async function (err, hash) {
      const msg = await momentDB.registerUser(
        username,
        hash,
        firstname,
        lastname
      );
      if (msg === "success") {
        // save username to session
        req.session.username = username;
        res.sendStatus(200);
      } else {
        res.status(409).send({ register: msg });
      }
    });
  } catch (e) {
    res.status(400).send({ err: e });
  }
});

/* User Log-Out Request. */
router.get("/userLogout", async (req, res) => {
  try {
    if (!auth(req, res)) {
      return;
    }
    delete req.session.username;
    res.sendStatus(200);
  } catch (e) {
    res.status(400).send({ err: e });
  }
});

module.exports = router;
