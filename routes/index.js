let express = require("express");
let router = express.Router();

// const momentDB = require("../db/momentDB.js");
const momentDB = require("../db/pseudoMomentDB.json");
let credentials = require("../db/pseudoCredentialDB.json");
const fs = require("fs");

const bcrypt = require("bcrypt");
// const saltRounds = 10;

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
router.get("/userSignIn", async (req, res) => {
  try {
    console.log("Received sign in request");
    res.json(credentials);
  } catch (e) {
    console.log("Error getting data: ", e);
    res.status(400).send({ err: e });
  }
});
// router.post("/userSignIn", async (req, res) => {
//   try {
//     const username = req.body.username;
//     const password = req.body.password;
//     // ask db to validate this user
//     const hash = await momentDB.getPassword(username);
//     // const hash = await credentials.

//     // user does not exist
//     if (hash == null) {
//       res.status(401).send({ signin: "user not found" });
//     } else {
//       const match = await bcrypt.compare(password, hash);
//       if (match == true) {
//         req.session.username = username;
//         res.sendStatus(200);
//       } else {
//         res.status(401).send({ signin: "wrong password" });
//       }
//     }
//   } catch (e) {
//     res.status(400).send({ err: e });
//   }
// });

/* User Sign-Up Request. */
router.post("/userSignUp", async (req, res) => {
  const newUser = req.body;
  for (let user of credentials) {
    if (user.username === newUser.username) {
      console.log("User exists!");
      throw new Error("User Exists!");
    }
  }
  console.log("Creating new user ", newUser);
  const userdata = {
    username: newUser.username,
    password: newUser.password,
    firstname: newUser.firstname,
    lastname: newUser.lastname,
  };
  credentials.push(userdata);
  credentials = JSON.stringify(credentials);

  fs.writeFile("./db/pseudoCredentialDB.json", credentials, (err) => {
    if (err) {
      res.status(400).send({ err: err });
      console.log("Error registering new user");
    }
  });
  res.redirect("/");
});
// router.post("/userSignUp", async (req, res) => {
//   console.log(req.body.username);
//   try {
//     const username = req.body.username;
//     const password = req.body.password;
//     const firstname = req.body.firstname;
//     const lastname = req.body.lastname;

//     // hash password and save to db
//     // await bcrypt.hash(password, saltRounds, async function (err, hash) {
//     console.log("Creating account...");
//     const msg = await momentDB.createCredential(
//       username,
//       password,
//       firstname,
//       lastname
//     );
//     if (msg === "success") {
//       // save username to session
//       console.log("Successfully created account!");
//       req.session.username = username;
//       res.sendStatus(200);
//     } else {
//       res.status(409).send({ register: msg });
//     }
//     // });
//   } catch (e) {
//     res.status(400).send({ err: e });
//   }
// });

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

/* Display moments in general page */
router.get("/general", async (req, res) => {
  try {
    console.log("Getting data from db");
    // const files = await momentDB.getFiles();
    // res.send({ files: files });
    res.json(momentDB);
  } catch (e) {
    console.log("Error getting data: ", e);
    res.status(400).send({ err: e });
  }
});

/* Get User's homepage to show thier own posts */
router.get("/myPosts", async (req, res) => {
  try {
    // if (!auth(req, res)) {
    //   return;
    // }
    // const username = req.session.username;

    // const userPosts = await myDB.getUserPosts(username);

    // res.status(200).send({ data: userPosts });

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

module.exports = router;
