import React, { useEffect, useState, useMemo } from 'react'
import useFetchData from '../../hooks/useFetchData'
export default function AdminDashboard(){
  const { data, loading } = useFetchData('/api/admin/dashboard.php', [])
  if (loading) return <div>Loading admin...</div>
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div className="row">
        <div className="col-md-4"><div className="card p-3">Users: {data?.total_users}</div></div>
        <div className="col-md-4"><div className="card p-3">Revenue: {data?.total_revenue}</div></div>
        <div className="col-md-4"><div className="card p-3">Top Selling: {data?.top_selling?.title}</div></div>
      </div>
    </div>
  )
}
