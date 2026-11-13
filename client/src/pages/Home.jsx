import { API_BASE } from '../config';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/products?limit=6`)
      .then(r => r.json())
      .then(data => setFeatured(data.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-eyebrow">
              <span>⚡</span> Offline-First PWA Store
            </div>
            <h1>
              Shop Smarter,<br />
              <span>Even Offline</span>
            </h1>
            <p>Browse products, manage your cart, and place orders — with or without internet. Everything syncs automatically.</p>
            <div className="hero-actions">
              <Link to="/products"><button className="btn-primary">Explore Products →</button></Link>
              <Link to="/wishlist"><button className="btn-ghost">View Wishlist ♡</button></Link>
            </div>
          </div>

          <div className="stats-bar">
            {[
              { value: '500+', label: 'Products' },
              { value: '100%', label: 'Offline Ready' },
              { value: '3', label: 'Categories' },
              { value: '0ms', label: 'Cache Hit' },
            ].map(s => (
              <div key={s.label} className="stat">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="page">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured <span>Products</span></h2>
            <Link to="/products"><button className="btn-ghost" style={{ fontSize: '0.8rem' }}>View all →</button></Link>
          </div>

          {loading ? <Spinner /> : (
            <div className="product-grid">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '2rem 0 4rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            {[
              { icon: '📶', title: 'Works Offline', desc: 'Service worker caches your app shell and API responses.' },
              { icon: '🔄', title: 'Auto Sync', desc: 'Queued orders sync automatically when you reconnect.' },
              { icon: '💾', title: 'Persistent Cart', desc: 'Cart saved in IndexedDB — survives page reloads.' },
              { icon: '📱', title: 'Installable', desc: 'Add to home screen for a native app experience.' },
            ].map(f => (
              <div key={f.title} className="feature-card">
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{f.icon}</div>
                <h3 style={{ fontWeight: 700, marginBottom: '0.4rem' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
