import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TimerProvider } from './context/TimerContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import DashboardLayout from './components/common/DashboardLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Timer from './pages/dashboard/Timer';
import Tasks from './pages/dashboard/Tasks';
import Analytics from './pages/dashboard/Analytics';
import Dashboard from './pages/dashboard/Dashboard';
import VerifyOTP from './pages/auth/VerifyOTP';

import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Settings from './pages/dashboard/Settings';

function App() {
  return (
    <AuthProvider>
      <TimerProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />

            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            {/* Protected Routes - Dashboard */}
             
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Dashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

            {/* Timer Page */}
            <Route
              path="/dashboard/timer"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Timer />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Tasks Page - REAL ONE */}
            <Route
              path="/dashboard/tasks"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Tasks />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Analytics Page - Placeholder */}
         
              <Route
                path="/dashboard/analytics"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Analytics />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

                <Route
              path="/dashboard/settings"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Settings />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* 404 Route */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center bg-gray-900">
                  <div className="text-center">
                    <h1 className="text-6xl font-bold text-white mb-4">404</h1>
                    <p className="text-gray-400 mb-8">Page not found</p>
                    <a href="/dashboard" className="btn-primary">
                      Go to Dashboard
                    </a>
                  </div>
                </div>
              }
            />
  
          </Routes>
        </BrowserRouter>
      </TimerProvider>
    </AuthProvider>
  );
}

export default App;