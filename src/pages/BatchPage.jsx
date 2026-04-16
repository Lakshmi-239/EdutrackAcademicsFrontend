import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiUsers, FiBookOpen, FiUser, FiArrowRight, FiActivity, FiSearch, FiFilter } from "react-icons/fi";

const BatchPage = () => {
  const navigate = useNavigate(); // Hook for navigation
  
  // --- State Management ---
  const [programs, setPrograms] = useState([]);
  const [years, setYears] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // --- API Logic (Unchanged) ---
  useEffect(() => {
    axios.get("https://localhost:7157/api/coordinator/programs").then(res => setPrograms(res.data || []));
  }, []);

  useEffect(() => {
    if (selectedProgram) {
      axios.get(`https://localhost:7157/api/coordinator/program/${selectedProgram.programId}/years`).then(res => setYears(res.data || []));
    }
  }, [selectedProgram]);

  useEffect(() => {
    if (selectedYear) {
      axios.get(`https://localhost:7157/api/coordinator/academic-year/${selectedYear.academicYearId}/courses`).then(res => setCourses(res.data || []));
    }
  }, [selectedYear]);

  useEffect(() => {
    if (selectedCourse) {
      axios.get(`https://localhost:7157/api/coordinator/course/${selectedCourse.courseId}/batches`).then(res => {
        setBatches(res.data || []);
        setStudents([]);
        setSelectedBatchId(null);
      });
    }
  }, [selectedCourse]);

  const handleBatchClick = (batchId) => {
    setSelectedBatchId(batchId);
    setLoadingStudents(true);
    axios.get(`https://localhost:7157/api/coordinator/batch/${batchId}/students`)
      .then((res) => {
        setStudents(res.data || []);
        setLoadingStudents(false);
      });
  };

  return (
    <div className="batch-mgmt-dark min-vh-100 py-4 px-lg-5">
      
      {/* --- HEADER --- */}
      <div className="d-flex justify-content-between align-items-end mb-5">
        <div>
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2" 
               style={{ background: "rgba(20, 184, 166, 0.1)", border: "1px solid rgba(20, 184, 166, 0.2)" }}>
            <FiActivity className="text-teal" />
            <span className="text-teal fw-bold small uppercase tracking-wider">Operations</span>
          </div>
          <h1 className="display-6 fw-bold text-white mb-1">Batch Management</h1>
          <p className="text-slate-400 mb-0">Monitor student enrollment and instructor assignments</p>
        </div>
        <div className="avatar-pill">AD</div>
      </div>

      {/* --- FLOATING FILTER BAR --- */}
      <div className="filter-bar-dark mb-5 shadow-lg">
        <div className="row align-items-center g-0">
          <div className="col-md-4 px-4 py-2 border-end border-slate-800">
            <label className="filter-label"><FiSearch className="me-1"/> Program</label>
            <select className="filter-select" 
              onChange={(e) => setSelectedProgram(programs.find(p => p.programId === e.target.value))}>
              <option value="">Choose Program...</option>
              {programs.map(p => <option key={p.programId} value={p.programId}>{p.programName}</option>)}
            </select>
          </div>
          <div className="col-md-4 px-4 py-2 border-end border-slate-800">
            <label className="filter-label"><FiFilter className="me-1"/> Cycle</label>
            <select className="filter-select" disabled={!selectedProgram}
              onChange={(e) => setSelectedYear(years.find(y => y.academicYearId === e.target.value))}>
              <option value="">Academic Year...</option>
              {years.map(y => <option key={y.academicYearId} value={y.academicYearId}>{y.display}</option>)}
            </select>
          </div>
          <div className="col-md-4 px-4 py-2">
            <label className="filter-label"><FiBookOpen className="me-1"/> Module</label>
            <select className="filter-select highlight" disabled={!selectedYear}
              onChange={(e) => setSelectedCourse(courses.find(c => c.courseId === e.target.value))}>
              <option value="">Choose Course...</option>
              {courses.map(c => <option key={c.courseId} value={c.courseId}>{c.courseName}</option>)}
            </select>
          </div>
        </div>
      </div>

      {selectedCourse && (
        <div className="row g-4 animate-fade-in">
          {/* --- BATCH TILES SIDEBAR --- */}
          <div className="col-lg-4">
            <h6 className="text-slate-500 fw-bold uppercase tracking-widest mb-4">
              <FiUsers className="me-2 text-teal"/> Available Batches ({batches.length})
            </h6>
            <div className="pe-2 custom-scrollbar" style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {batches.map((batch) => (
                <div 
                  key={batch.batchId} 
                  className={`batch-tile-dark ${selectedBatchId === batch.batchId ? "active" : ""}`}
                  onClick={() => handleBatchClick(batch.batchId)}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h5 className="fw-bold mb-1 text-white">{batch.batchName}</h5>
                      <div className="d-flex align-items-center mt-2">
                        <div className="instructor-mini-avatar me-2">
                          {batch.instructor?.charAt(0) || "G"}
                        </div>
                        <span className="text-slate-400 small">Instructor: <b className="text-slate-200">{batch.instructor || "Gowri"}</b></span>
                      </div>
                      <FiArrowRight className={`arrow-icon ${selectedBatchId === batch.batchId ? "active" : ""}`} />
                    </div>
                    <FiArrowRight className={`arrow-icon ${selectedBatchId === batch.batchId ? "active" : ""}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- STUDENT LIST MAIN VIEW --- */}
          <div className="col-lg-8">
            <div className="student-container-dark overflow-hidden">
              <div className="container-header d-flex justify-content-between align-items-center">
                <h5 className="fw-bold text-white mb-0">
                  {selectedBatchId ? `Enrolled Students (${students.length})` : "Student Roster"}
                </h5>
                {selectedBatchId && (
                  <span className="batch-id-pill">ID: {selectedBatchId}</span>
                )}
              </div>
              
              <div className="table-responsive">
                <table className="table table-dark-custom align-middle mb-0">
                  <thead>
                    <tr>
                      <th className="ps-4">Student Profile</th>
                      <th>Email Address</th>
                      <th className="text-end pe-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingStudents ? (
                      <tr><td colSpan="3" className="text-center py-5"><div className="spinner-teal"></div></td></tr>
                    ) : students.length > 0 ? (
                      students.map((stu) => (
                        <tr key={stu.studentId}>
                          <td className="ps-4 py-3">
                            <div className="d-flex align-items-center">
                              <div className="student-avatar-box">
                                {stu.studentName.charAt(0)}
                              </div>
                              <div>
                                <div className="fw-bold text-white mb-0">{stu.studentName}</div>
                                <div className="text-slate-500 small" style={{ fontSize: '11px' }}>{stu.studentId}</div>
                              </div>
                            </div>
                          </td>
                          <td className="text-slate-400">{stu.studentEmail}</td>
                          <td className="text-end pe-4">
                            <span className="status-pill-success">Verified</span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center py-5 text-slate-500">
                          <FiUsers size={40} className="mb-3 opacity-20" />
                          <p className="mb-0">Select a batch to load participants</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .batch-mgmt-dark { background-color: #020617; font-family: 'Inter', sans-serif; }
        .text-teal { color: #14b8a6 !important; }
        .text-slate-400 { color: #94a3b8 !important; }
        .text-slate-500 { color: #64748b !important; }

        .avatar-pill {
            width: 48px; height: 48px; background: #0f172a; color: #14b8a6;
            display: flex; align-items: center; justify-content: center;
            border-radius: 12px; font-weight: 800; border: 1px solid #1e293b;
        }

        /* Filter Bar */
        .filter-bar-dark {
          background: #0f172a; border-radius: 100px; 
          border: 1px solid #1e293b; overflow: hidden;
        }
        .filter-label { font-size: 10px; text-transform: uppercase; color: #475569; font-weight: 800; margin-bottom: 0; }
        .filter-select {
          background: transparent; border: none; color: white; font-weight: 600; font-size: 0.95rem;
          width: 100%; outline: none; cursor: pointer; padding: 0;
        }
        .filter-select.highlight { color: #14b8a6; }
        .filter-select option { background-color: #0f172a; color: white; }

        /* Batch Tiles */
        .batch-tile-dark {
          background: #0f172a; border-radius: 18px; padding: 20px;
          margin-bottom: 12px; border: 1px solid #1e293b; cursor: pointer;
          transition: all 0.3s;
        }
        .batch-tile-dark:hover { border-color: #334155; transform: translateX(5px); }
        .batch-tile-dark.active {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          border-color: #14b8a6; box-shadow: 0 10px 30px rgba(20, 184, 166, 0.1);
        }
        .instructor-mini-avatar {
          width: 24px; height: 24px; border-radius: 6px; background: rgba(20, 184, 166, 0.1);
          color: #14b8a6; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800;
        }
        .arrow-icon { color: #334155; font-size: 1.2rem; transition: 0.3s; }
        .arrow-icon.active { color: #14b8a6; transform: rotate(0deg); }

        /* Student List Table */
        .student-container-dark { background: #0f172a; border-radius: 24px; border: 1px solid #1e293b; }
        .container-header { padding: 25px; border-bottom: 1px solid #1e293b; }
        .batch-id-pill { background: rgba(20, 184, 166, 0.1); color: #14b8a6; padding: 4px 12px; border-radius: 6px; font-size: 11px; font-weight: 700; }
        
        .table-dark-custom thead th {
          background: rgba(255,255,255,0.02); color: #475569; 
          text-transform: uppercase; font-size: 11px; letter-spacing: 1px;
          padding: 15px; border-bottom: 1px solid #1e293b;
        }
        .table-dark-custom tbody td { border-bottom: 1px solid #1e293b; }
        .student-avatar-box {
          width: 38px; height: 38px; border-radius: 10px; background: #1e293b;
          color: #14b8a6; display: flex; align-items: center; justify-content: center;
          margin-right: 15px; font-weight: 700;
        }
        .status-pill-success { background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 4px 12px; border-radius: 50px; font-size: 11px; font-weight: 700; }

        /* Animation & Loader */
        .spinner-teal {
          width: 30px; height: 30px; border: 3px solid rgba(20, 184, 166, 0.1);
          border-top-color: #14b8a6; border-radius: 50%; animation: spin 0.8s linear infinite;
          margin: 0 auto;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default BatchPage;