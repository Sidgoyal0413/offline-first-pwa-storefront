import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import Toast from '../components/Toast';
import { useState } from 'react';

export default function Wishlist() {
  const { items, toggle } = useWishlist();
  const { addItem } = useCart();
  const [toast, setToast] = useState(null);

  return (
    <main className="page">
      <div className="container">
        <div className="section-header" style={{ marginBottom: '1.5rem' }}>
          <h1 className="section-title">My <span>Wishlist</span></h1>
          <span style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>{items.length} item{items.length !== 1 ? 's' : ''}</span>
        </div>

        {items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">♡</div>
            <p>Your wishlist is empty.</p>
            <Link to="/products"><button className="btn-primary">Browse Products</button></Link>
          </div>
        ) : (
          <div className="product-grid">
            {items.map(product => (
              <article key={product._id} className="product-card fade-up">
                <div className="product-card-img">
                  <Link to={`/products/${product.slug}`}>
                    <img src={product.image || '/placeholder.png'} alt={product.name} loading="lazy" onError={e => { e.target.src = '/placeholder.png'; }} />
                  </Link>
                  <button className="product-card-wish wished" onClick={() => { toggle(product); setToast({ message: 'Removed from wishlist', type: 'wish' }); }}>❤️</button>
                </div>
                <div className="card-body">
                  <span className="card-category">{product.category?.name}</span>
                  <Link to={`/products/${product.slug}`}><h3 className="card-title">{product.name}</h3></Link>
                  <div className="card-footer">
                    <span className="card-price">${product.price.toFixed(2)}</span>
                    <button className="card-add" onClick={() => { addItem(product); setToast({ message: 'Added to cart!', type: 'default' }); }} aria-label="Add to cart">+</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      {toast && <Toast key={Date.now()} message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </main>
  );
}
