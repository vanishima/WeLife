let express = require("express");
let router = express.Router();

const momentDB = require("../db/momentDB.js");

/* GET home page. */
router.get("/", function (req, res) {
  res.render("index", { title: "Express" });
});

module.exports = router;
