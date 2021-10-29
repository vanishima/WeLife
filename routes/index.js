let express = require("express");
let router = express.Router();

const momentDB = require("../db/momentDB.js");

const bcrypt = require("bcrypt");
const saltRounds = 10;

/* GET home page. */
router.get("/", function (req, res) {
  res.render("index", { title: "Express" });
});

/* User auth */
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
  console.log(req.body.username);
  try {
    const username = req.body.username;
    const password = req.body.password;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;

    // hash password and save to db
    // await bcrypt.hash(password, saltRounds, async function (err, hash) {
    console.log("Creating account...");
    const msg = await momentDB.createCredential(
      username,
      password,
      firstname,
      lastname
    );
    if (msg === "success") {
      // save username to session
      console.log("Successfully created account!");
      req.session.username = username;
      res.sendStatus(200);
    } else {
      res.status(409).send({ register: msg });
    }
    // });
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

// const pseudoDB = [
//   {
//     name: "Peter",
//     title: "Hello WeLife!",
//     content:
//       "Excited to join the WeLife! \
//     I would like to say hello to all of you in this great community!",
//     image: "/images/logo.png",
//     time: "2021\\10\\26",
//   },
//   {
//     name: "Xuejia",
//     title: "Just join!",
//     content: "Greetings! This is Xuejia. Glad \
//     to meet you all here.",
//     image: "/images/logo.png",
//     time: "2021\\10\\23",
//   },
//   {
//     name: "Anni",
//     title: "This is cool",
//     content: "Happy to join the community~",
//     image: "/images/logo.png",
//     time: "2021\\9\\4",
//   },
//   {
//     name: "Anni",
//     title: "This is cool",
//     content: "Happy to join the community~",
//     image: "/images/logo.png",
//     time: "2021\\9\\4",
//   },
//   {
//     name: "Xuejia",
//     title: "Just join!",
//     content: "Greetings! This is Xuejia. Glad \
//     to meet you all here.",
//     image: "/images/logo.png",
//     time: "2021\\10\\23",
//   },
//   {
//     name: "Peter",
//     title: "Hello WeLife!",
//     content:
//       "Excited to join the WeLife! \
//     I would like to say hello to all of you in this great community!",
//     image: "/images/logo.png",
//     time: "2021\\10\\26",
//   },
// ];

/* Display moments in general page */
router.get("/general", async (req, res) => {
  try {
    console.log("Getting data from db");
    const files = await momentDB.getFiles();
    res.send({ files: files });
  } catch (e) {
    console.log("Error getting data: ", e);
    res.status(400).send({ err: e });
  }
});

module.exports = router;
