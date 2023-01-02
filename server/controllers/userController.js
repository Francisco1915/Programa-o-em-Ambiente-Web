const res = require("express/lib/response");
var mongoose = require("mongoose");
var User = require("../models/User");
const Cart = require("../models/Cart");
const Receipt = require("../models/Receipt");

var userController = {};

userController.list = async function (req, res) {

  let page = parseInt(req.query.page);
  let limit = parseInt(req.query.limit);
  if (!(page && limit)) {
    page = 1;
    limit = 6;
  }
  const skipIndex = (page - 1) * limit;
  const results = {};

  try {

    let query = User.find().limit(limit).skip(skipIndex)
    if (req.query.name != null && req.query.name != '') {
      query = query.regex('name', new RegExp(req.query.name, 'i'))
    }

    const result = await query.exec();
    const count = result.length;

    results.results = result;
    results.page = page;
    results.limit = limit;
    results.pages = count / limit;
    res.render("main-user", { title: "User System", list: results, searchOptions: req.query });

  } catch (err) {
    res.render('error', { message: err.message, error: err });
  }
};

userController.getUser = async function (req, res) {
  let id = req.body.id;

  try {
    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.json({
        message: 'There is no user with the given id in our database.'
      });
    } else {
      return res.status(200).json({
        message: '',
        data: user,
      });
    }
  } catch (err) {
    return res.json({
      message: 'Something went wrong, please try again.'
    });
  }
};

userController.show = async function (req, res) {
  let id = req.params.id;

  try {
    const result = await User.findOne({ _id: id });

    if (!result) {
      res.render('error', { message: "Not found user with id " + id, error: { status: "", stack: "" } });
    } else {
      res.render("details-user", {
        title: "View User",
        user: result,
      });
    }
  } catch (err) {
    res.render('error', { message: "Not found user with id " + id, error: err });
  }
};

userController.create = async function (req, res) {
  res.render("createOrEdit-user", {
    title: "New User",
    method: "post",
    action: "create",
    user: new User({}),
  });
};

userController.save = async function (req, res) {
  if (!req.body) {
    res.render("error", { message: "Content can not be emtpy!", error: { status: "", stack: "" } });
  }

  //new user
  const user = new User(req.body);

  try {

    const duplicate = await User.findOne({ email: req.body.email });
    if (duplicate) {
      user.email = "";
      user.emailError = "Email Already exist";
      res.render("createOrEdit-user", {
        title: "New User",
        method: "post",
        action: "create",
        user: user,
      });
    } else {

      const newUser = await user.save();

      Cart.create({ user: newUser._id }).then((cart) => {
        newUser.cart = cart._id;
        newUser.save();
      });

      res.render("details-user", {
        title: "User",
        user: newUser,
      });
    }

  } catch (err) {
    if (err.name == "ValidationError") {
      handleValidationError(err, user);
    }
    res.render("createOrEdit-user", {
      title: "New User",
      method: "post",
      action: "create",
      user: user,
    });
  }
};

function handleValidationError(err, body) {
  for (field in err.errors) {
    switch (err.errors[field].path) {
      case "name":
        body["nameError"] = err.errors[field].message;
        break;
      case "email":
        body["emailError"] = err.errors[field].message;
        break;
      case "phone":
        body["phoneError"] = err.errors[field].message;
        break;
      case "password":
        body["pwError"] = err.errors[field].message;
        break;
      case "poitns":
        body["pointsError"] = err.errors[field].message;
        break;
      default:
        break;
    }
  }
}

userController.edit = async function (req, res) {
  let id = req.params.id;

  try {
    const result = await User.findOne({ id: id });

    res.render("createOrEdit-user", {
      title: "Edit User",
      method: "post",
      action: "/user/edit/" + id,
      user: result,
    });
  } catch (err) {
    res.render('error', { message: "Not found user with id " + id, error: err });
  }
};

userController.update = async function (req, res) {
  if (!req.body) {
    res.render('error', { message: "Data to update can not be empty", error: { status: "", stack: "" } });
  }

  try {

    const id = req.params.id;
    const user = new User(req.body);
    const err = await user.validateSync();

    if (err) {
      if (err.name == "ValidationError") {
        handleValidationError(err, req.body);
      }
      res.render("createOrEdit-user", {
        title: "Edit User",
        method: "post",
        action: "/user/edit/" + req.params.id,
        user: req.body,
      });
    } else {
      const duplicate = await User.findOne({ email: req.body.email });
      if (duplicate) {
        if (id == duplicate._id) {
          const result = await User.findOneAndUpdate({ _id: id }, { $set: req.body }, { new: true });
          if (!result) {
            res.render('error', { message: "Not found user with id " + id, error: { status: "", stack: "" } });
          } else {
            res.redirect("/user/" + result._id);
          }

        } else {
          req.body.email = "";
          req.body.emailError = "Email Already exist.";
          res.render("createOrEdit-user", {
            title: "Edit User",
            method: "post",
            action: "/user/edit/" + id,
            user: req.body,
          });
        }
      } else {
        const result = await User.findOneAndUpdate({ _id: id }, { $set: req.body }, { new: true });
        if (!result) {
          res.render('error', { message: "Not found user with id " + id, error: { status: "", stack: "" } });
        } else {
          res.redirect("/user/" + result._id);
        }
      }
    }
  } catch (err) {
    if (err.name == "ValidationError") {
      handleValidationError(err, req.body);
    } else {
      res.redirect("/user");
    }
    res.render("createOrEdit-user", {
      title: "Edit User",
      method: "post",
      action: "/user/edit/" + req.params.id,
      user: req.body,
    });
  }
};

userController.getPurchaseHistory = async function (req, res) {
  const userId = req.userId;
  Receipt
    .find({ user: userId })
    .sort({ creationDate: -1 })
    .then((receipts) => {
      res.status(200).json({
        message: '',
        data: receipts
      });
    });
}

userController.delete = async function (req, res) {
  const id = req.params.id;

  try {

    const result = await User.findOneAndRemove({ _id: id });
    if (!result) {
      res.render('error', { message: "Not found user with id " + id, error: err });
    } else {
      res.redirect("/user");
    }

  } catch (err) {
    res.render('error', { message: "Error delete user " + id, error: err });
  }
};

module.exports = userController;