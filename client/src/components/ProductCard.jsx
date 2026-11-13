import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import Toast from './Toast';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { toggle, isWished } = useWishlist();
  const [toast, setToast] = useState(null);
  const wished = isWished(product._id);

  const handleAdd = (e) => {
    e.preventDefault();
    addItem(product);
    setToast({ message: 'Added to cart!', type: 'default' });
  };

  const handleWish = (e) => {
    e.preventDefault();
    toggle(product);
    setToast({ message: wished ? 'Removed from wishlist' : 'Added to wishlist!', type: 'wish' });
  };

  return (
    <>
      <article className="product-card fade-up">
        <div className="product-card-img">
          <Link to={`/products/${product.slug}`}>
            <img
              src={product.image || '/placeholder.png'}
              alt={product.name}
              loading="lazy"
              onError={e => { e.target.src = '/placeholder.png'; }}
            />
          </Link>
          {product.featured && <span className="product-card-badge">Featured</span>}
          <button
            className={`product-card-wish ${wished ? 'wished' : ''}`}
            onClick={handleWish}
            aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {wished ? '❤️' : '🤍'}
          </button>
        </div>

        <div className="card-body">
          <span className="card-category">{product.category?.name}</span>
          <Link to={`/products/${product.slug}`}>
            <h3 className="card-title">{product.name}</h3>
          </Link>
          {product.description && (
            <p className="card-desc" style={{ WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {product.description}
            </p>
          )}
          <div className="card-footer">
            <span className="card-price">${product.price.toFixed(2)}</span>
            {product.stock === 0 ? (
              <span className="card-stock-out">Out of stock</span>
            ) : (
              <button className="card-add" onClick={handleAdd} aria-label="Add to cart">+</button>
            )}
          </div>
        </div>
      </article>

      {toast && <Toast key={Date.now()} message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
