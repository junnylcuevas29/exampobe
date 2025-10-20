import React, { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useFetchData from '../hooks/useFetchData'
import useSearch from '../hooks/useSearch'
import usePagination from '../hooks/usePagination'
import useDebounce from '../hooks/useDebounce'
import useCart from '../hooks/useCart'
import useAuth from '../hooks/useAuth'

export default function Shop() {
  const { data, loading } = useFetchData('/api/manga/read.php', [])
  const { add } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  // 🧠 Add to Cart
  const handleAddToCart = (manga) => {
    if (!user) {
      alert('Please login to add manga to cart.')
      return
    }
    if (user.role === 'admin') {
      alert('Admins cannot add manga to cart.')
      return
    }

    add({
      manga_id: manga.manga_id,
      title: manga.title,
      price: manga.price,
      qty: 1,
    })
    alert(`${manga.title} added to cart!`)
  }

  const items = data || []
  const [category, setCategory] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [sort, setSort] = useState('newest')

  const { query, setQuery, results } = useSearch(items, ['title', 'author'])
  const deb = useDebounce(query, 300)
  useEffect(() => setQuery(deb), [deb])

  const filtered = useMemo(() => {
    let arr = results
    if (category) arr = arr.filter(i => i.category_name === category)
    if (priceRange === 'low') arr = arr.filter(i => i.price < 200)
    if (priceRange === 'mid') arr = arr.filter(i => i.price >= 200 && i.price <= 250)
    if (priceRange === 'high') arr = arr.filter(i => i.price > 250)

    if (sort === 'az') arr = [...arr].sort((a, b) => a.title.localeCompare(b.title))
    if (sort === 'za') arr = [...arr].sort((a, b) => b.title.localeCompare(a.title))
    if (sort === 'low') arr = [...arr].sort((a, b) => a.price - b.price)
    if (sort === 'high') arr = [...arr].sort((a, b) => b.price - a.price)
    if (sort === 'newest') arr = [...arr].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    return arr
  }, [results, category, priceRange, sort])

  const { page, setPage, total, paged } = usePagination(filtered, 8)
  if (loading) return <div>Loading shop...</div>

  const categories = [...new Set(items.map(i => i.category_name))]

  return (
    <div>
      <h2>Shop</h2>

      {/* 🔍 Search & Filters */}
      <div className="row mb-3">
        <div className="col-md-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                alert(`Searching for "${query}"...`)
                e.preventDefault()
              }
            }}
            placeholder="Search manga..."
            className="form-control"
          />
        </div>

        <div className="col-md-3">
          <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="col-md-3">
          <select className="form-select" value={priceRange} onChange={e => setPriceRange(e.target.value)}>
            <option value="">All Prices</option>
            <option value="low">Below ₱200</option>
            <option value="mid">₱200 - ₱250</option>
            <option value="high">Above ₱250</option>
          </select>
        </div>

        <div className="col-md-3">
          <select className="form-select" value={sort} onChange={e => setSort(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="az">A - Z</option>
            <option value="za">Z - A</option>
            <option value="low">Lowest Price</option>
            <option value="high">Highest Price</option>
          </select>
        </div>
      </div>

      {/* 🧾 Manga Cards */}
      <div className="row">
        {paged.map((m) => (
          <div
            key={m.manga_id}
            className="col-md-3"
            onDoubleClick={() => navigate(`/manga/${m.manga_id}`)} // 🖱️ New event
          >
            <div className="card mb-3 shadow-sm" style={{ cursor: 'pointer' }}>
<img
  src={m.image_url || `http://localhost/MangaStore/uploads/${m.image}`}
  alt={m.title}
  className="card-img-top"
/>




              <div className="card-body">
                <h5>{m.title}</h5>
                <p>{m.price} PHP</p>

                <div className="d-flex justify-content-between">
                  <Link to={`/manga/${m.manga_id}`} className="btn btn-sm btn-primary">
                    View
                  </Link>

                  {!user && (
                    <button
                      className="btn btn-sm btn-secondary"
                      style={{ opacity: 0.5, cursor: 'not-allowed' }}
                      onClick={() => alert('Please login to add manga to cart.')}
                    >
                      Add to Cart
                    </button>
                  )}

                  {user && user.role !== 'admin' && (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleAddToCart(m)}
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 📄 Pagination */}
      <nav>
        <ul className="pagination">
          {Array.from({ length: total }).map((_, i) => (
            <li key={i} className={`page-item ${i + 1 === page ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setPage(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
