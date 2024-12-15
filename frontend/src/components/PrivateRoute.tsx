import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/userContext";
import Spinner from "../assets/Spinner";
import { useEffect } from "react";
const PrivateRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (loading && !isAuthenticated) {
      const timer = setTimeout(() => {
        <Navigate to="/login" replace />;
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [loading, isAuthenticated]);

  if (loading) {
    return <Spinner />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
