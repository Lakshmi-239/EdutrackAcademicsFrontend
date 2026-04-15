import React, { useState } from 'react';
import { api } from '../../services/Api'; 
import { 
  Lock, 
  ShieldCheck,
  Settings2,
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle,
  KeyRound,
  ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AccountSettingsSection = ({ email }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    // 1. Frontend Validation
    if (!newPassword || !confirmPassword) {
      setStatus({ type: 'error', message: 'All fields are required.' });
      return;
    }
    if (newPassword.length < 8) {
      setStatus({ type: 'error', message: 'Password must be at least 8 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    try {
      setIsChangingPassword(true);
      
      // 2. Map to ResetPasswordDto (matches your C# class)
      const passwordData = {
        Email: email, // This is overwritten by backend for security, but required for DTO binding
        NewPassword: newPassword 
      };

      // 3. Call POST method
      const response = await api.changePassword(passwordData);
      
      setStatus({ type: 'success', message: response.message || 'Password updated successfully!' });
      toast.success("Security keys updated.");
      
      // Reset form
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      // Handling the BadRequest response from your controller
      const errMsg = err.response?.data?.message || 'Update failed. Please try again.';
      setStatus({ type: 'error', message: errMsg });
      toast.error(errMsg);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const PasswordInput = ({ label, value, onChange, show, setShow, placeholder }) => (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Account Security</h2>
          <p className="text-slate-500 mt-1">Update your password to keep your academic record secure.</p>
        </div>
        <div className="hidden sm:flex p-3 bg-indigo-50 rounded-2xl">
          <ShieldCheck className="w-8 h-8 text-indigo-600" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
              <Settings2 size={18} className="text-indigo-600" /> Account Context
            </h3>
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Email</span>
                <p className="text-sm font-semibold text-slate-700 truncate">{email || 'Loading...'}</p>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
                  <CheckCircle size={14} />
                  <span className="text-[10px] font-bold uppercase">Identity Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <KeyRound size={18} className="text-slate-600" />
              <h3 className="font-bold text-slate-800 tracking-tight">Change Password</h3>
            </div>

            <div className="p-6">
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <PasswordInput 
                    label="New Password" 
                    value={newPassword} 
                    onChange={setNewPassword} 
                    show={showNewPassword} 
                    setShow={setShowNewPassword} 
                    placeholder="Min. 8 characters"
                  />
                  <PasswordInput 
                    label="Confirm Password" 
                    value={confirmPassword} 
                    onChange={setConfirmPassword} 
                    show={showConfirmPassword} 
                    setShow={setShowConfirmPassword} 
                    placeholder="Repeat password"
                  />
                </div>

                {status.message && (
                  <div className={`flex items-center gap-2 p-4 rounded-xl text-sm font-medium border animate-in slide-in-from-top-2 ${
                    status.type === 'error' 
                      ? 'bg-rose-50 text-rose-700 border-rose-100' 
                      : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                  }`}>
                    {status.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
                    {status.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-slate-200"
                >
                  {isChangingPassword ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Lock size={18} />
                      Update Security Key
                      <ArrowRight size={16} className="ml-1 opacity-50" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};