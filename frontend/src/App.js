import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import Stickers from "./pages/Stickers";
import StickerPurchase from "./pages/StickerPurchase";
import Payments from "./pages/Payments";
import Verify from "./pages/Verify";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminVehicles from "./pages/AdminVehicles";
import AdminStickers from "./pages/AdminStickers";
import AdminTaxConfig from "./pages/AdminTaxConfig";
import AdminUsers from "./pages/AdminUsers";
import AdminReports from "./pages/AdminReports";
import AdminAuditLogs from "./pages/AdminAuditLogs";
import AdminNotifications from "./pages/AdminNotifications";
import AgentScanner from "./pages/AgentScanner";
import AgentLogin from "./pages/AgentLogin";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="animate-spin w-8 h-8 border-4 border-[#E05D26] border-t-transparent rounded-full" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Public Only Route (redirect if logged in)
const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="animate-spin w-8 h-8 border-4 border-[#E05D26] border-t-transparent rounded-full" />
      </div>
    );
  }
  
  if (isAuthenticated) {
    if (user?.role === 'citizen') {
      return <Navigate to="/dashboard" replace />;
    } else if (user?.role === 'agent') {
      return <Navigate to="/agent/scanner" replace />;
    } else {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }
  
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/verify" element={<Verify />} />
      
      {/* Auth Routes */}
      <Route path="/login" element={
        <PublicOnlyRoute>
          <Login />
        </PublicOnlyRoute>
      } />
      <Route path="/register" element={
        <PublicOnlyRoute>
          <Register />
        </PublicOnlyRoute>
      } />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/agent/login" element={<AgentLogin />} />
      
      {/* Citizen Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={['citizen']}>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/vehicles" element={
        <ProtectedRoute allowedRoles={['citizen']}>
          <Vehicles />
        </ProtectedRoute>
      } />
      <Route path="/vehicles/add" element={
        <ProtectedRoute allowedRoles={['citizen']}>
          <Vehicles />
        </ProtectedRoute>
      } />
      <Route path="/stickers" element={
        <ProtectedRoute allowedRoles={['citizen']}>
          <Stickers />
        </ProtectedRoute>
      } />
      <Route path="/stickers/purchase" element={
        <ProtectedRoute allowedRoles={['citizen']}>
          <StickerPurchase />
        </ProtectedRoute>
      } />
      <Route path="/payments" element={
        <ProtectedRoute allowedRoles={['citizen']}>
          <Payments />
        </ProtectedRoute>
      } />
      
      {/* Admin Protected Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={['super_admin', 'admin', 'supervisor']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      <Route path="/admin/vehicles" element={
        <ProtectedRoute allowedRoles={['super_admin', 'admin', 'supervisor']}>
          <AdminVehicles />
        </ProtectedRoute>
      } />
      <Route path="/admin/stickers" element={
        <ProtectedRoute allowedRoles={['super_admin', 'admin', 'supervisor']}>
          <AdminStickers />
        </ProtectedRoute>
      } />
      <Route path="/admin/tax-config" element={
        <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
          <AdminTaxConfig />
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
          <AdminUsers />
        </ProtectedRoute>
      } />
      <Route path="/admin/reports" element={
        <ProtectedRoute allowedRoles={['super_admin', 'admin', 'supervisor']}>
          <AdminReports />
        </ProtectedRoute>
      } />
      <Route path="/admin/audit-logs" element={
        <ProtectedRoute allowedRoles={['super_admin']}>
          <AdminAuditLogs />
        </ProtectedRoute>
      } />
      <Route path="/admin/notifications" element={
        <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
          <AdminNotifications />
        </ProtectedRoute>
      } />
      
      {/* Agent Protected Routes */}
      <Route path="/agent/scanner" element={
        <ProtectedRoute allowedRoles={['agent', 'super_admin', 'admin', 'supervisor']}>
          <AgentScanner />
        </ProtectedRoute>
      } />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="App">
            <AppRoutes />
            <Toaster 
              position="top-right" 
              richColors 
              closeButton
              toastOptions={{
                style: {
                  fontFamily: 'Inter, sans-serif'
                }
              }}
            />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
