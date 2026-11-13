import { API_BASE } from '../config';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { enqueueOrder } from '../db/offlineDB';

function getClientId() {
  let id = localStorage.getItem('clientId');
  if (!id) { id = `client-${Date.now()}-${Math.random().toString(36).slice(2)}`; localStorage.setItem('clientId', id); }
  return id;
}

export default function Checkout() {
  const { items, total, emptyCart } = useCart();
  const isOnline = useOnlineStatus();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', street: '', city: '', zip: '', country: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!items.length) return;
    setSubmitting(true); setError('');
    const order = {
      clientId: getClientId(),
      items: items.map(i => ({ product: i.productId, name: i.name, price: i.price, quantity: i.quantity })),
      shippingAddress: form,
    };
    try {
      if (isOnline) {
        const res = await fetch(`${API_BASE}/api/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) });
        if (!res.ok) throw new Error('Order failed');
      } else {
        await enqueueOrder(order);
      }
      await emptyCart();
      navigate('/orders?placed=1');
    } catch { setError('Something went wrong. Please try again.'); }
    finally { setSubmitting(false); }
  };

  if (!items.length) return (
    <main className="page"><div className="container empty-state"><p>No items to checkout.</p></div></main>
  );

  return (
    <main className="page">
      <div className="container">
        <h1 className="section-title" style={{ marginBottom: '1.5rem' }}>Checkout</h1>

        {!isOnline && (
          <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 'var(--radius)', padding: '0.875rem 1rem', marginBottom: '1.5rem', fontSize: '0.875rem', color: '#fbbf24' }}>
            ⚠️ You're offline. Your order will be queued and synced when you reconnect.
          </div>
        )}

        <div className="checkout-layout">
          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="checkout-card">
              <h2>Shipping Address</h2>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} required autoComplete="name" />
              </div>
              <div className="form-group">
                <label className="form-label">Street Address</label>
                <input className="form-input" name="street" placeholder="123 Main St" value={form.street} onChange={handleChange} required autoComplete="address-line1" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input className="form-input" name="city" placeholder="New York" value={form.city} onChange={handleChange} required autoComplete="address-level2" />
                </div>
                <div className="form-group">
                  <label className="form-label">ZIP Code</label>
                  <input className="form-input" name="zip" placeholder="10001" value={form.zip} onChange={handleChange} required autoComplete="postal-code" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Country</label>
                <input className="form-input" name="country" placeholder="United States" value={form.country} onChange={handleChange} required autoComplete="country" />
              </div>
            </div>

            {error && <p style={{ color: '#f87171', fontSize: '0.875rem', marginTop: '0.75rem' }}>{error}</p>}

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.875rem', fontSize: '1rem', justifyContent: 'center', marginTop: '1rem' }} disabled={submitting}>
              {submitting ? '⏳ Placing Order...' : isOnline ? '✅ Place Order' : '📦 Queue Order (Offline)'}
            </button>
          </form>

          {/* Summary */}
          <div className="checkout-card" style={{ position: 'sticky', top: '80px' }}>
            <h2>Order Summary</h2>
            {items.map(i => (
              <div key={i.productId} className="order-summary-item">
                <span style={{ color: 'var(--text-secondary)' }}>{i.name} <span style={{ color: 'var(--muted)' }}>×{i.quantity}</span></span>
                <span>${(i.price * i.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="order-summary-total">
              <span>Total</span>
              <span style={{ background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
