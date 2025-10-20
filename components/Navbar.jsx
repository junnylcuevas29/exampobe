import React, { useLayoutEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useLayoutEffect(() => {
    document.body.style.backgroundColor = '#f9f9f9'
    return () => { document.body.style.backgroundColor = '' }
  }, [])

  const handleLogout = (e) => {
    e.preventDefault()
    if (window.confirm('Are you sure you want to log out?')) {
      logout()
      alert('✅ You have successfully logged out.')
      navigate('/')
    }
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom">
      <div className="container">
        {}
        <Link className="navbar-brand fw-bold text-primary" to="/">📚 MangaStore</Link>

        {}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {user && user.role !== 'admin' && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/shop">🏪 Shop</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/cart">🛒 Cart</Link></li>
              </>
            )}
            {user && user.role === 'admin' && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/admin">📊 Dashboard</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/admin/manga">📚 Manage Manga</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/admin/users">👥 Manage Users</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/admin/orders">🧾 Orders</Link></li>
              </>
            )}
          </ul>

          <ul className="navbar-nav">
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link fw-semibold" to={user.role === 'admin' ? '/admin' : '/profile'}>
                    👋 {user.name}
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-danger ms-2" onClick={handleLogout}>
                    🚪 Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item"><Link className="nav-link text-success" to="/login">🔑 Login</Link></li>
                <li className="nav-item"><Link className="nav-link text-primary" to="/register">📝 Register</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
