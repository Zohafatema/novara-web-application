import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useShop } from '../App';
import { useState } from 'react';

export default function Shop(){
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "All";
  const search = (params.get("search") || "").toLowerCase();
  const { addToCart, wishlist, setWishlist } = useShop();
  const nav = useNavigate();
  const [sort, setSort] = useState("popular");

  let list = products.filter(p => {
    const matchCat = category === "All" || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search) || p.category.toLowerCase().includes(search) || p.sub.toLowerCase().includes(search);
    return matchCat && matchSearch;
  });

  if(sort === "low") list = [...list].sort((a,b)=>a.price-b.price);
  if(sort === "high") list = [...list].sort((a,b)=>b.price-a.price);

  const toggleWish = (p) => {
    const exists = wishlist.find(w=>w.id===p.id);
    if(exists) setWishlist(wishlist.filter(w=>w.id!==p.id));
    else setWishlist([...wishlist, p]);
  };

  // Flipkart style BUY NOW - Cart se matlab nahi, sirf ye product Checkout pe jayega
  const handleBuyNow = (p) => {
    const buyNowItem = [{
      product: p._id || p.product || p.id,
      _id: p._id || p.id,
      id: p.id,
      name: p.name,
      image: p.img || p.image,
      img: p.img || p.image,
      price: p.price,
      quantity: 1
    }];
    sessionStorage.setItem("buyNow", JSON.stringify(buyNowItem));
    nav("/checkout?mode=buynow");
  };

  return (
    <div className="shop-page">
      <div className="shop-head">
        <h1>{category === "All" ? "All Products" : `${category} Collection`} <span>({list.length})</span></h1>
        <p>Showing {list.length} premium products • Free Delivery over ₹999</p>
      </div>

      <div className="filter-bar">
        {["All","Men","Women","Footwear","Watches","Kids","Accessories"].map(c=>(
          <button key={c} className={category===c ? "filter-btn active" : "filter-btn"} onClick={()=>setParams({category:c})}>{c}</button>
        ))}
        <select value={sort} onChange={e=>setSort(e.target.value)} className="sort-select">
          <option value="popular">Sort: Popular</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
        </select>
      </div>

      <div className="product-grid">
        {list.map(p=>(
          <div key={p.id} className="product-card creative-card">
            <div className="p-tag">{p.tag || p.category}</div>
            <button className="wish-btn" onClick={()=>toggleWish(p)}>{wishlist.find(w=>w.id===p.id) ? "❤️" : "🤍"}</button>
            <Link to={`/product/${p.id}`}><img src={p.img} alt={p.name} /></Link>
            <p className="brand">{p.brand} • {p.sub}</p>
            <h4>{p.name}</h4>
            <p className="stars">★ {p.rating} <span>({p.reviews})</span></p>
            <p className="price">₹{p.price} <s>₹{p.oldPrice}</s> <b>{Math.round((1-p.price/p.oldPrice)*100)}% OFF</b></p>
            <button onClick={()=>addToCart(p)}>ADD TO CART +</button>
            <button onClick={()=>handleBuyNow(p)} style={{background:'#ff6b00', color:'#fff', marginTop:8}}>BUY NOW →</button>
            <Link to={`/product/${p.id}`} className="buy-now">QUICK VIEW →</Link>
          </div>
        ))}
      </div>
      {list.length===0 && <div className="empty"><h3>No products found in {category}</h3><button className="hero-btn" onClick={()=>setParams({category:"All"})}>VIEW ALL</button></div>}
    </div>
  );
}