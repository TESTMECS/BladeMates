import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/userContext";
import Spinner from "../assets/Spinner";

const PrivateRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Spinner />;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
