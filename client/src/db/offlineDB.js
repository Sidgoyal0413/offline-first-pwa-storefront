/**
 * Lightweight IndexedDB wrapper for offline cart and order queue.
 */

const DB_NAME = 'pwa-storefront';
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('cart')) {
        db.createObjectStore('cart', { keyPath: 'productId' });
      }
      if (!db.objectStoreNames.contains('orderQueue')) {
        const store = db.createObjectStore('orderQueue', { keyPath: 'localId', autoIncrement: true });
        store.createIndex('synced', 'synced', { unique: false });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// --- Cart ---

export async function getCart() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('cart', 'readonly');
    const req = tx.objectStore('cart').getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function upsertCartItem(item) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('cart', 'readwrite');
    const req = tx.objectStore('cart').put(item);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function removeCartItem(productId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('cart', 'readwrite');
    const req = tx.objectStore('cart').delete(productId);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function clearCart() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('cart', 'readwrite');
    const req = tx.objectStore('cart').clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// --- Order Queue ---

export async function enqueueOrder(order) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('orderQueue', 'readwrite');
    const req = tx.objectStore('orderQueue').add({ ...order, synced: false, queuedAt: Date.now() });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getPendingOrders() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('orderQueue', 'readonly');
    const index = tx.objectStore('orderQueue').index('synced');
    const req = index.getAll(IDBKeyRange.only(false));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function markOrderSynced(localId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('orderQueue', 'readwrite');
    const store = tx.objectStore('orderQueue');
    const getReq = store.get(localId);
    getReq.onsuccess = () => {
      const record = getReq.result;
      if (record) {
        record.synced = true;
        store.put(record);
      }
      resolve();
    };
    getReq.onerror = () => reject(getReq.error);
  });
}
