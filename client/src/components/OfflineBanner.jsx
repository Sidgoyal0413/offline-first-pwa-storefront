import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useSyncOrders } from '../hooks/useSyncOrders';

export default function OfflineBanner() {
  const isOnline = useOnlineStatus();
  const syncState = useSyncOrders();

  if (!isOnline) return (
    <div className="offline-banner offline" role="status">
      ⚠️ You're offline — browsing cached data. Cart actions will sync when reconnected.
    </div>
  );
  if (syncState === 'syncing') return (
    <div className="offline-banner syncing" role="status">🔄 Syncing queued orders...</div>
  );
  if (syncState === 'done') return (
    <div className="offline-banner done" role="status">✅ Orders synced successfully.</div>
  );
  return null;
}
