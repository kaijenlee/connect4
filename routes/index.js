var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.sendFile("splash.html", {root: "./public"});
});

/* Pressing the 'PLAY' button, returns this page */
router.get("/play", function(req, res) {
  res.sendFile("game.html", { root: "./public" });
});
/* Pressing the 'RULES' button, returns this page */
router.get("/rules", function(req, res) {
  res.sendFile("rules.html", { root: "./public" });
});

/* Pressing the 'RULES' button, returns this page */
router.get("/back", function(req, res) {
  res.sendFile("splash.html", { root: "./public" });
});

module.exports = router;
