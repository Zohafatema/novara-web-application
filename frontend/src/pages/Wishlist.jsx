import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { useShop } from '../App';

export default function Wishlist(){
  const { wishlist } = useShop();
  const list = wishlist.length > 0 ? wishlist : products.slice(0,4);
  return (
    <div className="shop-page"><h2>My Wishlist ({list.length})</h2>
      <div className="product-grid">{list.map(p=>(
        <div key={p.id} className="product-card"><img src={p.img} alt={p.name}/><h4>{p.name}</h4><p className="price">₹{p.price}</p><Link to={`/product/${p.id}`} className="buy-now">VIEW</Link></div>
      ))}</div>
    </div>
  );
}