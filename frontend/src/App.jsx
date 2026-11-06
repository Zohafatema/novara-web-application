import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, createContext, useContext, useEffect } from 'react';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Auth from './pages/Auth';
import Account from './pages/Account';
import Admin from './pages/Admin';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Product from './pages/Product';
import Wishlist from './pages/Wishlist';
import NotFound from './pages/NotFound';

export const ShopContext = createContext();
export const useShop = () => useContext(ShopContext);
const API = "http://localhost:5000/api/shop";
const ORDER_API = "http://localhost:5000/api/orders";

export default function App(){
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));

  const getHeaders = () => ({ "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}` });

  const loadShopData = async () => {
    if(!localStorage.getItem("token")) return;
    try {
      const c = await fetch(`${API}/cart`, { headers: getHeaders() }).then(r=>r.json());
      const w = await fetch(`${API}/wishlist`, { headers: getHeaders() }).then(r=>r.json());
      const o = await fetch(`${ORDER_API}`, { headers: getHeaders() }).then(r=>r.json());
      if(c && c.items) {
        // Normalize - Backend se jo aaye usko Frontend format me lao
        const normalized = c.items.map(i => ({
          product: i.product?._id || i.product || i._id || i.id,
          _id: i.product?._id || i.product || i._id || i.id,
          id: i.product?._id || i.product || i._id || i.id,
          name: i.name || i.product?.name,
          image: i.image || i.img || i.product?.image || i.product?.img,
          img: i.image || i.img || i.product?.image || i.product?.img,
          price: i.price || i.product?.price,
          quantity: i.quantity || 1
        }));
        setCart(normalized);
      }
      if(w && w.products) setWishlist(w.products);
      if(Array.isArray(o)) setOrders(o);
      else if(o && Array.isArray(o.orders)) setOrders(o.orders);
    } catch {}
  };

  useEffect(()=>{ loadShopData(); }, [user]);

  const addToCart = async (p) => {
    if(!user) return alert("Please login first to add to cart");
    const productId = p._id || p.product || p.id;
    const productImage = p.image || p.img;
    const productName = p.name;
    const productPrice = p.price;

    // 1. Pehle screen pe turant badhao - Double click pe turant 2 hoga
    setCart(prev => {
      const exists = prev.find(i => (i.product === productId || i._id === productId || i.id === productId));
      if(exists){
        return prev.map(i => (i.product === productId || i._id === productId || i.id === productId) ? {...i, quantity: (i.quantity || 1) + 1} : i);
      }
      return [...prev, { product: productId, _id: productId, id: productId, name: productName, image: productImage, img: productImage, price: productPrice, quantity: 1 }];
    });

    // 2. Fir Backend ko bhejo
    try {
      await fetch(`${API}/cart`, { 
        method: "POST", headers: getHeaders(), 
        body: JSON.stringify({ product: productId, name: productName, price: productPrice, image: productImage, quantity: 1 }) 
      });
      loadShopData();
    } catch(e){
      console.log("Add to cart failed", e);
    }
  };

  const addToWishlist = async (p) => {
    if(!user) return alert("Please login first to add to wishlist");
    const productId = p._id || p.id || p.product;
    await fetch(`${API}/wishlist`, { 
      method: "POST", headers: getHeaders(), 
      body: JSON.stringify({ product: productId }) 
    });
    loadShopData();
  };

  const removeFromWishlist = async (productId) => {
    const id = productId._id || productId;
    await fetch(`${API}/wishlist/${id}`, { method: "DELETE", headers: getHeaders() });
    loadShopData();
  };

  const removeFromCart = async (productId) => {
    const id = productId._id || productId.product || productId;
    // Pehle screen se hatao
    setCart(prev => prev.filter(i => (i.product !== id && i._id !== id && i.id !== id)));
    await fetch(`${API}/cart/${id}`, { method: "DELETE", headers: getHeaders() });
    loadShopData();
  };

  const placeOrder = async (shippingAddress, orderItems = null) => {
    const itemsToOrder = orderItems || cart;
    const subtotal = itemsToOrder.reduce((s, i) => s + i.price * (i.quantity || 1), 0);
    const shipping = subtotal > 999 ? 0 : 49;
    const total = subtotal + shipping;
    const items = itemsToOrder.map(i => ({ product: i.product || i._id || i.id, name: i.name, image: i.image || i.img, price: i.price, quantity: i.quantity || 1 }));
    const res = await fetch(`${ORDER_API}`, { method: "POST", headers: getHeaders(), body: JSON.stringify({ items, shippingAddress, subtotal, shipping, total }) });
    const data = await res.json();
    if(res.ok){ setCart([]); loadShopData(); return data; }
    throw new Error(data.message);
  };

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("novara_user");
    sessionStorage.removeItem("buyNow");
    setUser(null); setCart([]); setWishlist([]); setOrders([]);
  };

  return (
    <ShopContext.Provider value={{cart, setCart, wishlist, setWishlist, orders, setOrders, addToCart, addToWishlist, removeFromWishlist, removeFromCart, placeOrder, loadShopData, user, setUser, login, logout}}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout/>}>
            <Route index element={<Home/>} />
            <Route path="shop" element={<Shop/>} />
            <Route path="product/:id" element={<Product/>} />
            <Route path="cart" element={<Cart/>} />
            <Route path="checkout" element={<Checkout/>} />
            <Route path="wishlist" element={<Wishlist/>} />
            <Route path="orders" element={<Orders/>} />
            <Route path="account" element={<Account/>} />
            <Route path="login" element={<Auth/>} />
            <Route path="signup" element={<Auth/>} />
            <Route path="admin" element={<Admin/>} />
            <Route path="*" element={<NotFound/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ShopContext.Provider>
  );
}