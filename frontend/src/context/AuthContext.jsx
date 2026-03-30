import { createContext, useContext, useState } from 'react';
import { authRegister } from '../api/client';

const AuthContext = createContext(null);

function loadSession() {
  try {
    const raw = localStorage.getItem('wanderlustUser');
    if (!raw) return { token: null, user: null };
    const parsed = JSON.parse(raw);
    if (parsed && parsed.token && parsed.user) return parsed;
    return { token: null, user: null };
  } catch {
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(loadSession);

  function login(tokenAndUser) {
    setSession(tokenAndUser);
    localStorage.setItem('wanderlustUser', JSON.stringify(tokenAndUser));
  }

  function logout() {
    setSession({ token: null, user: null });
    localStorage.removeItem('wanderlustUser');
  }

  async function register(data) {
    const result = await authRegister(data);
    login(result);
  }

  return (
    <AuthContext.Provider value={{ user: session.user, token: session.token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
