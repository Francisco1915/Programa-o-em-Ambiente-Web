const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../jwt_secret/config");
const User = require("../models/User");
const Employee = require("../models/Employee");
const Cart = require("../models/Cart");

var authController = {};

authController.login = async function (req, res) {
  let user = await User.findOne({ email: req.body.email });
  let employee = await Employee.findOne({ email: req.body.email });

  if (!user && !employee)
    return res.json({ message: "No user or employee found, check your email!!" });

  if (!user) {
    user = employee;
  }

  // check if the password is valid
  var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

  if (!passwordIsValid)
    return res.json({
      auth: false,
      token: null,
      message: "Authentication is invalid, check your password!!",
    });

  // if user is found and password is valid
  // create a token
  var token = jwt.sign({ id: user._id, role: user.role }, config.secret, {
    expiresIn: 86400, // expires in 24 hours
  });

  // return the information including token as JSON
  res.json({ auth: true, token: token, message: "Authentication is valid" });
};

authController.getUser = async function (req, res) {
  let id = req.userId;

  try {
    let user = await User.findOne({ _id: id });
    let employee = await Employee.findOne({ _id: id });

    if (!user && !employee)
      return res.json({ message: "No user or employee found in database!!" });

    if (!user) {
      user = employee;
    }

    if (!user) {
      res.json({ message: "Not found user or employee with id " + id });
    } else {
      res.json({ data: user, message: "" });
    }
  } catch (err) {
    res.json({ message: "Not found user or employee with id " + id });
  }
};

authController.getUserById = async function (req, res) {
  let id = req.params.userId;

  try {
    let user = await User.findOne({ _id: id });
    let employee = await Employee.findOne({ _id: id });

    if (!user && !employee)
      return res.json({ message: "No user or employee found in database!!" });

    if (!user) {
      user = employee;
    }

    if (!user) {
      res.json({ message: "Not found user with id " + id });
    } else {
      res.json({ data: user, message: "" });
    }
  } catch (err) {
    res.json({ message: "Not found user with id " + id, error: err });
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

authController.register = async function (req, res) {
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);

  const user = new User(req.body);
  user.password = hashedPassword;

  try {
    const duplicate = await User.findOne({ email: req.body.email });
    const duplicate1 = await Employee.findOne({ email: req.body.email });
    if (duplicate1) {
      return res.json({ message: "Email already exist" });
    } else {
      let newUser;
      if (duplicate) {
        if (!duplicate.password) {
          duplicate.password = user.password;
          newUser = await duplicate.save();
        } else {
          return res.json({ message: "Email already exist" });
        }
      } else {
        newUser = await user.save();
      }

      Cart.create({ user: newUser._id }).then((cart) => {
        console.log("5")
        newUser.cart = cart._id;
        newUser.save();
      });

      // if user is registered without errors
      // create a token
      var token = jwt.sign(
        { id: newUser._id, role: newUser.role },
        config.secret,
        {
          expiresIn: 86400, // expires in 24 hours
        }
      );
      res.json({ auth: true, token: token, message: "" });
    }
  } catch (err) {
    console.log(err)
    res.json({ message: "Something went wrong, please try again." });
  }
};

authController.editUser = async function (req, res) {
  if (!req.body) {
    return res.json({
      message: 'Something went wrong, please try again.'
    });
  }

  try {

    const id = req.userId;
    let err = undefined;
    let user = new User({});

    const duplicate = await User.findOne({ email: req.body.email });
    const duplicate1 = await Employee.findOne({ email: req.body.email });

    const duplicateID = await User.findOne({ _id: id });
    const duplicateID1 = await Employee.findOne({ _id: id });

    if (duplicate) {
      user = new User(req.body);
      err = await user.validateSync();
    }

    if (duplicate1) {
      user = new Employee(req.body);
      err = await user.validateSync();
    }

    if (!duplicate && !duplicate1) {

      if (duplicateID) {
        user = new User(req.body);
        err = await user.validateSync();
      }

      if (duplicateID1) {
        user = new Employee(req.body);
        err = await user.validateSync();
      }
    }

    if (err) {
      console.log(err)
      return res.json({
        message: 'User or employee form validation failed!',
      });
    } else {

      if (duplicate) {
        if (bcrypt.compareSync(req.body.password, duplicate.password)) {
          req.body.password = duplicate.password;
          editUser(duplicate, id, req, res);
        } else {
          res.json({
            message: "User password dont match!!"
          });
        }
      }

      if (duplicate1) {
        if (bcrypt.compareSync(req.body.password, duplicate1.password)) {
          req.body.password = duplicate1.password;
          editEmployee(duplicate1, id, req, res)
        } else {
          res.json({
            message: "Employee password dont match!!"
          });
        }
      }

      if (!duplicate && !duplicate1) {

        if (duplicateID) {
          if (bcrypt.compareSync(req.body.password, duplicateID.password)) {
            req.body.password = duplicateID.password;
            editUser(duplicateID, id, req, res);
          } else {
            res.json({
              message: "User password dont match!!"
            });
          }
        }

        if (duplicateID1) {
          if (bcrypt.compareSync(req.body.password, duplicateID1.password)) {
            req.body.password = duplicateID1.password;
            editEmployee(duplicateID1, id, req, res)
          } else {
            res.json({
              message: "Employee password dont match!!"
            });
          }
        }
      }

    }
  } catch (err) {
    console.log(err)
    res.json({ message: "Something went wrong, please try again." });
  }
};

async function editUser(duplicate, id, req, res) {
  if (duplicate) {
    if (id == duplicate._id) {
      const result = await User.findOneAndUpdate({ _id: id }, { $set: req.body }, { new: true });

      if (!result) {
        res.json({
          message: 'There is no user with the given id in our database.'
        });
      } else {
        res.status(200).json({
          message: 'User edit successfully!',
          data: result
        });
      }
    } else {
      req.body.email = "";
      req.body.emailError = "Email Already exist.";
      res.json({
        message: 'User form validation failed, email already exist!!!',
      });
    }
  }
}

async function editEmployee(duplicate, id, req, res) {
  if (duplicate) {
    if (id == duplicate._id) {
      const result = await Employee.findOneAndUpdate({ _id: id }, { $set: req.body }, { new: true });
      if (!result) {
        return res.json({
          message: 'There is no employee with the given id in our database.'
        });
      } else {
        return res.status(200).json({
          message: 'Employee edit successfully!',
          data: result
        });
      }

    } else {
      req.body.email = "";
      req.body.emailError = "Email Already exist.";
      return res.json({
        message: 'Employee form validation failed, email already exist!!!',
      });
    }
  }
}


authController.verifyToken = async function (req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.headers["x-access-token"];
  if (!token) return res.json({ auth: false, message: "No token provided." });

  // verifies secret and checks exp
  jwt.verify(token, config.secret, async function (err, decoded) {
    if (err)
      return res.json({
        auth: false,
        message: "Failed to authenticate token.",
      });

    // if everything is good, save to request for use in other routes
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

authController.verifyTokenAdmin = async function (req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.headers["x-access-token"];
  if (!token) return res.json({ auth: false, message: "No token provided." });

  // verifies secret and checks exp
  jwt.verify(token, config.secret, async function (err, decoded) {
    if (err || decoded.role !== "Admin")
      return res.json({
        auth: false,
        message: "Failed to authenticate token or not Admin",
      });
    // if everything is good, save to request for use in other routes
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

module.exports = authController;
