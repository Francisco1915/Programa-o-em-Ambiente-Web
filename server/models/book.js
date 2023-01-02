var mongoose = require('mongoose');

var BookSchema = new mongoose.Schema({
  title: {
    type: String,
    require: 'This filed is required.',
    minLength: [3, 'Min lenght is 3'],
    maxLength: [30, 'Max lenght is 15']
  },
  author: {
    type: String,
    require: 'This filed is required.',
    minLength: [2, 'Min lenght is 2'],
    maxLength: [30, 'Max lenght is 15']
  },
  price: {
    type: Number,
    require: 'This filed is required.',
    min: [2 , 'Min price is 2€']
  },
  isbn: {
    type: String,
    require: 'This filed is required.',
  },
  desc: {
    type: String,
    require: 'This filed is required.',
    minLength: [10, 'Min lenght is 50'],
    maxLength: [500, 'Max lenght is 500']
  },
  date: {
    type: Date,
    require: 'This filed is required.',
    default: Date.now
  },
  type: {
    type:  String,
    required: 'This filed is required'
  },
  status: {
    type: String,
    require: 'This filed is required.',
  },
  qt: {
      type: Number,
      default: 1
  }, 
  emphasis: {
    type: String,
    default: 'False'
  },
  coverImageName: {
    type: String,
    //require: 'Just accept files jpg, png, gif.',
  }
});

BookSchema.path('isbn').validate((val) => {
  isbnRegex = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/;
  return isbnRegex.test(val);
}, 'Invalid ISBN.');

module.exports = mongoose.model('Book', BookSchema);