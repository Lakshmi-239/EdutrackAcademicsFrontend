import React, { useState, useEffect } from 'react';
// Added 'X' to the imports below to fix the ReferenceError
import { CheckCircle, XCircle, Loader2, Users, Info, X } from 'lucide-react';
import { api } from '../../services/Api';

export default function MarkAttendanceModal({ isOpen, onClose, onRefresh }) {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [mode, setMode] = useState('Online');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const instructorId = "I003"; 

  useEffect(() => {
    if (isOpen) {
      api.getInstructorBatches(instructorId)
        .then(res => setBatches(res.data || []))
        .catch(err => console.error("Batch load error:", err));
    }
  }, [isOpen]);

  useEffect(() => {
    if (!selectedBatch) {
      setStudents([]);
      return;
    }
    const loadStudents = async () => {
      try {
        setLoading(true);
        const res = await api.getStudentsForAttendance(selectedBatch);
        setStudents(res.data.map(s => ({
          enrollmentId: s.enrollmentId,
          studentName: s.studentName,
          status: 'Present'
        })));
      } catch (err) {
        alert(err.response?.data || "Could not load students for this batch");
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };
    loadStudents();
  }, [selectedBatch]);

  const toggleStatus = (id) => {
    setStudents(prev => prev.map(s => 
      s.enrollmentId === id ? { ...s, status: s.status === 'Present' ? 'Absent' : 'Present' } : s
    ));
  };

  const handleSubmit = async () => {
    if (!selectedBatch || students.length === 0 || mode === 'Offline') return;

    const payload = {
      batchId: selectedBatch,
      sessionDate: sessionDate,
      mode: mode,
      students: students.map(s => ({
        enrollmentId: s.enrollmentId,
        status: s.status
      }))
    };

    try {
      setSubmitting(true);
      const res = await api.markBatchAttendance(payload);
      alert(res.data);
      onRefresh(); 
      onClose();
    } catch (err) {
      alert(err.response?.data || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      {/* 1. Added 'max-h-[90vh]' to ensure the modal never leaves the screen.
          2. Added 'flex flex-col' so the header/footer stay put.
      */}
      <div className="w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        
        {/* Header - Stays at top */}
        <div className="flex-none px-6 py-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h5 className="text-xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-teal-500/10 rounded-lg">
              <Users className="w-6 h-6 text-teal-400" />
            </div>
            Mark Batch Attendance
          </h5>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body - This section will now scroll if content is too long */}
        <div className="flex-1 p-6 bg-slate-900 overflow-y-auto custom-scrollbar">
          {/* Controls Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs font-bold text-teal-400/80 uppercase tracking-wider mb-2">Batch Name</label>
              <select 
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 transition-all outline-none" 
                value={selectedBatch} 
                onChange={(e) => setSelectedBatch(e.target.value)}
              >
                <option value="" className="bg-slate-900">Select Batch...</option>
                {batches.map(b => (
                  <option key={b.batchId} value={b.batchId} disabled={!b.isActive} className="bg-slate-900">
                    {b.batchId} - {b.courseName} {!b.isActive ? '(Inactive)' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-teal-400/80 uppercase tracking-wider mb-2">Date</label>
              <input 
                type="date" 
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 outline-none" 
                value={sessionDate} 
                onChange={(e) => setSessionDate(e.target.value)} 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-teal-400/80 uppercase tracking-wider mb-2">Mode</label>
              <select 
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 outline-none" 
                value={mode} 
                onChange={(e) => setMode(e.target.value)}
              >
                <option value="Online" className="bg-slate-900">Online</option>
                <option value="Offline" className="bg-slate-900">Offline</option>
              </select>
            </div>
          </div>

          {mode === 'Offline' && (
            <div className="mb-6 flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
              <Info size={20} />
              <span className="text-sm font-medium">Offline mode is currently unavailable.</span>
            </div>
          )}

          {/* Table Container */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-800 border-b border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Student Info</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Enrollment ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan="3" className="py-12 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-teal-400 mx-auto" />
                    </td>
                  </tr>
                ) : students.map((s) => (
                  <tr key={s.enrollmentId} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-teal-500/20 text-teal-400 rounded-full flex items-center justify-center font-bold border border-teal-500/30">
                          {s.studentName.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-200">{s.studentName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-slate-500 font-mono text-sm">{s.enrollmentId}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        disabled={mode === 'Offline'}
                        onClick={() => toggleStatus(s.enrollmentId)}
                        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-bold text-xs transition-all duration-300 ${
                          s.status === 'Present' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:bg-emerald-500/20' 
                          : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30'
                        }`}
                      >
                        {s.status === 'Present' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                        {s.status}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer - Stays at bottom */}
        <div className="flex-none px-6 py-5 border-t border-slate-800 flex justify-end gap-4 bg-slate-900/50">
          <button 
            className="px-6 py-2 text-slate-400 hover:text-white font-medium transition-colors" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="px-8 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled={submitting || students.length === 0 || mode === 'Offline'}
            onClick={handleSubmit}
          >
            {submitting ? 'Syncing...' : 'Sync Attendance'}
          </button>
        </div>
      </div>
    </div>
  );
}