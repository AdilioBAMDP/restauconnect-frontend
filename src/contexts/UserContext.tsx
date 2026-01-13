import React, { createContext, useState, ReactNode } from 'react';
import { UserRole, User } from '@/types';

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  userType: UserRole;
  setUserType: (type: UserRole) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // État par défaut : pas d'utilisateur connecté
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<UserRole>('restaurant');

  const value: UserContextType = {
    currentUser,
    setCurrentUser,
    userType,
    setUserType
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
