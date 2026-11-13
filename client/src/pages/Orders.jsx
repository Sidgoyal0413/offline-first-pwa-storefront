import { API_BASE } from '../config';
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getPendingOrders } from '../db/offlineDB';
import Spinner from '../components/Spinner';

const statusClass = (s) => ({ pending: 'status-pending', confirmed: 'status-confirmed', shipped: 'status-shipped', delivered: 'status-delivered' }[s] || 'status-pending');

export default function Orders() {
  const [searchParams] = useSearchParams();
  const placed = searchParams.get('placed');
  const [orders, setOrders] = useState([]);
  const [queued, setQueued] = useState([]);
  const [loading, setLoading] = useState(true);
  const clientId = localStorage.getItem('clientId');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        if (clientId) {
          const res = await fetch(`${API_BASE}/api/orders?clientId=${clientId}`);
          const data = await res.json();
          setOrders(Array.isArray(data) ? data : []);
        }
      } catch {}
      try {
        setQueued(await getPendingOrders());
      } catch {}
      setLoading(false);
    };
    fetchAll();
  }, [clientId]);

  return (
    <main className="page">
      <div className="container" style={{ maxWidth: '720px' }}>
        <h1 className="section-title" style={{ marginBottom: '1.5rem' }}>Your <span>Orders</span></h1>

        {placed && (
          <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 'var(--radius)', padding: '0.875rem 1rem', marginBottom: '1.5rem', color: '#4ade80', fontSize: '0.875rem' }}>
            ✅ Order placed successfully!
          </div>
        )}

        {queued.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#fbbf24', marginBottom: '0.75rem' }}>⏳ Pending Sync</p>
            {queued.map((o, i) => (
              <div key={i} className="queued-badge">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', color: '#fbbf24', fontWeight: 600 }}>Queued Order</span>
                  <span className="status-badge status-pending">Offline</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                  {o.items.length} item(s) — queued {new Date(o.queuedAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {loading ? <Spinner /> : orders.length === 0 && queued.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <p>No orders yet.</p>
            <Link to="/products"><button className="btn-primary">Start Shopping</button></Link>
          </div>
        ) : (
          orders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-card-header">
                <span className="order-id">#{order._id.slice(-10).toUpperCase()}</span>
                <span className={`status-badge ${statusClass(order.status)}`}>{order.status}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{order.items.length} item(s)</p>
                </div>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
