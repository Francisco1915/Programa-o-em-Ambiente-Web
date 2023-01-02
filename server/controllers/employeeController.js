const res = require("express/lib/response");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { count } = require("../models/Employee");
const Employee = require("../models/Employee");
const Order = require("../models/Order");

var employeeController = {};

employeeController.list = async function (req, res) {

  let page = parseInt(req.query.page);
  let limit = parseInt(req.query.limit);
  if (!(page && limit)) {
    page = 1;
    limit = 6;
  }
  const skipIndex = (page - 1) * limit;
  const results = {};

  try {

    let query = Employee.find().limit(limit).skip(skipIndex)
    if (req.query.name != null && req.query.name != '') {
      query = query.regex('name', new RegExp(req.query.name, 'i'))
    }

    const result = await query.exec();
    const count = result.length;

    results.results = result;
    results.page = page;
    results.limit = limit;
    results.pages = count / limit;
    res.render("main-employee", { title: "Employees System", list: results, searchOptions: req.query });

  } catch (err) {
    res.render('error', { message: err.message, error: err });
  };
};

employeeController.show = async function (req, res) {
  let id = req.params.id;

  try {
    const result = await Employee.findOne({ _id: id });
    if (!result) {
      res.render('error', { message: "Not found employee with id " + id, error: { status: "", stack: "" } });
    } else {
      res.render("details-employee", {
        title: "View Employee",
        employee: result,
      });
    }
  } catch (err) {
    res.render('error', { message: "Not found employee with id " + id, error: err });
  };
};

employeeController.create = function (req, res) {
  res.render("createOrEdit-employee", {
    title: "New Employee",
    method: "post",
    action: "create",
    employee: new Employee({}),
  });
};

employeeController.save = async function (req, res) {
  if (!req.body) {
    res.render("error", { message: "Content can not be emtpy!", error: { status: "", stack: "" } });
  }

  var hashedPassword = bcrypt.hashSync(req.body.password, 8);

  //new user
  const employee = new Employee(req.body);
  employee.password = hashedPassword;

  //save user in database
  try {

    const duplicate = await Employee.findOne({ email: req.body.email });
    if (duplicate) {
      employee.email = "";
      employee.password = "";
      employee.emailError = "Email Already exist";
      res.render("createOrEdit-employee", {
        title: "New Employee",
        method: "post",
        action: "create",
        employee: employee,
      });
    } else {
      const newEmployee = await employee.save();

      res.render("details-employee", {
        title: "Employee",
        employee: newEmployee,
      });
    }
  } catch (err) {
    if (err.name == "ValidationError") {
      handleValidationError(err, employee);
    }
    employee.password = "";
    res.render("createOrEdit-employee", {
      title: "New Employee",
      method: "post",
      action: "create",
      employee: employee,
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
      default:
        break;
    }
  }
}

employeeController.edit = async function (req, res) {

  try {
    const result = await Employee.findOne({ _id: req.params.id })
    if (!result) {
      res.render('error', { message: "Not found employee with id " + req.params.id, error: { status: "", stack: "" } });
    } else {
      res.render("createOrEdit-employee", {
        title: "Edit Employee",
        method: "post",
        action: "/employee/edit/" + req.params.id,
        employee: result,
      });
    }
  } catch (err) {
    res.render('error', { message: "Not found employee with id " + id, error: err });
  };
};

employeeController.update = async function (req, res) {
  if (!req.body) {
    res.render('error', { message: "Data to update can not be empty", error: { status: "", stack: "" } });
  }

  try {

    const id = req.params.id;
    const employee = new Employee(req.body);
    const err = await employee.validateSync();

    if (err) {
      if (err.name == "ValidationError") {
        handleValidationError(err, req.body);
      }
      res.render("createOrEdit-employee", {
        title: "Edit Employee",
        method: "post",
        action: "/employee/edit/" + req.params.id,
        employee: req.body,
      });
    } else {
      const duplicate = await Employee.findOne({ email: req.body.email });
      if (duplicate) {
        if (id == duplicate._id) {
          const result = await Employee.findOneAndUpdate({ _id: id }, { $set: req.body }, { new: true })
          if (!result) {
            res.render('error', { message: "Not found employee with id " + id, error: { status: "", stack: "" } });
          } else {
            res.redirect("/employee/" + result._id);
          }
        } else {
          req.body.email = "";
          req.body.emailError = "Email Already exist.";
          res.render("createOrEdit-employee", {
            title: "Edit Employee",
            method: "post",
            action: "/employee/edit/" + id,
            employee: req.body,
          });
        }
      } else {
        const result = await Employee.findOneAndUpdate({ _id: id }, { $set: req.body }, { new: true })
        if (!result) {
          res.render('error', { message: "Not found employee with id " + id, error: { status: "", stack: "" } });
        } else {
          res.redirect("/employee/" + result._id);
        }
      }
    }
  } catch (err) {
    if (err.name == "ValidationError") {
      handleValidationError(err, req.body);
    } else {
      res.redirect("/employee");
    }
    res.render("createOrEdit-employee", {
      title: "Edit Employee",
      method: "post",
      action: "/employee/edit/" + req.params.id,
      employee: req.body,
    });
  }
};

employeeController.delete = async function (req, res) {
  const id = req.params.id;

  try {

    const result = await Employee.findOneAndRemove({ _id: id });
    if (!result) {
      res.render('error', { message: "Not found employee with id " + id, error: err });
    } else {
      res.redirect("/employee");
    }

  } catch (err) {
    res.render('error', { message: "Error delete employee " + id, error: err });
  }
};

module.exports = employeeController;
