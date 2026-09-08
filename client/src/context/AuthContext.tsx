import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  username: string | null;
  login: (token: string, username: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('acnh_token'));
  const [username, setUsername] = useState<string | null>(localStorage.getItem('acnh_user'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('acnh_token', token);
    } else {
      localStorage.removeItem('acnh_token');
    }

    if (username) {
      localStorage.setItem('acnh_user', username);
    } else {
      localStorage.removeItem('acnh_user');
    }
  }, [token, username]);

  const login = (newToken: string, newUsername: string) => {
    setToken(newToken);
    setUsername(newUsername);
  };

  const logout = () => {
    setToken(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        username,
        login,
        logout,
        isAuthenticated: Boolean(token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};