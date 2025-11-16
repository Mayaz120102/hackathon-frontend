import { useState, useEffect, useRef } from 'react';
import { Plus, X, Edit2, Upload, FileText, Download, Trash2, Save, AlertCircle } from 'lucide-react';

const Profile = () => {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
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
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [newSkill, setNewSkill] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    calculateProfileCompletion();
  }, [profileData]);

  const calculateProfileCompletion = () => {
    let completed = 0;
    const total = 6;

    if (profileData.email) completed++;
    if (profileData.skills?.length > 0) completed++;
    if (profileData.experience) completed++;
    if (profileData.career_interests) completed++;
    if (profileData.cv_text) completed++;
    if (profileData.cv_pdf) completed++;

    setProfileCompletion(Math.round((completed / total) * 100));
  };

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(''), 5000);
  };

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
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
    if (!file) return;

    setError('');

    if (file.type !== 'application/pdf') {
      showError('Please upload only PDF files');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showError('File size must be less than 5MB');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    console.log('File selected:', file.name);
    setCvFile(file);
    showSuccess('File selected. Click "Upload CV" to save it.');
  };

  const handleUploadCV = async () => {
    if (!cvFile) {
      showError('Please select a PDF file first');
      return;
    }

    setUploadingCV(true);
    setError('');
    setSuccess('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate success
      setProfileData({
        ...profileData,
        cv_pdf: URL.createObjectURL(cvFile),
        pdf_text: 'Extracted text from PDF...'
      });

      setCvFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      showSuccess('✅ CV uploaded successfully!');

    } catch (err) {
      console.error('CV upload failed:', err);
      
      // Enhanced error handling
      let errorMsg = 'Failed to upload CV. ';
      
      if (err.response?.status === 413) {
        errorMsg = 'File is too large. Please use a smaller PDF.';
      } else if (err.response?.status === 400) {
        errorMsg = err.response?.data?.detail || 'Invalid file format.';
      } else if (err.response?.status === 500) {
        errorMsg = 'Server error. Please try again or contact support.';
      } else if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        errorMsg = 'Upload timeout. Please check your connection.';
      } else if (err.code === 'ERR_NETWORK') {
        errorMsg = 'Network error. Please check your internet connection.';
      } else {
        errorMsg += err.response?.data?.detail || err.message || 'Please try again.';
      }
      
      showError(errorMsg);
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
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProfileData({
        ...profileData,
        cv_pdf: null,
        pdf_text: ''
      });

      showSuccess('CV deleted successfully');
    } catch (err) {
      console.error('Delete CV failed:', err);
      showError(err.response?.data?.detail || 'Failed to delete CV. Please try again.');
    } finally {
      setUploadingCV(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Profile saved:', profileData);
      
      showSuccess('✅ Profile updated successfully!');
      setIsEditing(false);

    } catch (err) {
      console.error('Save profile failed:', err);
      
      // Enhanced error handling
      let errorMsg = 'Failed to save profile. ';

      if (err.response?.status === 400) {
        const errorData = err.response.data;
        if (typeof errorData === 'object' && errorData !== null) {
          const errors = Object.entries(errorData)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join(' | ');
          errorMsg = errors || 'Invalid data provided.';
        } else {
          errorMsg = errorData?.detail || 'Invalid data.';
        }
      } else if (err.response?.status === 401) {
        errorMsg = 'Session expired. Please log in again.';
      } else if (err.response?.status === 500) {
        errorMsg = 'Server error. Please try again later or contact support.';
      } else if (err.code === 'ERR_NETWORK') {
        errorMsg = 'Network error. Please check your connection.';
      } else if (err.message?.includes('timeout')) {
        errorMsg = 'Request timeout. Please try again.';
      } else {
        errorMsg += err.response?.data?.detail || err.message || 'Please try again.';
      }

      showError(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Manage Your Profile</h1>
          <p className="text-sm sm:text-base text-gray-600">Keep your profile updated to attract the best opportunities.</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 shrink-0 mt-0.5" />
            <span className="text-sm sm:text-base">{success}</span>
          </div>
        )}
        {error && (
          <div className="mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 shrink-0 mt-0.5" />
            <span className="text-sm sm:text-base">{error}</span>
          </div>
        )}

        {/* Profile Completion */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm sm:text-base font-semibold text-gray-900">Profile Completion</span>
            <span className="text-xl sm:text-2xl font-bold text-teal-600">{profileCompletion}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 mb-2">
            <div
              className="bg-linear-to-r from-teal-500 to-cyan-500 h-2 sm:h-3 rounded-full transition-all duration-500"
              style={{ width: `${profileCompletion}%` }}
            ></div>
          </div>
          <p className="text-xs sm:text-sm text-gray-600">
            {profileCompletion < 100
              ? 'Complete your profile to get better job matches!'
              : 'Your profile is complete! Great job!'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-2xl sm:text-3xl font-bold text-white">TA</span>
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Tanvir Alam</h2>
                    <p className="text-sm sm:text-base text-gray-600">{profileData.email}</p>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center text-sm"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="flex-1 px-3 sm:px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 flex items-center justify-center text-sm"
                      >
                        {saving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {profileData.skills.length > 0 ? (
                  profileData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs sm:text-sm font-medium"
                    >
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-2 text-teal-600 hover:text-teal-800"
                          type="button"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 text-xs sm:text-sm">No skills added yet.</p>
                )}
              </div>

              {isEditing && (
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="Add a skill (e.g., Python, React)"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={handleAddSkill}
                    type="button"
                    className="w-full sm:w-auto px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center justify-center text-sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </button>
                </div>
              )}
            </div>

            {/* Experience */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Experience</h3>
              {isEditing ? (
                <textarea
                  value={profileData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  placeholder="Describe your work experience, projects, internships..."
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                />
              ) : (
                <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap">
                  {profileData.experience || 'No experience added yet.'}
                </p>
              )}
            </div>

            {/* Career Interests */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Career Interests</h3>
              {isEditing ? (
                <textarea
                  value={profileData.career_interests}
                  onChange={(e) => handleInputChange('career_interests', e.target.value)}
                  placeholder="What are your career goals and interests?"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                />
              ) : (
                <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap">
                  {profileData.career_interests || 'No career interests specified yet.'}
                </p>
              )}
            </div>

            {/* About Me */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">About Me / Summary</h3>
              {isEditing ? (
                <textarea
                  value={profileData.cv_text}
                  onChange={(e) => handleInputChange('cv_text', e.target.value)}
                  placeholder="Write a brief summary about yourself..."
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                />
              ) : (
                <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap">
                  {profileData.cv_text || 'No summary added yet.'}
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* CV Upload */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-bold text-gray-900">Resume / CV</h3>
                {profileData.cv_pdf && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                    ✓ Uploaded
                  </span>
                )}
              </div>

              {profileData.cv_pdf ? (
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <FileText className="w-6 sm:w-8 h-6 sm:h-8 text-teal-600 mr-3 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                        Resume.pdf
                      </p>
                      <p className="text-xs text-gray-500">PDF Document</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center text-xs sm:text-sm">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </button>
                    <button
                      onClick={handleDeleteCV}
                      disabled={uploadingCV}
                      className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-600 mb-2">Upload a new version:</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center text-xs sm:text-sm"
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      Replace CV
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center">
                    <Upload className="w-10 sm:w-12 h-10 sm:h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 font-medium">
                      Upload your resume
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      PDF format, max 5MB
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center mx-auto text-sm"
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      Select PDF File
                    </button>
                  </div>

                  {cvFile && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center flex-1 min-w-0">
                          <FileText className="w-5 h-5 text-blue-600 mr-2 shrink-0" />
                          <span className="text-xs sm:text-sm text-gray-900 truncate font-medium">
                            {cvFile.name}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setCvFile(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                            setSuccess('');
                          }}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                          type="button"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">
                        {(cvFile.size / 1024).toFixed(2)} KB
                      </p>
                      <button
                        onClick={handleUploadCV}
                        disabled={uploadingCV}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center text-sm"
                      >
                        {uploadingCV ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-1" />
                            Upload CV
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="bg-linear-to-br from-teal-50 to-cyan-50 border border-teal-200 rounded-lg shadow p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Profile Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-600">Skills Added</span>
                  <span className="font-bold text-teal-600 text-base sm:text-lg">
                    {profileData.skills.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-600">Completion</span>
                  <span className="font-bold text-teal-600 text-base sm:text-lg">
                    {profileCompletion}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-600">CV Uploaded</span>
                  <span className="font-bold text-teal-600 text-base sm:text-lg">
                    {profileData.cv_pdf ? 'Yes ✓' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;