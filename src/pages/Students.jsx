import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiSearch, FiMail, FiBookOpen, FiClock, FiUser, FiHash } from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [courseId, setCourseId] = useState("");

  const fetchStudents = (url = "https://localhost:7157/api/coordinator/details") => {
    axios
      .get(url)
      .then((res) => setStudents(res.data))
      .catch((err) => console.error("Error fetching students:", err));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleCourseChange = (e) => {
    const selectedCourseId = e.target.value.trim();
    setCourseId(selectedCourseId);

    if (!selectedCourseId) {
      fetchStudents();
    } else {
      fetchStudents(`https://localhost:7157/api/coordinator/details/${selectedCourseId}`);
    }
  };

  return (
    <div className="student-directory-page pb-5" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <div className="container py-5">
        
        {/* --- HEADER SECTION --- */}
        <div className="row mb-5 align-items-center">
          <div className="col-md-6">
            <h1 className="display-6 fw-bold text-dark mb-1">Student Enrollment</h1>
            <p className="text-muted">Monitor academic records and batch distributions</p>
          </div>
          
          {/* --- SEARCH / FILTER BAR --- */}
          <div className="col-md-6">
            <div className="search-container position-relative">
              <FiSearch className="position-absolute top-50 translate-middle-y ms-3 text-primary" size={20} />
              <input
                type="text"
                className="form-control form-control-lg border-0 shadow-sm ps-5 rounded-pill"
                placeholder="Search by Course ID (e.g. C001)..."
                value={courseId}
                onChange={handleCourseChange}
                style={{ fontSize: "1rem" }}
              />
            </div>
          </div>
        </div>

        {/* --- STATS SUMMARY --- */}
        <div className="row g-4 mb-5">
            <div className="col-md-4">
                <div className="card border-0 shadow-sm rounded-4 p-3 d-flex flex-row align-items-center gap-3">
                    <div className="bg-primary-subtle p-3 rounded-3 text-primary"><FiUser size={24}/></div>
                    <div>
                        <h4 className="fw-bold mb-0">{students.length}</h4>
                        <small className="text-muted text-uppercase fw-bold" style={{fontSize: '0.7rem'}}>Total Students</small>
                    </div>
                </div>
            </div>
        </div>

        {/* --- STUDENT LISTING --- */}
        <div className="row g-4 animate-fade-in">
          {students.length === 0 ? (
            <div className="col-12 text-center py-5">
              <div className="mb-3 opacity-25">
                <FiBookOpen size={60} />
              </div>
              <h4 className="text-muted">No students matched your filter</h4>
              <p className="text-light-emphasis small">Try a different Course ID or clear the search.</p>
            </div>
          ) : (
            students.map((stu) => (
              <div className="col-xl-4 col-md-6" key={stu.studentId}>
                <div className="student-card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                  <div className="p-4">
                    {/* Header: Name & ID */}
                    <div className="d-flex justify-content-between align-items-start mb-4">
                      <div className="d-flex align-items-center gap-3">
                        <div className="avatar-placeholder rounded-circle bg-dark text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: "45px", height: "45px" }}>
                          {stu.studentName.charAt(0)}
                        </div>
                        <div>
                          <h6 className="fw-bold text-dark mb-0">{stu.studentName}</h6>
                          <small className="text-muted d-flex align-items-center gap-1">
                            <FiHash size={12}/> {stu.studentId}
                          </small>
                        </div>
                      </div>
                      <span className={`badge rounded-pill px-3 py-2 ${stu.batchName && stu.batchName !== "Unassigned" ? 'bg-success-subtle text-success' : 'bg-light text-muted border'}`}>
                        {stu.batchName && stu.batchName !== "Unassigned" ? 'Assigned' : 'Unassigned'}
                      </span>
                    </div>

                    {/* Details Body */}
                    <div className="student-info-grid">
                      <div className="d-flex align-items-center gap-3 mb-3 p-2 rounded-3 bg-light bg-opacity-50">
                        <FiMail className="text-primary" />
                        <span className="small text-dark text-truncate">{stu.studentEmail}</span>
                      </div>
                      
                      <div className="row g-2">
                        <div className="col-6">
                            <div className="p-2 border rounded-3 h-100">
                                <small className="d-block text-muted mb-1 fw-bold" style={{fontSize: '0.65rem'}}>COURSE</small>
                                <span className="small fw-bold text-primary text-truncate d-block">{stu.courseId || "N/A"}</span>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="p-2 border rounded-3 h-100">
                                <small className="d-block text-muted mb-1 fw-bold" style={{fontSize: '0.65rem'}}>BATCH</small>
                                <span className="small fw-bold text-dark text-truncate d-block">{stu.batchName || "N/A"}</span>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer bg-transparent border-0 p-4 pt-0 text-end">
                    <button className="btn btn-sm text-primary p-0 fw-bold border-0 bg-transparent" style={{fontSize: '0.8rem'}}>View Full Record →</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- INLINE STYLES --- */}
      <style>{`
        .student-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid #f1f3f5 !important;
        }
        .student-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02) !important;
          border-color: #dee2e6 !important;
        }
        .bg-primary-subtle {
          background-color: #eef2ff !important;
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .form-control:focus {
          box-shadow: 0 0 0 4px rgba(67, 97, 238, 0.1);
          border-color: #4361ee;
        }
      `}</style>
    </div>
  );
};

export default Students;