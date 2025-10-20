import React, { useReducer, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'


function cartReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_QTY':
      return state.map(item =>
        item.manga_id === action.id
          ? { ...item, qty: action.qty }
          : item
      )
    case 'REMOVE':
      return state.filter(item => item.manga_id !== action.id)
    case 'CLEAR':
      return []
    default:
      return state
  }
}

export default function Cart() {
  const navigate = useNavigate()

 
  const [cart, dispatch] = useReducer(cartReducer, JSON.parse(localStorage.getItem('manga_cart')) || [])

  const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0)

 
  useEffect(() => {
    localStorage.setItem('manga_cart', JSON.stringify(cart))
  }, [cart])

  return (
    <div>
      <h2>Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty. <Link to="/shop">Shop now</Link></p>
      ) : (
        <>
          <ul className="list-group mb-3">
            {cart.map(i => (
              <li key={i.manga_id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{i.title}</strong> <br /> {i.qty} x {i.price} PHP
                </div>
                <div>
                  <input
                    type="number"
                    value={i.qty}
                    onChange={e => dispatch({ type: 'UPDATE_QTY', id: i.manga_id, qty: Number(e.target.value) })}
                    style={{ width: 80 }}
                  />
                  <button className="btn btn-sm btn-danger ms-2" onClick={() => dispatch({ type: 'REMOVE', id: i.manga_id })}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <h4>Total: {total} PHP</h4>
          <button className="btn btn-success" onClick={() => navigate('/checkout')}>Checkout</button>
          <button className="btn btn-secondary ms-2" onClick={() => dispatch({ type: 'CLEAR' })}>Clear</button>
        </>
      )}
    </div>
  )
}
