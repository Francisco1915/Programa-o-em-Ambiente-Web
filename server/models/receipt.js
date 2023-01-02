const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const receiptSchema = mongoose.Schema({
    user: { type: ObjectId, ref: 'User' },
    productsInfo: [],
    totalPrice: { type: Number, default: 0 },
    promo: { type: Number, default: 0 },
    creationDate: { type: Date, default: Date.now }
}); 

module.exports = mongoose.model('Receipt', receiptSchema);;