import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  login: (role: UserRole) => void;
  logout: () => void;
  hasPermission: (allowedRoles: UserRole[]) => boolean;
  addProjectId: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  const login = (role: UserRole) => {
    // Simulating backend user retrieval based on role selection
    let mockUser: UserProfile;

    switch (role) {
      case UserRole.SUPER_ADMIN:
        mockUser = {
          id: 'u1',
          name: 'John Anderson',
          email: 'john@buildcorp.com',
          phone: '+44 7700 900001',
          role: UserRole.SUPER_ADMIN,
          avatarInitials: 'JA',
          companyId: 'ALL',
          projectIds: ['ALL']
        };
        break;
      case UserRole.COMPANY_ADMIN:
        mockUser = {
          id: 'u2',
          name: 'Sarah Mitchell',
          email: 'sarah@buildcorp.com',
          phone: '+44 7700 900002',
          role: UserRole.COMPANY_ADMIN,
          avatarInitials: 'SM',
          companyId: 'c1',
          projectIds: ['p1', 'p2']
        };
        break;
      case UserRole.SUPERVISOR:
        mockUser = {
          id: 'u3',
          name: 'Mike Thompson',
          email: 'mike@buildcorp.com',
          phone: '+44 7700 900003',
          role: UserRole.SUPERVISOR,
          avatarInitials: 'MT',
          companyId: 'c1',
          projectIds: ['p1']
        };
        break;
      case UserRole.OPERATIVE:
        mockUser = {
          id: 'u4',
          name: 'David Chen',
          email: 'david@buildcorp.com',
          phone: '+44 7700 900004',
          role: UserRole.OPERATIVE,
          avatarInitials: 'DC',
          companyId: 'c1',
          projectIds: ['p1']
        };
        break;
      default:
        return;
    }
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  const hasPermission = (allowedRoles: UserRole[]) => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  const addProjectId = (projectId: string) => {
    if (user && user.projectIds && !user.projectIds.includes(projectId) && !user.projectIds.includes('ALL')) {
        setUser({
            ...user,
            projectIds: [...user.projectIds, projectId]
        });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission, addProjectId }}>
      {children}
    </AuthContext.Provider>
  );
};