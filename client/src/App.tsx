import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';

// Protected Route Guard
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Placeholder pages for next steps
const LoginPage = () => <main><h1>Login Page</h1></main>;
const RegisterPage = () => <main><h1>Register Page</h1></main>;
const VillagersPage = () => <main><h1>Villagers Island Roster</h1></main>;
const InventoryPage = () => <main><h1>Clothing Closet Inventory</h1></main>;

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/villagers"
              element={
                <ProtectedRoute>
                  <VillagersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory"
              element={
                <ProtectedRoute>
                  <InventoryPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/villagers" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}