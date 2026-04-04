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
// Mock credentials for demo
const MOCK_USERS: Record<string, { password: string; user: Omit<AuthUser, 'token'> }> = {
  'superadmin@merogunaso.gov.np': {
    password: 'super123',
    user: {
      id: '1',
      email: 'superadmin@merogunaso.gov.np',
      name: 'Super Administrator',
      role: 'ROLE_SUPER_ADMIN',
    },
  },
  'roads.admin@merogunaso.gov.np': {
    password: 'admin123',
    user: {
      id: '2',
      email: 'roads.admin@merogunaso.gov.np',
      name: 'Ramesh Singh',
      role: 'ROLE_ADMIN',
      departmentId: '1',
    },
  },
  'water.admin@merogunaso.gov.np': {
    password: 'admin123',
    user: {
      id: '3',
      email: 'water.admin@merogunaso.gov.np',
      name: 'Sunita Rai',
      role: 'ROLE_ADMIN',
      departmentId: '2',
    },
  },
};
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('authUser');
    return stored ? JSON.parse(stored) : null;
  });
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockUser = MOCK_USERS[email];
    if (mockUser && mockUser.password === password) {
      const authUser: AuthUser = {
        ...mockUser.user,
        token: `mock-jwt-token-${Date.now()}`,
      };
      setUser(authUser);
      localStorage.setItem('authUser', JSON.stringify(authUser));
      return true;
    }
    return false;
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