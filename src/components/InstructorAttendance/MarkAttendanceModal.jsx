import React, { useState, useEffect } from 'react';
import { api } from '../../services/Api';
import { X, CheckCircle, XCircle, Send, Users } from 'lucide-react';

// Notice the "export default" here - this fixes your SyntaxError
export default function MarkAttendanceModal({ isOpen, onClose, onRefresh }) {
    const [batches, setBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [students, setStudents] = useState([]);
    const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
    const [mode, setMode] = useState('Offline');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) fetchBatches();
    }, [isOpen]);

    const fetchBatches = async () => {
        try {
            const res = await api.getBatches();
            setBatches(res.data);
        } catch (err) {
            console.error("Error loading batches", err);
        }
    };

    const handleBatchChange = async (batchId) => {
        setSelectedBatch(batchId);
        if (!batchId) {
            setStudents([]);
            return;
        }
        try {
            const res = await api.getEnrollmentsByBatch(batchId);
            const studentList = res.data.map(id => ({
                enrollmentID: id,
                status: 'Present'
            }));
            setStudents(studentList);
        } catch (err) {
            alert("Failed to load students for this batch");
        }
    };

    const toggleStatus = (id) => {
        setStudents(prev => prev.map(s => 
            s.enrollmentID === id 
            ? { ...s, status: s.status === 'Present' ? 'Absent' : 'Present' } 
            : s
        ));
    };

    const handleSubmit = async () => {
        if (!selectedBatch) return alert("Please select a batch");
        setIsSubmitting(true);
        try {
            const payload = {
                batchId: selectedBatch,
                sessionDate: sessionDate,
                mode: mode,
                students: students
            };
            await api.markBatchAttendance(payload);
            onRefresh(); // Refresh the grid behind the modal
            onClose();   // Close modal
        } catch (err) {
            alert(err.response?.data || "Error saving attendance");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop fade show" style={{ backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', inset: 0, zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="modal-dialog modal-lg w-100 shadow-lg border-0">
                <div className="modal-content border-0 rounded-4 overflow-hidden">
                    {/* Header */}
                    <div className="modal-header border-0 p-4" style={{ background: 'linear-gradient(135deg, #1d976c 0%, #93f9b9 100%)' }}>
                        <h5 className="modal-title fw-bold text-white d-flex align-items-center gap-2">
                            <Users size={24} /> Mark Batch Attendance
                        </h5>
                        <button type="button" className="btn-close btn-close-white shadow-none" onClick={onClose}></button>
                    </div>

                    <div className="modal-body p-4 bg-light">
                        {/* Controls */}
                        <div className="row g-3 mb-4 bg-white p-3 rounded-3 border shadow-sm mx-0">
                            <div className="col-md-4">
                                <label className="form-label small fw-bold text-muted">Batch ID</label>
                                <select className="form-select rounded-pill border-0 bg-light fw-semibold" value={selectedBatch} onChange={(e) => handleBatchChange(e.target.value)}>
                                    <option value="">Select Batch</option>
                                    {batches.map(b => <option key={b.batchId} value={b.batchId}>{b.batchId}</option>)}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small fw-bold text-muted">Session Date</label>
                                <input type="date" className="form-control rounded-pill border-0 bg-light fw-semibold" value={sessionDate} onChange={(e) => setSessionDate(e.target.value)} />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small fw-bold text-muted">Class Mode</label>
                                <select className="form-select rounded-pill border-0 bg-light fw-semibold" value={mode} onChange={(e) => setMode(e.target.value)}>
                                    <option value="Offline">Offline</option>
                                    <option value="Online">Online</option>
                                </select>
                            </div>
                        </div>

                        {/* Student List */}
                        <div className="bg-white rounded-3 border shadow-sm overflow-hidden" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            <table className="table table-hover mb-0">
                                <thead className="table-light sticky-top">
                                    <tr>
                                        <th className="px-4 py-3 border-0">Enrollment ID</th>
                                        <th className="px-4 py-3 border-0 text-end">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.length > 0 ? students.map(s => (
                                        <tr key={s.enrollmentID} className="align-middle">
                                            <td className="px-4 py-3 fw-medium">{s.enrollmentID}</td>
                                            <td className="px-4 py-3 text-end">
                                                <button 
                                                    onClick={() => toggleStatus(s.enrollmentID)}
                                                    className={`btn btn-sm rounded-pill px-3 d-inline-flex align-items-center gap-2 border-0 ${s.status === 'Present' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}
                                                >
                                                    {s.status === 'Present' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                                    {s.status}
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan="2" className="text-center py-5 text-muted">Select a batch to load students</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="modal-footer border-0 p-4 bg-white">
                        <button type="button" className="btn btn-light rounded-pill px-4" onClick={onClose}>Cancel</button>
                        <button 
                            type="button" 
                            className="btn btn-success rounded-pill px-4 d-flex align-items-center gap-2 shadow"
                            onClick={handleSubmit}
                            disabled={isSubmitting || students.length === 0}
                        >
                            <Send size={18} /> {isSubmitting ? 'Saving...' : 'Submit Attendance'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}