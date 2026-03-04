import { Outlet, Navigate, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { Navbar } from "../components/Navbar";
import { useEffect } from "react";
import { ChatAssistant } from "../components/ChatAssistant";

export default function ProtectedLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <ChatAssistant />
    </div>
  );
}