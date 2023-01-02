var express = require("express");
var router = express.Router();
var email = require("../controllers/emailController");

//API
router.post("/", email.test);

module.exports = router;