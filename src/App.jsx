import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute, RoleRoute, GuestRoute } from "./router/ProtectedRoutes";
import { PageLoader } from "./components/ui/Skeletons";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Engineers from "./pages/Engineers";
import EngineerProfile from "./pages/EngineerProfile";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/engineers" element={<Engineers />} />
          <Route path="/profile/:id" element={<EngineerProfile />} />

          {/* Guest Only */}
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />

          {/* Protected */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          {/* Admin Only */}
          <Route path="/admin" element={<RoleRoute allowedRoles={["admin"]}><Admin /></RoleRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
