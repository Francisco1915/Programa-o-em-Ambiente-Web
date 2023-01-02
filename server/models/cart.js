const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    user: { type: ObjectId, ref: 'User' },
    books: [{type: ObjectId, ref: 'Book'}],
    totalPrice: { type: Number, default: 0 }
});

module.exports = mongoose.model('Cart', cartSchema);