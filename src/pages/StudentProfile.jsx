import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/Api';
import toast from 'react-hot-toast';
import { PersonalInfoSection } from '../components/Student/PersonalInfoSection';
import { ProgramDetailsSection } from '../components/Student/ProgramDetailsSection';
import { AdditionalInfoSection } from '../components/Student/AdditionalInfoSection';
import { AccountSettingsSection } from '../components/Student/AccountSettingsSection';
import {Footer} from '../components/Footer';
import {
  User,
  GraduationCap,
  FileText,
  Settings,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  Loader2,
  LayoutGrid
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
      });
    } catch (error) {
      toast.error('Could not load profile data.');
      if (!isPreview && (error.response?.status === 401)) logout();
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = () => loadProfile();

  // Defined inside component to prevent ReferenceErrors
  const sidebarItems = [
    { id: 'profile', label: 'Personal Info', icon: User },
    { id: 'program', label: 'Program Details', icon: GraduationCap },
    { id: 'additional', label: 'Additional Info', icon: FileText },
    { id: 'settings', label: 'Account Settings', icon: Settings },
  ];

  const sectionMeta = useMemo(() => {
    const metas = {
      program: { title: 'Academic Program', icon: GraduationCap },
      additional: { title: 'Additional Data', icon: FileText },
      settings: { title: 'Security & Access', icon: Settings },
      profile: { title: 'Personal Profile', icon: User },
    };
    return metas[activeSection] || metas.profile;
  }, [activeSection]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-teal-500 animate-spin mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-[0.4em] text-[10px]">Syncing Campus Record</p>
      </div>
    );
  }

  const firstLetter = profile?.personalInfo?.fullName?.charAt(0) || '?';
  const SectionIcon = sectionMeta.icon;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-12 overflow-x-hidden">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-teal-500/5 via-transparent to-transparent" />
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-teal-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-[1440px] mx-auto px-6 lg:px-12 pt-12">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* SIDEBAR */}
          <aside className={`
            fixed lg:sticky lg:top-12 inset-y-0 left-0 w-80 z-50
            transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
            transition-all duration-500 ease-out bg-[#020617] lg:bg-transparent
            p-8 lg:p-0 flex flex-col h-full lg:h-fit
          `}>
            <div className="bg-slate-900/40 border border-slate-800/60 rounded-[2.5rem] p-8 mb-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-3xl bg-slate-800 border border-slate-700 flex items-center justify-center text-3xl font-black text-teal-400 shadow-2xl mb-5">
                  {firstLetter}
                </div>
                <h3 className="font-bold text-white tracking-tight leading-tight mb-3">
                  {profile?.personalInfo?.fullName || 'Student'}
                </h3>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/10 border border-teal-500/20 rounded-full">
                  <ShieldCheck size={12} className="text-teal-500" />
                  <span className="text-[10px] font-black text-teal-500 uppercase tracking-widest">Verified</span>
                </div>
              </div>
            </div>

            <nav className="space-y-1.5 lg:bg-slate-900/20 lg:p-3 lg:rounded-3xl lg:border lg:border-slate-800/50">
              {sidebarItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => { setActiveSection(id); setIsSidebarOpen(false); }}
                  className={`
                    w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300
                    ${activeSection === id 
                      ? 'bg-teal-500/10 text-white border border-teal-500/20' 
                      : 'text-slate-500 hover:text-slate-200 hover:bg-white/5 border border-transparent'}
                  `}
                >
                  <Icon size={18} className={activeSection === id ? 'text-teal-400' : ''} />
                  <span className="text-[12px] font-bold uppercase tracking-wider">{label}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1">
            <div className="bg-slate-900/30 border border-slate-800/60 rounded-[3rem] backdrop-blur-3xl overflow-hidden shadow-2xl">
              <div className="p-10 lg:p-14 border-b border-slate-800/40 bg-gradient-to-b from-white/5 to-transparent">
                <div className="flex items-center gap-8">
                  <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center text-teal-400">
                    <SectionIcon size={32} />
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter uppercase">
                    {sectionMeta.title}
                  </h1>
                </div>
              </div>

              <div className="p-10 lg:p-14">
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                  {activeSection === 'profile' && <PersonalInfoSection personalInfo={profile.personalInfo} onUpdate={handleProfileUpdate} />}
                  {activeSection === 'program' && <ProgramDetailsSection programDetails={profile.programDetails} />}
                  {activeSection === 'additional' && <AdditionalInfoSection additionalInfo={profile.additionalInfo} onUpdate={handleProfileUpdate} />}
                  {activeSection === 'settings' && <AccountSettingsSection email={profile.personalInfo.email} onUpdate={handleProfileUpdate} />}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      
    </div>
  );
};