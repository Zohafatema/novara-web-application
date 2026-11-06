const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  product: { type: String, ref: 'Product', required: true },
  name: String,
  image: String,
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 }
}, { _id: false });

const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [itemSchema]
}, { timestamps: true });

module.exports = mongoose.model('Cart', schema);