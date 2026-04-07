import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Eye, 
  EyeOff, 
  Briefcase, 
  Award, 
  Upload, 
  ChevronLeft 
} from 'lucide-react';
import { api } from "../../services/Api";
import toast from 'react-hot-toast';

export const CoordinatorRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  
  const [formData, setFormData] = useState({
    CoordinatorName: '',
    CoordinatorEmail: '',
    CoordinatorPhone: '',
    CoordinatorQualification: '',
    CoordinatorExperience: '',
    CoordinatorGender: '',
    CoordinatorPassword: '',
    confirmPassword: '',
  });

  const qualifications = [
    'Bachelor\'s Degree', 
    'Master\'s Degree', 
    'PhD', 
    'MBA', 
    'Education Management'
  ];
  
  const genders = [
    'Male', 
    'Female', 
    'Non-Binary', 
    'Other', 
    'Prefer Not To Say'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Ensure experience is sent as a number to match DTO
    const finalValue = name === 'CoordinatorExperience' ? parseInt(value, 10) || '' : value;
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

    // Basic Validation
    if (formData.CoordinatorPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    if (!resumeFile) {
      setError('Please upload the coordinator resume');
      toast.error('Resume is required');
      return;
    }

    setLoading(true);

    try {
      // Prepare multipart form data for the API
      const { confirmPassword, ...submitData } = formData;
      const finalPayload = {
        ...submitData,
        Resumepath: resumeFile // Mapping to your DTO property
      };
      
      await api.registerCoordinator(finalPayload);
      
      toast.success('Coordinator registered successfully!');
      
      // Navigate to login as requested
      setTimeout(() => navigate('/login'), 2000); 
      
    } catch (err) {
      const serverMsg = err.response?.data?.Message || err.response?.data?.errors;
      setError(typeof serverMsg === 'object' ? 'Validation failed' : serverMsg);
      toast.error('Registration failed. Check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation & Header */}
        <div className="mb-8 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-md">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">
              Admin: Register Coordinator
            </h1>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 overflow-hidden">
          {/* Form Banner */}
          <div className="bg-slate-900 px-8 py-6">
            <h2 className="text-white text-lg font-medium">Personal & Professional Credentials</h2>
            <p className="text-slate-400 text-sm">Fill in the official details for the new coordinator account.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                {error}
              </div>
            )}

            {/* Section 1: Identity */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    name="CoordinatorName"
                    type="text"
                    value={formData.CoordinatorName}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Official Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    name="CoordinatorEmail"
                    type="email"
                    value={formData.CoordinatorEmail}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    placeholder="coordinator@edutrack.com"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Contact & Demographics */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    name="CoordinatorPhone"
                    type="number"
                    value={formData.CoordinatorPhone}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Gender</label>
                <select
                  name="CoordinatorGender"
                  value={formData.CoordinatorGender}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                >
                  <option value="">Select Gender</option>
                  {genders.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Experience (Years)</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    name="CoordinatorExperience"
                    type="number"
                    value={formData.CoordinatorExperience}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    min="0"
                    max="50"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Professional Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Qualification</label>
                <div className="relative">
                  <Award className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <select
                    name="CoordinatorQualification"
                    value={formData.CoordinatorQualification}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    <option value="">Select Qualification</option>
                    {qualifications.map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Resume / CV (PDF/Word)</label>
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
                    className="flex items-center gap-3 w-full px-4 py-2 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all text-slate-600"
                  >
                    <Upload className="w-5 h-5 text-indigo-500" />
                    <span className="text-sm truncate">
                      {resumeFile ? resumeFile.name : 'Click to upload file'}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Section 4: Security */}
            <div className="pt-6 border-t border-slate-100">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Assign Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input
                      name="CoordinatorPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.CoordinatorPassword}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-12 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input
                      name="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                disabled={loading}
                onClick={() => navigate(-1)}
                className="flex-1 py-3 px-6 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] py-3 px-6 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Registering...' : 'Register Coordinator Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
