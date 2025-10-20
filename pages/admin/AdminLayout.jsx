import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

export default function AdminLayout() {
  const location = useLocation()

  const isActive = (path) =>
    location.pathname === path ? 'active bg-primary text-white' : 'text-dark'

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {}
      <div
        className="bg-light border-end p-3"
        style={{ width: '250px', position: 'fixed', height: '100%' }}
      >
        <h4 className="mb-4">Admin Panel</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link to="/admin" className={`nav-link ${isActive('/admin')}`}>
              📊 Dashboard
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/manga" className={`nav-link ${isActive('/admin/manga')}`}>
              📚 Manage Manga
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/users" className={`nav-link ${isActive('/admin/users')}`}>
              👤 Manage Users
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link to="/admin/orders" className={`nav-link ${isActive('/admin/orders')}`}>
              🛒 Manage Orders
            </Link>
          </li>
          <li className="nav-item mt-4">
            <Link to="/" className="nav-link text-danger">
              ← Back to Store
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1" style={{ marginLeft: '250px', padding: '20px' }}>
        <Outlet />
      </div>
    </div>
  )
}

