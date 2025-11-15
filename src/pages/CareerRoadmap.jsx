// src/pages/CareerRoadmap.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Target, TrendingUp, CheckCircle2, Circle, Download, RefreshCw, Calendar, BookOpen } from 'lucide-react';
import aiService from '../services/aiService';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';

const CareerRoadmap = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [roadmap, setRoadmap] = useState(null);

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await aiService.generateRoadmap();
      setRoadmap(data);
    } catch (err) {
      console.error('Failed to fetch roadmap:', err);
      setError('Failed to load career roadmap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateRoadmap = async () => {
    setGenerating(true);
    await fetchRoadmap();
    setGenerating(false);
  };

  const getPhaseColor = (phase, index) => {
    const colors = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-green-500 to-teal-500',
      'from-orange-500 to-red-500'
    ];
    return colors[index % colors.length];
  };

  const getPhaseIcon = (status) => {
    if (status === 'completed') return <CheckCircle2 className="w-6 h-6 text-green-600" />;
    if (status === 'in_progress') return <Circle className="w-6 h-6 text-blue-600 fill-blue-200" />;
    return <Circle className="w-6 h-6 text-gray-400" />;
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
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4 sm:gap-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-linear-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
              <Map className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Career Roadmap</h1>
              <p className="text-gray-600">Your personalized path to success</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleRegenerateRoadmap} disabled={generating} variant="outline">
              <RefreshCw className={`w-4 h-4 mr-2 ${generating ? 'animate-spin' : ''}`} />
              Regenerate
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {roadmap ? (
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Roadmap */}
          <div className="lg:col-span-3 space-y-6">
            {/* Overview */}
            {roadmap.goal && (
              <Card className="p-6 bg-linear-to-r from-blue-50 to-purple-50 border-blue-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Your Career Goal</h2>
                <p className="text-lg text-gray-800 mb-4">{roadmap.goal}</p>
                {roadmap.estimated_time && (
                  <div className="flex items-center text-gray-700">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span>Estimated Timeline: <strong>{roadmap.estimated_time}</strong></span>
                  </div>
                )}
              </Card>
            )}

            {/* Phases */}
            {roadmap.phases && roadmap.phases.length > 0 && (
              <div className="space-y-8">
                {roadmap.phases.map((phase, phaseIdx) => (
                  <Card key={phaseIdx} className="p-6">
                    {/* Phase Header */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                      <div className={`w-16 h-16 bg-linear-to-br ${getPhaseColor(phase, phaseIdx)} rounded-xl flex items-center justify-center text-white font-bold text-2xl`}>
                        {phaseIdx + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                          {phase.title || `Phase ${phaseIdx + 1}`}
                        </h3>
                        {phase.duration && (
                          <p className="text-sm text-gray-600 flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {phase.duration}
                          </p>
                        )}
                      </div>
                      {phase.status && getPhaseIcon(phase.status)}
                    </div>

                    {/* Phase Description */}
                    {phase.description && (
                      <p className="text-gray-700 mb-4">{phase.description}</p>
                    )}

                    {/* Milestones/Steps */}
                    {phase.milestones && phase.milestones.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900 mb-3">Milestones:</h4>
                        {phase.milestones.map((milestone, milIdx) => (
                          <div key={milIdx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0 mt-1">
                              {milestone.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                              ) : (
                                <Circle className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className={`font-medium ${milestone.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                {milestone.title || milestone}
                              </p>
                              {milestone.description && (
                                <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Skills to Learn */}
                    {phase.skills_to_learn && phase.skills_to_learn.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-3">Skills to Learn:</h4>
                        <div className="flex flex-wrap gap-2">
                          {phase.skills_to_learn.map((skill, skillIdx) => (
                            <span key={skillIdx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Resources */}
                    {phase.resources && phase.resources.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <BookOpen className="w-4 h-4 mr-2" />
                          Recommended Resources:
                        </h4>
                        <div className="space-y-2">
                          {phase.resources.map((resource, resIdx) => (
                            <a
                              key={resIdx}
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition"
                            >
                              <div>
                                <p className="font-medium text-gray-900">{resource.title}</p>
                                <p className="text-sm text-gray-600">{resource.platform}</p>
                              </div>
                              <TrendingUp className="w-5 h-5 text-blue-600" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}

            {/* Tips */}
            {roadmap.tips && roadmap.tips.length > 0 && (
              <Card className="p-6 bg-linear-to-br from-yellow-50 to-orange-50 border-yellow-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">💡 Expert Tips</h3>
                <ul className="space-y-2">
                  {roadmap.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                      <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Summary */}
            <Card className="p-6 bg-linear-to-br from-teal-50 to-cyan-50">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Progress Summary</h3>
              
              {roadmap.overall_progress !== undefined && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Overall Progress</span>
                    <span className="text-2xl font-bold text-teal-600">
                      {roadmap.overall_progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-linear-to-r from-teal-500 to-cyan-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${roadmap.overall_progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="space-y-3 pt-4 border-t border-teal-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Phases</span>
                  <span className="font-bold text-teal-600">
                    {roadmap.phases?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="font-bold text-teal-600">
                    {roadmap.phases?.filter(p => p.status === 'completed').length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">In Progress</span>
                  <span className="font-bold text-teal-600">
                    {roadmap.phases?.filter(p => p.status === 'in_progress').length || 0}
                  </span>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/ai/gap-analysis')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Target className="w-4 h-4 mr-2" />
                  View Skill Gaps
                </Button>
                <Button
                  onClick={() => navigate('/ai/recommendations')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Job Recommendations
                </Button>
                <Button
                  onClick={() => navigate('/learning')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Find Courses
                </Button>
              </div>
            </Card>

            {/* Motivation */}
            <Card className="p-6 bg-linear-to-br from-purple-50 to-pink-50 border-purple-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3">🚀 Stay Motivated</h3>
              <p className="text-sm text-gray-700 mb-3">
                "Every expert was once a beginner. Keep learning, stay consistent, and you'll reach your goals!"
              </p>
              <Button className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Track My Progress
              </Button>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Roadmap Available</h3>
          <p className="text-gray-600 mb-6">
            Complete your profile to generate a personalized career roadmap.
          </p>
          <Button onClick={() => navigate('/profile')}>
            Complete Profile
          </Button>
        </Card>
      )}
    </div>
  );
};

export default CareerRoadmap;
