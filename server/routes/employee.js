var express = require("express");
var router = express.Router();
var employee = require("../controllers/employeeController.js");

/* GET home page. */
router.get("/", employee.list);
router.get("/add-employee",employee.create);
router.get("/edit/:id", employee.edit);
router.get("/:id", employee.show);

//API
router.post("/create", employee.save);
router.post("/edit/:id", employee.update);
router.post("/delete/:id", employee.delete);

module.exports = router;
