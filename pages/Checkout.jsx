import React from 'react'
import useCart from '../hooks/useCart'
import useAuth from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export default function Checkout(){
  const { cart, total, clear } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return alert('Please login first')
    const res = await fetch('/api/orders/create.php', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ items: cart, user_id: user.user_id, total }) })
    if (!res.ok) return alert('Order failed')
    const json = await res.json()
    alert('Order created: ' + json.order_id)
    clear()
    navigate('/profile')
  }
  return (
    <div>
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit}>
        <p>Amount: {total} PHP</p>
        <button className="btn btn-primary" type="submit">Confirm Order</button>
      </form>
    </div>
  )
}
