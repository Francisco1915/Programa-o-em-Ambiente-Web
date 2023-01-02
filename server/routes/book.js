var express = require("express");
var router = express.Router();
var book = require("../controllers/bookController.js");
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

router.get("/", book.list);
router.get("/requests", book.requestSells);
router.get("/add-book",book.create);
router.get("/edit/:id", book.edit);
router.get("/:id", book.show);
router.post("/create", upload.single('cover'), book.save);
router.post("/edit/:id", upload.single('cover'),book.update);
router.post("/delete/:id", book.delete);
router.post("/increment/:id/:qt", book.increment);
router.post("/decrement/:id/:qt", book.decrement);
router.post("/requests/accept/:id", book.acceptRequest);
router.post("/requests/delete/:id", book.deleteRequest);

module.exports = router;