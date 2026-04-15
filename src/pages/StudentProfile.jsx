import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/Api';
import toast from 'react-hot-toast';
import { PersonalInfoSection } from '../components/Student/PersonalInfoSection';
import { ProgramDetailsSection } from '../components/Student/ProgramDetailsSection';
import { AdditionalInfoSection } from '../components/Student/AdditionalInfoSection';
import { AccountSettingsSection } from '../components/Student/AccountSettingsSection';
import {
  User,
  GraduationCap,
  FileText,
  Settings,
  Menu,
  X,
  ShieldCheck,
  AlertCircle,
  ChevronRight,
  Loader2
} from 'lucide-react';

export const StudentProfile = () => {
  const { logout } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isPreview = window.location.pathname.includes('/preview/');

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
        photoUrl: personalData.photoUrl || null,
      });
    } catch (error) {
      console.error('Failed to sync dashboard profile:', error);
      toast.error('Could not load profile data.');
      if (!isPreview && (error.response?.status === 401 || !localStorage.getItem('studentId'))) {
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
      program: { title: 'Program Details', subtitle: 'Academic program and curriculum.', icon: GraduationCap },
      additional: { title: 'Additional Info', subtitle: 'Supporting registration data.', icon: FileText },
      settings: { title: 'Account Settings', subtitle: 'Security and preferences.', icon: Settings },
      profile: { title: 'Personal Information', subtitle: 'Official student record details.', icon: User },
    };
    return metas[activeSection] || metas.profile;
  }, [activeSection]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-teal-500 animate-spin" />
      </div>
    );
  }

  const firstLetter = profile?.personalInfo?.fullName?.charAt(0) || '?';
  const SectionIcon = sectionMeta.icon;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-12">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* ===================== SIDEBAR ===================== */}
          <aside
            className={`
              fixed lg:sticky lg:top-8 inset-y-0 left-0 w-72 z-50
              transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
              transition-transform duration-300 ease-in-out
              bg-slate-900 lg:bg-slate-900/40 backdrop-blur-xl
              border-r lg:border border-slate-800 lg:rounded-3xl
              p-6 flex flex-col h-full lg:h-fit
            `}
          >
            <div className="flex flex-col items-center text-center pb-8 border-b border-slate-800/60">
              <div className="relative w-24 h-24 mb-4">
                <div className="absolute inset-0 bg-gradient-to-tr from-teal-400 to-emerald-500 rounded-2xl rotate-3 opacity-20 animate-pulse" />
                <div className="relative w-full h-full rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-3xl font-bold text-teal-400 shadow-2xl">
                  {firstLetter}
                </div>
              </div>
              <h3 className="font-bold text-white text-lg truncate w-full px-2">
                {profile?.personalInfo?.fullName || 'Student'}
              </h3>
              <div className="flex items-center gap-1.5 mt-2 px-3 py-1 bg-teal-500/10 border border-teal-500/20 rounded-full">
                <ShieldCheck size={14} className="text-teal-400" />
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">Verified</span>
              </div>
            </div>

            <nav className="mt-8 space-y-2">
              {sidebarItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => { setActiveSection(id); setIsSidebarOpen(false); }}
                  className={`
                    w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all group
                    ${activeSection === id 
                      ? 'bg-teal-500/10 text-white border border-teal-500/20 shadow-[0_0_20px_rgba(20,184,166,0.05)]' 
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} className={activeSection === id ? 'text-teal-400' : 'group-hover:text-slate-300'} />
                    <span className="text-sm font-semibold">{label}</span>
                  </div>
                  {activeSection === id && <ChevronRight size={16} className="text-teal-500/50" />}
                </button>
              ))}
            </nav>

            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden mt-auto flex items-center justify-center gap-2 p-4 text-slate-400 border border-slate-800 rounded-xl"
            >
              <X size={18} /> Close Menu
            </button>
          </aside>

          {/* ===================== MAIN WORKSPACE ===================== */}
          <main className="flex-1 min-w-0">
            {/* Mobile Header Toggle */}
            <div className="lg:hidden flex items-center justify-between mb-6 p-4 bg-slate-900 border border-slate-800 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-teal-400 font-bold">
                  {firstLetter}
                </div>
                <h2 className="font-bold text-white uppercase tracking-wider text-sm">Workspace</h2>
              </div>
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-teal-400">
                <Menu size={24} />
              </button>
            </div>

            {/* Main Content Card */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] overflow-hidden backdrop-blur-md shadow-2xl">
              <div className="p-8 lg:p-12 border-b border-slate-800/50 bg-gradient-to-b from-slate-900/50 to-transparent">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="w-16 h-16 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center text-teal-400 shadow-inner">
                    <SectionIcon size={32} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black text-white tracking-tight leading-none">
                      {sectionMeta.title}
                    </h1>
                    <p className="text-slate-400 mt-2 text-lg font-medium">{sectionMeta.subtitle}</p>
                  </div>
                </div>
              </div>

              <div className="p-8 lg:p-12">
                <div className="min-h-[400px]">
                  {activeSection === 'profile' && (
                    <PersonalInfoSection personalInfo={profile.personalInfo} onUpdate={handleProfileUpdate} />
                  )}
                  {activeSection === 'program' && (
                    <ProgramDetailsSection programDetails={profile.programDetails} />
                  )}
                  {activeSection === 'additional' && (
                    <AdditionalInfoSection additionalInfo={profile.additionalInfo} onUpdate={handleProfileUpdate} />
                  )}
                  {activeSection === 'settings' && (
                    <AccountSettingsSection email={profile.personalInfo.email} onUpdate={handleProfileUpdate} />
                  )}
                </div>

                
              </div>
            </div>
          </main>

        </div>
      </div>
    </div>
  );
};