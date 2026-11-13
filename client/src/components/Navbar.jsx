import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const { count } = useCart();
  const { count: wishCount } = useWishlist();
  const [cartOpen, setCartOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header className="navbar">
        <div className="container">
          <div className="navbar-inner">
            <NavLink to="/" className="brand">⚡ Shop<span>PWA</span></NavLink>

            <nav className="nav-links">
              <NavLink to="/" end>Home</NavLink>
              <NavLink to="/products">Products</NavLink>
              <NavLink to="/wishlist">Wishlist</NavLink>
              <NavLink to="/orders">Orders</NavLink>
            </nav>

            <div className="nav-actions">
              <button className="icon-btn" onClick={() => navigate('/wishlist')} aria-label="Wishlist">
                ♡
                {wishCount > 0 && <span className="badge">{wishCount}</span>}
              </button>
              <button className="icon-btn" onClick={() => setCartOpen(true)} aria-label="Cart">
                🛒
                {count > 0 && <span className="badge">{count}</span>}
              </button>
            </div>
          </div>
        </div>
      </header>

      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
    </>
  );
}
