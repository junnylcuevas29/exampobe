import React, { useEffect } from 'react'
import useAuth from '../hooks/useAuth'
import useFetchData from '../hooks/useFetchData'

export default function Profile() {
  const { user } = useAuth()
  const { data: orders, loading } = useFetchData(
    user ? `/api/orders/read_user.php?user_id=${user.user_id}` : null,
    [user]
  )

  useEffect(() => {
    document.title = 'My Profile - Manga Store'
  }, [])

  if (!user) {
    return <div className="alert alert-warning">Please log in to view your profile.</div>
  }

  return (
    <div>
      <h2>My Profile</h2>
      <div className="card p-3 mb-4">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>

      <h4>My Orders</h4>
      {loading && <p>Loading orders...</p>}
      {!loading && (!orders || orders.length === 0) && <p>No orders found.</p>}
      {!loading && orders && orders.length > 0 && (
        <ul className="list-group">
          {orders.map((order) => (
            <li key={order.order_id} className="list-group-item">
              Order #{order.order_id} — Total: {order.total} PHP
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
