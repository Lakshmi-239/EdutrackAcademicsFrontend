import React, { useState } from 'react';
// Path adjusted for: src/components/Student/AdditionalInfoSection.jsx
import { api } from '../../services/Api'; 
import {
  Edit,
  Save,
  X,
  Plus,
  Code,
  Heart,
  Linkedin,
  Github,
  Globe,
  User,
  Link as LinkIcon,
  Trash2
} from 'lucide-react';

export const AdditionalInfoSection = ({ additionalInfo, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(additionalInfo);
  const [isSaving, setIsSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');

  const handleEdit = () => {
    setFormData(additionalInfo);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(additionalInfo);
    setIsEditing(false);
    setNewSkill('');
    setNewInterest('');
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await api.updateAdditionalInfo(formData);
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating additional info:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const addTag = (type, value, setter) => {
    const trimmed = value.trim();
    if (trimmed && !formData[type].includes(trimmed)) {
      handleChange(type, [...formData[type], trimmed]);
      setter('');
    }
  };

  const removeTag = (type, value) => {
    handleChange(type, formData[type].filter((item) => item !== value));
  };

  // Reusable Section Component for consistent enterprise look
  const SectionWrapper = ({ title, icon: Icon, children, colorClass = "text-slate-600" }) => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:border-slate-300">
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
        <Icon className={`w-5 h-5 ${colorClass}`} />
        <h3 className="font-bold text-slate-800 tracking-tight">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Additional Profile Details</h2>
          <p className="text-slate-500 mt-1">Manage your public presence, technical stack, and social identity.</p>
        </div>
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all shadow-md shadow-indigo-100 active:scale-95"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* About Me Section */}
        <div className="lg:col-span-2">
          <SectionWrapper title="About Me" icon={User} colorClass="text-indigo-600">
            {isEditing ? (
              <textarea
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                rows={4}
                placeholder="Write a professional bio..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none"
              />
            ) : (
              <p className="text-slate-600 leading-relaxed italic">
                {additionalInfo.bio || 'Provide a brief introduction about your journey...'}
              </p>
            )}
          </SectionWrapper>
        </div>

        {/* Skills Section */}
        <SectionWrapper title="Technical Skills" icon={Code} colorClass="text-blue-600">
          {isEditing && (
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag('skills', newSkill, setNewSkill)}
                placeholder="e.g. React, .NET"
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
              />
              <button
                onClick={() => addTag('skills', newSkill, setNewSkill)}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {(isEditing ? formData.skills : additionalInfo.skills).map((skill) => (
              <span key={skill} className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-bold border border-blue-100">
                {skill}
                {isEditing && (
                  <X size={14} className="cursor-pointer hover:text-blue-900" onClick={() => removeTag('skills', skill)} />
                )}
              </span>
            ))}
          </div>
        </SectionWrapper>

        {/* Interests Section */}
        <SectionWrapper title="Personal Interests" icon={Heart} colorClass="text-rose-500">
          {isEditing && (
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag('interests', newInterest, setNewInterest)}
                placeholder="e.g. AI Research"
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-rose-500"
              />
              <button
                onClick={() => addTag('interests', newInterest, setNewInterest)}
                className="p-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {(isEditing ? formData.interests : additionalInfo.interests).map((interest) => (
              <span key={interest} className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 rounded-md text-xs font-bold border border-rose-100">
                {interest}
                {isEditing && (
                  <X size={14} className="cursor-pointer hover:text-rose-900" onClick={() => removeTag('interests', interest)} />
                )}
              </span>
            ))}
          </div>
        </SectionWrapper>

        {/* Social Links Section */}
        <div className="lg:col-span-2">
          <SectionWrapper title="Portfolio & Social Connectivity" icon={LinkIcon} colorClass="text-emerald-600">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: 'linkedin', icon: Linkedin, color: 'text-blue-700', label: 'LinkedIn', placeholder: 'linkedin.com/in/...' },
                { id: 'github', icon: Github, color: 'text-slate-900', label: 'GitHub', placeholder: 'github.com/...' },
                { id: 'portfolio', icon: Globe, color: 'text-emerald-600', label: 'Portfolio', placeholder: 'yoursite.com' }
              ].map((item) => (
                <div key={item.id} className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                    <item.icon size={14} className={item.color} />
                    {item.label}
                  </label>
                  {isEditing ? (
                    <input
                      type="url"
                      value={formData[item.id] || ''}
                      onChange={(e) => handleChange(item.id, e.target.value)}
                      placeholder={item.placeholder}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-emerald-500"
                    />
                  ) : (
                    <div className="truncate">
                      {additionalInfo[item.id] ? (
                        <a href={additionalInfo[item.id]} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 underline">
                          Visit Link
                        </a>
                      ) : (
                        <span className="text-sm text-slate-400 italic">Not Linked</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </SectionWrapper>
        </div>
      </div>

      {/* Action Bar */}
      {isEditing && (
        <div className="sticky bottom-6 left-0 right-0 flex justify-end gap-3 p-4 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl shadow-xl animate-in slide-in-from-bottom-4">
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="px-6 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={18} />
            )}
            Save All Changes
          </button>
        </div>
      )}
    </div>
  );
};