// src/components/layout/Layout.jsx
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Layout = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">C</span>
                </div>
                <span className="text-xl font-bold text-gray-900">CareerNest</span>
              </Link>
            </div>

            {/* Navigation Links */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-6">
                <Link
                  to="/dashboard"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/dashboard')
                      ? 'text-cyan-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/jobs"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/jobs')
                      ? 'text-cyan-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Jobs
                </Link>
                <Link
                  to="/profile"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/profile')
                      ? 'text-cyan-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  My Profile
                </Link>
                
                {/* User Menu */}
                <div className="flex items-center space-x-4 border-l pl-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm text-gray-700">{user?.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-cyan-500 rounded-lg hover:bg-cyan-600 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            © 2024 CareerNest. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

