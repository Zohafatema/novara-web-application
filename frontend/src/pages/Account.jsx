import { useState } from 'react';
import { useShop } from '../App';
import { Link, useNavigate } from 'react-router-dom';

export default function Account(){
  const { user, logout } = useShop();
  const [tab, setTab] = useState("orders");
  const navigate = useNavigate();

  if(!user) return <div className="empty"><h3>Please Login</h3><Link to="/login" className="hero-btn">LOGIN</Link></div>;

  const doLogout = () => { logout(); navigate("/login"); };

  return (
    <div className="account-page">
      <div className="account-sidebar">
        <div className="profile-card">
          <div className="profile-avatar">{user.name[0].toUpperCase()}</div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <button className="edit-btn">EDIT PROFILE</button>
        </div>
        <div className="sidebar-menu">
          <p className={tab==="orders" ? "active" : ""} onClick={()=>setTab("orders")}>📦 My Orders</p>
          <p className={tab==="wishlist" ? "active" : ""} onClick={()=>setTab("wishlist")}>❤️ My Wishlist</p>
          <p className={tab==="address" ? "active" : ""} onClick={()=>setTab("address")}>📍 My Addresses</p>
          <p className="logout-link" onClick={doLogout}>🚪 Logout</p>
        </div>
      </div>

      <div className="account-main">
        <div className="welcome-banner">
          <h1>Hi, {user.name} 👋</h1>
          <p>Welcome back to NOVARA. Manage your orders and profile from here.</p>
          <div className="quick-btns">
            <button onClick={()=>navigate("/shop")}>🛍️ Shop Now</button>
            <button onClick={()=>navigate("/cart")}>🛒 My Cart</button>
            <button onClick={()=>navigate("/orders")}>📦 Track Order</button>
          </div>
        </div>

        <div className="empty-order-card">
          <div className="empty-icon">📦</div>
          <h3 style={{marginTop:12}}>No orders yet</h3>
          <p style={{color:'#888', marginTop:8}}>You have no orders yet. Start shopping now!</p>
          <button className="shop-now-btn" onClick={()=>navigate("/shop")}>SHOP NOW →</button>
        </div>
      </div>
    </div>
  );
}