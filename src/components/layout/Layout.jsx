import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Layout = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  // Close profile dropdown if click is outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.relative')) setProfileOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link
                to={isAuthenticated ? "/dashboard" : "/"}
                className="flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">C</span>
                </div>
                <span className="text-xl font-bold text-gray-900">CareerNest</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`text-sm font-medium transition-colors ${
                      isActive('/dashboard') ? 'text-cyan-600' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/jobs"
                    className={`text-sm font-medium transition-colors ${
                      isActive('/jobs') ? 'text-cyan-600' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Jobs
                  </Link>
                  <Link
                    to="/recommendations"
                    className={`text-sm font-medium transition-colors ${
                      isActive('/recommendations') ? 'text-cyan-600' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Recommendations
                  </Link>

                  {/* AI Services Dropdown */}
                  <div className="relative group">
                    <button className={`text-sm font-medium transition-colors flex items-center gap-1
                      ${['/aircm', '/gapAnalysis', '/career'].includes(location.pathname) ? 'text-cyan-600' : 'text-gray-600 hover:text-gray-900'}
                    `}>
                      AI Services
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown */}
                    <div className="absolute hidden group-hover:block bg-white shadow-lg border rounded-lg mt-2 w-48 z-50">
                      <Link
                        to="/aircm"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50"
                      >
                        AI Recommendation
                      </Link>
                      <Link
                        to="/gapAnalysis"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50"
                      >
                        Gap Analysis
                      </Link>
                      <Link
                        to="/career"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50"
                      >
                        Career Roadmap
                      </Link>

                       <Link
                        to="/chatbot"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-cyan-50"
                      >
                        Chat bot
                      </Link>
                    </div>
                  </div>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="flex items-center gap-2 bg-cyan-100 px-2 py-1 rounded-full hover:bg-cyan-200 focus:outline-none"
                    >
                      <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-medium uppercase">
                        {user?.email?.charAt(0)}
                      </div>
                      <span className="hidden sm:inline text-gray-700 font-medium">{user?.email?.split('@')[0]}</span>
                    </button>

                    {profileOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2 z-50">
                        <div className="px-4 py-2 text-gray-800 font-semibold">{user?.email?.split('@')[0]}</div>
                        <div className="border-t my-1"></div>
                        <Link
                          to="/profile"
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-cyan-50"
                          onClick={() => setProfileOpen(false)}
                        >
                          View Profile
                        </Link>
                        <button
                          onClick={() => { handleLogout(); setProfileOpen(false); }}
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-cyan-50"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-2 space-y-2 pb-4 border-t border-gray-200">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`block text-sm font-medium ${
                      isActive('/dashboard') ? 'text-cyan-600' : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/jobs"
                    className={`block text-sm font-medium ${
                      isActive('/jobs') ? 'text-cyan-600' : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Jobs
                  </Link>
                  <Link
                    to="/recommendations"
                    className={`block text-sm font-medium ${
                      isActive('/recommendations') ? 'text-cyan-600' : 'text-gray-600 hover:text-gray-900'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Recommendations
                  </Link>

                  {/* AI Services in Mobile */}
                  <div className="border-t border-gray-200 pt-2">
                    <p className="px-2 text-gray-500 text-xs">AI Services</p>

                    <Link
                      to="/aircm"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-2 py-1 text-sm hover:text-cyan-600"
                    >
                      AI Recommendation
                    </Link>

                    <Link
                      to="/gapAnalysis"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-2 py-1 text-sm hover:text-cyan-600"
                    >
                      Gap Analysis
                    </Link>

                    <Link
                      to="/career"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-2 py-1 text-sm hover:text-cyan-600"
                    >
                      Career Roadmap
                    </Link>
                      <Link
                      to="/chatbot"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-2 py-1 text-sm hover:text-cyan-600"
                    >
                      Career Bot
                    </Link>


                  </div>

                  {/* Avatar and Logout in mobile */}
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex items-center space-x-2 px-2 mb-2">
                      <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user?.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-gray-700">{user?.email?.split('@')[0]}</span>
                    </div>
                    <Link
                      to="/profile"
                      className="w-full text-left px-2 py-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      View Profile
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                      className="w-full text-left px-2 py-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block text-sm font-medium text-gray-600 hover:text-gray-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="block text-sm font-medium text-white bg-cyan-500 rounded-lg px-4 py-2 hover:bg-cyan-600 mt-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
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
