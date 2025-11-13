// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, GraduationCap, FileText, CheckCircle, Edit } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const Dashboard = () => {
  const { user } = useAuth();
  const [profileCompletion, setProfileCompletion] = useState(75);

  const completionTasks = [
    { id: 1, text: 'Verify Your Email', completed: true },
    { id: 2, text: 'Add Your Skills', completed: true },
    { id: 3, text: 'Add Your Work Experience', completed: false },
    { id: 4, text: 'Upload Your Resume', completed: false }
  ];

  const recommendedJobs = [
    {
      id: 1,
      title: 'UX/UI Designer',
      company: 'Google',
      location: 'Mountain View, CA',
      logo: 'https://www.google.com/favicon.ico'
    },
    {
      id: 2,
      title: 'Product Designer',
      company: 'Spotify',
      location: 'New York, NY',
      logo: 'https://www.spotify.com/favicon.ico'
    },
    {
      id: 3,
      title: 'Senior UI Designer',
      company: 'Microsoft',
      location: 'Redmond, WA (Remote)',
      logo: 'https://www.microsoft.com/favicon.ico'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      text: "You applied for 'Product Designer' at Spotify.",
      time: '1 day ago',
      icon: CheckCircle,
      color: 'text-teal-600 bg-teal-50'
    },
    {
      id: 2,
      text: "You saved 'UI/UX Design Course' to your learning list.",
      time: '3 days ago',
      icon: GraduationCap,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      id: 3,
      text: 'You updated your profile skills.',
      time: '5 days ago',
      icon: Edit,
      color: 'text-purple-600 bg-purple-50'
    }
  ];

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
              Almost there! Complete your profile to get better recommendations.
            </p>

            <div className="space-y-3">
              {completionTasks.map(task => (
                <div key={task.id} className="flex items-center space-x-3">
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

            <div className="space-y-4">
              {recommendedJobs.map(job => (
                <div key={job.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-teal-500 hover:shadow-md transition">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <img src={job.logo} alt={job.company} className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{job.title}</h3>
                      <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Links */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h2>
            <div className="space-y-3">
              <Link to="/jobs" className="flex items-center space-x-3 p-3 bg-teal-50 rounded-lg hover:bg-teal-100 transition">
                <div className="bg-teal-500 p-2 rounded-lg">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-gray-900">Browse All Jobs</span>
              </Link>
              
              <Link to="/learning" className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                <div className="bg-blue-500 p-2 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-gray-900">Explore Learning Paths</span>
              </Link>
              
              <Link to="/applications" className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition">
                <div className="bg-purple-500 p-2 rounded-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-gray-900">View My Applications</span>
              </Link>
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
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
