import React, { useState, useEffect } from 'react'

export default function ManageOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const loadOrders = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/orders.php')
    const data = await res.json()
    setOrders(data)
    setLoading(false)
  }

  useEffect(() => {
    loadOrders()
  }, [])

  if (loading) return <div>Loading orders...</div>

  return (
    <div>
      <h2>Manage Orders</h2>
      {orders.map(o => (
        <div key={o.order_id} className="card mb-3">
          <div className="card-body">
            <h5>Order #{o.order_id}</h5>
            <p>
              <strong>Customer:</strong> {o.user_name} <br/>
              <strong>Total:</strong> {o.total} PHP <br/>
              <strong>Date:</strong> {o.created_at}
            </p>
            <div className="table-scroll">
              <table className="table table-sm table-striped">
                <thead>
                  <tr>
                    <th>Title</th><th>Qty</th><th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {o.items.map(it => (
                    <tr key={it.order_item_id}>
                      <td>{it.title}</td>
                      <td>{it.qty}</td>
                      <td>{it.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
