const Order = require("../models/Order");
const mongoose = require("mongoose");

function isRealObjectId(id) {
  if (!id) return false;
  const s = String(id);
  if (s.length !== 24) return false;
  return /^[0-9a-fA-F]{24}$/.test(s);
}

const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    const userId = req.user && (req.user._id || req.user.id || req.user.userId);
    if (!userId) {
      return res.status(401).json({ message: "Login expired, please login again" });
    }

    let subtotal = 0;
    const finalItems = [];

    for (let it of items) {
      let price = Number(it.price) || 0;
      let name = it.name || "Product";
      let image = it.image || it.img || "";
      let productId = null;

      if (isRealObjectId(it.product)) {
        productId = it.product;
      } else {
        productId = null;
      }

      const qty = Number(it.quantity) || 1;
      subtotal += price * qty;

      finalItems.push({
        product: productId,
        name: name,
        image: image,
        price: price,
        quantity: qty
      });
    }

    let discount = 0;
    if (couponCode === "WELCOME10") {
      discount = Math.round(subtotal * 0.10);
    }

    const shipping = (subtotal - discount) > 999 ? 0 : 49;
    const total = subtotal - discount + shipping;

    const order = await Order.create({
      user: userId,
      items: finalItems,
      shippingAddress: typeof shippingAddress === "object" ? shippingAddress : { address: shippingAddress || "" },
      paymentMethod: paymentMethod || "COD",
      couponCode: couponCode || "",
      subtotal: subtotal,
      discount: discount,
      shipping: shipping,
      total: total,
      status: "Placed"
    });

    res.status(201).json({ message: "Order placed", order: order });
  } catch (err) {
    console.log("ORDER CREATE ERROR:", err);
    res.status(500).json({ message: "Order failed: " + err.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const userId = req.user && (req.user._id || req.user.id);
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate("user", "name email");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  create: createOrder,
  createOrder: createOrder,
  getMyOrders: getMyOrders,
  getOrders: getMyOrders,
  getAllOrders: getAllOrders
};