import React, { createContext, useContext, useState, useCallback } from 'react';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wishlist') || '[]'); } catch { return []; }
  });

  const toggle = useCallback((product) => {
    setItems(prev => {
      const exists = prev.find(i => i._id === product._id);
      const next = exists ? prev.filter(i => i._id !== product._id) : [...prev, product];
      localStorage.setItem('wishlist', JSON.stringify(next));
      return next;
    });
  }, []);

  const isWished = useCallback((id) => items.some(i => i._id === id), [items]);

  return (
    <WishlistContext.Provider value={{ items, toggle, isWished, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
