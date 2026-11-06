import { Link } from 'react-router-dom';
import { products, categories } from '../data/products';
import { useShop } from '../App';

export default function Home(){
  const { addToCart, wishlist, setWishlist } = useShop();

  const toggleWish = (p) => {
    const exists = wishlist.find(w=>w.id===p.id);
    if(exists) setWishlist(wishlist.filter(w=>w.id!==p.id));
    else setWishlist([...wishlist, p]);
  };

  return (
    <div>
      {/* ===== CREATIVE HERO ===== */}
      <div className="hero">
        <div>
          <span className="hero-tag">✦ NEW SEASON • 2026 • NOVARA</span>
          <h1>Wear The<br/><em>Story,</em><br/>Not Just<br/>Clothes.</h1>
          <p>Handpicked fashion for Men & Women. Up to 80% OFF. Free Delivery over ₹999.</p>
          <div style={{display:'flex', gap:10}}>
            <Link to="/shop" className="hero-btn">SHOP NOW →</Link>
            <Link to="/shop?category=Women" className="hero-btn2">FOR HER ❤️</Link>
            <Link to="/shop?category=Men" className="hero-btn2">FOR HIM 🖤</Link>
          </div>
          <p style={{marginTop:18, fontSize:12, color:'#888'}}>⭐ 4.8 Rated • 10L+ Happy Customers • COD Available</p>
        </div>
        <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900" alt="Fashion" />
      </div>

      {/* ===== CATEGORY - YAHAN FIX HAI ===== */}
      <h2 className="sec-title">Shop By <em>Category</em></h2>
      <div className="cat-grid">
        {categories.map(c=>(
          <Link key={c.name} to={`/shop?category=${c.name}`} className="cat-card">
            <img src={c.img} alt={c.name} />
            <b>{c.name}</b>
            <span>{c.count} • Shop Now →</span>
          </Link>
        ))}
      </div>

      <div className="deal-strip">⚡ DEAL OF THE DAY - Up to 80% OFF &nbsp; <Link to="/shop">VIEW ALL DEALS →</Link></div>

      {/* ===== MEN PREVIEW - SIRF MEN ===== */}
      <h2 className="sec-title">For Him • <em>Men's Top Picks</em></h2>
      <div className="product-grid">
        {products.filter(p=>p.category==="Men").slice(0,4).map(p=>(
          <div key={p.id} className="product-card creative-card">
            <div className="p-tag">{p.tag || "MEN"}</div>
            <button className="wish-btn" onClick={()=>toggleWish(p)}>{wishlist.find(w=>w.id===p.id) ? "❤️" : "🤍"}</button>
            <Link to={`/product/${p.id}`}><img src={p.img} alt={p.name} /></Link>
            <p className="brand">{p.brand} • {p.sub}</p>
            <h4>{p.name}</h4>
            <p className="stars">★ {p.rating} <span>({p.reviews})</span></p>
            <p className="price">₹{p.price} <s>₹{p.oldPrice}</s> <b>{Math.round((1-p.price/p.oldPrice)*100)}% OFF</b></p>
            <button onClick={()=>addToCart(p)}>ADD TO CART +</button>
            <Link to={`/product/${p.id}`} className="buy-now">QUICK VIEW →</Link>
          </div>
        ))}
      </div>
      <div style={{textAlign:'center', marginBottom:20}}><Link to="/shop?category=Men" className="hero-btn">VIEW ALL MEN →</Link></div>

      {/* ===== WOMEN PREVIEW - SIRF WOMEN ===== */}
      <h2 className="sec-title">For Her • <em>Women's Top Picks</em></h2>
      <div className="product-grid">
        {products.filter(p=>p.category==="Women").slice(0,4).map(p=>(
          <div key={p.id} className="product-card creative-card">
            <div className="p-tag">{p.tag || "WOMEN"}</div>
            <button className="wish-btn" onClick={()=>toggleWish(p)}>{wishlist.find(w=>w.id===p.id) ? "❤️" : "🤍"}</button>
            <Link to={`/product/${p.id}`}><img src={p.img} alt={p.name} /></Link>
            <p className="brand">{p.brand} • {p.sub}</p>
            <h4>{p.name}</h4>
            <p className="stars">★ {p.rating} <span>({p.reviews})</span></p>
            <p className="price">₹{p.price} <s>₹{p.oldPrice}</s> <b>{Math.round((1-p.price/p.oldPrice)*100)}% OFF</b></p>
            <button onClick={()=>addToCart(p)}>ADD TO CART +</button>
            <Link to={`/product/${p.id}`} className="buy-now">QUICK VIEW →</Link>
          </div>
        ))}
      </div>
      <div style={{textAlign:'center', marginBottom:20}}><Link to="/shop?category=Women" className="hero-btn">VIEW ALL WOMEN →</Link></div>

      {/* ===== ALL DEALS ===== */}
      <h2 className="sec-title">Top Deals <em>For You</em></h2>
      <div className="product-grid">
        {products.slice(16,24).map(p=>(
          <div key={p.id} className="product-card creative-card">
            <div className="p-tag">{p.tag || p.category}</div>
            <button className="wish-btn" onClick={()=>toggleWish(p)}>{wishlist.find(w=>w.id===p.id) ? "❤️" : "🤍"}</button>
            <Link to={`/product/${p.id}`}><img src={p.img} alt={p.name} /></Link>
            <p className="brand">{p.brand}</p>
            <h4>{p.name}</h4>
            <p className="stars">★ {p.rating} <span>({p.reviews})</span></p>
            <p className="price">₹{p.price} <s>₹{p.oldPrice}</s> <b>{Math.round((1-p.price/p.oldPrice)*100)}% off</b></p>
            <p className="free">FREE Delivery</p>
            <button onClick={()=>addToCart(p)}>ADD TO CART</button>
            <Link to={`/product/${p.id}`} className="buy-now">VIEW DETAILS</Link>
          </div>
        ))}
      </div>

      <div className="trust-bar">
        <div>🚚 <b>Free Delivery</b><span>On orders ₹999+</span></div>
        <div>💵 <b>COD Available</b><span>Pay on delivery</span></div>
        <div>↩️ <b>Easy Returns</b><span>7 days return</span></div>
        <div>🛡️ <b>100% Genuine</b><span>Quality checked</span></div>
      </div>
    </div>
  );
}