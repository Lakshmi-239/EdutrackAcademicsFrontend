import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2, Users, Info, X, Calendar, Globe, Save } from 'lucide-react';
import { api } from '../../services/Api';

export default function MarkAttendanceModal({ isOpen, onClose, onRefresh }) {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [mode, setMode] = useState('Online');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const instructorId = localStorage.getItem("instructorId");

  useEffect(() => {
    if (!isOpen || !instructorId) return;

    api.getInstructorBatches(instructorId)
      .then(data => {
        console.log("Instructor batches:", data);

        if (Array.isArray(data)) {
          setBatches(data);
        } else {
          setBatches([]);
        }
      })
      .catch(err => {
        console.error("Batch load error:", err);
        setBatches([]);
      });
  }, [isOpen, instructorId]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    <div className="modal-overlay">
      <div className="modal-container animate-slide-up flex flex-column" style={{ maxHeight: '85vh', maxWidth: '750px' }}>

        {/* Fixed Enterprise Header */}
        <div className="modal-header-enterprise shrink-0">
          <div className="d-flex align-items-center gap-3">
            <div className="header-icon-wrapper">
              <Users size={22} className="text-teal-400" />
            </div>
            <div>
              <h5 className="mb-0 fw-bold text-white tracking-tight">Mark Attendance</h5>
              <p className="text-slate-400 mb-0 extra-small uppercase tracking-widest">EduTrack Academics • Session Management</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-close-enterprise"><X size={20} /></button>
        </div>

        {/* Scrollable Body Container */}
        <div className="overflow-y-auto p-4 bg-slate-900 custom-scrollbar" style={{ flex: 1 }}>
          <div className="row g-3 mb-4">
            {/* Batch Selection */}
            <div className="col-md-5">
              <label className="form-label-enterprise">Target Batch</label>
              <div className="input-group-enterprise">
                <span className="input-icon"><Users size={18} /></span>
                <select
                  className="form-control-enterprise"
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                >
                  <option value="" className="bg-slate-800">Choose batch...</option>
                  {Array.isArray(batches) && batches.length > 0 ? (
                    batches.map(b => (
                      <option
                        key={b.batchId}
                        value={b.batchId}
                        disabled={b.isActive === false}
                        className="bg-slate-800"
                      >
                        {b.batchId} – {b.courseName}
                      </option>
                    ))
                  ) : (
                    <option disabled className="bg-slate-800">
                      No batches available
                    </option>
                  )}
                </select>
              </div>
            </div>

            {/* Date Picker */}
            <div className="col-md-4">
              <label className="form-label-enterprise">Session Date</label>
              <div className="input-group-enterprise">
                <span className="input-icon"><Calendar size={18} /></span>
                <input
                  type="date"
                  className="form-control-enterprise"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                />
              </div>
            </div>

            {/* Mode Selection */}
            <div className="col-md-3">
              <label className="form-label-enterprise">Mode</label>
              <div className="input-group-enterprise">
                <span className="input-icon"><Globe size={18} /></span>
                <select
                  className="form-control-enterprise"
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                >
                  <option value="Online" className="bg-slate-800">Online</option>
                  <option value="Offline" className="bg-slate-800">Offline</option>
                </select>
              </div>
            </div>
          </div>

          {mode === 'Offline' && (
            <div className="mb-4 d-flex align-items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
              <Info size={18} />
              <span className="extra-small uppercase tracking-wider">Offline synchronization is currently disabled.</span>
            </div>
          )}

          {/* Table Container */}
          <div className="bg-slate-950/40 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 form-label-enterprise mb-0 border-0">Student Info</th>
                  <th className="px-4 py-3 form-label-enterprise mb-0 border-0 text-center">ID</th>
                  <th className="px-4 py-3 form-label-enterprise mb-0 border-0 text-end">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan="3" className="py-12 text-center">
                      <Loader2 className="animate-spin text-teal-400 mx-auto" size={32} />
                    </td>
                  </tr>
                ) : students.map((s) => (
                  <tr key={s.enrollmentId} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="w-9 h-9 bg-teal-500/10 text-teal-400 rounded-full d-flex align-items-center justify-center font-bold border border-teal-500/20">
                          {s.studentName.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-200 small">{s.studentName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-slate-500 font-mono small">{s.enrollmentId}</td>
                    <td className="px-4 py-3 text-end">
                      <button
                        disabled={mode === 'Offline'}
                        onClick={() => toggleStatus(s.enrollmentId)}
                        className={`btn-attendance-toggle ${s.status === 'Present' ? 'present' : 'absent'}`}
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

        {/* Fixed Footer */}
        <div className="modal-footer-enterprise p-4 bg-slate-900 border-top border-slate-800 shrink-0">
          <div className="d-flex gap-3">
            <button type="button" onClick={onClose} className="btn-enterprise-secondary">
              Discard
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || students.length === 0 || mode === 'Offline'}
              className="btn-enterprise-primary"
            >
              {submitting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <Save size={18} />
                  <span>Sync Attendance</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(7, 10, 25, 0.85); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center; z-index: 2000;
          padding: 20px;
        }
        .modal-container {
          background: #0f172a; width: 100%;
          border-radius: 24px; border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
          overflow: hidden;
        }
        .modal-header-enterprise {
          background: #0f172a; padding: 1.5rem 2rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          display: flex; justify-content: space-between; align-items: center;
        }
        .header-icon-wrapper {
          background: rgba(20, 184, 166, 0.1); padding: 10px; border-radius: 12px;
          border: 1px solid rgba(20, 184, 166, 0.2);
        }
        .form-label-enterprise {
          color: #94a3b8; font-size: 11px; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;
        }
        .input-group-enterprise { position: relative; display: flex; align-items: center; }
        .input-icon { position: absolute; left: 16px; color: #5eead4; z-index: 5; opacity: 0.8; }
        .form-control-enterprise {
          background: #1e293b !important; border: 1px solid #334155 !important;
          color: #f8fafc !important; padding: 10px 16px 10px 48px !important;
          border-radius: 12px !important; width: 100%; font-size: 14px;
        }
        .form-control-enterprise:focus { border-color: #14b8a6 !important; outline: none; }
        
        .btn-attendance-toggle {
          display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px;
          border-radius: 20px; font-weight: 700; font-size: 11px; text-transform: uppercase;
          transition: 0.2s; border: 1px solid transparent;
        }
        .btn-attendance-toggle.present { 
          background: rgba(16, 185, 129, 0.1); color: #34d399; border-color: rgba(16, 185, 129, 0.3); 
        }
        .btn-attendance-toggle.absent { 
          background: rgba(30, 41, 59, 0.5); color: #64748b; border-color: #334155; 
        }

        .btn-enterprise-primary {
          background: #14b8a6; color: #0f172a; border: none; padding: 12px 24px;
          border-radius: 14px; font-weight: 700; display: flex; align-items: center; gap: 8px; flex-grow: 2;
          justify-content: center;
        }
        .btn-enterprise-secondary {
          background: transparent; color: #94a3b8; border: 1px solid #334155;
          padding: 12px 24px; border-radius: 14px; font-weight: 600; flex-grow: 1;
        }
        .btn-close-enterprise {
          background: rgba(255,255,255,0.05); border: none; color: #64748b;
          width: 36px; height: 36px; border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .animate-slide-up { animation: slideUp 0.3s ease-out; }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}