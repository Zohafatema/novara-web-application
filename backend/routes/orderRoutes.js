const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { createOrder, getMyOrders, getAllOrders } = require("../controllers/orderController");

const protect = async (req, res, next) => {
  let token = req.headers.authorization;
  if (token && token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  } else {
    token = req.headers.authorization;
  }
  if (!token) {
    return res.status(401).json({ message: "No token, please login" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "novara123");
    const user = await User.findById(decoded.id || decoded._id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token expired, please login again" });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({ message: "Admin only" });
  }
};

router.post("/", protect, createOrder);
router.get("/", protect, getMyOrders);
router.get("/all", protect, admin, getAllOrders);

module.exports = router;