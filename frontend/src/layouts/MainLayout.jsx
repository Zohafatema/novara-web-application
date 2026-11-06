import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useShop } from '../App';

export default function MainLayout(){
  const { cart, user, logout } = useShop();
  const [q, setQ] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const searchNow = (e) => { e.preventDefault(); navigate(`/shop?search=${q}`); };

  return (
    <div className="app">
      <div className="top-offer">BIG SAVING DAYS - UP TO 80% OFF + EXTRA 10% WITH CODE NOVARA10</div>
      <header className="main-header">
        <Link to="/" className="logo">NOVARA<span>.</span></Link>
        <div className="search-box">
          <form onSubmit={searchNow}>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search for Kurtis, Shoes, Shirts, Watches..." />
            <button>SEARCH</button>
          </form>
        </div>
        <div className="header-right">
          <div className="profile-box" onMouseEnter={()=>setShowMenu(true)} onMouseLeave={()=>setShowMenu(false)}>
            <div className="profile-btn">👤 <span>{user ? `Hi, ${user.name}` : "Hello, Sign In"}<br/><b>Account ▾</b></span></div>
            {showMenu && (
              <div className="drop-menu">
                {user ? <>
                  <p><b>Welcome {user.name}</b></p>
                  <Link to="/orders">My Orders</Link>
                  <Link to="/wishlist">My Wishlist</Link>
                  <Link to="/cart">My Cart ({cart.length})</Link>
                  <button onClick={logout}>LOGOUT</button>
                </> : <>
                  <Link to="/login" className="pink-btn">LOGIN / SIGNUP</Link>
                  <Link to="/orders">Track Order</Link>
                  <Link to="/wishlist">My Wishlist</Link>
                </>}
              </div>
            )}
          </div>
          <Link to="/cart" className="cart-btn">🛒 Cart <b>{cart.length}</b></Link>
        </div>
      </header>
      <nav className="cat-nav">
        {["All","Men","Women","Footwear","Watches","Kids","Accessories"].map(c=>(
         <Link key={c} to={c==="All" ? "/shop" : `/shop?category=${c}`}>{c.toUpperCase()}</Link>
       ))}
      </nav>
      <Outlet />
      <footer className="footer">
        <div className="f-grid">
          <div><h4>NOVARA</h4><p>India's most loved shopping destination. Best quality, best prices, fast delivery.</p><p>📍 Aurangabad, Maharashtra<br/>📞 90000 00000<br/>✉️ hello@novara.com</p></div>
          <div><h4>SHOP</h4><p>Men</p><p>Women</p><p>Kids</p><p>Footwear</p><p>Watches</p></div>
          <div><h4>HELP</h4><p>Track Order</p><p>Returns</p><p>Shipping</p><p>Size Guide</p><p>Contact Us</p></div>
          <div><h4>100% SAFE</h4><p>✓ Cash on Delivery</p><p>✓ UPI / Cards / Net Banking</p><p>✓ 7-Day Easy Returns</p><p>✓ 10L+ Happy Customers</p></div>
        </div>
        <div className="f-bottom">© 2026 NOVARA - Made in India • Privacy • Terms • Sitemap</div>
      </footer>
    </div>
  );
}