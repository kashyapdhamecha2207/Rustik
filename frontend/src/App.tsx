import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { CustomerLayout } from './components/Layout';

// Website Pages
import Home from './pages/website/Home';
import Services from './pages/website/Services';
import Gallery from './pages/website/Gallery';
import Artists from './pages/website/Artists';
import Locations from './pages/website/Locations';
import Contact from './pages/website/Contact';

// Portal / Admin
import Admin from './pages/Admin';

const queryClient = new QueryClient();

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
            <Route path="/admin" element={<Admin />} />

            {/* Catch-all fallback redirect to landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
