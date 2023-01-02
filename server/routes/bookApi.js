var express = require("express");
var router = express.Router();
var book = require("../controllers/bookController.js");
const authController = require("../controllers/authUserController");
const path = require("path");
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
const multer = require("multer");

const upload = multer({
    dest: (req, file, cb) => {
        cb(null, "public/uploads/bookCovers");
    },
    fileFilter: (req, file, callback) => {
      callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

//API
router.get("/", book.getBooks);
router.get("/:id", authController.verifyToken ,book.getBook);
router.get("/requests", authController.verifyToken , book.getRequests);
router.post("/create", authController.verifyToken ,upload.single('file'), book.addBook);
router.delete("/requests/delete/:id", authController.verifyToken , book.deleteRequestJson);

module.exports = router;