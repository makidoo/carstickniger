import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

const fetchUser = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/auth/me`);
      setUser(res.data);
    } catch (err) {
      console.error('Failed to fetch user:', err);
      logout();
    } finally {
      setLoading(false);
    }
  },[]);
  
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token, fetchUser]);

  const login = async (phone, password, isAdmin = false) => {
    const endpoint = isAdmin ? `${API}/auth/admin/login` : `${API}/auth/login`;
    const payload = isAdmin ? { username: phone, password } : { phone, password };
    
    const res = await axios.post(endpoint, payload);
    const { access_token, user: userData } = res.data;
    
    localStorage.setItem('token', access_token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    setToken(access_token);
    setUser(userData);
    
    return userData;
  };

  const register = async (data) => {
    const res = await axios.post(`${API}/auth/register`, data);
    const { access_token, user: userData } = res.data;
    
    localStorage.setItem('token', access_token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    setToken(access_token);
    setUser(userData);
    
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data) => {
    await axios.put(`${API}/auth/profile`, data);
    await fetchUser();
  };

  const isSuperAdmin = user?.role === 'super_admin';
  const isAdmin = user?.role === 'admin';
  const isSupervisor = user?.role === 'supervisor';
  const isAgent = user?.role === 'agent';
  const isCitizen = user?.role === 'citizen';
  
  // Role-based access helpers
  const canManageUsers = ['super_admin', 'admin'].includes(user?.role);
  const canManageTaxConfig = user?.role === 'super_admin';
  const canViewAuditLogs = user?.role === 'super_admin';
  const canViewAllRegions = ['super_admin', 'admin'].includes(user?.role);
  const userRegion = user?.region;

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      updateProfile,
      isSuperAdmin,
      isAdmin,
      isSupervisor,
      isAgent,
      isCitizen,
      canManageUsers,
      canManageTaxConfig,
      canViewAuditLogs,
      canViewAllRegions,
      userRegion,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
