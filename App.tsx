
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { GenerateBarcodePage } from './pages/GenerateBarcodePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { useAuth } from './hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const auth = useAuth();
  if (!auth || !auth.user) { // Added null check for auth
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/generate" 
              element={
                <ProtectedRoute>
                  <GenerateBarcodePage />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <footer className="bg-gray-800 text-center p-4 text-sm text-gray-400">
          © 2024 AAMVA PDF417 Generator. For demonstration purposes only.
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
