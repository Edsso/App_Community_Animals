import { RouterProvider } from "react-router";
import { AuthProvider } from "./contexts/AuthContext";
import { AnimalProvider } from "./contexts/AnimalContext";
import { router } from "./routes.tsx";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <AuthProvider>
      <AnimalProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AnimalProvider>
    </AuthProvider>
  );
}