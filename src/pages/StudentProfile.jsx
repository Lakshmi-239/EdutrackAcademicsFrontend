import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/Api';
import toast from 'react-hot-toast';

import { PersonalInfoSection } from '../components/Student/PersonalInfoSection';
import { ProgramDetailsSection } from '../components/Student/ProgramDetailsSection';
import { AdditionalInfoSection } from '../components/Student/AdditionalInfoSection';
import { AccountSettingsSection } from '../components/Student/AccountSettingsSection';
import { Unauthorized } from '../components/Unauthorized';

import {
  User,
  GraduationCap,
  FileText,
  Settings,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

export const StudentProfile = () => {
  const { logout, isAuthenticated } = useAuth();

  const [activeSection, setActiveSection] = useState('profile');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isPreview = window.location.pathname.includes('/preview/');

  // ✅ AUTH GUARD — PREVENT BLANK PAGE
  if (!isAuthenticated && !isPreview) {
    return <Unauthorized />;
  }

  useEffect(() => {
    loadProfile();
  }, [isPreview]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const studentId = localStorage.getItem('studentId');

      if (!studentId && !isPreview) {
        toast.error('Session expired. Please login again.');
        logout();
        return;
      }

      const [personalData, programData, additionalData] = await Promise.all([
        api.getPersonalInfo(studentId),
        api.getProgramDetails(studentId),
        api.getAdditionalInfo(studentId),
      ]);

      setProfile({
        personalInfo: {
          ...personalData,
          email: personalData?.email || personalData?.Email || '',
        },
        programDetails: programData.details || programData,
        additionalInfo: additionalData || {},
      });
    } catch (error) {
      toast.error('Could not load profile data.');
      if (!isPreview && error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = () => loadProfile();

  const sidebarItems = [
    { id: 'profile', label: 'Personal Info', icon: User },
    { id: 'program', label: 'Program Details', icon: GraduationCap },
    { id: 'additional', label: 'Additional Info', icon: FileText },
    { id: 'settings', label: 'Account Settings', icon: Settings },
  ];

  const sectionMeta = useMemo(() => {
    const metas = {
      profile: { title: 'Personal Profile', icon: User },
      program: { title: 'Academic Program', icon: GraduationCap },
      additional: { title: 'Additional Data', icon: FileText },
      settings: { title: 'Security & Access', icon: Settings },
    };
    return metas[activeSection] || metas.profile;
  }, [activeSection]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-teal-500 animate-spin mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[10px]">
          Syncing Campus Record
        </p>
      </div>
    );
  }

  const firstLetter = profile?.personalInfo?.fullName?.charAt(0) || '?';
  const SectionIcon = sectionMeta.icon;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-12 overflow-x-hidden">

      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-teal-500/5 via-transparent to-transparent" />
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-teal-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12 pt-12">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* SIDEBAR */}
          <aside
            className={`
              fixed lg:sticky lg:top-12 inset-y-0 left-0 w-80 z-50
              transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
              transition-all duration-500 ease-out
              bg-[#020617] lg:bg-transparent
              p-8 lg:p-0
            `}
          >
            <div className="bg-slate-900/40 border border-slate-800/60 rounded-[2.5rem] p-8 mb-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-3xl bg-slate-800 border border-slate-700 flex items-center justify-center text-3xl font-black text-teal-400 shadow-2xl mb-5">
                  {firstLetter}
                </div>
                <h3 className="font-bold text-white mb-3">
                  {profile?.personalInfo?.fullName || 'Student'}
                </h3>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/10 border border-teal-500/20 rounded-full">
                  <ShieldCheck size={12} className="text-teal-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-teal-500">
                    Verified
                  </span>
                </div>
              </div>
            </div>

            <nav className="space-y-2">
              {sidebarItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    setActiveSection(id);
                    setIsSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-4 px-6 py-4 rounded-2xl
                    ${activeSection === id
                      ? 'bg-teal-500/10 border border-teal-500/20 text-white'
                      : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'}
                  `}
                >
                  <Icon size={18} />
                  <span className="text-[12px] font-bold uppercase tracking-wider">
                    {label}
                  </span>
                </button>
              ))}
            </nav>
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1">
            <div className="bg-slate-900/30 border border-slate-800/60 rounded-[3rem] backdrop-blur-3xl shadow-2xl">
              <div className="p-10 lg:p-14 border-b border-slate-800/40">
                <div className="flex items-center gap-8">
                  <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-teal-400">
                    <SectionIcon size={32} />
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-black uppercase text-white">
                    {sectionMeta.title}
                  </h1>
                </div>
              </div>

              <div className="p-10 lg:p-14">
                {activeSection === 'profile' && (
                  <PersonalInfoSection
                    personalInfo={profile.personalInfo}
                    onUpdate={handleProfileUpdate}
                  />
                )}
                {activeSection === 'program' && (
                  <ProgramDetailsSection
                    programDetails={profile.programDetails}
                  />
                )}
                {activeSection === 'additional' && (
                  <AdditionalInfoSection
                    additionalInfo={profile.additionalInfo}
                    onUpdate={handleProfileUpdate}
                  />
                )}
                {activeSection === 'settings' && (
                  <AccountSettingsSection
                    email={profile.personalInfo.email}
                    onUpdate={handleProfileUpdate}
                  />
                )}
              </div>
            </div>
          </main>

        </div>
      </div>
    </div>
  );
};