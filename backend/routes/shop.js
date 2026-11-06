const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Wishlist = require('../models/Wishlist');
const Order = require('../models/Order');
// Product model ko register karna zaroori hai warna populate fail hoga
try { require('../models/Product'); } catch(e) {}

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Please login first' });
  try { 
    const decoded = jwt.verify(token, process.env.JWT_SECRET || process.env.JWT_KEY || 'novara_secret');
    req.userId = decoded.id || decoded._id || decoded.userId; 
    next(); 
  }
  catch (err) { 
    console.log("JWT Error:", err.message);
    return res.status(401).json({ message: 'Invalid token - Please login again' }); 
  }
};

// --- CART ---
router.get('/cart', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.userId });
    res.json(cart || { items: [] });
  } catch(err){ console.log(err); res.status(500).json({ message: err.message }); }
});

router.post('/cart', auth, async (req, res) => {
  try {
    const { product, name, price, image } = req.body;
    if(!product) return res.status(400).json({ message: 'Product ID missing' });
    let cart = await Cart.findOne({ user: req.userId });
    if (!cart) cart = await Cart.create({ user: req.userId, items: [] });
    const existing = cart.items.find(i => i.product && i.product.toString() === product.toString());
    if (existing) existing.quantity += 1;
    else cart.items.push({ product, name, price, image, quantity: 1 });
    await cart.save();
    res.json(cart);
  } catch(err){ console.log("Cart POST Error:", err); res.status(500).json({ message: err.message }); }
});

router.delete('/cart/:productId', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.userId });
    if (cart) {
      cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
      await cart.save();
    }
    res.json({ message: 'Removed' });
  } catch(err){ res.status(500).json({ message: err.message }); }
});

// --- WISHLIST ---
router.get('/wishlist', auth, async (req, res) => {
  try {
    const wish = await Wishlist.findOne({ user: req.userId }).populate('products');
    res.json(wish || { products: [] });
  } catch(err){ console.log("Wishlist GET Error:", err); res.status(500).json({ message: err.message }); }
});

router.post('/wishlist', auth, async (req, res) => {
  try {
    const { product } = req.body;
    if(!product) return res.status(400).json({ message: 'Product ID missing' });
    let wish = await Wishlist.findOne({ user: req.userId });
    if (!wish) wish = await Wishlist.create({ user: req.userId, products: [] });
    const already = wish.products.some(p => p.toString() === product.toString());
    if (!already) {
      wish.products.push(product);
      await wish.save();
    }
    res.json(wish);
  } catch(err){ console.log("Wishlist POST Error:", err); res.status(500).json({ message: err.message }); }
});

router.delete('/wishlist/:productId', auth, async (req, res) => {
  try {
    let wish = await Wishlist.findOne({ user: req.userId });
    if (wish) {
      wish.products = wish.products.filter(p => p.toString() !== req.params.productId);
      await wish.save();
    }
    res.json({ message: 'Removed' });
  } catch(err){ res.status(500).json({ message: err.message }); }
});

// --- ORDER ---
router.post('/orders', auth, async (req, res) => {
  try {
    const { items, shippingAddress, subtotal, shipping, total } = req.body;
    const order = await Order.create({
      user: req.userId,
      items,
      shippingAddress,
      subtotal,
      shipping: shipping || 0,
      total,
      paymentMethod: 'COD'
    });
    await Cart.findOneAndDelete({ user: req.userId });
    res.json(order);
  } catch(err){ console.log("Order POST Error:", err); res.status(500).json({ message: err.message }); }
});

router.get('/orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch(err){ res.status(500).json({ message: err.message }); }
});

module.exports = router;