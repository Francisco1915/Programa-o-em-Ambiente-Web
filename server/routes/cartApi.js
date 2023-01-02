var express = require("express");
var router = express.Router();
var cart = require("../controllers/cartController.js");
const authController = require("../controllers/authUserController");

//API
router.get("/cartSize", cart.getCartSize);
router.get("/", authController.verifyToken ,cart.getCart);
router.post("/add-to-cart/:bookId", authController.verifyToken, cart.addToCart)
router.delete("/remove-from-cart/:bookId", authController.verifyToken, cart.removeFromCart)
router.post("/checkout", authController.verifyToken, cart.checkout)
/* router.get("/",cart.getCart);
router.post("/add-to-cart", cart.addToCart)
router.post("/remove-from-cart", cart.removeFromCart)
router.post("/checkout", cart.checkout); */

module.exports = router;