import React, { createContext, useContext, useState } from 'react';

interface User {
  username: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isEditorMode: boolean;
  loginAttempts: number;
  lockoutTime: Date | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  toggleEditorMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditorMode, setIsEditorMode] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState<Date | null>(null);

  const login = (username: string, password: string): boolean => {
    // Check if locked out
    if (lockoutTime && new Date() < lockoutTime) {
      return false;
    }

    // Admin credentials
    if ((username === 'roti' && password === 'curry') || (username === 'abhi' && password === 'gobi')) {
      setUser({ username, isAdmin: true });
      setLoginAttempts(0);
      setLockoutTime(null);
      return true;
    }

    // Failed login
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);
    
    if (newAttempts >= 3) {
      const lockout = new Date();
      lockout.setHours(lockout.getHours() + 1);
      setLockoutTime(lockout);
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    setIsEditorMode(false);
  };

  const toggleEditorMode = () => {
    if (user?.isAdmin) {
      setIsEditorMode(!isEditorMode);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isEditorMode,
        loginAttempts,
        lockoutTime,
        login,
        logout,
        toggleEditorMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};