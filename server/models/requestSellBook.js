var mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const Book = require("../models/Book");

var requestSellBookSchema = new mongoose.Schema({
  user: { type: ObjectId, ref: 'User' },
  book: {},
  status: { type: Boolean}
});

module.exports = mongoose.model('RequestSellBook', requestSellBookSchema);