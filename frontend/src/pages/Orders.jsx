import { Link } from 'react-router-dom';
export default function Orders(){
  return (
    <div className="shop-page"><h2>My Orders</h2>
      <div className="empty"><h3>No orders yet</h3><p>Order karo, yahan dikhega.</p><Link to="/shop" className="hero-btn">SHOP NOW</Link></div>
    </div>
  );
}