import React, { useEffect, useState } from 'react';
import { api } from '../../services/Api';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, X, Edit2, Save, Loader2, User, Fingerprint } from 'lucide-react';

export default function AttendanceDetailsModal({ batchId, date, isOpen, onClose, onUpdate }) {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [tempStatuses, setTempStatuses] = useState({});
  const [updating, setUpdating] = useState(false);

  const fetchDetails = async () => {
    if (isOpen && batchId && date) {
      try {
        setLoading(true);
        const res = await api.getAttendanceDetails(batchId, date);
        setDetails(res.data);
      } catch (err) {
        console.error("Failed to load attendance logs", err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [isOpen, batchId, date]);

  const handleEditClick = (student) => {
    setEditingId(student.attendanceId);
    setTempStatuses({
      ...tempStatuses,
      [student.attendanceId]: student.status
    });
  };

  const handleUpdateStatus = async (student) => {
    const newStatus = tempStatuses[student.attendanceId];
    if (!newStatus) return;

    // Create a loading toast
    const t = toast.loading(`Updating ${student.studentName}...`);

    try {
      setUpdating(true);
      await api.updateStudentStatus(student.attendanceId, student.enrollmentID, newStatus);

      setDetails(prev => prev.map(item =>
        item.attendanceId === student.attendanceId ? { ...item, status: newStatus } : item
      ));

      setEditingId(null);
      if (onUpdate) onUpdate();

      // Update the same toast to success
      toast.success("Status updated successfully", { id: t });
    } catch (err) {
      console.error(err);
      // Update the same toast to error
      toast.error(err.response?.data || "Failed to update status", { id: t });
    } finally {
      setUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1060] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      {/* Reduced max-w-6xl to max-w-4xl to remove empty right-side space */}
      <div className="w-full max-w-4xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-[1.5rem] shadow-2xl overflow-hidden flex flex-col transform animate-in zoom-in-95 duration-300">

        {/* HEADER */}
        <div className="flex-shrink-0 p-5 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-500/10 border border-teal-500/20 rounded-lg flex items-center justify-center text-teal-400">
              <Fingerprint size={20} />
            </div>
            <div>
              <h5 className="text-white font-black text-base mb-0">Logs: <span className="text-teal-400">{batchId}</span></h5>
              <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mb-0">Session: {new Date(date).toLocaleDateString()}</p>
            </div>
          </div>
          <button
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="p-16 text-center flex flex-col items-center">
              <Loader2 className="animate-spin text-teal-400 mb-3" size={32} />
              <span className="text-slate-500 font-bold tracking-widest text-[10px] uppercase">Syncing...</span>
            </div>
          ) : (
            details.length === 0 ? (
              <div className="p-20 text-center">
                <User className="mx-auto text-slate-700 mb-4 opacity-20" size={48} />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No attendance logs found for this session.</p>
              </div>
          ) : (
              <table className="w-full border-collapse" style={{ tableLayout: 'fixed' }}>
                <thead className="sticky top-0 z-20 shadow-sm">
                  <tr className="text-[10px] font-black uppercase tracking-wider text-teal-500/80 bg-slate-800">
                    <th className="ps-6 py-3 text-left" style={{ width: '30%' }}>Student Name</th>
                    <th className="py-3 text-center" style={{ width: '15%' }}>ID</th>
                    <th className="py-3 text-center" style={{ width: '15%' }}>Enroll</th>
                    <th className="py-3 text-center" style={{ width: '15%' }}>Log ID</th>
                    <th className="ps-4 py-3 text-left" style={{ width: '25%' }}>Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {details.map((s) => {
                    const isEditing = editingId === s.attendanceId;
                    const currentStatusValue = tempStatuses[s.attendanceId] || s.status;
                    return (
                      <tr key={s.attendanceId} className="group hover:bg-slate-800/40 transition-colors">
                        <td className="ps-6 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-teal-400">
                              <User size={12} />
                            </div>
                            <span className="font-bold text-slate-200 text-sm truncate">{s.studentName}</span>
                          </div>
                        </td>
                        <td className="text-center font-mono text-[11px] text-slate-500 uppercase">{s.studentId}</td>
                        <td className="text-center font-mono text-[11px] text-slate-500 uppercase">{s.enrollmentID}</td>
                        <td className="text-center">
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-500 font-mono text-[9px]">
                            {s.attendanceId}
                          </span>
                        </td>
                        <td className="ps-4 py-3 text-left">
                          <div className="flex items-center gap-2">
                            {isEditing ? (
                              <div className="flex items-center gap-2">
                                <select
                                  className="bg-slate-950 border border-slate-700 text-slate-200 text-[10px] font-bold rounded-md px-1 py-1 outline-none w-24"
                                  value={currentStatusValue}
                                  onChange={(e) => setTempStatuses({ ...tempStatuses, [s.attendanceId]: e.target.value })}
                                >
                                  <option value="Present">Present</option>
                                  <option value="Absent">Absent</option>
                                </select>
                                <button
                                  className="w-7 h-7 rounded bg-teal-500 text-slate-950 flex items-center justify-center hover:bg-teal-400"
                                  onClick={() => handleUpdateStatus(s)}
                                  disabled={updating}
                                >
                                  {updating ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center justify-center gap-1 min-w-[85px] px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter border ${s.status === 'Present'
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                  }`}>
                                  {s.status === 'Present' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                                  {s.status}
                                </span>
                                <button
                                  className="w-7 h-7 rounded bg-slate-800 border border-slate-700 text-slate-400 hover:text-teal-400 transition-all flex items-center justify-center"
                                  onClick={() => handleEditClick(s)}
                                >
                                  <Edit2 size={12} />
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )
            )}
        </div>

        {/* FOOTER */}
        <div className="flex-shrink-0 p-4 bg-slate-800/30 border-t border-slate-800 flex justify-end">
          <button
            className="px-6 py-2 bg-slate-800 hover:bg-white text-slate-300 hover:text-slate-950 font-black text-[10px] uppercase tracking-widest rounded-lg border border-slate-700 hover:border-white transition-all duration-300 shadow-lg"
            onClick={onClose}
          >
            Close Logs
          </button>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #0f172a; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #14b8a6; }
      `}</style>
    </div>
  );
}