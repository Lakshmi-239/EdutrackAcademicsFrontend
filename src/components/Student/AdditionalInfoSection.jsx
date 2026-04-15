import React, { useState, useEffect } from 'react';
import { api } from '../../services/Api'; 
import {
  Edit,
  Save,
  X,
  Plus,
  Award,
  Globe,
  Home,
  Users,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export const AdditionalInfoSection = ({ additionalInfo, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Sync internal state when prop changes
  useEffect(() => {
    setFormData(additionalInfo);
  }, [additionalInfo]);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setFormData(additionalInfo);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const studentId = localStorage.getItem('studentId');
      // Pass both studentId and the data
      await api.updateAdditionalInfo(studentId, formData);
      setIsEditing(false);
      onUpdate(); // Trigger refresh in parent
    } catch (error) {
      console.error('Error updating info:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const SectionWrapper = ({ title, icon: Icon, children, colorClass = "text-slate-600" }) => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:border-slate-300">
      <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
        <Icon className={`w-5 h-5 ${colorClass}`} />
        <h3 className="font-bold text-slate-800 tracking-tight">{title}</h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );

  const InputField = ({ label, value, field, placeholder, type = "text" }) => (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
      {isEditing ? (
        <input
          type={type}
          value={value || ''}
          onChange={(e) => handleChange(field, e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
        />
      ) : (
        <p className="text-slate-700 font-medium px-1">{value || 'Not Provided'}</p>
      )}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Additional Details</h2>
          <p className="text-slate-500 mt-1">Official background and extra-curricular information.</p>
        </div>
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all shadow-md active:scale-95"
          >
            <Edit className="w-4 h-4" /> Edit Details
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Identity & Origin */}
        <SectionWrapper title="Citizenship & Origin" icon={Globe} colorClass="text-blue-600">
          <div className="grid gap-6">
            <InputField label="Nationality" field="nationality" value={formData.nationality} placeholder="e.g. Indian" />
            <InputField label="Citizenship" field="citizenship" value={formData.citizenship} placeholder="e.g. Indian" />
          </div>
        </SectionWrapper>

        {/* Accommodation */}
        <SectionWrapper title="Residential Status" icon={Home} colorClass="text-emerald-600">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
            {isEditing ? (
              <select
                value={formData.dayscholarHosteller || ''}
                onChange={(e) => handleChange('dayscholarHosteller', e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-500"
              >
                <option value="">Select Option</option>
                <option value="Dayscholar">Dayscholar</option>
                <option value="Hosteller">Hosteller</option>
              </select>
            ) : (
              <p className="text-slate-700 font-medium">{formData.dayscholarHosteller || 'Not Selected'}</p>
            )}
          </div>
        </SectionWrapper>

        {/* Professional & Academic */}
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
          <SectionWrapper title="Certifications" icon={CheckCircle2} colorClass="text-indigo-600">
            <InputField label="List your certs" field="certifications" value={formData.certifications} placeholder="AWS, Azure, etc." />
          </SectionWrapper>

          <SectionWrapper title="Clubs & Chapters" icon={Users} colorClass="text-orange-600">
            <InputField label="Organizations" field="clubs_Chapters" value={formData.clubs_Chapters} placeholder="Coding Club, etc." />
          </SectionWrapper>

          <SectionWrapper title="Achievements" icon={Award} colorClass="text-amber-600">
            <InputField label="Honors" field="achievements" value={formData.achievements} placeholder="Hackathon Winner..." />
          </SectionWrapper>
        </div>

        {/* Miscl */}
        <div className="md:col-span-2">
          <SectionWrapper title="Academic History" icon={AlertCircle} colorClass="text-rose-600">
            <InputField label="Education Gap (Years/Description)" field="educationGap" value={formData.educationGap} placeholder="Any gaps in education..." />
          </SectionWrapper>
        </div>
      </div>

      {isEditing && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-3 p-4 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 animate-in slide-in-from-bottom-4">
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="px-6 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : <><Save size={18} /> Save Changes</>}
          </button>
        </div>
      )}
    </div>
  );
};