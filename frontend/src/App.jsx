import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import CarbonMeterPage from './pages/CarbonMeterPage';
import LogActivityPage from './pages/LogActivityPage';
import ProgressPage from './pages/ProgressPage';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ActivityProvider } from './context/ActivityContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/meter" 
          element={
            <ProtectedRoute>
              <CarbonMeterPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/log-activity" 
          element={
            <ProtectedRoute>
              <LogActivityPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/progress" 
          element={
            <ProtectedRoute>
              <ProgressPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <ActivityProvider>
          <AppRoutes />
        </ActivityProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;