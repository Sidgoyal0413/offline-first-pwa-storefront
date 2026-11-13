import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, updateQty, removeItem, total, count } = useCart();
  const navigate = useNavigate();

  if (count === 0) return (
    <main className="page">
      <div className="container">
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <p>Your cart is empty.</p>
          <Link to="/products"><button className="btn-primary">Browse Products</button></Link>
        </div>
      </div>
    </main>
  );

  return (
    <main className="page">
      <div className="container">
        <h1 className="section-title" style={{ marginBottom: '1.5rem' }}>Your <span>Cart</span></h1>

        <div className="cart-page-layout">
          {/* Items */}
          <div>
            {items.map(item => (
              <div key={item.productId} className="cart-item" style={{ background: 'var(--card)', borderRadius: 'var(--radius)', padding: '1rem', marginBottom: '0.75rem', border: '1px solid var(--border)' }}>
                <img className="cart-item-img" src={item.image || '/placeholder.png'} alt={item.name} onError={e => { e.target.src = '/placeholder.png'; }} />
                <div className="cart-item-info">
                  <p className="cart-item-name">{item.name}</p>
                  <p className="cart-item-price">${item.price.toFixed(2)} each</p>
                  <div className="qty-controls" style={{ marginTop: '0.5rem' }}>
                    <button className="qty-btn" onClick={() => updateQty(item.productId, item.quantity - 1)}>−</button>
                    <span className="qty-val">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQty(item.productId, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 700 }}>${(item.price * item.quantity).toFixed(2)}</span>
                  <button className="btn-danger" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }} onClick={() => removeItem(item.productId)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', position: 'sticky', top: '80px' }}>
            <h2 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Order Summary</h2>
            {items.map(i => (
              <div key={i.productId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                <span>{i.name} ×{i.quantity}</span>
                <span>${(i.price * i.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="divider" />
            <div className="cart-total-row">
              <span className="cart-total-label">Total</span>
              <span className="cart-total-val">${total.toFixed(2)}</span>
            </div>
            <button className="btn-primary" style={{ width: '100%', padding: '0.875rem', fontSize: '1rem', justifyContent: 'center', marginTop: '0.5rem' }} onClick={() => navigate('/checkout')}>
              Checkout →
            </button>
            <Link to="/products">
              <button className="btn-ghost" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>Continue Shopping</button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
