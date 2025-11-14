// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, GraduationCap, FileText, CheckCircle, Edit, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import jobService from '../services/jobService';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileCompletion, setProfileCompletion] = useState(0);

  // Calculate profile completion based on user data
  useEffect(() => {
    if (user) {
      calculateProfileCompletion();
    }
  }, [user]);

  // Fetch recommended jobs
  useEffect(() => {
    fetchRecommendedJobs();
  }, []);

  const calculateProfileCompletion = () => {
    let completed = 0;
    const totalSteps = 4;

    // Check email verification (assuming active users are verified)
    if (user?.is_active) completed++;
    
    // Check if user has skills (would need to fetch from profile API)
    // For now, we'll estimate
    completed++; // Assuming skills added
    
    // Additional checks can be added when profile API is available
    // completed += user?.work_experience?.length > 0 ? 1 : 0;
    // completed += user?.resume_uploaded ? 1 : 0;

    const percentage = Math.round((completed / totalSteps) * 100);
    setProfileCompletion(percentage);
  };

  const fetchRecommendedJobs = async () => {
    setLoading(true);
    try {
      const data = await jobService.getAllJobs();
      // Get first 3 jobs as recommendations
      setJobs(data.slice(0, 3));
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewJob = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  const completionTasks = [
    { 
      id: 1, 
      text: 'Verify Your Email', 
      completed: user?.is_active || false,
      action: null
    },
    { 
      id: 2, 
      text: 'Add Your Skills', 
      completed: profileCompletion >= 50,
      action: () => navigate('/profile')
    },
    { 
      id: 3, 
      text: 'Add Your Work Experience', 
      completed: false,
      action: () => navigate('/profile')
    },
    { 
      id: 4, 
      text: 'Upload Your Resume', 
      completed: false,
      action: () => navigate('/profile')
    }
  ];

  const recentActivity = [
    {
      id: 1,
      text: `Welcome to CareerPath! Complete your profile to get started.`,
      time: 'Just now',
      icon: CheckCircle,
      color: 'text-teal-600 bg-teal-50'
    }
  ];

  const getCompanyInitials = (company) => {
    return company.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase();
  };

  const getCompanyColor = (company) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500'
    ];
    const index = company.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.full_name?.split(' ')[0] || 'User'}!
        </h1>
        <p className="text-gray-600">Here's what's happening with your career journey today.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Completion Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Profile Completion</h2>
              <span className="text-2xl font-bold text-teal-600">{profileCompletion}%</span>
            </div>
            
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-teal-500 to-cyan-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${profileCompletion}%` }}
                ></div>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              {profileCompletion < 100 
                ? "Almost there! Complete your profile to get better recommendations."
                : "Great! Your profile is complete. Keep it updated for best results."}
            </p>

            <div className="space-y-3">
              {completionTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${
                      task.completed 
                        ? 'bg-teal-500 border-teal-500' 
                        : 'border-gray-300'
                    }`}>
                      {task.completed && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className={`flex-1 ${task.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                      {task.text}
                    </span>
                  </div>
                  {!task.completed && task.action && (
                    <button
                      onClick={task.action}
                      className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                    >
                      Complete
                    </button>
                  )}
                </div>
              ))}
            </div>

            <Link to="/profile">
              <Button className="w-full mt-4">Complete Your Profile</Button>
            </Link>
          </Card>

          {/* Recommended Jobs */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recommended Jobs for you</h2>
              <Link to="/jobs" className="text-teal-600 hover:underline text-sm font-semibold">
                View All
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading jobs...</div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-8">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No jobs available at the moment.</p>
                <Link to="/jobs">
                  <Button variant="outline" className="mt-4">Browse All Jobs</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map(job => (
                  <div 
                    key={job.id} 
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-teal-500 hover:shadow-md transition cursor-pointer"
                    onClick={() => handleViewJob(job.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${getCompanyColor(job.company)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <span className="text-white font-bold text-sm">
                          {getCompanyInitials(job.company)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{job.title}</h3>
                        <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewJob(job.id);
                      }}
                    >
                      View
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Links */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/jobs')}
                className="w-full flex items-center space-x-3 p-3 bg-teal-50 rounded-lg hover:bg-teal-100 transition text-left"
              >
                <div className="bg-teal-500 p-2 rounded-lg">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-gray-900">Browse All Jobs</span>
              </button>
              
              <button
                onClick={() => navigate('/learning')}
                className="w-full flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition text-left"
              >
                <div className="bg-blue-500 p-2 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-gray-900">Explore Learning Paths</span>
              </button>
              
              <button
                onClick={() => navigate('/applications')}
                className="w-full flex items-center space-x-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition text-left"
              >
                <div className="bg-purple-500 p-2 rounded-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-gray-900">View My Applications</span>
              </button>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map(activity => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 p-2 rounded-lg ${activity.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.text}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
              
              {/* Empty state message */}
              <div className="text-center py-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Your activity will appear here as you interact with jobs and resources.
                </p>
              </div>
            </div>
          </Card>

          {/* User Info Card */}
          <Card className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {user?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{user?.full_name || 'User'}</h3>
                <p className="text-sm text-gray-600">{user?.email || ''}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-teal-200">
              <span className="text-sm text-gray-600">Profile Status</span>
              <span className="inline-flex items-center px-3 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">
                {profileCompletion}% Complete
              </span>
            </div>
            <Link to="/profile">
              <Button variant="outline" className="w-full mt-4 border-teal-600 text-teal-600 hover:bg-teal-50">
                Edit Profile
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;