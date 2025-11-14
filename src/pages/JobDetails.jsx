// src/pages/JobDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign, 
  Users, 
  Bookmark,
  Share2,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import jobService from '../services/jobService';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await jobService.getJobById(id);
      setJob(data);
    } catch (err) {
      setError('Failed to load job details. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    setApplied(true);
    // TODO: Implement actual application logic
  };

  const handleSave = () => {
    setSaved(!saved);
    // TODO: Implement save to favorites
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this job: ${job.title} at ${job.company}`,
        url: window.location.href
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-700 mb-4">{error || 'Job not found'}</p>
          <Button onClick={() => navigate('/jobs')}>Back to Jobs</Button>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/jobs')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to Jobs</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                <div className={`w-16 h-16 ${getCompanyColor(job.company)} rounded-xl flex items-center justify-center shrink-0`}>
                  <span className="text-white font-bold text-xl">
                    {getCompanyInitials(job.company)}
                  </span>
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {job.title}
                  </h1>
                  <p className="text-lg sm:text-xl text-gray-700 mb-4">{job.company}</p>
                  <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm sm:text-base">
                    <div className="flex items-center gap-2">
                      <MapPin size={18} />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase size={18} />
                      <span>{job.job_type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={18} />
                      <span>{job.experience_level}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                <Button
                  onClick={handleApply}
                  disabled={applied}
                  className="flex-1 sm:flex-initial"
                >
                  {applied ? (
                    <>
                      <CheckCircle size={18} className="mr-2" />
                      Applied
                    </>
                  ) : (
                    'Apply Now'
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSave}
                  className={saved ? 'text-blue-600 border-blue-600' : ''}
                >
                  <Bookmark
                    size={18}
                    fill={saved ? 'currentColor' : 'none'}
                  />
                </Button>
                <Button variant="outline" onClick={handleShare}>
                  <Share2 size={18} />
                </Button>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                Job Description
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  We are looking for a talented {job.title} to join our team at {job.company}. 
                  This is an exciting opportunity to work on innovative projects and make a real impact.
                </p>
                <h3 className="text-lg sm:text-lg font-semibold text-gray-900 mt-6 mb-3">
                  What You'll Do
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>Collaborate with cross-functional teams to deliver high-quality solutions</li>
                  <li>Design and implement features using modern technologies</li>
                  <li>Participate in code reviews and contribute to technical discussions</li>
                  <li>Continuously learn and stay updated with industry trends</li>
                </ul>

                <h3 className="text-lg sm:text-lg font-semibold text-gray-900 mt-6 mb-3">
                  What We're Looking For
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>Strong problem-solving skills and attention to detail</li>
                  <li>Excellent communication and teamwork abilities</li>
                  <li>Passion for technology and continuous learning</li>
                  <li>Ability to work independently and manage time effectively</li>
                </ul>
              </div>
            </div>

            {/* Required Skills */}
            {job.required_skills && job.required_skills.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                  Required Skills
                </h2>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {job.required_skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-50 text-blue-700 rounded-lg font-medium text-sm sm:text-base"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-6">
            {/* Quick Info Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Job Overview
              </h3>
              <div className="space-y-4 text-sm sm:text-base">
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Briefcase size={18} />
                    <span className="font-medium">Job Type</span>
                  </div>
                  <p className="text-gray-900 font-semibold ml-6">{job.job_type}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Clock size={18} />
                    <span className="font-medium">Experience Level</span>
                  </div>
                  <p className="text-gray-900 font-semibold ml-6">{job.experience_level}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <MapPin size={18} />
                    <span className="font-medium">Location</span>
                  </div>
                  <p className="text-gray-900 font-semibold ml-6">{job.location}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Users size={18} />
                    <span className="font-medium">Company</span>
                  </div>
                  <p className="text-gray-900 font-semibold ml-6">{job.company}</p>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                <Button className="w-full" onClick={handleApply} disabled={applied}>
                  {applied ? 'Application Submitted' : 'Apply Now'}
                </Button>
              </div>
            </div>

            {/* Similar Jobs */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Similar Jobs
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition cursor-pointer">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">
                    Senior Developer
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600">TechCorp</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">Remote</p>
                </div>
                <div className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition cursor-pointer">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">
                    Full Stack Engineer
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600">StartupXYZ</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">San Francisco, CA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;