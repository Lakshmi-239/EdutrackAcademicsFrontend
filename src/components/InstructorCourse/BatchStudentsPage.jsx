import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/Api';
import StudentProfileModal from './StudentProfileModal';
import { 
  ChevronLeft, 
  Users, 
  Mail, 
  Phone, 
  Calendar, 
  Search,
  Loader2,
  ExternalLink,
  UserCheck
} from 'lucide-react';

const BatchStudentsPage = () => {
  const { id: batchId } = useParams();
  const navigate = useNavigate();
  
  // 1. ALL STATES AT THE TOP
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 2. FETCH DATA EFFECT
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await api.getStudentsByBatchId(batchId); 
        setStudents(response.data || []);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      } finally {
        setLoading(false);
      }
    };
    if (batchId) fetchStudents();
  }, [batchId]);

  // 3. LOGIC HANDLERS
  const handleOpenProfile = (id) => {
    setSelectedStudentId(id);
    setIsModalOpen(true);
  };

  const filteredStudents = students.filter(s => 
    s.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.studentId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 4. LOADING STATE
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="text-center">
          <Loader2 className="text-primary animate-spin mb-2" size={40} />
          <p className="text-muted fw-medium">Loading Enrollment List...</p>
        </div>
      </div>
    );
  }

  // 5. MAIN RENDER
  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      <div className="container">
        
        {/* Header with Search and Total Counter */}
        <div className="d-flex align-items-center justify-content-between mb-4 bg-white px-3 py-2 rounded-3 shadow-sm border">
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm" 
                    onClick={() => navigate(-1)} 
                    style={{ width: '40px', height: '40px' }}>
              <ChevronLeft size={20} />
            </button>
            <div className="d-flex flex-column align-items-start ms-2">
              <h5 className="fw-bold mb-0 text-dark">Batch Students</h5>
              <small className="text-muted fw-semibold" style={{ fontSize: '0.75rem' }}>
                Batch ID: <span className="text-primary">{batchId}</span>
              </small>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="position-relative d-none d-md-block" style={{ width: '250px' }}>
              <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" size={16} />
              <input 
                type="text" 
                className="form-control ps-5 rounded-pill border-light-subtle shadow-sm" 
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ fontSize: '0.85rem' }}
              />
            </div>

            <div className="badge rounded-pill bg-primary bg-opacity-10 text-primary px-3 py-2 fw-bold border border-primary border-opacity-25 d-flex align-items-center gap-2">
              <Users size={16} />
              <span>{filteredStudents.length} Enrolled</span>
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="row">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student, idx) => (
              <div key={student.studentId || idx} className="col-12 mb-3">
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                  <div className="row g-0 align-items-center">
                    
                    {/* Identity - studentName */}
                    <div className="col-md-4 p-4 bg-white border-end">
                      <div className="d-flex align-items-center gap-3">
                        <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" 
                             style={{ width: '50px', height: '50px', fontSize: '1.2rem' }}>
                          {student.studentName?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h6 className="fw-bold mb-0 text-dark">{student.studentName}</h6>
                          <span className="badge bg-light text-primary border rounded-pill px-2 mt-1" style={{fontSize: '0.7rem'}}>
                             ID: {student.studentId}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Details - studentEmail */}
                    <div className="col-md-5 p-4 bg-white">
                       <div className="d-flex align-items-center gap-2 text-muted mb-2">
                          <Mail size={14} className="text-primary" />
                          <span style={{ fontSize: '0.85rem' }}>{student.studentEmail}</span>
                       </div>
                       <div className="d-flex align-items-center gap-2 text-muted">
                          <Calendar size={14} className="text-primary" />
                          <span style={{ fontSize: '0.85rem' }}>Status: <span className="text-success fw-bold">Enrolled</span></span>
                       </div>
                    </div>

                    {/* Action Button */}
                    <div className="col-md-3 bg-light p-4 d-flex align-items-center justify-content-center">
                      <button 
                        className="btn btn-outline-dark btn-sm px-4 py-2 rounded-pill d-flex align-items-center gap-2 fw-bold shadow-sm"
                        onClick={() => handleOpenProfile(student.studentId)}
                      >
                        <ExternalLink size={14} /> Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="text-center py-5 bg-white rounded-4 shadow-sm border border-dashed d-flex flex-column align-items-center justify-content-center">
                <UserCheck size={48} className="text-muted mb-3 opacity-25" />
                <p className="text-muted mb-0 fw-medium">No students found in this batch.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 6. MODAL COMPONENT (Placed outside the container) */}
      <StudentProfileModal 
        studentId={selectedStudentId} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default BatchStudentsPage;