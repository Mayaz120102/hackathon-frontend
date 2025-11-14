import { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Clock, Bookmark, ChevronLeft, ChevronRight, X, GraduationCap, ExternalLink, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import jobService from '../services/jobService';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';

const Jobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [learningResources, setLearningResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    skill: '',
    location: '',
    job_type: ''
  });
  const [activeFilters, setActiveFilters] = useState({});
  const [showFilters, setShowFilters] = useState({
    skill: false,
    location: false,
    jobType: false
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [savedJobs, setSavedJobs] = useState([]);

  // Filter options
  const filterOptions = {
    skills: ['Python', 'JavaScript', 'React', 'Django', 'HTML', 'CSS', 'SQL', 'Java', 'Node.js', 'TensorFlow'],
    locations: ['Remote', 'Dhaka', 'Chittagong', 'Sylhet', 'Khulna', 'Rajshahi', 'Hybrid'],
    jobTypes: ['Full-time', 'Part-time', 'Internship', 'Freelance']
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await jobService.getAllJobs();
      setJobs(data);
      setLearningResources([]);
      setSearchQuery('');
      setActiveFilters({});
    } catch (err) {
      setError('Failed to load jobs. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchJobs();
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await jobService.searchJobs(searchTerm);
      setJobs(result.jobs);
      setLearningResources(result.learningResources || []);
      setSearchQuery(result.query);
      setActiveFilters({});
      setFilters({ skill: '', location: '', job_type: '' });
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = async () => {
    setLoading(true);
    setError('');
    const activeFilterParams = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value) acc[key] = value;
      return acc;
    }, {});

    if (Object.keys(activeFilterParams).length === 0) {
      fetchJobs();
      return;
    }
    
    try {
      const result = await jobService.filterJobs(activeFilterParams);
      setJobs(result.jobs);
      setActiveFilters(result.appliedFilters || {});
      setLearningResources([]);
      setSearchQuery('');
      setSearchTerm('');
      setShowMobileFilters(false);
    } catch (err) {
      setError('Filter failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setFilters({ skill: '', location: '', job_type: '' });
    setActiveFilters({});
    fetchJobs();
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setShowFilters(prev => ({
      ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
      [filterType]: false
    }));
  };

  const toggleFilterDropdown = (filterName) => {
    setShowFilters(prev => ({
      ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
      [filterName]: !prev[filterName]
    }));
  };

  const toggleSaveJob = (jobId) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleViewDetails = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  const getJobTypeStyle = (type) => {
    const styles = {
      'Full-time': 'bg-blue-50 text-blue-700 border-blue-200',
      'Part-time': 'bg-orange-50 text-orange-700 border-orange-200',
      'Internship': 'bg-green-50 text-green-700 border-green-200',
      'Freelance': 'bg-purple-50 text-purple-700 border-purple-200'
    };
    return styles[type] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getExperienceStyle = (level) => {
    const styles = {
      'Entry-level': 'bg-teal-50 text-teal-700 border-teal-200',
      'Beginner': 'bg-teal-50 text-teal-700 border-teal-200',
      'Fresher': 'bg-teal-50 text-teal-700 border-teal-200',
      'Junior': 'bg-blue-50 text-blue-700 border-blue-200',
      'Intermediate': 'bg-blue-50 text-blue-700 border-blue-200',
      'Senior': 'bg-purple-50 text-purple-700 border-purple-200',
      'Expert': 'bg-purple-50 text-purple-700 border-purple-200'
    };
    return styles[level] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getCompanyInitials = (company) => {
    return company.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase();
  };

  const getCompanyColor = (company) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500',
      'bg-indigo-500', 'bg-teal-500', 'bg-orange-500', 'bg-red-500'
    ];
    const index = company.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (loading && jobs.length === 0 && learningResources.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Find Your Next Role
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
            Explore thousands of job opportunities tailored for you.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-4 sm:mt-6">
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search jobs..."
                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base lg:text-lg"
              />
            </div>
          </form>

          {/* Mobile Filter Button */}
          <div className="md:hidden mt-4">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition"
            >
              <Filter size={18} />
              <span className="font-medium">Filters</span>
              {hasActiveFilters && (
                <span className="ml-auto bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {Object.values(filters).filter(v => v).length}
                </span>
              )}
            </button>
          </div>

          {/* Desktop Filters */}
          <div className="hidden md:flex flex-wrap items-center gap-3 lg:gap-4 mt-6">
            {/* Skill Filter */}
            <div className="relative">
              <button
                onClick={() => toggleFilterDropdown('skill')}
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 border rounded-lg transition text-sm ${
                  filters.skill ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Briefcase size={16} />
                <span className="whitespace-nowrap">{filters.skill || 'Skill'}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showFilters.skill && (
                <div className="absolute top-full mt-2 w-56 lg:w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {filterOptions.skills.map(skill => (
                    <button
                      key={skill}
                      onClick={() => handleFilterChange('skill', skill)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                        filters.skill === skill ? 'bg-blue-50 text-blue-700' : ''
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Location Filter */}
            <div className="relative">
              <button
                onClick={() => toggleFilterDropdown('location')}
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 border rounded-lg transition text-sm ${
                  filters.location ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <MapPin size={16} />
                <span className="whitespace-nowrap">{filters.location || 'Location'}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showFilters.location && (
                <div className="absolute top-full mt-2 w-44 lg:w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {filterOptions.locations.map(location => (
                    <button
                      key={location}
                      onClick={() => handleFilterChange('location', location)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                        filters.location === location ? 'bg-blue-50 text-blue-700' : ''
                      }`}
                    >
                      {location}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Job Type Filter */}
            <div className="relative">
              <button
                onClick={() => toggleFilterDropdown('jobType')}
                className={`flex items-center gap-2 px-3 lg:px-4 py-2 border rounded-lg transition text-sm ${
                  filters.job_type ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Clock size={16} />
                <span className="whitespace-nowrap">{filters.job_type || 'Job Type'}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showFilters.jobType && (
                <div className="absolute top-full mt-2 w-44 lg:w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {filterOptions.jobTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => handleFilterChange('job_type', type)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                        filters.job_type === type ? 'bg-blue-50 text-blue-700' : ''
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button onClick={handleApplyFilters} className="ml-auto" size="sm">
              Apply Filters
            </Button>

            {hasActiveFilters && (
              <Button variant="outline" onClick={handleClearFilters} size="sm">
                <X size={16} className="mr-1" />
                Clear All
              </Button>
            )}
          </div>

          {/* Mobile Filters Dropdown */}
          {showMobileFilters && (
            <div className="md:hidden mt-4 bg-white border border-gray-200 rounded-lg p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skill</label>
                <select
                  value={filters.skill}
                  onChange={(e) => handleFilterChange('skill', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">Select skill</option>
                  {filterOptions.skills.map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">Select location</option>
                  {filterOptions.locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                <select
                  value={filters.job_type}
                  onChange={(e) => handleFilterChange('job_type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">Select job type</option>
                  {filterOptions.jobTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <Button onClick={handleApplyFilters} className="flex-1">
                  Apply
                </Button>
                {hasActiveFilters && (
                  <Button variant="outline" onClick={handleClearFilters} className="flex-1">
                    Clear
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {Object.keys(activeFilters).length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <span className="text-xs sm:text-sm text-gray-600">Active filters:</span>
              {Object.entries(activeFilters).map(([key, value]) => 
                value && (
                  <span key={key} className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm">
                    <strong>{key}:</strong> {value}
                  </span>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* Learning Resources Section */}
      {learningResources.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <GraduationCap className="text-purple-600" size={20} />
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
                Recommended Learning Resources for "{searchQuery}"
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {learningResources.map((resource) => (
                <div key={resource.id} className="bg-white rounded-lg border border-purple-200 p-3 sm:p-4 hover:shadow-md transition">
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{resource.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">Platform: {resource.platform}</p>
                  <div className="flex flex-wrap gap-1 sm:gap-2 mb-3">
                    {resource.related_skills.map((skill, idx) => (
                      <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs sm:text-sm font-medium ${resource.cost === 'Free' ? 'text-green-600' : 'text-orange-600'}`}>
                      {resource.cost}
                    </span>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium"
                    >
                      View Course
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Job Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
          <p className="text-xs sm:text-sm text-gray-600">
            {searchQuery && `Search results for "${searchQuery}" - `}
            Showing 1-{Math.min(10, jobs.length)} of {jobs.length} jobs
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
            >
              <option value="relevance">Relevance</option>
              <option value="date">Date Posted</option>
              <option value="company">Company</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6 hover:shadow-lg hover:border-blue-300 transition duration-200 cursor-pointer"
              onClick={() => handleViewDetails(job.id)}
            >
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${getCompanyColor(job.company)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white font-bold text-xs sm:text-sm">
                      {getCompanyInitials(job.company)}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base lg:text-lg truncate">{job.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">{job.company}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSaveJob(job.id);
                  }}
                  className={`p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition flex-shrink-0 ${
                    savedJobs.includes(job.id) ? 'text-blue-600' : 'text-gray-400'
                  }`}
                >
                  <Bookmark size={18} fill={savedJobs.includes(job.id) ? 'currentColor' : 'none'} />
                </button>
              </div>

              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2">
                Join our team and work on exciting projects with cutting-edge technologies.
              </p>

              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                <span className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-full border ${getJobTypeStyle(job.job_type)}`}>
                  {job.job_type}
                </span>
                <span className={`px-2 sm:px-3 py-1 text-xs font-medium rounded-full border ${getExperienceStyle(job.experience_level)}`}>
                  {job.experience_level}
                </span>
              </div>

              {job.required_skills && job.required_skills.length > 0 && (
                <div className="mb-3 sm:mb-4">
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {job.required_skills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                    {job.required_skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        +{job.required_skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
                  <MapPin size={14} />
                  <span className="truncate">{job.location}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails(job.id);
                  }}
                  className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5"
                >
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>

        {jobs.length === 0 && !loading && (
          <div className="text-center py-8 sm:py-12">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full mb-3 sm:mb-4">
              <Briefcase className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 px-4">
              {searchQuery 
                ? `No results for "${searchQuery}". Try different keywords.`
                : 'Try adjusting your search or filters'}
            </p>
            {(searchQuery || hasActiveFilters) && (
              <Button onClick={() => {
                setSearchTerm('');
                setSearchQuery('');
                handleClearFilters();
              }}>
                Clear Search & Filters
              </Button>
            )}
          </div>
        )}

        {/* Pagination */}
        {jobs.length > 0 && (
          <div className="flex items-center justify-center gap-1 sm:gap-2 mt-6 sm:mt-8">
            <button className="p-1.5 sm:p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              <ChevronLeft size={18} />
            </button>
            <button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg font-medium text-sm">1</button>
            <button className="px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm">2</button>
            <button className="px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm">3</button>
            <span className="px-2 sm:px-4 py-1.5 sm:py-2 text-gray-500 text-sm">...</span>
            <button className="px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm">15</button>
            <button className="p-1.5 sm:p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;