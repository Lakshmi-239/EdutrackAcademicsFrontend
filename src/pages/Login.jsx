import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, GraduationCap, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/Api';
import toast from 'react-hot-toast';
import { jwtDecode } from "jwt-decode";
import Swal from 'sweetalert2';

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
      // 1. Authenticate with Backend
      const data = await api.login(email, password);
      console.log("LOGIN RESPONSE:", data);

      // 2. Extract the token string safely
      const token = data?.token?.accessToken || data?.accessToken || data?.token;

      if (!token || typeof token !== 'string') {
        toast.error("No valid token received");
        setLoading(false);
        return;
      }

      // 3. Update AuthContext (Saves 'authToken' to localStorage)
      login(token);

      // 4. Decode JWT for Routing and ID Storage
      let role = "";
      try {
        const decoded = jwtDecode(token);
        
        // Match .NET Role Claim URI
        const dotNetRoleClaim = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
        const rawRoles = decoded[dotNetRoleClaim] || decoded.role || "";
        role = Array.isArray(rawRoles) ? rawRoles[0] : rawRoles;

        // Store the actual User ID (Matches C#: new Claim("id", user.UserId))
        const studentId = decoded.id; 
        if (studentId) {
          //for matching the format in the backend
          const finalId = studentId.toString().startsWith('S') ? studentId : `S${studentId.toString().padStart(3, '0')}`;
          localStorage.setItem('studentId', finalId);
        }
      } catch (err) {
        console.error("Token decoding failed:", err);
      }

      toast.success("Login successful!");

      // 5. Structured Navigation
      const dashboardRoutes = {
        "Student": "/Studentdashboard",
        "Admin": "/admin",
        "Instructor": "/InstructorDashboard",
        "Coordinator": "/coordinator/dashboard"
      };

      if (dashboardRoutes[role]) {
        navigate(dashboardRoutes[role]);
      } else {
        console.warn("Role not recognized:", role);
        navigate("/"); // Fallback to Home
      }

    } catch (err) {
      console.error("Login Error:", err);
      Swal.fire({
        icon: 'error',
        title: 'Authentication Failed',
        text: err.response?.data?.message || 'Invalid credentials.',
        background: '#0f172a',
        color: '#f1f5f9',
        confirmButtonColor: '#22d3ee', 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center px-6 overflow-hidden relative">
      
      {/* Background Decorative Shimmers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] bg-indigo-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[45%] h-[45%] bg-cyan-600/20 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-[420px] z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 bg-slate-900 border border-white/10 rounded-xl flex items-center justify-center transition-all hover:border-cyan-400/50">
                <GraduationCap className="w-7 h-7 text-cyan-400" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                Edu<span className="text-cyan-400">Track</span>
              </span>
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-sm" style={{ color: '#22d3ee' }}>
            Get started with EduTrack!{' '}
            <Link to="/register" 
              style={{color: '#94a3b8'}}
              className="font-semibold hover:text-cyan-300 transition-colors ml-1">
              Create account
            </Link>
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#0f172a]/70 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-8 shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Email Field */}
            <div className="space-y-2" style={{ textAlign: 'left' }}>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/50 pl-12 pr-4 py-3 text-slate-200 outline-none focus:border-cyan-500/50 transition-all"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2" style={{ textAlign: 'left' }}>
              <div className="flex justify-between px-1">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  Password
                </label>
                <Link 
                  to="/forgot-password" 
                  style={{color: '#94a3b8'}} 
                  className="text-[10px] font-bold hover:text-cyan-400 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/50 pl-12 pr-12 py-3 text-slate-200 outline-none focus:border-cyan-500/50 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 hover:opacity-90 active:scale-[0.98] transition-all"
            >
              {loading ? "Verifying..." : "Sign In"}
              {!loading && <ChevronRight className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};