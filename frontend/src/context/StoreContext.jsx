import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
const StoreContext = createContext(null);
export function StoreProvider({ children }) {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('novara_user')); } catch { return null; } });
  const [cart, setCart] = useState(() => { try { return JSON.parse(localStorage.getItem('novara_cart')) || []; } catch { return []; } });
  const [wishlist, setWishlist] = useState(() => { try { return JSON.parse(localStorage.getItem('novara_wishlist')) || []; } catch { return []; } });
  const [toast, setToast] = useState('');
  useEffect(() => localStorage.setItem('novara_cart', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('novara_wishlist', JSON.stringify(wishlist)), [wishlist]);
  const notify = (message) => { setToast(message); window.clearTimeout(window.__novaraToast); window.__novaraToast = window.setTimeout(() => setToast(''), 2600); };
  const addToCart = (product, quantity = 1) => { setCart(old => { const found = old.find(x => x.product._id === product._id); return found ? old.map(x => x.product._id === product._id ? { ...x, quantity: x.quantity + quantity } : x) : [...old, { product, quantity }]; }); notify('Added to your bag'); };
  const updateQuantity = (id, quantity) => setCart(old => quantity < 1 ? old.filter(x => x.product._id !== id) : old.map(x => x.product._id === id ? { ...x, quantity } : x));
  const removeFromCart = id => setCart(old => old.filter(x => x.product._id !== id));
  const toggleWishlist = product => { setWishlist(old => old.some(x => x._id === product._id) ? old.filter(x => x._id !== product._id) : [...old, product]); notify('Wishlist updated'); };
  const login = async (email, password) => { const { data } = await api.post('/auth/login', { email, password }); localStorage.setItem('novara_token', data.token); localStorage.setItem('novara_user', JSON.stringify(data.user)); setUser(data.user); return data.user; };
  const register = async (payload) => { const { data } = await api.post('/auth/register', payload); localStorage.setItem('novara_token', data.token); localStorage.setItem('novara_user', JSON.stringify(data.user)); setUser(data.user); return data.user; };
  const logout = () => { localStorage.removeItem('novara_token'); localStorage.removeItem('novara_user'); setUser(null); notify('You have been signed out'); };
  const value = useMemo(() => ({ user, setUser, cart, setCart, wishlist, toast, notify, addToCart, updateQuantity, removeFromCart, toggleWishlist, login, register, logout, cartCount: cart.reduce((n,x)=>n+x.quantity,0), cartTotal: cart.reduce((n,x)=>n+x.product.price*x.quantity,0) }), [user,cart,wishlist,toast]);
  return <StoreContext.Provider value={value}>{children}{toast && <div className="toast" role="status">{toast}</div>}</StoreContext.Provider>;
}
export const useStore = () => useContext(StoreContext);
