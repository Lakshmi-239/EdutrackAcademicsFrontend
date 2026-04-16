import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiSearch, FiMail, FiBookOpen, FiUser, FiHash, FiActivity, FiLayers, FiCheckCircle, FiSlash } from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [courseId, setCourseId] = useState("");

  // --- Working Logic (Unchanged) ---
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

  const handleViewRecord = (stu) => {
    console.log("Viewing record for:", stu.studentName);
    // Add your modal or navigation logic here
  };

  return (
    <div className="student-mgmt-dark min-vh-100 pb-5">
      <div className="container py-5">
        
        {/* --- HEADER SECTION --- */}
        <div className="row mb-5 align-items-end">
          <div className="col-md-7">
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3" 
                 style={{ background: "rgba(20, 184, 166, 0.1)", border: "1px solid rgba(20, 184, 166, 0.2)" }}>
              <FiActivity className="text-teal" />
              <span className="text-teal fw-bold small uppercase tracking-wider">Registrar Office</span>
            </div>
            <h1 className="display-6 fw-bold text-white mb-2">Student Directory</h1>
            <p className="text-slate-400 mb-0">Manage global student enrollments and batch mapping across modules.</p>
          </div>
          
          <div className="col-md-5 mt-4 mt-md-0">
            <div className="search-box-dark px-4 py-2">
              <FiSearch className="text-teal me-3" size={20} />
              <input
                type="text"
                className="form-control-dark"
                placeholder="Search by Course ID (e.g. C001)..."
                value={courseId}
                onChange={handleCourseChange}
              />
            </div>
          </div>
        </div>

        {/* --- QUICK STATS --- */}
        <div className="row g-4 mb-5">
          <div className="col-md-4 col-lg-3">
            <div className="stat-card-dark">
              <div className="stat-icon-box">
                <FiUser size={22}/>
              </div>
              <div>
                <h3 className="fw-bold text-white mb-0">{students.length}</h3>
                <span className="stat-label">Total Enrollment</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- STUDENT CARDS GRID --- */}
        <div className="row g-4 animate-fade-in">
          {students.map((stu) => {
            const isAssigned = stu.batchName && stu.batchName !== "Unassigned";
            
            return (
              <div className="col-xl-4 col-md-6" key={stu.studentId}>
                <div 
                  className="student-card-dark"
                  onClick={() => handleViewRecord(stu)} 
                >
                  <div className="p-4">
                    {/* Header: Name & Status */}
                    <div className="d-flex justify-content-between align-items-start mb-4">
                      <div className="d-flex align-items-center gap-3">
                        <div className="student-pfp">
                          {stu.studentName.charAt(0)}
                        </div>
                        <div>
                          <h6 className="fw-bold text-white mb-0">{stu.studentName}</h6>
                          <div className="text-slate-500 small d-flex align-items-center gap-1">
                            <FiHash size={12}/> {stu.studentId}
                          </div>
                        </div>
                      </div>
                      <span className={`status-pill ${isAssigned ? 'assigned' : 'unassigned'}`}>
                        {isAssigned ? <FiCheckCircle className="me-1"/> : <FiSlash className="me-1"/>}
                        {isAssigned ? 'Assigned' : 'Pending'}
                      </span>
                    </div>

                    {/* Contact Row */}
                    <div className="info-strip mb-4">
                      <FiMail className="text-teal me-2" size={14} />
                      <span className="text-slate-300 text-truncate">{stu.studentEmail}</span>
                    </div>
                    
                    {/* Course/Batch Grid */}
                    <div className="row g-2">
                      <div className="col-6">
                        <div className="meta-box">
                          <span className="meta-label">Module ID</span>
                          <span className="meta-value text-teal">{stu.courseId || "N/A"}</span>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="meta-box">
                          <span className="meta-label">Batch Code</span>
                          <span className="meta-value text-white">{stu.batchName || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .student-mgmt-dark { background-color: #020617; font-family: 'Inter', sans-serif; }
        .text-teal { color: #14b8a6 !important; }
        .text-slate-400 { color: #94a3b8 !important; }
        .text-slate-500 { color: #475569 !important; }

        /* Search Box */
        .search-box-dark {
          background: #0f172a; border-radius: 16px; border: 1px solid #1e293b;
          display: flex; align-items: center; transition: 0.3s;
        }
        .search-box-dark:focus-within { border-color: #14b8a6; box-shadow: 0 0 20px rgba(20, 184, 166, 0.1); }
        .form-control-dark {
          background: transparent; border: none; color: white; width: 100%; outline: none; padding: 10px 0;
        }

        /* Stat Card */
        .stat-card-dark {
          background: #0f172a; border-radius: 20px; border: 1px solid #1e293b;
          padding: 20px; display: flex; align-items: center; gap: 15px;
        }
        .stat-icon-box {
          width: 48px; height: 48px; background: rgba(20, 184, 166, 0.1);
          color: #14b8a6; border-radius: 12px; display: flex; align-items: center; justify-content: center;
        }
        .stat-label { font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; }

        /* Student Card */
        .student-card-dark {
          background: #0f172a; border-radius: 24px; border: 1px solid #1e293b;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer;
          position: relative; overflow: hidden;
        }
        .student-card-dark:hover {
          transform: translateY(-8px); border-color: #14b8a6;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }
        .student-pfp {
          width: 48px; height: 48px; border-radius: 14px; background: #1e293b;
          color: #14b8a6; display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 1.1rem; border: 1px solid #334155;
        }

        /* Status Pills */
        .status-pill {
          padding: 6px 14px; border-radius: 100px; font-size: 11px; font-weight: 700;
          display: flex; align-items: center;
        }
        .status-pill.assigned { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .status-pill.unassigned { background: rgba(244, 63, 94, 0.1); color: #f43f5e; }

        .info-strip {
          background: rgba(2, 6, 23, 0.5); border-radius: 12px; padding: 10px 15px;
          display: flex; align-items: center; font-size: 0.85rem;
        }

        .meta-box {
          background: #020617; border: 1px solid #1e293b; border-radius: 14px;
          padding: 12px; height: 100%; display: flex; flex-direction: column;
        }
        .meta-label { font-size: 9px; font-weight: 800; color: #475569; text-transform: uppercase; margin-bottom: 4px; }
        .meta-value { font-size: 0.85rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        /* Animations */
        .animate-fade-in { animation: fadeIn 0.6s ease-out; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Students;