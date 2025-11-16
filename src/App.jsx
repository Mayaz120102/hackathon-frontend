// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import  AuthProvider from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';

// Auth Pages
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Protected Pages
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import AIRecommendations from './pages/AIRecommendations';
import GapAnalysis from './pages/GapAnalysis';
import CareerRoadmap from './pages/CareerRoadmap';
import ChatBot from './pages/CareerBot';

// New Import
import RecommendationsDashboard from './pages/RecommendationsDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:uidb64/:token" element={<ResetPassword />} />

          {/* Protected Routes with Layout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* New Recommendations Route */}
          <Route
            path="/recommendations"
            element={
              <ProtectedRoute>
                <Layout>
                  <RecommendationsDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Jobs Routes */}
          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <Layout>
                  <Jobs />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/jobs/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <JobDetails />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Placeholder Routes */}
          <Route
            path="/learning"
            element={
              <ProtectedRoute>
                <Layout>
                  <div className="p-8">
                    <h1 className="text-3xl font-bold">Learning Page - Coming Soon</h1>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/applications"
            element={
              <ProtectedRoute>
                <Layout>
                  <div className="p-8">
                    <h1 className="text-3xl font-bold">Applications Page - Coming Soon</h1>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout>
                  <div className="p-8">
                    <h1 className="text-3xl font-bold">Settings Page - Coming Soon</h1>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />
           <Route
            path="/aircm"
            element={
              <ProtectedRoute>
                <Layout>
                  <AIRecommendations />
                </Layout>
              </ProtectedRoute>
            }
          />

           <Route
            path="/gapAnalysis"
            element={
              <ProtectedRoute>
                <Layout>
                  <GapAnalysis />
                </Layout>
              </ProtectedRoute>
            }
          />

           <Route
            path="/career"
            element={
              <ProtectedRoute>
                <Layout>
                  <CareerRoadmap />
                </Layout>
              </ProtectedRoute>
            }
          />

            <Route
            path="/chatbot"
            element={
              <ProtectedRoute>
                <Layout>
                  <ChatBot />
                </Layout>
              </ProtectedRoute>
            }
          />



          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;