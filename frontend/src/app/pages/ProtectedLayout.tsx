import { Outlet, Navigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { Navbar } from "../components/Navbar";

export default function ProtectedLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Outlet />
    </div>
  );
}