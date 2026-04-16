import React, { useState, useEffect } from 'react';
import { api } from '../../services/Api';
import { Edit, Save, Globe, Home, Award, History, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdditionalInfoSection = ({ additionalInfo, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (additionalInfo) setFormData(additionalInfo);
  }, [additionalInfo]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await api.updateAdditionalInfo(localStorage.getItem('studentId'), formData);
      toast.success('Profile Synchronized');
      setIsEditing(false);
      onUpdate();
    } catch {
      toast.error('Update failed');
    } finally {
      setIsSaving(false);
    }
  };

  /* ================== FIELD ================== */
  const FieldBlock = ({ label, field, value, icon: Icon, type = 'text' }) => (
    <div className="flex flex-col gap-2 p-4 rounded-2xl bg-slate-950/30 border border-slate-800/50 hover:border-slate-700 transition-colors">
      <div className="flex items-center gap-2 text-slate-400">
        {Icon && <Icon size={14} />}
        <span className="text-[11px] font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>

      {isEditing ? (
        <input
          type={type}
          value={value || ''}
          onChange={(e) =>
            setFormData({ ...formData, [field]: e.target.value })
          }
          className="bg-transparent border-b border-teal-500/30 py-1.5 text-sm text-white font-medium focus:border-teal-400 outline-none"
        />
      ) : (
        <p
          className={`text-sm font-medium ${
            value ? 'text-white' : 'text-slate-600'
          }`}
        >
          {value || 'Not Disclosed'}
        </p>
      )}
    </div>
  );

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">
            Background
          </h2>
          <p className="text-xs text-slate-500 font-normal mt-1">
            Manage your institutional registration data.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="group flex items-center gap-2 px-5 py-2.5 bg-teal-500 text-slate-950 rounded-xl text-xs font-semibold uppercase tracking-wide hover:bg-teal-400 transition"
          >
            <Edit size={14} className="group-hover:rotate-12 transition-transform" />
            Modify Records
          </button>
        )}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Residency */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2 ml-2">
            <Globe size={16} className="text-teal-500" />
            <span className="text-xs font-semibold text-white uppercase tracking-wide">
              Origin & Residency
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldBlock
              label="Nationality"
              field="nationality"
              value={formData.nationality}
            />
            <FieldBlock
              label="Citizenship"
              field="citizenship"
              value={formData.citizenship}
            />
          </div>

          <FieldBlock
            label="Residential Status"
            field="dayscholarHosteller"
            value={formData.dayscholarHosteller}
            icon={Home}
          />
        </div>

        {/* Achievements */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2 ml-2">
            <Award size={16} className="text-blue-500" />
            <span className="text-xs font-semibold text-white uppercase tracking-wide">
              Campus Engagement
            </span>
          </div>

          <FieldBlock
            label="Certifications"
            field="certifications"
            value={formData.certifications}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldBlock
              label="Clubs & Chapters"
              field="clubs_Chapters"
              value={formData.clubs_Chapters}
            />
            <FieldBlock
              label="Education Gap"
              field="educationGap"
              value={formData.educationGap}
              type="number"
              icon={History}
            />
          </div>
        </div>
      </div>

      {/* Action Bar */}
      {isEditing && (
        <div className="mt-12 flex items-center justify-end gap-4 p-6 bg-slate-900/40 border border-slate-800 rounded-[2rem] animate-in slide-in-from-bottom-4">
          <button
            onClick={() => {
              setIsEditing(false);
              setFormData(additionalInfo);
            }}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-400 hover:text-white transition"
          >
            <RotateCcw size={14} />
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 bg-teal-500 text-slate-950 rounded-2xl text-xs font-semibold uppercase tracking-wide hover:bg-teal-400 shadow-lg shadow-teal-500/20 disabled:opacity-50"
          >
            {isSaving ? 'Synchronizing…' : <><Save size={16} /> Save Changes</>}
          </button>
        </div>
      )}
    </div>
  );
};
