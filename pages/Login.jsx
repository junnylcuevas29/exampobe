import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const EVENTS = {
    INPUT_CHANGE: 'input_change',
    FORM_SUBMIT: 'form_submit',
    LOGIN_SUCCESS: 'login_success',
    LOGIN_ERROR: 'login_error'
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    console.log(`Event: ${EVENTS.INPUT_CHANGE} (${name}) | Value:`, value)
    setForm({ ...form, [name]: value })
  }

  const validateForm = () => {
    if (!form.email || !form.password) {
      alert('⚠️ Please fill in all fields.')
      return false
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      alert('⚠️ Invalid email format.')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(`Event: ${EVENTS.FORM_SUBMIT}`, e.type)

    if (!validateForm()) return
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()

      if (!res.ok) {
        console.error(`Event: ${EVENTS.LOGIN_ERROR}`, data.error)
        alert(`❌ Login failed: ${data.error}`)
        setLoading(false)
        return
      }

      console.log(`Event: ${EVENTS.LOGIN_SUCCESS}`, data.user)
      login(data.user)
      alert(`✅ Welcome back, ${data.user.name}!`)
      navigate('/')
    } catch (error) {
      console.error('Login request failed:', error)
      alert('⚠️ Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '80vh' }}
      onLoad={() => console.log('Login page loaded')}
    >
      <div className="card shadow p-4" style={{ width: '350px' }}>
        <h3 className="text-center mb-3">🔑 Login</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={form.email}
              onChange={handleInputChange}
              onFocus={() => console.log('Email input focused')}
              onBlur={() => console.log('Email input blurred')}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={form.password}
              onChange={handleInputChange}
              onFocus={() => console.log('Password input focused')}
              onBlur={() => console.log('Password input blurred')}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="d-grid">
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>

        <p className="text-center mt-3 mb-0">
          Don’t have an account?{' '}
          <a href="/register" className="text-decoration-none text-primary">
            Register here
          </a>
        </p>
      </div>
    </div>
  )
}
