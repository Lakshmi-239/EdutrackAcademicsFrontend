import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, GraduationCap, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/Api';
import Swal from 'sweetalert2';
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
      if (data.token) {
        login(data.token);
        toast.success('Welcome back to EduTrack!');
        navigate('/');
      }
    } catch (err) {
      toast.error(err.response?.data?.Message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      
      {/* Background Shimmer Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute -inset-[100%] animate-[spin_30s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#0ea5e9_0%,#2dd4bf_50%,#0ea5e9_100%)]" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-[400px] relative z-10 flex flex-col items-center">
        
        {/* Brand Header */}
        <div className="mb-6 text-center flex flex-col items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative w-11 h-11 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
                <GraduationCap className="w-7 h-7 text-teal-400" />
              </div>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-white italic">
              Edu<span className="text-teal-400 not-italic">Track</span>
            </span>
          </Link>
          
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-white">
            Welcome Back
          </h1>
          
          <p className="mt-1 text-sm text-slate-400">
            New to EduTrack?{' '}
            <Link to="/register" className="text-teal-400 hover:text-teal-300 font-semibold transition-colors underline underline-offset-4">
              Create an account
            </Link>
          </p>
        </div>

        {/* Enterprise Grade Card */}
        <div className="w-full bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-8">
          <form className="space-y-5 text-left" onSubmit={handleSubmit}>
            
            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {/* Color is now static teal-400 */}
                  <Mail className="h-4 w-4 text-teal-400/80" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-slate-700/50 bg-slate-950/40 pl-10 pr-4 py-2.5 text-slate-200 placeholder-slate-600 focus:border-teal-400/50 focus:ring-4 focus:ring-teal-400/10 text-sm transition-all outline-none"
                  placeholder="name@gmail.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <label htmlFor="password" className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  Password
                </label>
                <Link to="/forgot-password" core="true" className="text-[10px] font-semibold text-teal-400 hover:text-teal-300">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {/* Color is now static teal-400 */}
                  <Lock className="h-4 w-4 text-teal-400/80" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-slate-700/50 bg-slate-950/40 pl-10 pr-10 py-2.5 text-slate-200 placeholder-slate-600 focus:border-teal-400/50 focus:ring-4 focus:ring-teal-400/10 text-sm transition-all outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-teal-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-teal-500 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(45,212,191,0.2)] hover:bg-teal-400 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Login"}
                {!loading && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};