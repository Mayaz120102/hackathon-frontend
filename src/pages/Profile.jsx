// src/pages/Profile.jsx
import { useState, useEffect, useRef } from 'react';
import { Plus, X, Edit2, ExternalLink, Upload, FileText, Download, Trash2, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import profileService from '../services/profileService';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [analyzingCV, setAnalyzingCV] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [profileData, setProfileData] = useState({
    email: '',
    skills: [],
    experience: '',
    career_interests: '',
    cv_text: '',
    cv_pdf: null,
    pdf_text: ''
  });
  
  const [cvFile, setCvFile] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [newSkill, setNewSkill] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    calculateProfileCompletion();
  }, [profileData]);

  const fetchProfileData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await profileService.getProfile();
      console.log('Fetched profile data:', data);
      
      setProfileData({
        email: data.email || user?.email || '',
        skills: data.skills ? data.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
        experience: data.experience || '',
        career_interests: data.career_interests || '',
        cv_text: data.cv_text || '',
        cv_pdf: data.cv_pdf || null,
        pdf_text: data.pdf_text || ''
      });
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      if (err.response?.status === 404) {
        // Profile doesn't exist, use default values
        setProfileData({
          email: user?.email || '',
          skills: [],
          experience: '',
          career_interests: '',
          cv_text: '',
          cv_pdf: null,
          pdf_text: ''
        });
      } else {
        setError('Failed to load profile data. Please refresh the page.');
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateProfileCompletion = () => {
    let completed = 0;
    let total = 6;

    if (profileData.email) completed++;
    if (profileData.skills?.length > 0) completed++;
    if (profileData.experience) completed++;
    if (profileData.career_interests) completed++;
    if (profileData.cv_text) completed++;
    if (profileData.cv_pdf) completed++;

    const percentage = Math.round((completed / total) * 100);
    setProfileCompletion(percentage);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData({
        ...profileData,
        skills: [...profileData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleInputChange = (field, value) => {
    setProfileData({
      ...profileData,
      [field]: value
    });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file only');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      setCvFile(file);
      setError('');
    }
  };

  const handleUploadCV = async () => {
    if (!cvFile) {
      setError('Please select a PDF file first');
      return;
    }

    setUploadingCV(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('cv_pdf', cvFile);
      
      // Also append other profile data if editing
      if (isEditing) {
        formData.append('skills', profileData.skills.join(', '));
        formData.append('experience', profileData.experience || '');
        formData.append('career_interests', profileData.career_interests || '');
        formData.append('cv_text', profileData.cv_text || '');
      }

      const updatedProfile = await profileService.updateProfileWithCV(formData);
      
      setProfileData({
        ...profileData,
        cv_pdf: updatedProfile.cv_pdf,
        pdf_text: updatedProfile.pdf_text || ''
      });
      
      setCvFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      setSuccess('CV uploaded successfully! AI is analyzing your resume...');
      
      // Auto-analyze CV after upload
      setTimeout(() => {
        handleAnalyzeCV();
      }, 1000);
      
    } catch (err) {
      console.error('CV upload failed:', err);
      setError(err.response?.data?.detail || 'Failed to upload CV. Please try again.');
    } finally {
      setUploadingCV(false);
    }
  };

  const handleDeleteCV = async () => {
    if (!window.confirm('Are you sure you want to delete your CV?')) {
      return;
    }

    setUploadingCV(true);
    setError('');
    
    try {
      await profileService.deleteCV();
      setProfileData({
        ...profileData,
        cv_pdf: null,
        pdf_text: ''
      });
      setSuccess('CV deleted successfully');
    } catch (err) {
      setError('Failed to delete CV');
    } finally {
      setUploadingCV(false);
    }
  };

  const handleAnalyzeCV = async () => {
    if (!profileData.cv_pdf && !profileData.pdf_text) {
      setError('Please upload a CV first to analyze');
      return;
    }

    setAnalyzingCV(true);
    setError('');
    
    try {
      const suggestions = await profileService.analyzeCV();
      setAiSuggestions(suggestions);
      setSuccess('AI analysis complete! Check the suggestions below.');
    } catch (err) {
      console.error('CV analysis failed:', err);
      // If backend doesn't have this endpoint yet, show a message
      if (err.response?.status === 404) {
        setError('AI analysis feature is not available yet. Coming soon!');
      } else {
        setError('Failed to analyze CV. Please try again.');
      }
    } finally {
      setAnalyzingCV(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      const updateData = {
        email: profileData.email,
        skills: profileData.skills.join(', '),
        experience: profileData.experience || '',
        career_interests: profileData.career_interests || '',
        cv_text: profileData.cv_text || ''
      };

      console.log('Updating profile with:', updateData);

      // If there's a new CV file, use FormData
      if (cvFile) {
        const formData = new FormData();
        Object.keys(updateData).forEach(key => {
          formData.append(key, updateData[key]);
        });
        formData.append('cv_pdf', cvFile);
        
        await profileService.updateProfileWithCV(formData);
        setCvFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        // Regular update without file
        await profileService.patchProfile(updateData);
      }
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Refresh profile data
      await fetchProfileData();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      const errorMessage = err.response?.data?.detail 
        || err.response?.data?.error
        || 'Failed to update profile. Please try again.';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Your Profile</h1>
        <p className="text-gray-600">Keep your profile updated to attract the best opportunities.</p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Profile Completion */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-900">Profile Completion</span>
              <span className="text-2xl font-bold text-teal-600">{profileCompletion}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className="bg-gradient-to-r from-teal-500 to-cyan-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${profileCompletion}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              {profileCompletion < 100 
                ? 'Complete your profile to get noticed!' 
                : 'Your profile is complete! Keep it updated.'}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {user?.full_name ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{user?.full_name || 'User'}</h2>
                  <p className="text-gray-600">{profileData.email}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSaveProfile} disabled={saving}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>

          {/* Skills Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Skills</h3>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {profileData.skills.length > 0 ? (
                profileData.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-2 text-teal-600 hover:text-teal-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No skills added yet. Add your skills to improve your profile.</p>
              )}
            </div>

            {isEditing && (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                  placeholder="Add a skill (e.g., Python, Design Thinking)"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <Button onClick={handleAddSkill}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
            )}
          </Card>

          {/* Experience Section */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Experience</h3>
            {isEditing ? (
              <textarea
                value={profileData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                placeholder="Describe your work experience, projects, internships..."
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap">
                {profileData.experience || 'No experience added yet. Share your work history, projects, or internships.'}
              </p>
            )}
          </Card>

          {/* Career Interests Section */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Career Interests</h3>
            {isEditing ? (
              <textarea
                value={profileData.career_interests}
                onChange={(e) => handleInputChange('career_interests', e.target.value)}
                placeholder="What are your career goals and interests?"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap">
                {profileData.career_interests || 'No career interests specified yet.'}
              </p>
            )}
          </Card>

          {/* About Me Section */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">About Me</h3>
            {isEditing ? (
              <textarea
                value={profileData.cv_text}
                onChange={(e) => handleInputChange('cv_text', e.target.value)}
                placeholder="Write a brief summary about yourself..."
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap">
                {profileData.cv_text || 'No summary added yet.'}
              </p>
            )}
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* CV Upload Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Resume / CV</h3>
              {profileData.cv_pdf && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Uploaded
                </span>
              )}
            </div>

            {profileData.cv_pdf ? (
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <FileText className="w-8 h-8 text-teal-600 mr-3" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {profileData.cv_pdf.split('/').pop()}
                    </p>
                    <p className="text-xs text-gray-500">PDF Document</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <a
                    href={profileData.cv_pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </a>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeleteCV}
                    disabled={uploadingCV}
                    className="text-red-600 hover:text-red-700 border-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <Button
                  onClick={handleAnalyzeCV}
                  disabled={analyzingCV}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {analyzingCV ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      AI Analyze CV
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-2">
                    Upload your resume in PDF format
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Max file size: 5MB
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Select PDF File
                  </Button>
                </div>

                {cvFile && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center flex-1 min-w-0">
                        <FileText className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-900 truncate">
                          {cvFile.name}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setCvFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <Button
                      onClick={handleUploadCV}
                      disabled={uploadingCV}
                      size="sm"
                      className="w-full"
                    >
                      {uploadingCV ? 'Uploading...' : 'Upload CV'}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* AI Suggestions Card */}
          {aiSuggestions && (
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
              <div className="flex items-center mb-4">
                <Sparkles className="w-5 h-5 text-purple-600 mr-2" />
                <h3 className="text-lg font-bold text-gray-900">AI Suggestions</h3>
              </div>
              
              <div className="space-y-3 text-sm">
                {aiSuggestions.suggested_skills && (
                  <div>
                    <p className="font-semibold text-purple-900 mb-1">Suggested Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {aiSuggestions.suggested_skills.map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 bg-white text-purple-700 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {aiSuggestions.improvements && (
                  <div>
                    <p className="font-semibold text-purple-900 mb-1">Improvements:</p>
                    <ul className="list-disc list-inside text-purple-800 space-y-1">
                      {aiSuggestions.improvements.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {aiSuggestions.score && (
                  <div className="mt-4 p-3 bg-white rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Profile Score</p>
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${aiSuggestions.score}%` }}
                        ></div>
                      </div>
                      <span className="text-lg font-bold text-purple-600">
                        {aiSuggestions.score}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Profile Stats */}
          <Card className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Skills Added</span>
                <span className="font-semibold text-teal-600">
                  {profileData.skills.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Profile Views</span>
                <span className="font-semibold text-teal-600">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">CV Uploaded</span>
                <span className="font-semibold text-teal-600">
                  {profileData.cv_pdf ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;