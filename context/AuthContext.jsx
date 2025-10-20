import React, { createContext, useState, useEffect, useCallback } from 'react'

export const AuthContext = createContext()

export function AuthProvider({ children }){
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')||'null'))
  useEffect(() => localStorage.setItem('user', JSON.stringify(user)), [user])
  const login = useCallback((userData) => setUser(userData), [])
  const logout = useCallback(() => setUser(null), [])
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}
