const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: null },
      name: { type: String, required: true },
      image: { type: String },
      price: { type: Number, required: true },
      quantity: { type: Number, default: 1 }
    }
  ],
  shippingAddress: {
    fullName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    postalCode: String
  },
  paymentMethod: { type: String, default: "COD" },
  couponCode: { type: String, default: "" },
  subtotal: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  shipping: { type: Number, default: 49 },
  total: { type: Number, required: true },
  status: { type: String, default: "Placed" }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);