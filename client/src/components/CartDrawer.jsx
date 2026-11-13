import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartDrawer({ onClose }) {
  const { items, updateQty, removeItem, total, count } = useCart();
  const navigate = useNavigate();

  const goCheckout = () => { onClose(); navigate('/checkout'); };

  return (
    <>
      <div className="cart-overlay" onClick={onClose} />
      <aside className="cart-drawer" aria-label="Shopping cart">
        <div className="cart-drawer-header">
          <h2>Cart {count > 0 && <span style={{ color: 'var(--muted)', fontWeight: 400, fontSize: '0.9rem' }}>({count} items)</span>}</h2>
          <button className="btn-ghost" onClick={onClose} style={{ width: 36, height: 36, padding: 0, borderRadius: 8 }}>✕</button>
        </div>

        <div className="cart-drawer-body">
          {items.length === 0 ? (
            <div className="empty-state" style={{ padding: '3rem 1rem' }}>
              <div className="empty-icon">🛒</div>
              <p>Your cart is empty</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.productId} className="cart-item">
                <img
                  className="cart-item-img"
                  src={item.image || '/placeholder.png'}
                  alt={item.name}
                  onError={e => { e.target.src = '/placeholder.png'; }}
                />
                <div className="cart-item-info">
                  <p className="cart-item-name">{item.name}</p>
                  <p className="cart-item-price">${item.price.toFixed(2)} each</p>
                  <div className="qty-controls" style={{ marginTop: '0.4rem' }}>
                    <button className="qty-btn" onClick={() => updateQty(item.productId, item.quantity - 1)}>−</button>
                    <span className="qty-val">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQty(item.productId, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>${(item.price * item.quantity).toFixed(2)}</span>
                  <button className="btn-danger" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }} onClick={() => removeItem(item.productId)}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-total-row">
              <span className="cart-total-label">Total</span>
              <span className="cart-total-val">${total.toFixed(2)}</span>
            </div>
            <button className="btn-primary" style={{ width: '100%', padding: '0.875rem', fontSize: '1rem', justifyContent: 'center' }} onClick={goCheckout}>
              Checkout →
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
