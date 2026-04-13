import React, { useEffect, useState } from 'react';
import { api } from '../../services/Api';
import { CheckCircle, XCircle, X, Edit2, Save, Loader2, Fingerprint, User, CreditCard, Hash } from 'lucide-react';

// Ensure 'onUpdate' is included in the props here:
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

  const handleUpdateStatus = async (attendanceId) => {
    const newStatus = tempStatuses[attendanceId];
    try {
      setUpdating(true);
      
      // 1. Call the backend API
      await api.updateStudentStatus(attendanceId, newStatus);

      // 2. Update the local state instantly in the modal table
      setDetails(prevDetails => 
        prevDetails.map(item => 
          item.attendanceId === attendanceId 
            ? { ...item, status: newStatus } 
            : item
        )
      );

      // 3. Close the editing mode for this row
      setEditingId(null);

      // 4. Update the parent page counts (background refresh)
      if (onUpdate) {
        onUpdate();
      }

    } catch (err) {
      alert(err.response?.data || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 1060 }}>
      {/* ... rest of your modal JSX remains exactly the same ... */}
      <div className="modal-dialog modal-xl modal-dialog-centered">
        <div className="modal-content border-0 rounded-4 shadow-lg">
          <div className="modal-header border-0 bg-white p-4">
            <div>
              <h5 className="fw-bold mb-0">Attendance Detailed Logs: {batchId}</h5>
              <p className="text-muted small mb-0">Session Date: {new Date(date).toLocaleDateString()}</p>
            </div>
            <button className="btn-close shadow-none" onClick={onClose}></button>
          </div>
          <div className="modal-body p-0" style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {loading ? (
              <div className="p-5 text-center"><Loader2 className="spinner text-success" /></div>
            ) : (
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light sticky-top">
                  <tr className="small text-uppercase text-muted">
                    <th className="ps-4 py-3">Student Name</th>
                    <th className="py-3 text-center">Student ID</th>
                    <th className="py-3 text-center">Enrollment ID</th>
                    <th className="py-3 text-center">Attendance ID</th>
                    <th className="text-end pe-4 py-3">Status / Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {details.map((s) => {
                    const isEditing = editingId === s.attendanceId;
                    const currentStatusValue = tempStatuses[s.attendanceId] || s.status;
                    return (
                      <tr key={s.attendanceId}>
                        <td className="ps-4 py-3">
                          <div className="d-flex align-items-center gap-2">
                            <User size={16} className="text-primary" />
                            <span className="fw-bold text-dark">{s.studentName}</span>
                          </div>
                        </td>
                        <td className="text-center small text-muted">{s.studentId}</td>
                        <td className="text-center small text-muted">{s.enrollmentID}</td>
                        <td className="text-center"><span className="badge bg-light text-dark border">{s.attendanceId}</span></td>
                        <td className="text-end pe-4 py-3">
                          <div className="d-flex align-items-center justify-content-end gap-2">
                            {isEditing ? (
                              <>
                                <select 
                                  className="form-select form-select-sm" 
                                  value={currentStatusValue}
                                  onChange={(e) => setTempStatuses({...tempStatuses, [s.attendanceId]: e.target.value})}
                                >
                                  <option value="Present">Present</option>
                                  <option value="Absent">Absent</option>
                                </select>
                                <button className="btn btn-sm btn-success" onClick={() => handleUpdateStatus(s.attendanceId)} disabled={updating}>
                                  {updating ? <Loader2 size={14} className="spinner" /> : <Save size={14}/>}
                                </button>
                                <button className="btn btn-sm btn-light border" onClick={() => setEditingId(null)}><X size={14}/></button>
                              </>
                            ) : (
                              <>
                                <span className={`badge rounded-pill px-3 py-2 ${s.status === 'Present' ? 'bg-success' : 'bg-danger'}`}>
                                  {s.status === 'Present' ? <CheckCircle size={14} /> : <XCircle size={14} />} {s.status}
                                </span>
                                <button className="btn btn-outline-primary btn-sm rounded-circle p-2" onClick={() => handleEditClick(s)}>
                                  <Edit2 size={14}/>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
          <div className="modal-footer border-0 p-3 bg-light rounded-bottom-4">
             <button className="btn btn-secondary px-4 rounded-pill fw-bold" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}