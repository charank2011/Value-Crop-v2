import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Check if user was previously logged in
    const savedRole = localStorage.getItem('userRole');
    if (savedRole) {
      setUserRole(savedRole);
    }
  }, []);

  const login = (role) => {
    setUserRole(role);
    if (role) {
      localStorage.setItem('userRole', role);
    }
  };

  const logout = () => {
    setUserRole(null);
    localStorage.removeItem('userRole');
    localStorage.removeItem('jwt_token');
  };

  return (
    <AuthContext.Provider
      value={{
        userRole,
        login,
        logout,
        isAuthenticated: userRole !== null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
