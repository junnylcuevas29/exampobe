import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useFetchData from '../hooks/useFetchData'

export default function Home() {
  const { data, loading } = useFetchData('/api/manga/latest.php', [])
  const navigate = useNavigate()

  if (loading) return <div>Loading featured...</div>

  return (
    <div>
      <h2>Featured Manga</h2>
      <div className="row">
        {data?.map(m => (
          <div
            key={m.manga_id}
            className="col-md-3"
            onDoubleClick={() => navigate(`/manga/${m.manga_id}`)} // 🖱️ Double-click to view
          >
            <div className="card mb-3 shadow-sm" style={{ cursor: 'pointer' }}>
              <img
  src={m.image_url || `http://localhost/MangaStore/uploads/${m.image}`}
  alt={m.title}
  className="card-img-top"
/>




              <div className="card-body">
                <h5 className="card-title">{m.title}</h5>
                <p className="card-text">{m.author}</p>
                <Link to={`/manga/${m.manga_id}`} className="btn btn-primary">
                  View
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
