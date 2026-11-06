import { useShop } from '../App';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';

export default function Checkout(){
  const { cart, setCart, user } = useShop();
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const isBuyNow = searchParams.get("mode") === "buynow";
  const isSelected = searchParams.get("mode") === "selected";

  const buyNowItems = isBuyNow ? JSON.parse(sessionStorage.getItem("buyNow") || "[]") : [];
  const selectedCartItems = isSelected ? JSON.parse(sessionStorage.getItem("selectedCartItems") || "[]") : [];
  const checkoutItems = isBuyNow ? buyNowItems : isSelected ? selectedCartItems : cart;

  const [form, setForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "Aurangabad",
    state: "Maharashtra",
    postalCode: "",
  });
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);

  const total = checkoutItems.reduce((s,p)=> s + p.price * (p.quantity || 1), 0);

  const placeOrder = async () => {
    if(!user){
      alert("Please login first!");
      return nav("/login");
    }
    for(let k of ["fullName","email","phone","address","city","state","postalCode"]){
      if(!form[k]?.trim()){
        return alert(`Please enter ${k}`);
      }
    }
    if(!checkoutItems.length) return alert("Your cart is empty");

    const token = localStorage.getItem("token");
    if(!token){
      alert("Session expired, please login again");
      return nav("/login");
    }

    const items = checkoutItems.map(p => ({
      product: p.product || p._id || p.id,
      name: p.name,
      image: p.image || p.img,
      price: p.price,
      quantity: p.quantity || 1
    }));

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          items,
          shippingAddress: form,
          paymentMethod: "COD",
          couponCode: couponCode || undefined
        })
      });

      const data = await res.json();
      console.log("Backend response:", data);

      if(!res.ok){
        return alert(data.message || "Order failed");
      }

      alert(`Order Placed Successfully! Total Rs.${data.order.total} - Cash on Delivery`);
      if(isBuyNow){
        sessionStorage.removeItem("buyNow");
      } else if(isSelected){
        sessionStorage.removeItem("selectedCartItems");
        const orderedIds = checkoutItems.map(i => i.product || i._id || i.id);
        setCart(cart.filter(i => !orderedIds.includes(i.product || i._id || i.id)));
      } else {
        setCart([]);
      }
      nav("/orders");

    } catch(e){
      console.log(e);
      alert("Unable to connect to server. Please check if the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const set = (k,v) => setForm(prev => ({...prev, [k]: v}));

  return (
    <div className="cart-page"><h2>Checkout {isBuyNow ? "- Buy Now" : ""}</h2>
      <div className="cart-flex">
        <div className="login-box" style={{textAlign:'left'}}>
          <h3>Delivery Address</h3>
          <input value={form.fullName} onChange={e=>set("fullName", e.target.value)} placeholder="Full Name" style={{width:'100%', padding:12, margin:'10px 0', border:'1px solid #ddd', borderRadius:8}} />
          <input value={form.email} onChange={e=>set("email", e.target.value)} placeholder="Email Address" style={{width:'100%', padding:12, margin:'10px 0', border:'1px solid #ddd', borderRadius:8}} />
          <input value={form.phone} onChange={e=>set("phone", e.target.value)} placeholder="Phone Number" style={{width:'100%', padding:12, margin:'10px 0', border:'1px solid #ddd', borderRadius:8}} />
          <input value={form.address} onChange={e=>set("address", e.target.value)} placeholder="Full Address, Aurangabad" style={{width:'100%', padding:12, margin:'10px 0', border:'1px solid #ddd', borderRadius:8}} />
          <input value={form.city} onChange={e=>set("city", e.target.value)} placeholder="City" style={{width:'100%', padding:12, margin:'10px 0', border:'1px solid #ddd', borderRadius:8}} />
          <input value={form.state} onChange={e=>set("state", e.target.value)} placeholder="State" style={{width:'100%', padding:12, margin:'10px 0', border:'1px solid #ddd', borderRadius:8}} />
          <input value={form.postalCode} onChange={e=>set("postalCode", e.target.value)} placeholder="Postal Code - 431001" style={{width:'100%', padding:12, margin:'10px 0', border:'1px solid #ddd', borderRadius:8}} />
          <input value={couponCode} onChange={e=>setCouponCode(e.target.value)} placeholder="Coupon Code - WELCOME10 (Optional)" style={{width:'100%', padding:12, margin:'10px 0', border:'1px solid #ddd', borderRadius:8}} />
          <p>Payment: Cash on Delivery (COD)</p>
          <button className="hero-btn" style={{width:'100%'}} onClick={placeOrder} disabled={loading}>
            {loading ? "Placing Order..." : `PLACE ORDER - Rs.${total}`}
          </button>
        </div>
        <div className="bill"><h3>Order Summary ({checkoutItems.length})</h3>{checkoutItems.map((p,i)=><p key={i}>{p.name} <span>Rs.{p.price} x {p.quantity || 1}</span></p>)}<hr/><h3>Total <span>Rs.{total}</span></h3><Link to="/cart">Edit Cart</Link></div>
      </div>
    </div>
  );
}