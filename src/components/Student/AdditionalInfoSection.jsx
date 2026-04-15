import React, { useState, useEffect } from 'react';
import { api } from '../../services/Api'; 
import {
  Edit, Save, Globe, Home, Award
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AdditionalInfoSection = ({ additionalInfo, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (additionalInfo) {
      setFormData(additionalInfo);
    }
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
      
      // Formatting payload to match C# StudentAdditionalDetailsDTO
      const payload = {
        nationality: formData.nationality || null,
        citizenship: formData.citizenship || null,
        dayscholarHosteller: formData.dayscholarHosteller || null,
        certifications: formData.certifications || null,
        clubs_Chapters: formData.clubs_Chapters || null,
        achievements: formData.achievements || null,
        educationGap: formData.educationGap ? parseInt(formData.educationGap, 10) : 0
      };

      // Ensure your api.js has updateAdditionalInfo using the PUT route
      await api.updateAdditionalInfo(studentId, payload);
      
      toast.success("Additional details updated!");
      setIsEditing(false);
      onUpdate(); // Refreshes profile state in StudentProfile.jsx
    } catch (error) {
      console.error('Update Error:', error);
      toast.error(error.response?.data?.message || "Check your input formats");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all shadow-md active:scale-95"
          >
            <Edit className="w-4 h-4" /> Edit Details
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" /> Citizenship & Origin
          </h3>
          <InputField label="Nationality" field="nationality" value={formData.nationality} />
          <InputField label="Citizenship" field="citizenship" value={formData.citizenship} />
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Home className="w-5 h-5 text-emerald-600" /> Residential Status
          </h3>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
            {isEditing ? (
              <select
                value={formData.dayscholarHosteller || ''}
                onChange={(e) => handleChange('dayscholarHosteller', e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
              >
                <option value="">Select Option</option>
                <option value="Dayscholar">Dayscholar</option>
                <option value="Hosteller">Hosteller</option>
              </select>
            ) : (
              <p className="text-slate-700 font-medium">{formData.dayscholarHosteller || 'Not Selected'}</p>
            )}
          </div>
        </div>

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <InputField label="Certifications" field="certifications" value={formData.certifications} />
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <InputField label="Clubs & Chapters" field="clubs_Chapters" value={formData.clubs_Chapters} />
          </div>
        </div>

        <div className="md:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Achievements" field="achievements" value={formData.achievements} />
          <InputField label="Education Gap (Years)" field="educationGap" type="number" value={formData.educationGap} />
        </div>
      </div>

      {isEditing && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-3 p-4 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 animate-in slide-in-from-bottom-4">
          <button onClick={handleCancel} className="px-6 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : <><Save size={18} /> Save Changes</>}
          </button>
        </div>
      )}
    </div>
  );
};