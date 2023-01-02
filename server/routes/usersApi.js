var express = require("express");
var router = express.Router();
var auth = require("../controllers/authUserController.js");
var user = require("../controllers/userController.js");
const authController = require("../controllers/authUserController");

//API
router.post("/register", auth.register);
router.post("/login", auth.login);
router.get("/purchaseHistory", authController.verifyToken, user.getPurchaseHistory);
router.post("/edit", authController.verifyToken, auth.editUser)
router.get('/profile', authController.verifyToken, auth.getUser);
router.get('/profile/:userId', authController.verifyToken, auth.getUser);

module.exports = router;