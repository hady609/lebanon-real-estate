import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { setAuthToken } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      loadUser();
    } else setLoading(false);
  }, []);

  const loadUser = async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user);
    } catch { localStorage.removeItem('token'); setAuthToken(null); }
    finally { setLoading(false); }
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setAuthToken(data.token);
    setUser(data.user);
    navigate(data.user.role === 'admin' ? '/dashboard' : '/');
    return data;
  };

  const register = async (formData) => {
    const { data } = await api.post('/auth/register', formData);
    localStorage.setItem('token', data.token);
    setAuthToken(data.token);
    setUser(data.user);
    navigate('/');
    return data;
  };

  const logout = async () => {
    try { await api.get('/auth/logout'); } catch {}
    localStorage.removeItem('token');
    setAuthToken(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
