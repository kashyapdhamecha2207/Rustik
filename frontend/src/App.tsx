import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CustomerLayout, DashboardLayout } from './components/Layout';

// Website Pages
import Home from './pages/website/Home';
import Services from './pages/website/Services';
import Gallery from './pages/website/Gallery';
import Artists from './pages/website/Artists';
import Locations from './pages/website/Locations';
import Contact from './pages/website/Contact';

// Portal / Admin
import Login from './pages/Login';
import Overview from './pages/dashboard/Overview';
import Appointments from './pages/dashboard/Appointments';
import Customers from './pages/dashboard/Customers';
import Employees from './pages/dashboard/Employees';
import Finance from './pages/dashboard/Finance';
import ContentManager from './pages/dashboard/ContentManager';
import Reports from './pages/dashboard/Reports';

const queryClient = new QueryClient();

// Protected route component helper
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-luxury-black text-gold">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* ========================================================
                1. CUSTOMER PORTFOLIO ROUTES (CustomerLayout)
               ======================================================== */}
            <Route path="/" element={<CustomerLayout><Home /></CustomerLayout>} />
            <Route path="/services" element={<CustomerLayout><Services /></CustomerLayout>} />
            <Route path="/gallery" element={<CustomerLayout><Gallery /></CustomerLayout>} />
            <Route path="/artists" element={<CustomerLayout><Artists /></CustomerLayout>} />
            <Route path="/locations" element={<CustomerLayout><Locations /></CustomerLayout>} />
            <Route path="/contact" element={<CustomerLayout><Contact /></CustomerLayout>} />

            {/* ========================================================
                2. SECURITY PORTAL (No Layout / Standalone)
               ======================================================== */}
            <Route path="/login" element={<Login />} />

            {/* ========================================================
                3. MANAGEMENT DASHBOARD ROUTES (DashboardLayout)
               ======================================================== */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardLayout><Overview /></DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/appointments" 
              element={
                <ProtectedRoute>
                  <DashboardLayout><Appointments /></DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/customers" 
              element={
                <ProtectedRoute allowedRoles={['owner', 'manager', 'staff']}>
                  <DashboardLayout><Customers /></DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/employees" 
              element={
                <ProtectedRoute allowedRoles={['owner', 'manager', 'staff']}>
                  <DashboardLayout><Employees /></DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/finances" 
              element={
                <ProtectedRoute allowedRoles={['owner', 'manager']}>
                  <DashboardLayout><Finance /></DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/cms" 
              element={
                <ProtectedRoute allowedRoles={['owner', 'manager']}>
                  <DashboardLayout><ContentManager /></DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/reports" 
              element={
                <ProtectedRoute allowedRoles={['owner', 'manager']}>
                  <DashboardLayout><Reports /></DashboardLayout>
                </ProtectedRoute>
              } 
            />

            {/* Catch-all fallback redirect to landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
