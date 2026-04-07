import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Mail, Lock, User, Phone, Eye, EyeOff, Calendar } from 'lucide-react';
import { api } from "../../services/api";
import toast from 'react-hot-toast';

export const StudentRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    StudentName: '',
    StudentEmail: '',
    StudentPhone: '',
    StudentQualification: '',
    StudentProgram: '',
    StudentAcademicYear: '', 
    Year: 1,                 
    StudentGender: '',
    StudentPassword: '',
    confirmPassword: '',
  });

  const qualifications = ['High School', 'Associate Degree', 'Bachelor\'s Degree', 'Master\'s Degree', 'PhD'];
  const programs = ['Computer Science', 'Business Administration', 'Engineering', 'Data Science', 'Arts', 'Public Health'];
  const genders = ['Male', 'Female', 'Non-Binary', 'Other', 'Prefer Not To Say'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    const finalValue = name === 'Year' ? parseInt(value, 10) || '' : value;
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Client-side Validation: Password Match
    if (formData.StudentPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // 2. Client-side Validation: Regex (Matches your C# Student.cs model)
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,64}$/;
    if (!passwordRegex.test(formData.StudentPassword)) {
      setError('Password must be 8-64 chars and include uppercase, lowercase, number, and special character.');
      return;
    }

    setLoading(true);

    try {
      // Remove confirmPassword before sending to the backend
      const { confirmPassword, ...submitData } = formData;
      
      await api.registerStudent(submitData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      console.error("Registration Error:", err);

      // 3. Backend Validation Error Parsing (Shows messages from your [Required] attributes)
      if (err.response?.data?.errors) {
        const validationErrors = err.response.data.errors;
        // Flattens the error object and takes the very first message
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
            <div className="w-12 h-12 bg-violet-600 rounded-lg flex items-center justify-center shadow-lg">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold text-gray-900 tracking-tight">EduTrack</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Student Registration</h2>
          <p className="text-gray-600">Enter your academic details to get started</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* Centralized Error Alert */}
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
                    name="StudentName"
                    type="text"
                    value={formData.StudentName}
                    onChange={handleChange}
                    required
                    minLength={2}
                    maxLength={100}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none transition-all"
                    placeholder="Gudala Lakshmi"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    name="StudentEmail"
                    type="email"
                    value={formData.StudentEmail}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none transition-all"
                    placeholder="xyz2@gmail.com"
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
                    name="StudentPhone"
                    type="tel"
                    value={formData.StudentPhone}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{10}"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none transition-all"
                    placeholder="10-digit number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Gender *</label>
                <select
                  name="StudentGender"
                  value={formData.StudentGender}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none bg-white transition-all"
                >
                  <option value="">Select Gender</option>
                  {genders.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 border-t border-gray-50 pt-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Qualification *</label>
                <select
                  name="StudentQualification"
                  value={formData.StudentQualification}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none bg-white transition-all"
                >
                  <option value="">Select Qualification</option>
                  {qualifications.map(q => <option key={q} value={q}>{q}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Program *</label>
                <select
                  name="StudentProgram"
                  value={formData.StudentProgram}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none bg-white transition-all"
                >
                  <option value="">Select Program</option>
                  {programs.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Academic Start Date *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    name="StudentAcademicYear"
                    type="date"
                    value={formData.StudentAcademicYear}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Current Year (1-6) *</label>
                <input
                  name="Year"
                  type="number"
                  min="1"
                  max="6"
                  value={formData.Year}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 border-t border-gray-50 pt-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    name="StudentPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.StudentPassword}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none transition-all"
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
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-violet-600 text-white rounded-xl font-bold text-lg hover:bg-violet-700 shadow-lg hover:shadow-violet-200 transition-all disabled:opacity-50 active:scale-95"
            >
              {loading ? 'Registering Student...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-600 font-bold hover:underline ml-1">Login here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};