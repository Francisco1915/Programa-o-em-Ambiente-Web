var mongoose = require('mongoose');

var OrderSchema = new mongoose.Schema({
  clientEmail: {
      type: String,
      require: 'This filed is required'
  },
  employeeEmail: {
    type: String,
    require: 'This filed is required'
  },
  books: {
      type: [{
          isbn: {
              type: String
          },
          status: {
              type: String
          }
      }]
  },
  priceOrder: {
      type: Number,
      required: 'This filed is required'
  }
});


module.exports = mongoose.model('Order', OrderSchema);