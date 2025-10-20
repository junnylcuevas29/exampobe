import React, { Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Shop from './pages/Shop'
import MangaDetails from './pages/MangaDetails'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageManga from './pages/admin/ManageManga'
import ManageUsers from './pages/admin/ManageUsers'
import ManageOrders from './pages/admin/ManageOrders'
import RequireAuth from './components/RequireAuth'
import { AuthProvider } from './context/AuthContext'
import AdminLayout from './layouts/AdminLayout'

function AppContent() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <>
      {/* Only show navbar for non-admin pages */}
      {!isAdminRoute && <Navbar />}

      <div className={isAdminRoute ? 'container-fluid p-0' : 'container my-4'}>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/manga/:id" element={<MangaDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* User-only */}
            <Route path="/cart" element={<RequireAuth><Cart /></RequireAuth>} />
            <Route path="/checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
            <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />

            {/* Admin Layout with nested pages */}
            <Route
              path="/admin"
              element={
                <RequireAuth adminOnly={true}>
                  <AdminLayout />
                </RequireAuth>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="manga" element={<ManageManga />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="orders" element={<ManageOrders />} />
            </Route>
          </Routes>
        </Suspense>
      </div>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}