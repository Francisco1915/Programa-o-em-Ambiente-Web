var mongoose = require('mongoose');

var EmployeeSchema = new mongoose.Schema({
  password: {
    type: String,
    require: 'This filed is required.',
    minLength: [8, 'Min lenght is 8'],
  },
  name: {
    type: String,
    require: 'This filed is required.',
    minLength: [2, 'Min lenght is 2'],
    maxLength: [30, 'Max lenght is 30']
  },
  email: {
    type: String,
    require: 'This filed is required.',
  },
  phone: {
    type: String,
    require: 'This filed is required.',
    maxLength: [9, 'Max lenght is 9']
  },
  date: {
    type: Date,
  },
  gender: {
    type: String,
  },
  role: {
    type: String,
    default: 'Admin'
  }
});

EmployeeSchema.path('email').validate((val) => {
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(val);
}, 'Invalid e-mail.');

module.exports = mongoose.model('Employee', EmployeeSchema);