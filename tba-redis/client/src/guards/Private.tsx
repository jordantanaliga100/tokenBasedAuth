import { Navigate, Outlet } from "react-router";
import { Loaders } from "../components/Loader";
import { useAuth } from "../hooks/useAuth";

const PrivateRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Loaders />; // O kaya spinner

  // Kung hindi authenticated, bawal pumasok, punta sa login
  return user ? <Outlet /> : <Navigate to="/a" replace />;
};

export default PrivateRoute;
