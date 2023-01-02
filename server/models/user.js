var mongoose = require("mongoose");
const { ObjectId } = require('mongodb');

var UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: "This filed is required.",
      minLength: [2, "Min lenght is 2"],
      maxLength: [30, "Max lenght is 30"],
    },
    email: {
      type: String,
      require: "This filed is required.",
    },
    phone: {
      type: String,
      require: "This filed is required.",
      maxLength: [9, "Max lenght is 9"],
    },
    password: {
      type: String,
      require: "This field is required.",
      minLength: [2, "Min lenght is 2"],
    },
    date: {
      type: Date,
    },
    points: {
      type: Number,
      min: [0, "Min points it´s 0!!"],
      default: 100,
    },
    gender: {
      type: String,
    },
    role: {
      type: String,
      default: "User",
    },
    cart: { 
      type: ObjectId, ref: "Cart" 
    },
    receipts: [{ type: ObjectId, ref: "Receipt" }],
    },
  { timestamps: true }
);

UserSchema.path("email").validate((val) => {
  emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(val);
}, "Invalid e-mail.");

module.exports = mongoose.model("User", UserSchema);
