import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2, Users, Info } from 'lucide-react';
import { api } from '../../services/Api';

export default function MarkAttendanceModal({ isOpen, onClose, onRefresh }) {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [mode, setMode] = useState('Online');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const instructorId = "I001"; // Hardcoded as per your current setup

  // Fetch batches only when modal is open
  useEffect(() => {
    if (isOpen) {
      api.getInstructorBatches(instructorId)
        .then(res => setBatches(res.data || []))
        .catch(err => console.error("Batch load error:", err));
    }
  }, [isOpen]);

  // Fetch students when batch is selected
  useEffect(() => {
    if (!selectedBatch) {
      setStudents([]);
      return;
    }
    const loadStudents = async () => {
      try {
        setLoading(true);
        const res = await api.getStudentsForAttendance(selectedBatch);
        // Map to internal state with default 'Present' status
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
      sessionDate: sessionDate, // Already formatted as YYYY-MM-DD
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
      onRefresh(); // Refresh parent list
      onClose();
    } catch (err) {
      alert(err.response?.data || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)', zIndex: 1050 }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
          
          <div className="modal-header border-0 p-4 text-white" style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }}>
            <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
              <Users size={24} /> Mark Batch Attendance
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body p-4 bg-light">
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <label className="small fw-bold text-secondary mb-1">Batch Name</label>
                <select className="form-select border-0 shadow-sm" value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)}>
                  <option value="">Select Batch...</option>
                  {batches.map(b => (
                    <option key={b.batchId} value={b.batchId} disabled={!b.isActive}>
                      {b.batchId} - {b.courseName} {!b.isActive ? '(Inactive)' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label className="small fw-bold text-secondary mb-1">Date</label>
                <input type="date" className="form-control border-0 shadow-sm" value={sessionDate} onChange={(e) => setSessionDate(e.target.value)} />
              </div>
              <div className="col-md-4">
                <label className="small fw-bold text-secondary mb-1">Mode</label>
                <select className="form-select border-0 shadow-sm" value={mode} onChange={(e) => setMode(e.target.value)}>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>
            </div>

            {mode === 'Offline' && (
              <div className="alert alert-warning border-0 shadow-sm d-flex align-items-center gap-2 rounded-3">
                <Info size={18} /> <span>Offline mode is currently unavailable.</span>
              </div>
            )}

            <div className="bg-white rounded-4 shadow-sm border overflow-hidden">
              <table className="table table-borderless align-middle mb-0">
                <thead className="bg-white border-bottom">
                  <tr>
                    <th className="ps-4 py-3 text-secondary small fw-bold">STUDENT INFO</th>
                    <th className="py-3 text-secondary small fw-bold text-center">ENROLLMENT ID</th>
                    <th className="pe-4 py-3 text-secondary small fw-bold text-end">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="3" className="text-center py-5"><Loader2 className="spinner text-success" /></td></tr>
                  ) : students.map((s) => (
                    <tr key={s.enrollmentId} className="border-bottom border-light">
                      <td className="ps-4 py-3">
                        <div className="d-flex align-items-center gap-3">
                          <div className="bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '38px', height: '38px' }}>
                            {s.studentName.charAt(0)}
                          </div>
                          <div className="fw-bold text-dark">{s.studentName}</div>
                        </div>
                      </td>
                      <td className="text-center text-muted small">{s.enrollmentId}</td>
                      <td className="pe-4 text-end">
                        <button 
                          disabled={mode === 'Offline'}
                          onClick={() => toggleStatus(s.enrollmentId)}
                          className={`btn btn-sm rounded-pill px-3 py-1 fw-bold d-inline-flex align-items-center gap-2 ${
                            s.status === 'Present' ? 'btn-success shadow-sm' : 'btn-outline-danger'
                          }`}
                        >
                          {s.status === 'Present' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                          <span>{s.status}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="modal-footer border-0 p-4 bg-light">
            <button className="btn btn-link text-decoration-none text-secondary" onClick={onClose}>Cancel</button>
            <button 
              className="btn btn-success px-5 py-2 rounded-pill fw-bold shadow" 
              disabled={submitting || students.length === 0 || mode === 'Offline'}
              onClick={handleSubmit}
            >
              {submitting ? 'Syncing...' : 'Sync Attendance'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}