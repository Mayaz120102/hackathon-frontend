import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X, Briefcase } from "lucide-react";

function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    required_skills: "",
    experience_level: "Entry-level",
    job_type: "Full-time",
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = () => {
    setJobs([
      {
        id: "8b3f9e10",
        title: "Junior Web Developer",
        company: "TechSpark",
        location: "Remote",
        required_skills: ["HTML", "CSS", "JavaScript"],
        experience_level: "Entry-level",
        job_type: "Full-time",
      },
    ]);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      company: "",
      location: "",
      required_skills: "",
      experience_level: "Entry-level",
      job_type: "Full-time",
    });
    setEditingJob(null);
  };

  const handleSubmit = () => {
    const skillsArray = formData.required_skills.split(",").map((s) => s.trim());
    const jobData = { ...formData, required_skills: skillsArray };

    if (editingJob) {
      setJobs(jobs.map((j) => (j.id === editingJob.id ? { ...j, ...jobData } : j)));
    } else {
      setJobs([{ id: Math.random().toString(36).substr(2, 9), ...jobData }, ...jobs]);
    }

    resetForm();
    setShowModal(false);
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      company: job.company,
      location: job.location,
      required_skills: job.required_skills.join(", "),
      experience_level: job.experience_level,
      job_type: job.job_type,
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
      setJobs(jobs.filter((j) => j.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Briefcase className="text-indigo-600" /> Admin Job Management
          </h1>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Add Job
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white p-4 rounded-xl shadow">
              <h3 className="text-lg font-bold">{job.title}</h3>
              <p className="text-gray-600 text-sm">{job.company}</p>
              <p className="text-gray-600 text-sm mb-3">{job.location}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(job)}
                  className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(job.id)}
                  className="text-red-600 hover:bg-red-50 p-2 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {editingJob ? "Edit Job" : "Create Job"}
                </h2>
                <button onClick={() => setShowModal(false)}>
                  <X />
                </button>
              </div>
              <input
                type="text"
                placeholder="Job Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 mb-3"
              />
              <input
                type="text"
                placeholder="Company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 mb-3"
              />
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 mb-3"
              />
              <input
                type="text"
                placeholder="Required Skills (comma separated)"
                value={formData.required_skills}
                onChange={(e) =>
                  setFormData({ ...formData, required_skills: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 mb-3"
              />
              <select
                value={formData.experience_level}
                onChange={(e) =>
                  setFormData({ ...formData, experience_level: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 mb-3"
              >
                <option value="Entry-level">Entry-level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <select
                value={formData.job_type}
                onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 mb-4"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Freelance">Freelance</option>
              </select>
              <button
                onClick={handleSubmit}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <Save class