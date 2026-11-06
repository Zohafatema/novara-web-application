import { products } from '../data/products';
export default function Admin(){
  return <div className="shop-page"><h2>Admin Dashboard</h2><p>Total Products: {products.length}</p><p>Total Orders: 0</p><div className="product-grid">{products.map(p=><div key={p.id} className="product-card"><img src={p.img} alt={p.name}/><h4>{p.name}</h4><p>₹{p.price}</p></div>)}</div></div>;
}