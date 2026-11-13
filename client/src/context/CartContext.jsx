import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getCart, upsertCartItem, removeCartItem, clearCart } from '../db/offlineDB';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  // Load cart from IndexedDB on mount
  useEffect(() => {
    getCart().then(setItems).catch(console.error);
  }, []);

  const addItem = useCallback(async (product, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === product._id);
      const updated = existing
        ? prev.map(i => i.productId === product._id ? { ...i, quantity: i.quantity + quantity } : i)
        : [...prev, { productId: product._id, name: product.name, price: product.price, image: product.image, quantity }];
      // Persist to IDB
      const item = updated.find(i => i.productId === product._id);
      upsertCartItem(item).catch(console.error);
      return updated;
    });
  }, []);

  const updateQty = useCallback(async (productId, quantity) => {
    if (quantity < 1) return removeItem(productId);
    setItems(prev => {
      const updated = prev.map(i => i.productId === productId ? { ...i, quantity } : i);
      const item = updated.find(i => i.productId === productId);
      if (item) upsertCartItem(item).catch(console.error);
      return updated;
    });
  }, []);

  const removeItem = useCallback(async (productId) => {
    setItems(prev => prev.filter(i => i.productId !== productId));
    await removeCartItem(productId);
  }, []);

  const emptyCart = useCallback(async () => {
    setItems([]);
    await clearCart();
  }, []);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, updateQty, removeItem, emptyCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
