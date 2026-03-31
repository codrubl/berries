import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
 
const AuthContext = createContext(null);
const API_BASE = process.env.REACT_APP_API_URL || '';
 
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('berries_token'));
  const [loading, setLoading] = useState(true);
 
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('berries_token');
  }, []);
 
  useEffect(() => {
    const loadUser = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          logout();
        }
      } catch (error) {
        logout();
      }
      setLoading(false);
    };
    loadUser();
  }, [token, logout]);
 
  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('berries_token', data.token);
    return data;
  };
 
  const register = async (username, email, password) => {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('berries_token', data.token);
    return data;
  };
 
  const updateProfile = async (updates) => {
    const res = await fetch(`${API_BASE}/api/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    setUser(data.user);
    return data;
  };
 
  const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const res = await fetch(`${API_BASE}/api/auth/avatar`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    setUser(data.user);
    return data;
  };
 
  const updateInterests = async (interests) => {
    const res = await fetch(`${API_BASE}/api/auth/interests`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ interests })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    setUser(data.user);
    return data;
  };
 
  const removeAvatar = async () => {
    const res = await fetch(`${API_BASE}/api/auth/avatar`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    setUser(data.user);
    return data;
  };
 
  const deleteAccount = async () => {
    const res = await fetch(`${API_BASE}/api/auth/account`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    logout();
    return data;
  };
 
  const value = {
    user, token, loading,
    login, register, logout,
    updateProfile, uploadAvatar, removeAvatar, updateInterests, deleteAccount,
    isAuthenticated: !!user
  };
 
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
 
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}