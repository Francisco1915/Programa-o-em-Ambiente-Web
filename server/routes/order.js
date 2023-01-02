var express = require("express");
var router = express.Router();
var order = require("../controllers/ordersController.js");

/* GET home page. */
router.get("/", order.list);
router.get("/add-order", order.create);

//API
router.post("/create", order.save);

module.exports = router;

