// Relative API paths work locally through Vite proxy. In production set VITE_API_URL to your Render backend URL.
export const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
