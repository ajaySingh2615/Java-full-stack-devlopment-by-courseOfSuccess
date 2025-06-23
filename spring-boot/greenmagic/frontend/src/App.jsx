import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Shop from './pages/Shop';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import Login from './pages/Login';
import Register from './pages/Register';
import VendorRegister from './pages/VendorRegister';
import VendorRegistration from './pages/VendorRegistration';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';

// Import new dashboard components
import DashboardRouter from './pages/dashboard/index';
import CustomerDashboard from './pages/dashboard/CustomerDashboard';
import VendorDashboard from './pages/dashboard/VendorDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';

// Import unauthorized component
import Unauthorized from './pages/Unauthorized';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/vendor-register" element={<VendorRegister />} />
              <Route path="/vendor-registration" element={
                <ProtectedRoute requireVendor={true}>
                  <VendorRegistration />
                </ProtectedRoute>
              } />
              
              {/* Legacy dashboard route - will redirect based on user role */}
              <Route path="/dashboard" element={<DashboardRouter />} />
              
              {/* Role-specific dashboard routes */}
              <Route path="/customer/dashboard" element={
                <ProtectedRoute requireAuth={true}>
                  <CustomerDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/vendor/dashboard" element={
                <ProtectedRoute requireVendor={true} requireCompleteVendorProfile={true}>
                  <VendorDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/admin/dashboard" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/admin/users" element={
                <ProtectedRoute requireAdmin={true}>
                  <UserManagement />
                </ProtectedRoute>
              } />

              <Route path="/unauthorized" element={<Unauthorized />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
