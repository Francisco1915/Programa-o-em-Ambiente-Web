const res = require("express/lib/response");
const mongoose = require("mongoose");
const Book = require("../models/Book");
const RequestSellBook = require("../models/RequestSellBook");
const fs = require("fs");
const path = require("path");

var bookController = {};

bookController.list = async function (req, res) {
  let query = Book.find()
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
    query = query.lte('date', req.query.publishedBefore)
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
    query = query.gte('date', req.query.publishedAfter)
  }
  try {
    const books = await query.exec();
    res.render("main-book", { title: "Book System", books: books, searchOptions: req.query });
  } catch (err) {
    res.render('error', { message: err.message, error: err });
  }
};

bookController.getBooks = async function (req, res) {
  let query = Book.find()
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  if (req.query.isbn != null && req.query.isbn != '') {
    query = query.regex('isbn', new RegExp(req.query.isbn, 'i'))
  }
  if (req.query.type != null && req.query.type != '') {
    query = query.regex('type', new RegExp(req.query.type, 'i'))
  }
  if (req.query.price != null && req.query.price != '') {
    query = query.lte('price', req.query.price)
  }
  if (req.query.available != null && req.query.available != '') {
    if (req.query.available == 1) {
      query = query.gte('qt', req.query.available)
    } else {
      query = query.lte('qt', req.query.available)
    }
  }
  if (req.query.emphasis != null && req.query.emphasis != '') {
    query = query.regex('emphasis', new RegExp(req.query.emphasis, 'i'))
  }

  try {
    const books = await query.exec();
    return res.status(200).json({
      message: '',
      data: books,
      searchOptions: req.query
    });
  } catch (err) {
    return res.json({
      message: 'Something went wrong, please try again.'
    });
  }
};

bookController.show = async function (req, res) {
  let id = req.params.id;

  try {

    let book = await Book.findOne({ _id: id });
    if (!book) {
      res.render('error', { message: "Not found book with id " + id, error: { status: "", stack: "" } });
    } else {
      res.render("details-book", {
        title: "View Book",
        book: book,
      });
    }
  } catch (err) {
    res.render('error', { message: "Not found book with id " + id, error: err });
  }
};

bookController.getBook = async function (req, res) {
  let id = req.params.id;

  try {

    let book = await Book.findOne({ _id: id });
    if (!book) {
      return res.json({
        message: 'There is no book with the given id in our database.'
      });
    } else {
      return res.status(200).json({
        message: '',
        data: book,
      });
    }
  } catch (err) {
    return res.json({
      message: 'Something went wrong, please try again.'
    });
  }
};

bookController.create = function (req, res) {
  res.render("createOrEdit-book", {
    title: "New Book",
    method: "post",
    action: "create",
    book: new Book({}),
  });
};

function removeBookCover(fileName) {
  fs.unlink(path.join("public/uploads/bookCovers", fileName), err => {
    if (err) console.error(err)
  })
}

bookController.save = async function (req, res) {
  if (!req.body) {
    res.render("error", { message: "Content can not be emtpy!", error: { status: "", stack: "" } });
  }

  //new user
  const fileName = req.file != null ? req.file.filename : null
  const book = new Book(req.body);
  book.coverImageName = fileName;

  //save user in database
  try {

    let duplicate = await Book.findOne({ isbn: req.body.isbn, status: req.body.status });

    if (duplicate) {
      book.isbn = "";
      book.isbnError = "Isbn Already exist.";
      res.render("createOrEdit-book", {
        title: "New book",
        method: "post",
        action: "create",
        book: book,
      });
    } else {

      if (book.coverImageName == null) {
        book.coverError = "Just accept files jpg, png, gif."
        throw err;
      }
      let newBook = await book.save();
      res.render("details-book", {
        title: "book",
        book: newBook,
      });
    }
  } catch (err) {
    if (err.name == "ValidationError") {
      handleValidationError(err, book);
    }
    res.render("createOrEdit-book", {
      title: "New book",
      method: "post",
      action: "create",
      book: book,
    });
  }
};

bookController.addBook = async function (req, res, file) {
  if (!req.body) {
    return res.json({
      message: 'Something went wrong, please try again.'
    });
  }

  //new user
  const book = new Book(req.body);
  book.date = Date(req.body.date);
  book.price = Number(req.body.price);
  book.qt = Number(req.body.qt);
  book.coverImageName = req.file.filename;
  
  //save user in database
  try {

    let duplicate = await Book.findOne({ isbn: req.body.isbn, status: req.body.status });

    if (duplicate) {
      book.isbn = "";
      book.isbnError = "Isbn Already exist.";
      return res.json({
        message: 'Book form validation failed, isbn already exist!!!',
      });
    } else {
      if (book.coverImageName == null) {
        book.coverError = "Just accept files jpg, png, gif."
        let err = { name: "ValidationError" };
        throw err;
      }

      var fileDestination = path.join(__dirname, "..", "public", "uploads", "bookCovers", req.file.filename);

      fs.readFileSync(req.file.path, function (err) {
        if (err) {
          return res.json({
            message: 'Something went wrong, please try again.'
          });
        }
        fs.writeFileSync(fileDestination, function (err) {
          if (err) {
            return res.json({
              message: 'Something went wrong, please try again.'
            });
          }
        });
      });

      const requestSellBook = await RequestSellBook.create({
        user: req.userId,
        book: book,
        status: false
      });

      return res.status(200).json({
        message: 'Book created successfully!',
      });
    }
  } catch (err) {
    if (err.name == "ValidationError") {
      handleValidationError(err, book);
    } else {
      return res.json({
        message: 'Something went wrong, please try again.'
      });
    }
    return res.json({
      message: 'Book form validation failed!',
    });
  }
};

bookController.acceptRequest = async function (req, res) {

  let requestId = req.params.id;

  try {
  const request = await RequestSellBook.findOne({_id : requestId});
  if (!request) {
    res.render('error', { message: "Not found request with id " + requestId, error: { status: "", stack: "" } });
  } else {

    let book = new Book(request.book);
    const newBook = await book.save();

    request.status = true;
    const newRequest = await request.save();

    res.redirect("/books/requests");
  }
  } catch {
    res.render('error', { message: err.message, error: err });
  }
}

bookController.requestSells = async function (req, res) {

  let page = parseInt(req.query.page);
  let limit = parseInt(req.query.limit);
  if (!(page && limit)) {
    page = 1;
    limit = 6;
  }
  const skipIndex = (page - 1) * limit;
  const results = {};

  try {

    let query = RequestSellBook.find().limit(limit).skip(skipIndex);

    const result = await query.exec();
    const count = result.length;

    results.results = result;
    results.page = page;
    results.limit = limit;
    results.pages = count / limit;
    res.render("main-requests", { title: "Requests System", list: results, searchOptions: req.query });

  } catch (err) {
    res.render('error', { message: err.message, error: err });
  }

}

bookController.getRequests = async function (req, res) {
  let userId = req.userId;

  try {

    let requests = await RequestSellBook.find({user: userId});
    console.log(requests)

    return res.status(200).json({
      message: '',
      data: requests,
    });

  } catch(err) {
    return res.json({
      message: 'Something went wrong, please try again.'
    });
  }
}

bookController.edit = async function (req, res) {

  try {

    let book = await Book.findOne({ _id: req.params.id });
    if (!book) {
      res.render('error', { message: "Not found book with id " + id, error: { status: "", stack: "" } });
    } else {
      res.render("createOrEdit-book", {
        title: "Edit Book",
        method: "post",
        action: "/books/edit/" + req.params.id,
        book: book,
      });
    }
  } catch (err) {
    res.render('error', { message: "Not found book with id " + req.params.id, error: err });
  }
};

bookController.update = async function (req, res) {
  if (!req.body) {
    res.render('error', { message: "Data to update can not be empty", error: { status: "", stack: "" } });
  }

  try {

    const id = req.params.id;
    const fileName = req.file != null ? req.file.filename : null
    const book = new Book(req.body);
    req.body.coverImageName = fileName;
    book.coverImageName = fileName;
    const err = await book.validateSync();

    if (err) {
      if (err.name == "ValidationError") {
        handleValidationError(err, book);
      }
      res.render("createOrEdit-book", {
        title: "New book",
        method: "post",
        action: "create",
        book: book,
      });
    } else {
      const duplicate = await Book.findOne({ isbn: req.body.isbn, status: req.body.status });
      if (duplicate) {
        if (id == duplicate._id) {
          if (book.coverImageName == null) {
            req.body.coverError = "Just accept files jpg, png, gif.";
            const err1 = { name: "ValidationError" };
            throw err1;
          } else {
            removeBookCover(duplicate.coverImageName)
          }
          const result = await Book.findOneAndUpdate({ _id: id }, { $set: req.body, }, { new: true });
          if (!result) {
            res.render('error', { message: "Not found book with id " + id, error: { status: "", stack: "" } });
          } else {
            res.redirect("/books/" + result._id);
          }
        } else {
          req.body.isbn = "";
          req.body.isbnError = "Isbn Already exist.";
          res.render("createOrEdit-book", {
            title: "Edit Book",
            method: "post",
            action: "/books/edit/" + id,
            book: req.body,
          });
        }
      }
    }
  } catch (err) {
    if (err.name == "ValidationError") {
      handleValidationError(err, req.body);
    } else {
      res.redirect("/books");
    }
    res.render("createOrEdit-book", {
      title: "Edit Book",
      method: "post",
      action: "/books/edit/" + req.params.id,
      book: req.body,
    });
  }
};

bookController.deleteRequest = async function (req, res) {
  const id = req.params.id;

  try {

    const result = await RequestSellBook.findOneAndRemove({ _id: id });
    if (!result) {
      res.render('error', { message: "Not found request with id " + id, error: { status: "", stack: "" } });
    } else {
      res.redirect("/books/requests");
    }

  } catch (err) {
    res.render('error', { message: "Not found request with id " + id, error: err });
  }
};

bookController.deleteRequestJson = async function (req, res) {
  const id = req.params.id;

  try {

    const result = await RequestSellBook.findOneAndRemove({ _id: id });
    if (!result) {
      return res.json({
        message: 'There is no request with the given id in our database.'
      });
    } else {
      return res.status(200).json({
        message: 'Request deleted!!.'
      });
    }

  } catch (err) {
    return res.json({
      message: 'Something went wrong, please try again.'
    });
  }
};

bookController.delete = async function (req, res) {
  const id = req.params.id;

  try {

    const result = await Book.findOneAndRemove({ _id: id });
    if (!result) {
      res.render('error', { message: "Not found book with id " + id, error: { status: "", stack: "" } });
    } else {
      removeBookCover(result.coverImageName);
      res.redirect("/books");
    }

  } catch (err) {
    res.render('error', { message: "Not found book with id " + id, error: err });
  }
};

function handleValidationError(err, body) {
  for (field in err.errors) {
    switch (err.errors[field].path) {
      case "title":
        body["titleError"] = err.errors[field].message;
        break;
      case "author":
        body["authorError"] = err.errors[field].message;
        break;
      case "isbn":
        body["isbnError"] = err.errors[field].message;
        break;
      case "status":
        body["statusError"] = err.errors[field].message;
        break;
      case "cover":
        body["coverError"] = err.errors[field].message;
        break;
      case "desc":
        body["descError"] = err.errors[field].message;
        break;
      case "price":
        body["priceError"] = err.errors[field].message;
        break;
      case "type":
        body["typeError"] = err.errors[field].message;
        break;
      default:
        break;
    }
  }
}

bookController.increment = function (req, res) {
  const id = req.params.id;
  const qt = parseInt(req.params.qt);

  Book.findOneAndUpdate({ _id: id }, { $set: { qt: qt + 1 } })
    .then((result) => {
      res.redirect("/books");
    })
    .catch((err) => {
      res.render('error', { message: "Not found book with id " + id, error: err });
    });
}

bookController.decrement = function (req, res) {
  const id = req.params.id;
  const qt = parseInt(req.params.qt);

  if (qt !== 0) {
    Book.findOneAndUpdate({ _id: id }, { $set: { qt: qt - 1 } }, { new: true })
      .then((result) => {
        res.redirect("/books");
      })
      .catch((err) => {
        res.render('error', { message: "Not found book with id " + id, error: err });
      });
  } else {
    res.redirect("/books");
  }
}

module.exports = bookController;