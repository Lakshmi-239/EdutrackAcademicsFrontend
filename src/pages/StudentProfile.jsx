import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/Api';
import toast from 'react-hot-toast';

import { PersonalInfoSection } from '../components/Student/PersonalInfoSection';
import { ProgramDetailsSection } from '../components/Student/ProgramDetailsSection';
import { AdditionalInfoSection } from '../components/Student/AdditionalInfoSection';
import { PhotoUploadSection } from '../components/Student/PhotoUploadSection';
import { AccountSettingsSection } from '../components/Student/AccountSettingsSection';

import {
  User,
  GraduationCap,
  FileText,
  Camera,
  Settings,
  Menu,
  X,
  LogOut,
  LayoutDashboard
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
        toast.error("Session expired. Please login again.");
        logout();
        return;
      }
      // We call the new separate services in parallel
      const [personalData, programData] = await Promise.all([
        api.getPersonalInfo(studentId),
        api.getProgramDetails(studentId),
        api.updateAdditionalInfo(studentId)
      ]);

      // Reconstruct the profile state so child components don't break
      setProfile({
        personalInfo: personalData,
        programDetails: programData.details || programData,
        // Mapping these from personalData if that's where they reside in your DB
        additionalInfo: personalData.additionalInfo || {},
        
      });

    } catch (error) {
      console.error('Failed to sync dashboard profile:', error);
      toast.error("Could not load profile data.");
      
      if (!isPreview && (error.response?.status === 401 || !localStorage.getItem('studentId'))) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = () => {
    loadProfile();
  };

  const handleLogout = () => {
    if (isPreview) {
      window.location.href = '/';
    } else {
      logout();
    }
  };

  const sidebarItems = [
    { id: 'profile', label: 'Personal Info', icon: User, color: 'text-blue-500' },
    { id: 'program', label: 'Program Details', icon: GraduationCap, color: 'text-indigo-500' },
    { id: 'additional', label: 'Additional Info', icon: FileText, color: 'text-emerald-500' },
    { id: 'settings', label: 'Account Settings', icon: Settings, color: 'text-slate-500' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500 font-bold animate-pulse">Syncing EduTrack Profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Unable to load profile data.</p>
          <button onClick={() => window.location.reload()} className="text-indigo-600 font-bold underline">Try Refreshing</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          <aside className={`
            fixed lg:relative inset-y-0 left-0 w-72 lg:w-64 z-40
            transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
            transition-transform duration-300 ease-in-out
            bg-white lg:bg-transparent lg:block
          `}>
            <div className="h-full p-6 lg:p-0">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col items-center text-center pb-6 border-b border-slate-100">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-slate-50 bg-slate-100 mb-4">
                    {profile.photoUrl ? (
                      <img src={profile.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-600 font-bold text-2xl">
                        {profile?.personalInfo?.fullName?.charAt(0) || "?"}
                      </div>
                    )}
                  </div>
                  <h3 className="text-sm font-black text-slate-900 truncate w-full">
                    {profile?.personalInfo?.fullName || "Student"}
                  </h3>
                </div>

                <nav className="mt-6 space-y-1">
                  {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveSection(item.id);
                          setIsSidebarOpen(false);
                        }}
                        className={`
                          w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                          ${isActive 
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                            : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
                          }
                        `}
                      >
                        <Icon size={18} className={isActive ? 'text-white' : item.color} />
                        <span className="text-sm font-bold">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
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
            {activeSection === 'photo' && (
              <PhotoUploadSection 
                currentPhotoUrl={profile.photoUrl} 
                onUpdate={handleProfileUpdate} 
              />
            )}
            {activeSection === 'settings' && (
              <AccountSettingsSection 
                email={profile.personalInfo?.email} 
                emailNotifications={profile.emailNotifications} 
                onUpdate={handleProfileUpdate} 
              />
            )}
          </main>
        </div>
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}
    </div>
  );
};