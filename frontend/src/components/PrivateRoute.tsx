import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/userContext";
import Spinner from "../assets/Spinner";
import { useState, useEffect } from "react";

const PrivateRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [rehydrating, setRehydrating] = useState(true);

  useEffect(() => {
    // Delay rehydration check
    const rehydrationTimer = setTimeout(() => {
      setRehydrating(false);
    }, 1000); // Adjust the delay as needed

    return () => clearTimeout(rehydrationTimer);
  }, []);

  useEffect(() => {
    if (!rehydrating && loading) {
      const timer = setTimeout(() => {
        if (!isAuthenticated) {
          setRedirectToLogin(true);
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [rehydrating, loading, isAuthenticated]);

  if (redirectToLogin) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <Spinner />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
