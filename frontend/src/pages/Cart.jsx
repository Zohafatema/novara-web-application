import { useShop } from '../App';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Cart(){
  const { cart, removeFromCart, setCart } = useShop();
  const nav = useNavigate();
  const [selected, setSelected] = useState([]);

  useEffect(()=>{
    const allIds = cart.map(i => i.product || i._id || i.id);
    setSelected(allIds);
  }, [cart.length]);

  const getId = (i) => i.product || i._id || i.id;

  const toggleSelect = (id) => {
    if(selected.includes(id)){
      setSelected(selected.filter(s => s !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const selectedItems = cart.filter(i => selected.includes(getId(i)));
  const total = selectedItems.reduce((s,p)=> s + p.price * (p.quantity || 1), 0);
  const totalCount = selectedItems.reduce((s,p)=> s + (p.quantity || 1), 0);
  const delivery = total > 999 || total === 0 ? 0 : 49;
  const grandTotal = total + delivery;

  const handlePlaceOrder = () => {
    if(selectedItems.length === 0){
      return alert("Please select at least 1 product to order");
    }
    sessionStorage.setItem("selectedCartItems", JSON.stringify(selectedItems));
    nav("/checkout?mode=selected");
  };

  if(cart.length === 0) return <div className="empty"><h2>Your Cart is Empty</h2><Link to="/shop" className="hero-btn">SHOP NOW</Link></div>;

  return (
    <div className="cart-page">
      <h2>My Cart ({cart.length})</h2>
      <div className="cart-flex">
        <div style={{flex:1}}>
          {cart.map((p, idx) => {
            const id = getId(p);
            const isChecked = selected.includes(id);
            return (
              <div key={id + idx} className="cart-item" style={{display:'flex', gap:12, alignItems:'center', opacity: isChecked ? 1 : 0.6}}>
                <input 
                  type="checkbox" 
                  checked={isChecked} 
                  onChange={()=>toggleSelect(id)}
                  style={{width:22, height:22, cursor:'pointer'}}
                />
                <img src={p.image || p.img} alt={p.name} style={{width:110, height:120, objectFit:'cover', borderRadius:10}} />
                <div style={{flex:1}}>
                  <h4 style={{margin:0}}>{p.name}</h4>
                  <p>Rs.{p.price} • FREE Delivery</p>
                  <p style={{fontSize:13}}>Qty: {p.quantity || 1}</p>
                  <button onClick={()=>removeFromCart(id)} style={{color:'red', background:'none', border:'none', cursor:'pointer', padding:0}}>Remove</button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bill">
          <h3>PRICE DETAILS</h3>
          <p>Price ({totalCount} items selected) <span>Rs.{total}</span></p>
          <p>Delivery <span>{delivery === 0 ? "FREE" : `Rs.${delivery}`}</span></p>
          <hr/>
          <h3>Total <span>Rs.{grandTotal}</span></h3>
          <button 
            className="hero-btn" 
            style={{width:'100%'}} 
            onClick={handlePlaceOrder}
            disabled={selectedItems.length===0}
          >
            PLACE ORDER
          </button>
        </div>
      </div>
    </div>
  );
}