import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/Api';
import toast from 'react-hot-toast';
import {jwtDecode} from "jwt-decode";

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    

    try {
    const data = await api.login(email, password);
    console.log("LOGIN RESPONSE:", data);
 
    const token = data?.token?.accessToken || data?.accessToken;
 
    if (!token) {
      toast.error("No token received");
      return;
    }
 
    login(token);
 
    let role = "";
 
    try {
      const decoded = jwtDecode(token);
      console.log("DECODED:", decoded);
 
      role =
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded["role"]||"";
    } catch (err) {
      console.log("Decode error:", err);
    }
 
    toast.success("Login successful!");
 
    if (role === "Student") {
      navigate("/Studentdashboard");
    } else if (role === "Admin") {
      navigate("/admin");
    } else if (role === "Instructor") {
      navigate("/instructor");
    } else  if(role==="Coordinator"){
      
      navigate("/coordinator/dashboard");
    }
    else{
      console.log("unknown role",role);
    }
 
  } catch (err) {
    console.log(err);
    toast.error("Login failed");
  } finally {
    setLoading(false); // ✅ ensures loading stops ALWAYS
  }
};
 

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-violet-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">EduTrack</span>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button" // CRITICAL: prevents submitting form
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Bottom Links */}
          <div className="mt-8 space-y-3 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-violet-600 font-semibold hover:underline">
                Register
              </Link>
            </p>
            <p className="text-sm">
              <Link to="/forgot-password" title="Forgot Password" className="text-gray-500 hover:text-violet-600 transition-colors">
                Forgot your password?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};