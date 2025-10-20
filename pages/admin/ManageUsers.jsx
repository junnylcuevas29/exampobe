import React, { useState, useEffect } from 'react'

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const loadUsers = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/users.php')
    const data = await res.json()
    setUsers(data)
    setLoading(false)
  }

  useEffect(() => { loadUsers() }, [])

  const handleRoleChange = async (user_id, role) => {
    const user = users.find(u => u.user_id === user_id)
    if (!user) return alert('User not found.')

    const res = await fetch('/api/admin/users.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id,
        name: user.name,
        email: user.email,
        role
      })
    })

    if (res.ok) {
      alert('Role updated successfully!')
      loadUsers()
    } else {
      const err = await res.json()
      alert('Error updating role: ' + (err.error || 'Unknown error'))
    }
  }

  const handleDelete = async (user_id) => {
    if (!window.confirm('Delete this user?')) return
    const res = await fetch('/api/admin/users.php', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id })
    })

    if (res.ok) {
      alert('User deleted!')
      loadUsers()
    } else {
      const err = await res.json()
      alert('Error deleting user: ' + (err.error || 'Unknown error'))
    }
  }

  if (loading) return <div>Loading users...</div>

  return (
    <div>
      <h2>Manage Users</h2>
      <div className="table-scroll">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.user_id}>
                <td>{u.user_id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={u.role}
                    onChange={e => handleRoleChange(u.user_id, e.target.value)}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(u.user_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
