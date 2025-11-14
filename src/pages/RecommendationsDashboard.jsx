import React, { useState, useEffect } from 'react';
import { Briefcase, BookOpen, Award, TrendingUp, Search } from 'lucide-react';

function RecommendationsDashboard() {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('jobs');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setTimeout(() => {
        setRecommendations({
          user: "john@example.com",
          skills: ["python", "django", "react"],
          career_interests: ["web development", "backend development"],
          recommended_jobs: [
            {
              id: "1",
              title: "Junior Python Developer",
              company: "TechHeaven",
              required_skills: ["Python", "Django"],
              match_score: 2,
              matched_skills: ["python", "django"],
              location: "Remote",
              salary: "$60k - $80k"
            },
            {
              id: "2",
              title: "Full Stack Developer",
              company: "WebCorp",
              required_skills: ["Python", "React", "Django"],
              match_score: 3,
              matched_skills: ["python", "django", "react"],
              location: "New York, NY",
              salary: "$80k - $100k"
            },
            {
              id: "3",
              title: "Backend Engineer",
              company: "DataFlow Inc",
              required_skills: ["Python", "Django", "PostgreSQL"],
              match_score: 2,
              matched_skills: ["python", "django"],
              location: "San Francisco, CA",
              salary: "$90k - $120k"
            }
          ],
          recommended_resources: [
            {
              id: "1",
              title: "Django Crash Course",
              platform: "YouTube",
              related_skills: ["Python", "Django"],
              match_score: 2,
              matched_skills: ["python", "django"],
              duration: "3 hours",
              level: "Intermediate"
            },
            {
              id: "2",
              title: "Advanced React Patterns",
              platform: "Udemy",
              related_skills: ["React", "JavaScript"],
              match_score: 1,
              matched_skills: ["react"],
              duration: "8 hours",
              level: "Advanced"
            },
            {
              id: "3",
              title: "Python Web Development Bootcamp",
              platform: "Coursera",
              related_skills: ["Python", "Django", "Flask"],
              match_score: 2,
              matched_skills: ["python", "django"],
              duration: "40 hours",
              level: "Beginner to Advanced"
            }
          ]
        });
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const getMatchColor = (score) => {
    if (score >= 3) return 'text-green-600 bg-green-100';
    if (score === 2) return 'text-blue-600 bg-blue-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  const filterItems = (items) => {
    if (!searchTerm) return items;
    return items.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.company && item.company.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your recommendations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md text-center">
          <div className="text-red-600 text-5xl mb-4">⚠</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                Your Recommendations
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Personalized for {recommendations.user}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {recommendations.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 sm:px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs sm:text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search jobs or resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-1 sm:p-2 mb-6">
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 sm:py-3 px-2 sm:px-4 rounded-lg font-medium transition-all ${
                activeTab === 'jobs'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Jobs</span>
              <span className="sm:hidden">Jobs</span>
              <span className="ml-1 px-2 py-0.5 bg-white bg-opacity-20 rounded-full text-xs">
                {recommendations.recommended_jobs.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 sm:py-3 px-2 sm:px-4 rounded-lg font-medium transition-all ${
                activeTab === 'resources'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Resources</span>
              <span className="sm:hidden">Learn</span>
              <span className="ml-1 px-2 py-0.5 bg-white bg-opacity-20 rounded-full text-xs">
                {recommendations.recommended_resources.length}
              </span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {activeTab === 'jobs'
            ? filterItems(recommendations.recommended_jobs).map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-4 sm:p-5"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4">
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-1">
                        {job.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">{job.company}</p>
                    </div>
                    <span
                      className={`mt-2 sm:mt-0 px-2 sm:px-3 py-0.5 rounded-full text-xs sm:text-sm font-bold ${getMatchColor(
                        job.match_score
                      )}`}
                    >
                      {job.match_score}/{job.required_skills.length}
                    </span>
                  </div>

                  <div className="space-y-2 mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
                      <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm sm:text-base font-semibold text-green-600">
                      <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>{job.salary}</span>
                    </div>
                  </div>

                  <div className="mb-3 sm:mb-4">
                    <p className="text-xs sm:text-sm font-semibold text-gray-500 mb-1">
                      MATCHED SKILLS
                    </p>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {job.matched_skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs sm:text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3 sm:mb-4">
                    <p className="text-xs sm:text-sm font-semibold text-gray-500 mb-1">
                      REQUIRED SKILLS
                    </p>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {job.required_skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs sm:text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 sm:py-2.5 px-3 rounded-lg transition-colors text-sm sm:text-base">
                    Apply Now
                  </button>
                </div>
              ))
            : filterItems(recommendations.recommended_resources).map((resource) => (
                <div
                  key={resource.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-4 sm:p-5"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4">
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-1">
                        {resource.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">{resource.platform}</p>
                    </div>
                    <span
                      className={`mt-2 sm:mt-0 px-2 sm:px-3 py-0.5 rounded-full text-xs sm:text-sm font-bold ${getMatchColor(
                        resource.match_score
                      )}`}
                    >
                      {resource.match_score}/{resource.related_skills.length}
                    </span>
                  </div>

                  <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4 text-sm sm:text-base">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium text-gray-800">{resource.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Level:</span>
                      <span className="font-medium text-gray-800">{resource.level}</span>
                    </div>
                  </div>

                  <div className="mb-3 sm:mb-4">
                    <p className="text-xs sm:text-sm font-semibold text-gray-500 mb-1">
                      MATCHED SKILLS
                    </p>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {resource.matched_skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs sm:text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3 sm:mb-4">
                    <p className="text-xs sm:text-sm font-semibold text-gray-500 mb-1">
                      RELATED SKILLS
                    </p>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {resource.related_skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs sm:text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 sm:py-2.5 px-3 rounded-lg transition-colors text-sm sm:text-base">
                    Start Learning
                  </button>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}

export default RecommendationsDashboard;