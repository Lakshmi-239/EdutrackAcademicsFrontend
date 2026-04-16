import React, { useState } from 'react';
import { api } from '../services/Api';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });
    try {
      await api.forgotPassword(email);
      setStatus({ loading: false, success: true, error: '' });
    } catch (err) {
      setStatus({ 
        loading: false, 
        success: false, 
        error: 'Account not found with this email address.' 
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Shimmer */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-cyan-600/20 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Fixed "Back to Sign In" - No more Blue! */}
        <div className="flex justify-center mb-6">
          <Link 
            to="/login" 
            className="flex items-center gap-2 text-sm font-semibold transition-all duration-300"
            style={{ color: '#94a3b8' }} // Slate-400 (Greyish white)
            onMouseEnter={(e) => e.target.style.color = '#22d3ee'} // Cyan-400 on Hover
            onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Sign In</span>
          </Link>
        </div>

        <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {!status.success ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Enter your email and we'll send you a secure link to reset your password.
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                  </div>
                  <input 
                    type="email" 
                    placeholder="name@company.com" 
                    className="w-full bg-[#1e293b]/50 border border-slate-700 text-white pl-11 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all placeholder:text-slate-600"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button 
                  disabled={status.loading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-indigo-600 text-white py-3 rounded-md font-bold hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center shadow-lg shadow-cyan-500/10"
                >
                  {status.loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>

              {status.error && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                   <p className="text-red-400 text-xs text-center">{status.error}</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyan-500/20">
                <CheckCircle2 className="w-10 h-10 text-cyan-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Email Sent</h2>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                We've sent a password reset link to <br/>
                <span className="text-white font-medium">{email}</span>
              </p>
              <button 
                onClick={() => setStatus({...status, success: false})}
                className="text-cyan-400 text-sm font-semibold hover:text-cyan-300 transition-colors"
              >
                Try another email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};