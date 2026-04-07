import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AuthUser, UserRole } from '@/types';
interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
import api from '@/services/api';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('authUser');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post<{
        id: string;
        email: string;
        name: string;
        role: UserRole;
        departmentId?: string;
        token: string;
      }>('/auth/login', { email, password }, { requireAuth: false });
      
      const authUser: AuthUser = {
        id: response.id,
        email: response.email,
        name: response.name,
        role: response.role,
        departmentId: response.departmentId,
        token: response.token
      };

      setUser(authUser);
      localStorage.setItem('authUser', JSON.stringify(authUser));
      return true;
    } catch (error) {
      console.error('Login failed', error);
      return false;
    }
  }, []);
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('authUser');
  }, []);
  const hasRole = useCallback((role: UserRole): boolean => {
    if (!user) return false;
    if (user.role === 'ROLE_SUPER_ADMIN') return true;
    return user.role === role;
  }, [user]);
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    hasRole,
    isSuperAdmin: user?.role === 'ROLE_SUPER_ADMIN',
    isAdmin: !!user && (user.role === 'ROLE_ADMIN' || user.role === 'ROLE_SUPER_ADMIN'),
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}