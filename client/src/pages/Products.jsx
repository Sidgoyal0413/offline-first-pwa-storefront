import { API_BASE } from '../config';
import React, { useEffect, useState, useCallback } from 'react';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';

const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'name_asc', label: 'Name A–Z' },
];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 12 });
    if (activeCategory) params.set('category', activeCategory);
    if (search) params.set('search', search);
    if (sort) params.set('sort', sort);

    fetch(`${API_BASE}/api/products?${params}`)
      .then(r => r.json())
      .then(data => {
        let prods = data.products || [];
        // Client-side sort fallback
        if (sort === 'price_asc') prods = [...prods].sort((a, b) => a.price - b.price);
        if (sort === 'price_desc') prods = [...prods].sort((a, b) => b.price - a.price);
        if (sort === 'name_asc') prods = [...prods].sort((a, b) => a.name.localeCompare(b.name));
        setProducts(prods);
        setTotalPages(data.pages || 1);
        setTotal(data.total || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, activeCategory, search, sort]);

  useEffect(() => {
    fetch(`${API_BASE}/api/categories`).then(r => r.json()).then(setCategories).catch(() => {});
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return (
    <main className="page">
      <div className="container">
        <div className="section-header" style={{ marginBottom: '0.5rem' }}>
          <h1 className="section-title">All <span>Products</span></h1>
          {total > 0 && <span style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>{total} items</span>}
        </div>

        {/* Toolbar */}
        <div className="toolbar">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <select className="sort-select" value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Category filters */}
        <div className="filters" style={{ paddingTop: 0, paddingBottom: '1.25rem' }}>
          <button className={`filter-chip ${activeCategory === '' ? 'active' : ''}`} onClick={() => { setActiveCategory(''); setPage(1); }}>
            All
          </button>
          {categories.map(c => (
            <button
              key={c._id}
              className={`filter-chip ${activeCategory === c._id ? 'active' : ''}`}
              onClick={() => { setActiveCategory(c._id); setPage(1); }}
            >{c.name}</button>
          ))}
        </div>

        {loading ? <Spinner /> : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <p>No products found.</p>
            <button className="btn-outline" onClick={() => { setSearch(''); setActiveCategory(''); }}>Clear filters</button>
          </div>
        ) : (
          <div className="product-grid">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button className="page-btn" onClick={() => setPage(1)} disabled={page === 1}>«</button>
            <button className="page-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
              .map((n, idx, arr) => (
                <React.Fragment key={n}>
                  {idx > 0 && arr[idx - 1] !== n - 1 && <span style={{ color: 'var(--muted)' }}>…</span>}
                  <button className={`page-btn ${page === n ? 'active' : ''}`} onClick={() => setPage(n)}>{n}</button>
                </React.Fragment>
              ))}
            <button className="page-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>›</button>
            <button className="page-btn" onClick={() => setPage(totalPages)} disabled={page === totalPages}>»</button>
          </div>
        )}
      </div>
    </main>
  );
}
