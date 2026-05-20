import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { RootLayout } from './components/layout/RootLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';

// Placeholder components to prevent errors
const LeadDetails = () => <div className="p-4">Lead Details (Protected)</div>;

function App() {
  return (
    <>
      <Toaster 
        position="top-right" 
        toastOptions={{
          className: 'dark:bg-gray-800 dark:text-white dark:border-gray-700 border',
        }}
      />
      <Routes>
        {/* Public routes without Navbar to maximize form visibility */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected routes wrapping both auth check and shared navbar layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RootLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/leads/:id" element={<LeadDetails />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
