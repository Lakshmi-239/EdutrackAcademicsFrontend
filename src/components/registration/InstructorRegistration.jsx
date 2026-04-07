import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Mail, Lock, User, Phone, Eye, EyeOff, Calendar, Briefcase, Award, Upload } from 'lucide-react';
import { api } from "../../services/api";
import toast from 'react-hot-toast';

export const InstructorRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  
  const [formData, setFormData] = useState({
    InstructorName: '',
    InstructorEmail: '',
    InstructorPhone: '',
    InstructorQualification: '',
    InstructorSkills: '',
    InstructorExperience: 0,
    InstructorJoinDate: '',
    InstructorGender: '',
    InstructorPassword: '',
    confirmPassword: '',
  });

  const qualifications = ['Bachelor\'s Degree', 'Master\'s Degree', 'PhD', 'Professional Certificate'];
  const genders = ['Male', 'Female', 'Non-Binary', 'Other', 'Prefer Not To Say'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Ensure experience is treated as a number for the DTO
    const finalValue = name === 'InstructorExperience' ? parseInt(value, 10) || 0 : value;
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Client-side Validation: Password Match
    if (formData.InstructorPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // 2. Client-side Validation: Password Complexity (Matching DTO Regex)
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,64}$/;
    if (!passwordRegex.test(formData.InstructorPassword)) {
      setError('Password must be 8-64 chars and include uppercase, lowercase, number, and special character.');
      return;
    }

    setLoading(true);

    try {
      // Create the payload matching InstructorDTO
      const { confirmPassword, ...submitData } = formData;
      const finalData = {
        ...submitData,
        InstructorResume: resumeFile // This will be handled as [FromForm] in C#
      };
      
      await api.registerInstructor(finalData);
      toast.success('Instructor registered successfully! Please login.');
      navigate('/login');
    } catch (err) {
      console.error("Registration Error:", err);

      // Backend Validation Error Parsing
      if (err.response?.data?.errors) {
        const validationErrors = err.response.data.errors;
        const firstMessage = Object.values(validationErrors).flat()[0];
        setError(firstMessage);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Server connection failed. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center shadow-lg">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold text-gray-900 tracking-tight">EduTrack</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Instructor Registration</h2>
          <p className="text-gray-600">Join our faculty and start teaching</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md text-red-700 text-sm animate-pulse">
              <p className="font-bold">Registration Error:</p>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    name="InstructorName"
                    type="text"
                    value={formData.InstructorName}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                    placeholder="Dr. Jane Smith"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    name="InstructorEmail"
                    type="email"
                    value={formData.InstructorEmail}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                    placeholder="instructor@gmail.com"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    name="InstructorPhone"
                    type="tel"
                    value={formData.InstructorPhone}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{10}"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                    placeholder="10-digit number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Gender *</label>
                <select
                  name="InstructorGender"
                  value={formData.InstructorGender}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white transition-all"
                >
                  <option value="">Select Gender</option>
                  {genders.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 border-t border-gray-50 pt-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Qualification *</label>
                <div className="relative">
                  <Award className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <select
                    name="InstructorQualification"
                    value={formData.InstructorQualification}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white transition-all"
                  >
                    <option value="">Select Qualification</option>
                    {qualifications.map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Experience (Years) *</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    name="InstructorExperience"
                    type="number"
                    min="0"
                    max="50"
                    value={formData.InstructorExperience}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Skills (comma separated) *</label>
              <textarea
                name="InstructorSkills"
                value={formData.InstructorSkills}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                placeholder="React, C#, SQL Server, Azure..."
                rows="2"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Available Join Date *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    name="InstructorJoinDate"
                    type="date"
                    value={formData.InstructorJoinDate}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Resume *</label>
                <div className="relative">
                  <input
                    id="resume-upload"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                  />
                  <label 
                    htmlFor="resume-upload"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-all text-gray-500"
                  >
                    <Upload className="w-5 h-5" />
                    <span className="text-sm truncate">
                      {resumeFile ? resumeFile.name : 'Choose File'}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 border-t border-gray-50 pt-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    name="InstructorPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.InstructorPassword}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-teal-600 text-white rounded-xl font-bold text-lg hover:bg-teal-700 shadow-lg hover:shadow-teal-200 transition-all disabled:opacity-50 active:scale-95"
            >
              {loading ? 'Registering Instructor...' : 'Create Instructor Account'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-600 font-bold hover:underline ml-1">Login here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};