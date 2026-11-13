import React, { useEffect } from 'react';

export default function Toast({ message, type = 'default', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2800);
    return () => clearTimeout(t);
  }, [onClose]);

  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'wish' ? '❤️' : '🛒';

  return (
    <div className={`toast toast-${type}`} role="alert">
      <span>{icon}</span>
      <span>{message}</span>
    </div>
  );
}
