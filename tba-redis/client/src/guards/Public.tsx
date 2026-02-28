import { Navigate, Outlet } from "react-router";
import { Loaders } from "../components/Loader";
import { useAuth } from "../hooks/useAuth";

const PublicRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Loaders />; // O kaya spinner

  // Kung authenticated na, bawal na pumasok sa login/signup, punta sa home
  return user ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
