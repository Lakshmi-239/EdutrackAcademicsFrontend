import React, { useState } from 'react';
import { api } from '../../services/Api';
import {
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  KeyRound,
  ArrowRight,
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

    if (!newPassword || !confirmPassword) {
      setStatus({ type: 'error', message: 'Fields required.' });
      return;
    }
    if (newPassword.length < 8) {
      setStatus({ type: 'error', message: 'Min 8 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', message: 'No match.' });
      return;
    }

    try {
      setIsChangingPassword(true);
      await api.changePassword({ Email: email, NewPassword: newPassword });
      toast.success('Updated.');
      setStatus({ type: 'success', message: 'Updated successfully.' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const message = err.response?.data?.message || 'Error.';
      setStatus({ type: 'error', message });
      toast.error(message);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const PasswordInput = ({ label, value, onChange, show, setShow }) => (
    <div className="space-y-1">
      <label className="text-[10px] font-medium uppercase tracking-widest text-slate-500">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/5 outline-none transition-all"
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-teal-400"
        >
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );

  return (
    /* Changed: Added mx-auto to center and removed top margin/space */
    <div className="w-full max-w-sm mx-auto animate-in fade-in duration-500">
      <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <KeyRound size={13} className="text-slate-400" />
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
            Update Password
          </h3>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-3">
          <div className="grid grid-cols-1 gap-3">
            <PasswordInput
              label="New Password"
              value={newPassword}
              onChange={setNewPassword}
              show={showNewPassword}
              setShow={setShowNewPassword}
            />
            <PasswordInput
              label="Confirm Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              show={showConfirmPassword}
              setShow={setShowConfirmPassword}
            />
          </div>

          {status.message && (
            <div className={`flex items-center gap-2 p-2 rounded-lg text-[11px] ${
              status.type === 'error' ? 'bg-red-500/5 text-red-400' : 'bg-emerald-500/5 text-emerald-400'
            }`}>
              {status.type === 'error' ? <AlertCircle size={12} /> : <CheckCircle size={12} />}
              {status.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isChangingPassword}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-teal-500 text-slate-950 rounded-lg text-[11px] font-bold uppercase tracking-wider hover:bg-teal-400 transition-colors disabled:opacity-50"
          >
            {isChangingPassword ? (
              <div className="w-3 h-3 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
            ) : (
              <>
                <Lock size={12} /> Update <ArrowRight size={12} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};