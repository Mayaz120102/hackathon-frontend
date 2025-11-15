// src/pages/GapAnalysis.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, BookOpen, TrendingUp, CheckCircle, AlertCircle, ExternalLink, Play, Clock } from 'lucide-react';
import aiService from '../services/aiService';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';

const GapAnalysis = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [gapData, setGapData] = useState(null);

  useEffect(() => {
    fetchGapAnalysis();
  }, []);

  const fetchGapAnalysis = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await aiService.getGapAnalysis();
      setGapData(data);
    } catch (err) {
      console.error('Failed to fetch gap analysis:', err);
      setError('Failed to load skill gap analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'text-green-600';
      case 'intermediate':
        return 'text-yellow-600';
      case 'advanced':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Skill Gap Analysis</h1>
            <p className="text-gray-600">Identify skills to learn and resources to grow</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {gapData ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Missing Skills */}
            {gapData.missing_skills && gapData.missing_skills.length > 0 && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Skills to Learn</h2>
                  <span className="text-sm text-gray-500">
                    {gapData.missing_skills.length} skills identified
                  </span>
                </div>

                <div className="space-y-4">
                  {gapData.missing_skills.map((skillGap, idx) => (
                    <div key={idx} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {skillGap.skill}
                          </h3>
                          {skillGap.reason && (
                            <p className="text-sm text-gray-600 mb-2">
                              <AlertCircle className="w-4 h-4 inline mr-1" />
                              {skillGap.reason}
                            </p>
                          )}
                        </div>
                        {skillGap.priority && (
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(skillGap.priority)}`}>
                            {skillGap.priority} Priority
                          </span>
                        )}
                      </div>

                      {/* Related Jobs */}
                      {skillGap.related_jobs && skillGap.related_jobs.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-gray-700 mb-1">Required for:</p>
                          <div className="flex flex-wrap gap-2">
                            {skillGap.related_jobs.map((job, jobIdx) => (
                              <span key={jobIdx} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">
                                {job}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Learning Resources */}
                      {skillGap.learning_resources && skillGap.learning_resources.length > 0 && (
                        <div className="pt-3 border-t border-gray-100">
                          <p className="text-sm font-semibold text-gray-700 mb-2">
                            <BookOpen className="w-4 h-4 inline mr-1" />
                            Recommended Resources:
                          </p>
                          <div className="space-y-2">
                            {skillGap.learning_resources.map((resource, resIdx) => (
                              <div key={resIdx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {resource.title}
                                  </p>
                                  <div className="flex items-center gap-3 mt-1">
                                    <span className="text-xs text-gray-600">
                                      {resource.platform}
                                    </span>
                                    {resource.duration && (
                                      <span className="text-xs text-gray-500 flex items-center">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {resource.duration}
                                      </span>
                                    )}
                                    {resource.difficulty && (
                                      <span className={`text-xs font-semibold ${getDifficultyColor(resource.difficulty)}`}>
                                        {resource.difficulty}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <a
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ml-3 flex-shrink-0"
                                >
                                  <Button size="sm" variant="outline">
                                    <Play className="w-3 h-3 mr-1" />
                                    Start
                                  </Button>
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Learning Suggestions */}
            {gapData.learning_suggestions && gapData.learning_suggestions.length > 0 && (
              <Card className="p-6 bg-linear-to-br from-purple-50 to-blue-50 border-purple-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-purple-600" />
                  General Learning Suggestions
                </h2>
                <ul className="space-y-2">
                  {gapData.learning_suggestions.map((suggestion, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                      <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Overview */}
            <Card className="p-6 bg-linear-to-br from-teal-50 to-cyan-50">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Your Progress</h3>
              
              {gapData.skills_score !== undefined && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Overall Skills Score</span>
                    <span className="text-2xl font-bold text-teal-600">
                      {gapData.skills_score}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-linear-to-r from-teal-500 to-cyan-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${gapData.skills_score}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="space-y-3 pt-4 border-t border-teal-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Skills to Learn</span>
                  <span className="font-bold text-teal-600">
                    {gapData.missing_skills?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Resources Found</span>
                  <span className="font-bold text-teal-600">
                    {gapData.missing_skills?.reduce((acc, skill) => 
                      acc + (skill.learning_resources?.length || 0), 0) || 0}
                  </span>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/ai/recommendations')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Target className="w-4 h-4 mr-2" />
                  View Job Recommendations
                </Button>
                <Button
                  onClick={() => navigate('/ai/roadmap')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Generate Career Roadmap
                </Button>
                <Button
                  onClick={() => navigate('/learning')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Browse All Courses
                </Button>
              </div>
            </Card>

            {/* Tips Card */}
            <Card className="p-6 bg-linear-to-br from-yellow-50 to-orange-50 border-yellow-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3">💡 Pro Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Focus on high-priority skills first</li>
                <li>• Complete at least one course per week</li>
                <li>• Build projects to practice new skills</li>
                <li>• Update your profile as you learn</li>
              </ul>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Analysis Available</h3>
          <p className="text-gray-600 mb-6">
            Complete your profile to get personalized skill gap analysis.
          </p>
          <Button onClick={() => navigate('/profile')}>
            Complete Profile
          </Button>
        </Card>
      )}
    </div>
  );
};

export default GapAnalysis;
