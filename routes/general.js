console.log("Running general.js");

let express = require("express");
let router = express.Router();

const pseudoDB = [
  {
    name: "Peter",
    title: "Hello WeLife!",
    content:
      "Excited to join the WeLife! \
    I would like to say hello to all of you in this great community!",
    image: "/images/moment.png",
    time: "2021\\10\\26",
  },
  {
    name: "Xuejia",
    title: "Just join!",
    content: "Greetings! This is Xuejia. Glad \
    to meet you all here.",
    image: "/images/moment.png",
    time: "2021\\10\\23",
  },
  {
    name: "Anni",
    title: "This is cool",
    content: "Happy to join the community~",
    image: "/images/moment.png",
    time: "2021\\9\\4",
  },
];

router.get("/", function (req, res) {
  res.json(pseudoDB);
});

module.exports = router;
