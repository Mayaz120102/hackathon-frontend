// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  
  const [profileData, setProfileData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    location: '',
    bio: '',
    title: '',
    company: ''
  });

  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({
        email: user.email || '',
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        title: user.title || '',
        company: user.company || ''
      });
      setSkills(user.skills || []);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!profileData.firstName) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!profileData.lastName) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (profileData.phone && !/^\+?[\d\s-()]+$/.test(profileData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const response = await api.put('/accounts/profile/', {
        first_name: profileData.firstName,
        last_name: profileData.lastName,
        phone: profileData.phone,
        location: profileData.location,
        bio: profileData.bio,
        title: profileData.title,
        company: profileData.company,
        skills: skills
      });

      updateUser(response.data);
      setSuccessMessage('Profile updated successfully!');
      setEditing(false);
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      setErrors({
        general: error.response?.data?.detail || 'Failed to update profile. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const profileCompletion = () => {
    const fields = [
      profileData.firstName,
      profileData.lastName,
      profileData.phone,
      profileData.location,
      profileData.bio,
      profileData.title,
      skills.length > 0
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Your Profile</h1>
        <p className="text-gray-600">Keep your profile updated to attract the best opportunities.</p>
      </div>

      {/* Profile Completion Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Profile Completion</h2>
          <span className="text-2xl font-bold text-cyan-600">{profileCompletion()}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div
            className="bg-linear-to-r from-cyan-500 to-teal-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${profileCompletion()}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600">
          Complete your profile to get noticed!
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-600 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {successMessage}
          </p>
        </div>
      )}

      {/* Error Message */}
      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errors.general}</p>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-linear-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {profileData.firstName?.charAt(0)?.toUpperCase() || 
                 profileData.email?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {profileData.firstName && profileData.lastName 
                  ? `${profileData.firstName} ${profileData.lastName}`
                  : 'Complete Your Profile'}
              </h2>
              <p className="text-gray-600">{profileData.title || 'Add your title'}</p>
              {profileData.location && (
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {profileData.location}
                </p>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-cyan-50 text-cyan-600 rounded-lg font-medium hover:bg-cyan-100 transition-colors"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={profileData.firstName}
                onChange={handleChange}
                disabled={!editing}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-50 disabled:text-gray-600 ${
                  errors.firstName ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={profileData.lastName}
                onChange={handleChange}
                disabled={!editing}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-50 disabled:text-gray-600 ${
                  errors.lastName ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
              <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleChange}
                disabled={!editing}
                placeholder="+1 (555) 123-4567"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-50 disabled:text-gray-600 ${
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={profileData.location}
                onChange={handleChange}
                disabled={!editing}
                placeholder="San Francisco, CA"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Title
              </label>
              <input
                type="text"
                name="title"
                value={profileData.title}
                onChange={handleChange}
                disabled={!editing}
                placeholder="Software Engineer"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                type="text"
                name="company"
                value={profileData.company}
                onChange={handleChange}
                disabled={!editing}
                placeholder="Tech Corp"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              value={profileData.bio}
              onChange={handleChange}
              disabled={!editing}
              rows="4"
              placeholder="Tell us about yourself and your professional experience..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-50 disabled:text-gray-600 resize-none"
            ></textarea>
          </div>
        </form>
      </div>

      {/* Skills Section */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Skills</h2>
          {editing && (
            <button
              onClick={() => {}}
              className="px-4 py-2 bg-cyan-50 text-cyan-600 rounded-lg text-sm font-medium hover:bg-cyan-100 transition-colors"
            >
              + Add Skill
            </button>
          )}
        </div>

        {editing && (
          <div className="mb-6 flex space-x-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
              placeholder="Enter a skill (e.g., JavaScript, React)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-6 py-3 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition-colors"
            >
              Add
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {skills.length > 0 ? (
            skills.map((skill, index) => (
              <div
                key={index}
                className="inline-flex items-center px-4 py-2 bg-cyan-50 text-cyan-700 rounded-lg text-sm font-medium"
              >
                {skill}
                {editing && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-2 text-cyan-600 hover:text-cyan-800"
                  >
                    ×
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">
              {editing ? 'Add skills to showcase your expertise' : 'No skills added yet'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;