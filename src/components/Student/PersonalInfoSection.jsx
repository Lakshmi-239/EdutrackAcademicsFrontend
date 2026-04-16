import React, { useState, useEffect } from 'react';
import { api } from '../../services/Api'; 
import toast from 'react-hot-toast';
import {
  Mail,
  Phone,
  User,
  Info,
  UserCircle
} from 'lucide-react';

export const PersonalInfoSection = () => {
  const [personalInfo, setPersonalInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Using the updated api.js method
        const data = await api.getPersonalInfo();
        setPersonalInfo(data);
      } catch (error) {
        console.error('Fetch error:', error);
        toast.error('Could not load profile details');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Shared Styles
  const labelStyles = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2";
  const displayBoxStyles = "px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-semibold min-h-[48px] flex items-center";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-3">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Loading your information...</p>
      </div>
    );
  }

  if (!personalInfo) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
        <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
          <UserCircle size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Personal Information</h2>
          <p className="text-slate-500">Official details from your student record</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Student Name */}
            <div className="space-y-1">
              <label className={labelStyles}>
                <User size={14} className="text-indigo-500" /> Full Name
              </label>
              <div className={displayBoxStyles}>
                {personalInfo.studentName}
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className={labelStyles}>
                <Mail size={14} className="text-indigo-500" /> Email Address
              </label>
              <div className="px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 flex justify-between items-center group">
                <span className="font-medium">{personalInfo.studentEmail}</span>
                <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded uppercase tracking-tighter">Verified</span>
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label className={labelStyles}>
                <Phone size={14} className="text-indigo-500" /> Phone Number
              </label>
              <div className={displayBoxStyles}>
                {personalInfo.studentPhone || 'Not provided'}
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-1">
              <label className={labelStyles}>
                <Info size={14} className="text-indigo-500" /> Gender
              </label>
              <div className={displayBoxStyles}>
                {personalInfo.studentGender || 'Not provided'}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Notice box since they can't edit */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
        <Info className="text-amber-600 shrink-0" size={20} />
        <p className="text-sm text-amber-800">
          These details are read-only. If you need to update your phone number or name, please submit a request to the registrar's office.
        </p>
      </div>
    </div>
  );
};