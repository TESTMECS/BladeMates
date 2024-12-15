import React, { createContext, useContext, useState, useEffect } from "react";
import { User as UserType } from "../types/User";
import {
  userIdResponse,
  customError,
  thrownError,
  isCustomError,
  isThrownError,
} from "../utils/errors";
import useDarkMode from "./useDarkMode";
//PROPS
interface AuthContextProps {
  isAuthenticated: boolean;
  loginUser: (
    username: string,
    password: string,
  ) => Promise<userIdResponse | customError | thrownError | undefined>;
  logoutUser: () => void;
  user: UserType;
  updateUser: (user: any) => void;
  registerUser: (
    username: string,
    password: string,
  ) => Promise<userIdResponse | customError | thrownError | undefined>;
  loading: boolean;
  darkMode: boolean;
  toggleDarkMode: () => void;
}
//API RESPONSE
type checkAuthResponse = {
  userId: string;
  username: string;
};
//CREATE CONTEXT
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setloading] = useState<boolean>(true);
  const [user, setUser] = useState<UserType>();
  const { darkMode, toggleDarkMode } = useDarkMode();
  // REHYDRATE AUTH ON REFRESH
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/auth/checkAuth",
          {
            method: "GET",
            credentials: "include",
          },
        );
        if (response.ok) {
          const data: checkAuthResponse = await response.json();
          updateUser({ id: data.userId, username: data.username });
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.log(error);
        setIsAuthenticated(false);
      } finally {
        setloading(false);
      }
    };
    checkAuth();
  }, []);

  const loginUser = async (username: string, password: string) => {
    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Origin: "http://localhost:3000",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      if (response.ok) {
        const data: userIdResponse = await response.json();
        setIsAuthenticated(true);
        setloading(false);
        return data;
      } else {
        // ERROR OBJECTS
        const data = await response.json();
        try {
          if (isCustomError(JSON.parse(data.error))) {
            const errorObject: customError = JSON.parse(data.error);
            return errorObject;
          }
        } catch (_error) {
          if (isThrownError(data)) {
            const errorObject: thrownError = data;
            return errorObject;
          }
        }
      }
    } catch (err) {
      alert("Error logging in, request failed : " + err);
    }
  };
  const logoutUser = () => {
    // reset the user
    setIsAuthenticated(false);
    setUser({} as UserType);
  };
  const updateUser = (user: any) => {
    console.log("Updating/rehydrating user");
    setUser({ ...user });
  };
  const registerUser = async (username: string, password: string) => {
    try {
      const response = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "http://localhost:3000",
        },
        credentials: "include",
        body: JSON.stringify({
          username,
          password,
        }),
      });
      if (response.ok) {
        const data: userIdResponse = await response.json();
        setIsAuthenticated(true);
        setloading(false);
        return data;
      } else {
        const data = await response.json();
        try {
          if (isCustomError(JSON.parse(data.error))) {
            const errorObject: customError = JSON.parse(data.error);
            return errorObject;
          }
        } catch (_error) {
          if (isThrownError(data)) {
            const errorObject: thrownError = data;
            return errorObject;
          }
        }
      }
    } catch (err) {
      console.log("Error registering user, request failed: " + err);
    }
  };
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loginUser,
        logoutUser,
        user: user ? user : ({} as UserType), // If user is null, set it to an empty object
        updateUser,
        registerUser,
        loading,
        darkMode,
        toggleDarkMode,
      }}
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
