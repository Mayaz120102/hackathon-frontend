// src/pages/AIRecommendations.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, TrendingUp, Briefcase, MapPin, Target, ArrowRight, RefreshCw, Info } from 'lucide-react';
import aiService from '../services/aiService';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';

// const AIRecommendations = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState('');
//   const [recommendations, setRecommendations] = useState([]);
//   const [missingSkills, setMissingSkills] = useState([]);

//   useEffect(() => {
//     fetchRecommendations();
//   }, []);

//   const fetchRecommendations = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const data = await aiService.getJobRecommendations();
//       setRecommendations(data.recommended_jobs || []);
//       setMissingSkills(data.missing_skills || []);
//     } catch (err) {
//       console.error('Failed to fetch recommendations:', err);
//       setError('Failed to load AI recommendations. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchRecommendations();
//     setRefreshing(false);
//   };

//   const getMatchColor = (percentage) => {
//     if (percentage >= 80) return 'text-green-600 bg-green-100';
//     if (percentage >= 60) return 'text-blue-600 bg-blue-100';
//     if (percentage >= 40) return 'text-yellow-600 bg-yellow-100';
//     return 'text-orange-600 bg-orange-100';
//   };

//   const getCompanyInitials = (company) => {
//     return company.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase();
//   };

//   const getCompanyColor = (company) => {
//     const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'];
//     const index = company.charCodeAt(0) % colors.length;
//     return colors[index];
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <Spinner size="lg" />
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
//           <div className="flex items-center gap-3">
//             <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
//               <Sparkles className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">AI Job Recommendations</h1>
//               <p className="text-gray-600">Personalized job matches powered by AI</p>
//             </div>
//           </div>
//           <Button onClick={handleRefresh} disabled={refreshing} variant="outline" className="w-full sm:w-auto">
//             <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
//             {refreshing ? 'Refreshing...' : 'Refresh'}
//           </Button>
//         </div>
//       </div>

//       {error && (
//         <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
//           {error}
//         </div>
//       )}

//       {/* Info Banner */}
//       <Card className="p-6 mb-6 bg-linear-to-r from-purple-50 to-blue-50 border-purple-200">
//         <div className="flex items-start gap-3">
//           <Info className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
//           <div>
//             <h3 className="font-semibold text-purple-900 mb-1">How AI Recommendations Work</h3>
//             <p className="text-sm text-purple-800">
//               Our AI analyzes your profile, skills, and experience to match you with the most suitable job opportunities. 
//               The match percentage shows how well you fit each role.
//             </p>
//           </div>
//         </div>
//       </Card>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {/* Main Content */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Recommendations */}
//           {recommendations.length > 0 ? (
//             recommendations.map((job) => (
//               <Card key={job.id} className="p-6 hover:shadow-lg transition-shadow">
//                 <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
//                   <div className="flex items-start gap-4 flex-1">
//                     <div className={`w-14 h-14 ${getCompanyColor(job.company)} rounded-lg flex items-center justify-center shrink-0`}>
//                       <span className="text-white font-bold text-lg">
//                         {getCompanyInitials(job.company)}
//                       </span>
//                     </div>
//                     <div className="flex-1">
//                       <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
//                       <p className="text-gray-600 mb-2">{job.company}</p>
//                       <div className="flex items-center gap-2 text-sm text-gray-500">
//                         <MapPin size={16} />
//                         <span>{job.location || 'Remote'}</span>
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Match Percentage */}
//                   <div className="text-center">
//                     <div className={`inline-flex items-center px-4 py-2 rounded-full font-bold text-lg ${getMatchColor(job.match_percentage)}`}>
//                       <Target className="w-5 h-5 mr-1" />
//                       {job.match_percentage}%
//                     </div>
//                     <p className="text-xs text-gray-500 mt-1">Match Score</p>
//                   </div>
//                 </div>

//                 {/* Matched Skills */}
//                 {job.matched_skills && job.matched_skills.length > 0 && (
//                   <div className="mb-4">
//                     <p className="text-sm font-semibold text-gray-700 mb-2">Your Matching Skills:</p>
//                     <div className="flex flex-wrap gap-2">
//                       {job.matched_skills.map((skill, idx) => (
//                         <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
//                           ✓ {skill}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Missing Skills for this job */}
//                 {job.missing_skills && job.missing_skills.length > 0 && (
//                   <div className="mb-4">
//                     <p className="text-sm font-semibold text-gray-700 mb-2">Skills to Learn:</p>
//                     <div className="flex flex-wrap gap-2">
//                       {job.missing_skills.slice(0, 3).map((skill, idx) => (
//                         <span key={idx} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
//                           {skill}
//                         </span>
//                       ))}
//                       {job.missing_skills.length > 3 && (
//                         <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
//                           +{job.missing_skills.length - 3} more
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 <div className="flex items-center justify-between pt-4 border-t border-gray-200">
//                   <div className="flex items-center gap-2 text-sm">
//                     <TrendingUp className="w-4 h-4 text-teal-600" />
//                     <span className="text-gray-600">
//                       {job.match_percentage >= 80 ? 'Excellent' : job.match_percentage >= 60 ? 'Good' : 'Fair'} match
//                     </span>
//                   </div>
//                   <Button onClick={() => navigate(`/jobs/${job.id}`)} className="w-full sm:w-auto">
//                     View Details
//                     <ArrowRight className="w-4 h-4 ml-2" />
//                   </Button>
//                 </div>
//               </Card>
//             ))
//           ) : (
//             <Card className="p-12 text-center">
//               <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">No Recommendations Yet</h3>
//               <p className="text-gray-600 mb-6">
//                 Complete your profile and add your skills to get personalized job recommendations.
//               </p>
//               <Button onClick={() => navigate('/profile')}>
//                 Complete Profile
//               </Button>
//             </Card>
//           )}
//         </div>

//         {/* Sidebar */}
//         <div className="space-y-6">
//           {/* Missing Skills */}
//           {missingSkills.length > 0 && (
//             <Card className="p-6 bg-linear-to-br from-orange-50 to-red-50 border-orange-200">
//               <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
//                 <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
//                 Skills to Improve
//               </h3>
//               <p className="text-sm text-gray-700 mb-3">
//                 Learning these skills will increase your job match rate:
//               </p>
//               <div className="space-y-2">
//                 {missingSkills.map((skill, idx) => (
//                   <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-lg">
//                     <span className="text-sm font-medium text-gray-900">{skill}</span>
//                     <span className="text-xs text-orange-600 font-semibold">Learn</span>
//                   </div>
//                 ))}
//               </div>
//               <Button
//                 onClick={() => navigate('/learning')}
//                 variant="outline"
//                 className="w-full mt-4 border-orange-300 text-orange-700 hover:bg-orange-50"
//               >
//                 Find Learning Resources
//               </Button>
//             </Card>
//           )}

//           {/* Quick Actions */}
//           <Card className="p-6">
//             <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
//             <div className="space-y-3">
//               <Button
//                 onClick={() => navigate('/ai/gap-analysis')}
//                 variant="outline"
//                 className="w-full justify-start"
//               >
//                 <Sparkles className="w-4 h-4 mr-2" />
//                 View Skill Gap Analysis
//               </Button>
//               <Button
//                 onClick={() => navigate('/ai/roadmap')}
//                 variant="outline"
//                 className="w-full justify-start"
//               >
//                 <Target className="w-4 h-4 mr-2" />
//                 Generate Career Roadmap
//               </Button>
//               <Button
//                 onClick={() => navigate('/jobs')}
//                 variant="outline"
//                 className="w-full justify-start"
//               >
//                 <Briefcase className="w-4 h-4 mr-2" />
//                 Browse All Jobs
//               </Button>
//             </div>
//           </Card>

//           {/* Stats */}
//           <Card className="p-6 bg-linear-to-br from-teal-50 to-cyan-50">
//             <h3 className="text-lg font-bold text-gray-900 mb-4">Your Stats</h3>
//             <div className="space-y-3">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-600">Recommendations</span>
//                 <span className="text-lg font-bold text-teal-600">{recommendations.length}</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-600">Avg. Match Rate</span>
//                 <span className="text-lg font-bold text-teal-600">
//                   {recommendations.length > 0
//                     ? Math.round(
//                         recommendations.reduce((acc, job) => acc + job.match_percentage, 0) /
//                           recommendations.length
//                       )
//                     : 0}
//                   %
//                 </span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-600">Skills to Learn</span>
//                 <span className="text-lg font-bold text-teal-600">{missingSkills.length}</span>
//               </div>
//             </div>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

const AIRecommendations = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);

  // Fallback integrated data if API request fails
  const fallbackRecommendations = [
    {
      id: '1',
      title: 'Frontend Developer',
      company: 'TechCorp',
      location: 'Remote',
      match_percentage: 85,
      matched_skills: ['React', 'JavaScript', 'CSS'],
      missing_skills: ['Node.js', 'TypeScript'],
    },
    {
      id: '2',
      title: 'Backend Developer',
      company: 'DevWorks',
      location: 'San Francisco, CA',
      match_percentage: 70,
      matched_skills: ['Node.js', 'JavaScript', 'SQL'],
      missing_skills: ['Docker', 'GraphQL'],
    },
  ];

  const fallbackMissingSkills = ['Docker', 'GraphQL', 'TypeScript'];

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await aiService.getJobRecommendations();
      setRecommendations(data.recommended_jobs || []);
      setMissingSkills(data.missing_skills || []);
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
      setError('Failed to load AI recommendations. Using fallback data.');
      // Use fallback data if the API fails
      setRecommendations(fallbackRecommendations);
      setMissingSkills(fallbackMissingSkills);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchRecommendations();
    setRefreshing(false);
  };

  const getMatchColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-blue-600 bg-blue-100';
    if (percentage >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-orange-600 bg-orange-100';
  };

  const getCompanyInitials = (company) => {
    return company.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase();
  };

  const getCompanyColor = (company) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'];
    const index = company.charCodeAt(0) % colors.length;
    return colors[index];
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
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Job Recommendations</h1>
              <p className="text-gray-600">Personalized job matches powered by AI</p>
            </div>
          </div>
          <Button onClick={handleRefresh} disabled={refreshing} variant="outline" className="w-full sm:w-auto">
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Info Banner */}
      <Card className="p-6 mb-6 bg-linear-to-r from-purple-50 to-blue-50 border-purple-200">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-purple-900 mb-1">How AI Recommendations Work</h3>
            <p className="text-sm text-purple-800">
              Our AI analyzes your profile, skills, and experience to match you with the most suitable job opportunities. 
              The match percentage shows how well you fit each role.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recommendations */}
          {recommendations.length > 0 ? (
            recommendations.map((job) => (
              <Card key={job.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-14 h-14 ${getCompanyColor(job.company)} rounded-lg flex items-center justify-center shrink-0`}>
                      <span className="text-white font-bold text-lg">
                        {getCompanyInitials(job.company)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
                      <p className="text-gray-600 mb-2">{job.company}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin size={16} />
                        <span>{job.location || 'Remote'}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Match Percentage */}
                  <div className="text-center">
                    <div className={`inline-flex items-center px-4 py-2 rounded-full font-bold text-lg ${getMatchColor(job.match_percentage)}`}>
                      <Target className="w-5 h-5 mr-1" />
                      {job.match_percentage}%
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Match Score</p>
                  </div>
                </div>

                {/* Matched Skills */}
                {job.matched_skills && job.matched_skills.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Your Matching Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {job.matched_skills.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          ✓ {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Skills for this job */}
                {job.missing_skills && job.missing_skills.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Skills to Learn:</p>
                    <div className="flex flex-wrap gap-2">
                      {job.missing_skills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                      {job.missing_skills.length > 3 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                          +{job.missing_skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-teal-600" />
                    <span className="text-gray-600">
                      {job.match_percentage >= 80 ? 'Excellent' : job.match_percentage >= 60 ? 'Good' : 'Fair'} match
                    </span>
                  </div>
                  <Button onClick={() => navigate(`/jobs/${job.id}`)} className="w-full sm:w-auto">
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center">
              <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Recommendations Yet</h3>
              <p className="text-gray-600 mb-6">
                Complete your profile and add your skills to get personalized job recommendations.
              </p>
              <Button onClick={() => navigate('/profile')}>
                Complete Profile
              </Button>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Missing Skills */}
          {missingSkills.length > 0 && (
            <Card className="p-6 bg-linear-to-br from-orange-50 to-red-50 border-orange-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
                Skills to Improve
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                Learning these skills will increase your job match rate:
              </p>
              <div className="space-y-2">
                {missingSkills.map((skill, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-lg">
                    <span className="text-sm font-medium text-gray-900">{skill}</span>
                    <span className="text-xs text-orange-600 font-semibold">Learn</span>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => navigate('/learning')}
                variant="outline"
                className="w-full mt-4 border-orange-300 text-orange-700 hover:bg-orange-50"
              >
                Find Learning Resources
              </Button>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button
                onClick={() => navigate('/ai/gap-analysis')}
                variant="outline"
                className="w-full justify-start"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                View Skill Gap Analysis
              </Button>
              <Button
                onClick={() => navigate('/ai/roadmap')}
                variant="outline"
                className="w-full justify-start"
              >
                <Target className="w-4 h-4 mr-2" />
                Generate Career Roadmap
              </Button>
              <Button
                onClick={() => navigate('/jobs')}
                variant="outline"
                className="w-full justify-start"
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Browse All Jobs
              </Button>
            </div>
          </Card>

          {/* Stats */}
          <Card className="p-6 bg-linear-to-br from-teal-50 to-cyan-50">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Your Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Recommendations</span>
                <span className="text-lg font-bold text-teal-600">{recommendations.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg. Match Rate</span>
                <span className="text-lg font-bold text-teal-600">
                  {recommendations.length > 0
                    ? Math.round(
                        recommendations.reduce((acc, job) => acc + job.match_percentage, 0) /
                          recommendations.length
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Skills to Learn</span>
                <span className="text-lg font-bold text-teal-600">{missingSkills.length}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};


export default AIRecommendations;
