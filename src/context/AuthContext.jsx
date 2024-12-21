import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('session_token'));

  const updateAuthState = (newToken) => {
    setToken(newToken);
    localStorage.setItem('session_token', newToken);
  };

  const clearAuth = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('session_token');
  };

  // Optionally, add methods to verify token with backend
  // ...

  return (
    <AuthContext.Provider value={{ user, token, updateAuthState, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
