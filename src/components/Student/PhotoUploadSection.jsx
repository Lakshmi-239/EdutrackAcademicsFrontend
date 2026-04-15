import React, { useState, useRef } from 'react';
// Consistent with your service architecture
import { api } from '../../services/Api'; 
import {
  Upload,
  Camera,
  Trash2,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';

export const PhotoUploadSection = ({ currentPhotoUrl, onUpdate }) => {
  const [preview, setPreview] = useState(currentPhotoUrl);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Invalid format. Please select an image (JPG, PNG, or GIF).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File is too heavy. Maximum size is 5MB.');
      return;
    }

    setError('');
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      setError('');
      const result = await api.uploadProfilePhoto(selectedFile);
      setPreview(result.url);
      setSelectedFile(null);
      onUpdate();
    } catch (err) {
      setError('The upload failed. Please verify your connection and try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview('');
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="border-b border-slate-200 pb-6">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Identity Image</h2>
        <p className="text-slate-500 mt-1">Your profile picture helps instructors and peers recognize you.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
            
            {/* Left Column: Interactive Avatar */}
            <div className="flex flex-col items-center">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative group w-64 h-64 rounded-2xl overflow-hidden cursor-pointer shadow-2xl border-4 border-white ring-1 ring-slate-200"
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Profile"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center text-slate-400">
                    <ImageIcon size={48} strokeWidth={1.5} />
                    <span className="text-xs font-bold mt-2 uppercase tracking-widest">No Image</span>
                  </div>
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-indigo-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white w-10 h-10" />
                </div>
              </div>

              {selectedFile && (
                <div className="mt-4 flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 animate-bounce">
                  <CheckCircle2 size={14} />
                  <span className="text-xs font-bold truncate max-w-[180px]">{selectedFile.name}</span>
                </div>
              )}
            </div>

            {/* Right Column: Controls & Guidelines */}
            <div className="flex-1 w-full space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck size={16} className="text-indigo-500" /> Upload Rules
                  </h3>
                  <ul className="space-y-2.5">
                    {[
                      'Professional headshot preferred',
                      'JPG, PNG or GIF formats',
                      'Maximum file size: 5MB',
                      'Best aspect ratio: 1:1 (Square)'
                    ].map((rule, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-500">
                        <div className="w-1 h-1 bg-indigo-400 rounded-full" />
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col justify-end space-y-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Upload size={18} />
                    Change Photo
                  </button>

                  {selectedFile && (
                    <button
                      onClick={handleUpload}
                      disabled={isUploading}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {isUploading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <CheckCircle2 size={18} />
                      )}
                      {isUploading ? 'Finalizing...' : 'Confirm Upload'}
                    </button>
                  )}

                  {preview && !selectedFile && (
                    <button
                      onClick={handleRemove}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-rose-600 font-bold hover:bg-rose-50 rounded-xl transition-colors"
                    >
                      <Trash2 size={18} />
                      Remove Current
                    </button>
                  )}
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-xl animate-in fade-in zoom-in-95">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <p className="text-sm font-medium text-rose-700">{error}</p>
                </div>
              )}

              {/* Privacy Footer */}
              <div className="p-4 bg-slate-50/80 border border-slate-100 rounded-xl flex gap-3">
                <div className="w-1 h-auto bg-indigo-500 rounded-full" />
                <p className="text-xs text-slate-500 leading-relaxed">
                  <strong className="text-slate-700">Privacy Transparency:</strong> Your image is stored securely and only visible to registered instructors and platform coordinators within the EduTrack ecosystem.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};