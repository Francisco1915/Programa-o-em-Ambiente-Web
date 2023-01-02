var express = require("express");
var router = express.Router();
var user = require("../controllers/userController.js");

/* GET home page. */
router.get("/", user.list);
router.get("/add-user",user.create);
router.get("/edit/:id", user.edit);
router.get("/:id", user.show);

//API
router.post("/create", user.save);
router.post("/edit/:id", user.update);
router.post("/delete/:id", user.delete);

module.exports = router;