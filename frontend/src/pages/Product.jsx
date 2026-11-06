import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { useShop } from '../App';

export default function Product(){
  const { id } = useParams();
  const { addToCart } = useShop();
  const p = products.find(x => x.id === Number(id)) || products[0];
  return (
    <div className="shop-page">
      <div className="product-detail">
        <img src={p.img} alt={p.name} />
        <div>
          <p className="brand">{p.brand}</p>
          <h2>{p.name}</h2>
          <p className="stars">★ {p.rating} ({p.reviews} reviews)</p>
          <p className="price">₹{p.price} <s>₹{p.oldPrice}</s> <b>{Math.round((1-p.price/p.oldPrice)*100)}% off</b></p>
          <p>{p.desc}</p>
          <p className="free">FREE Delivery • COD Available • 7 Days Return</p>
          <button className="hero-btn" onClick={()=>addToCart(p)}>ADD TO CART</button>
          <Link to="/cart" className="hero-btn2" onClick={()=>addToCart(p)}>BUY NOW</Link>
        </div>
      </div>
    </div>
  );
}