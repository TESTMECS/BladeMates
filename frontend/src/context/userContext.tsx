import React, { createContext, useContext, useState } from "react";
import UserType from "../types/User";

interface AuthContextProps {
  isAuthenticated: boolean;
  loginUser: () => void;
  logoutUser: () => void;
  user: UserType;
  updateUser: (user: any) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserType>({} as UserType);

  const loginUser = () => {
    // Perform authentication logic
    // make an API call to authenticate the user: POST /api/auth/login
    // if successful, set isAuthenticated to true
    setIsAuthenticated(true);
    setUser({
      id: 1,
      username: "johndoe",
      name: "John Doe",
      bio: "",
      profileImage: "",
    });
  };

  const logoutUser = () => {
    // Perform logout logic
    // make an API call to logout the user: POST /api/auth/logout
    // if successful, set isAuthenticated to false
    setIsAuthenticated(false);
  };
  const updateUser = (user: any) => {
    // Perform update user logic
    // make an API call to update the user: PUT /api/user/:id
    // if successful, update
    setUser({ ...user });
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loginUser, logoutUser, user, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
