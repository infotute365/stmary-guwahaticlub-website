'use client'

import React, { createContext, useState, useEffect, useCallback, useRef } from 'react'
import { login as apiLogin, logout as apiLogout, getSession } from '../services/api.js'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const hasCheckedSessionRef = useRef(false)

  const checkSession = useCallback(async () => {
    if (hasCheckedSessionRef.current) return
    hasCheckedSessionRef.current = true

    try {
      const data = await getSession()
      setUser(data ?? null)
    } catch (error) {
      if (error?.response?.status !== 401 && error?.response?.status !== 403) {
        console.error('Session check failed', error)
      }
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void checkSession()
  }, [checkSession])

  const login = async (email, password) => {
    const data = await apiLogin(email, password)
    setUser(data?.user ?? null)
    return data
  }

  const logout = async () => {
    try {
      await apiLogout()
    } catch (error) {
      if (error?.response?.status !== 401 && error?.response?.status !== 403) {
        console.error('Logout failed', error)
      }
    } finally {
      setUser(null)
      hasCheckedSessionRef.current = false
      window.location.href = '/login'
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin' || user?.role === 'super-admin'
    }}>
      {children}
    </AuthContext.Provider>
  )
}