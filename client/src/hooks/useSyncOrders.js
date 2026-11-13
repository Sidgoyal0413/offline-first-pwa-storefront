import { API_BASE } from '../config';
import { useEffect, useRef, useState } from 'react';
import { getPendingOrders, markOrderSynced } from '../db/offlineDB';
import { useOnlineStatus } from './useOnlineStatus';

/**
 * Watches online status and syncs queued orders when connectivity is restored.
 */
export function useSyncOrders() {
  const isOnline = useOnlineStatus();
  const [syncState, setSyncState] = useState('idle'); // idle | syncing | done | error
  const isSyncing = useRef(false);

  useEffect(() => {
    if (!isOnline || isSyncing.current) return;

    const sync = async () => {
      const pending = await getPendingOrders();
      if (!pending.length) return;

      isSyncing.current = true;
      setSyncState('syncing');

      try {
        const res = await fetch(`${API_BASE}/api/orders/sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orders: pending }),
        });

        if (!res.ok) throw new Error('Sync failed');

        // Mark all as synced in IDB
        await Promise.all(pending.map(o => markOrderSynced(o.localId)));
        setSyncState('done');
        setTimeout(() => setSyncState('idle'), 3000);
      } catch (err) {
        console.error('Order sync error:', err);
        setSyncState('error');
      } finally {
        isSyncing.current = false;
      }
    };

    sync();
  }, [isOnline]);

  return syncState;
}
