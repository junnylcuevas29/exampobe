import React, { useState, useRef, useImperativeHandle, forwardRef, useId } from 'react'
import { useNavigate } from 'react-router-dom'


const Register = forwardRef((props, ref) => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)

  const formRef = useRef()

  const nameId = useId()
  const emailId = useId()
  const passwordId = useId()
  const confirmId = useId()

 
  useImperativeHandle(ref, () => ({
    resetForm: () => {
      setForm({ name: '', email: '', password: '', confirmPassword: '' })
    }
  }))

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const validateForm = () => {
    const { name, email, password, confirmPassword } = form
    if (!name || !email || !password || !confirmPassword) {
      alert('⚠️ Please fill in all fields.')
      return false
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert('⚠️ Invalid email format.')
      return false
    }
    if (password.length < 6) {
      alert('⚠️ Password must be at least 6 characters long.')
      return false
    }
    if (password !== confirmPassword) {
      alert('⚠️ Passwords do not match.')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password
        })
      })
      const data = await res.json()

      if (!res.ok || data.error) {
        alert(`❌ Registration failed: ${data.error || 'Unknown error.'}`)
        setLoading(false)
        return
      }
      alert(`✅ Account created successfully! Please login.`)
      navigate('/login')
    } catch {
      alert('⚠️ Network error. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card shadow p-4" style={{ width: '380px' }}>
        <h3 className="text-center mb-3">📝 Register</h3>
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor={nameId} className="form-label">Full Name</label>
            <input id={nameId} type="text" name="name" className="form-control" value={form.name}
              onChange={handleInputChange} placeholder="Enter your full name" required />
          </div>

          <div className="mb-3">
            <label htmlFor={emailId} className="form-label">Email Address</label>
            <input id={emailId} type="email" name="email" className="form-control" value={form.email}
              onChange={handleInputChange} placeholder="Enter your email" required />
          </div>

          <div className="mb-3">
            <label htmlFor={passwordId} className="form-label">Password</label>
            <input id={passwordId} type="password" name="password" className="form-control" value={form.password}
              onChange={handleInputChange} placeholder="Create password" required />
          </div>

          <div className="mb-3">
            <label htmlFor={confirmId} className="form-label">Confirm Password</label>
            <input id={confirmId} type="password" name="confirmPassword" className="form-control" value={form.confirmPassword}
              onChange={handleInputChange} placeholder="Re-enter password" required />
          </div>

          <div className="d-grid">
            <button className="btn btn-success" type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
})

export default Register
