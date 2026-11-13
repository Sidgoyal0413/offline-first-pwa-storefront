import { API_BASE } from '../config';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import Toast from '../components/Toast';
import Spinner from '../components/Spinner';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState(null);
  const { addItem } = useCart();
  const { toggle, isWished } = useWishlist();

  useEffect(() => {
    fetch(`${API_BASE}/api/products/${slug}`)
      .then(r => r.json())
      .then(setProduct)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Spinner />;
  if (!product) return (
    <div className="empty-state" style={{ paddingTop: '4rem' }}>
      <div className="empty-icon">😕</div>
      <p>Product not found.</p>
      <Link to="/products"><button className="btn-outline">Back to Products</button></Link>
    </div>
  );

  const wished = isWished(product._id);

  return (
    <main className="page">
      <div className="container">
        <Link to="/products" style={{ color: 'var(--muted)', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginBottom: '1.5rem' }}>
          ← Back to Products
        </Link>

        <div className="product-detail-layout">
          <div className="product-detail-img">
            <img
              src={product.image || '/placeholder.png'}
              alt={product.name}
              onError={e => { e.target.src = '/placeholder.png'; }}
            />
          </div>

          <div>
            <p className="product-detail-category">{product.category?.name}</p>
            <h1 className="product-detail-title">{product.name}</h1>
            <p className="product-detail-price">${product.price.toFixed(2)}</p>
            <p className="product-detail-desc">{product.description}</p>

            <div className="product-detail-meta">
              <div className="meta-chip">
                {product.stock > 0 ? `✅ In stock (${product.stock})` : '❌ Out of stock'}
              </div>
              {product.featured && <div className="meta-chip">⭐ Featured</div>}
              <div className="meta-chip">🏷 {product.category?.name}</div>
            </div>

            {/* Qty selector */}
            {product.stock > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Qty:</span>
                <div className="qty-controls">
                  <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <span className="qty-val" style={{ minWidth: '32px', textAlign: 'center' }}>{qty}</span>
                  <button className="qty-btn" onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
                </div>
              </div>
            )}

            <div className="product-detail-actions">
              <button
                className="btn-primary"
                disabled={product.stock === 0}
                onClick={() => { addItem(product, qty); setToast({ message: `${qty}× added to cart!`, type: 'default' }); }}
              >
                🛒 Add to Cart
              </button>
              <button
                className={wished ? 'btn-danger' : 'btn-ghost'}
                onClick={() => { toggle(product); setToast({ message: wished ? 'Removed from wishlist' : 'Added to wishlist!', type: 'wish' }); }}
              >
                {wished ? '❤️ Wishlisted' : '🤍 Wishlist'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {toast && <Toast key={Date.now()} message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </main>
  );
}
