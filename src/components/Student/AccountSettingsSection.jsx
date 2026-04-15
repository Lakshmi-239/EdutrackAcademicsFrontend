import React, { useState } from 'react';
import { api } from '../../services/Api'; 
import { 
  Lock, 
  Bell, 
  Mail, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ShieldCheck,
  Settings2
} from 'lucide-react';

export const AccountSettingsSection = ({
  email = "user@edutrack.com",
  emailNotifications = {
    courseUpdates: true,
    assignments: true,
    grades: true,
    announcements: true,
    newsletter: false
  },
  onUpdate = () => {},
}) => {
  // Password Change State - Now matching ChangePasswordDTO
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Notification Settings State
  const [notifications, setNotifications] = useState(emailNotifications);
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);
  const [notificationSuccess, setNotificationSuccess] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // Validation
    if (!newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    try {
      setIsChangingPassword(true);
      
      /** * UPDATION: Mapping to ChangePasswordDTO
       * We send NewPassword. The Email is handled by the Controller's 
       * User.Identity?.Name, but we include it in the object to satisfy the DTO.
       */
      const changePasswordData = {
        email: email, 
        newPassword: newPassword 
      };

      await api.changePassword(changePasswordData);
      
      setPasswordSuccess('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      // Handles error messages from your Backend (e.g., BadRequest)
      setPasswordError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveNotifications = async () => {
    try {
      setIsSavingNotifications(true);
      setNotificationSuccess('');
      await api.updateEmailNotifications(notifications);
      setNotificationSuccess('Preferences saved successfully!');
      onUpdate();
    } catch (error) {
      console.error('Error updating notifications:', error);
    } finally {
      setIsSavingNotifications(false);
    }
  };

  const PasswordInput = ({ label, value, onChange, show, setShow, placeholder }) => (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <div className="relative group">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Security & Notifications</h2>
          <p className="text-slate-500 text-sm mt-1">Manage your account credentials and alerts.</p>
        </div>
        <div className="hidden sm:block p-3 bg-indigo-50 rounded-2xl">
          <ShieldCheck className="w-8 h-8 text-indigo-600" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Settings2 size={18} className="text-indigo-600" />
              Account Context
            </h3>
            <div className="mt-4 space-y-3">
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Active Email</span>
                <span className="text-sm text-slate-700 truncate font-medium">{email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Lock size={18} className="text-slate-600" />
                Change Password
              </h3>
            </div>
            <div className="p-6">
              <form onSubmit={handlePasswordChange} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                {passwordError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                    <AlertCircle size={16} /> {passwordError}
                  </div>
                )}
                
                {passwordSuccess && (
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 text-sm rounded-lg border border-emerald-100">
                    <CheckCircle size={16} /> {passwordSuccess}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="w-full sm:w-auto px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-all disabled:opacity-50"
                >
                  {isChangingPassword ? "Updating..." : "Save New Password"}
                </button>
              </form>
            </div>
          </section>

          {/* Notifications Card - Remained largely same but styled to match */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Bell size={18} className="text-slate-600" />
                Alert Settings
              </h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="divide-y divide-slate-100">
                {Object.keys(notifications).map((key) => (
                  <div key={key} className="flex items-center justify-between py-4">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                    </div>
                    <button
                      onClick={() => handleNotificationToggle(key)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notifications[key] ? 'bg-indigo-600' : 'bg-slate-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications[key] ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={handleSaveNotifications}
                disabled={isSavingNotifications}
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors"
              >
                {isSavingNotifications ? "Saving..." : "Update Preferences"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};