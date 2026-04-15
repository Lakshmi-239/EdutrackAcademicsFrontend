import React, { useState, useEffect } from "react";
import axios from "axios";

// Add this CSS to your App.css or a <style> tag in your component
const customStyles = `
  .glass-card {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
  .batch-card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid transparent !important;
  }
  .batch-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
  }
  .batch-active {
    background: linear-gradient(135deg, #0d6efd 0%, #003db3 100%) !important;
    color: white !important;
    border: none !important;
  }
  .student-row {
    transition: background 0.2s ease;
  }
  .student-row:hover {
    background-color: #f8f9fa !important;
  }
  .avatar-circle {
    width: 40px;
    height: 40px;
    background: #e9ecef;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-weight: bold;
    color: #495057;
  }
`;

const BatchPage = () => {
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

  // APIs (keeping your working logic)
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
    <div className="container-fluid min-vh-100 py-4 px-lg-5" style={{ backgroundColor: "#f0f2f5" }}>
      <style>{customStyles}</style>
      
      {/* 🚀 Dynamic Header */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1 className="display-6 fw-bold text-dark mb-1">Academy Portal</h1>
          <p className="text-secondary fw-medium">Manage batch flows and student distributions</p>
        </div>
        <div className="avatar-circle shadow-sm" style={{ width: '50px', height: '50px' }}>AD</div>
      </div>

      {/* 🔍 Unique Floating Filter Bar */}
      <div className="glass-card shadow-sm p-3 mb-5 rounded-pill px-4">
        <div className="row align-items-center">
          <div className="col-md-4 border-end border-light">
            <select className="form-select border-0 bg-transparent fw-bold" 
              onChange={(e) => setSelectedProgram(programs.find(p => p.programId === e.target.value))}>
              <option value="">Select Program</option>
              {programs.map(p => <option key={p.programId} value={p.programId}>{p.programName}</option>)}
            </select>
          </div>
          <div className="col-md-4 border-end border-light">
            <select className="form-select border-0 bg-transparent fw-bold" disabled={!selectedProgram}
              onChange={(e) => setSelectedYear(years.find(y => y.academicYearId === e.target.value))}>
              <option value="">Academic Year</option>
              {years.map(y => <option key={y.academicYearId} value={y.academicYearId}>{y.display}</option>)}
            </select>
          </div>
          <div className="col-md-4">
            <select className="form-select border-0 bg-transparent fw-bold text-primary" disabled={!selectedYear}
              onChange={(e) => setSelectedCourse(courses.find(c => c.courseId === e.target.value))}>
              <option value="">Choose Course</option>
              {courses.map(c => <option key={c.courseId} value={c.courseId}>{c.courseName}</option>)}
            </select>
          </div>
        </div>
      </div>

      {selectedCourse && (
        <div className="row g-4">
          {/* 📦 Sidebar: Batches as Interactive Tiles */}
          <div className="col-lg-4">
            <h5 className="fw-bold mb-4 text-dark d-flex align-items-center">
              <span className="badge bg-dark me-2">{batches.length}</span> Available Batches
            </h5>
            <div className="pe-2" style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {batches.map((batch) => (
                <div 
                  key={batch.batchId} 
                  className={`card batch-card mb-3 shadow-sm rounded-4 ${selectedBatchId === batch.batchId ? "batch-active" : "bg-white"}`}
                  onClick={() => handleBatchClick(batch.batchId)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between">
                      <h5 className="fw-bold mb-1">{batch.batchName}</h5>
                      <i className={`bi bi-box-arrow-in-right fs-4 ${selectedBatchId === batch.batchId ? "text-white" : "text-primary"}`}></i>
                    </div>
                    <div className="d-flex align-items-center mt-3">
                      <div className="avatar-circle me-2" style={{ width: '30px', height: '30px', fontSize: '12px' }}>
                        {batch.instructor?.charAt(0) || "G"}
                      </div>
                      <small className="opacity-75">Instructor: {batch.instructor || "Gowri"}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 👥 Main View: Students as Clean Table/List */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-header bg-white p-4 border-0 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0">
                  {selectedBatchId ? `Enrolled Students (${students.length})` : "Course Overview"}
                </h5>
                {selectedBatchId && <span className="badge bg-soft-success text-success rounded-pill px-3 py-2">Batch: {selectedBatchId}</span>}
              </div>
              
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="bg-light text-muted small text-uppercase">
                    <tr>
                      <th className="ps-4 py-3 border-0">Student Profile</th>
                      <th className="py-3 border-0">Email Address</th>
                      <th className="py-3 border-0 text-end pe-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingStudents ? (
                      <tr><td colSpan="3" className="text-center py-5"><div className="spinner-border text-primary border-3"></div></td></tr>
                    ) : students.length > 0 ? (
                      students.map((stu) => (
                        <tr key={stu.studentId} className="student-row">
                          <td className="ps-4 py-3">
                            <div className="d-flex align-items-center">
                              <div className="avatar-circle me-3 bg-soft-primary text-primary fw-bold">
                                {stu.studentName.charAt(0)}
                              </div>
                              <div>
                                <div className="fw-bold text-dark">{stu.studentName}</div>
                                <div className="text-muted small">{stu.studentId}</div>
                              </div>
                            </div>
                          </td>
                          <td className="text-secondary">{stu.studentEmail}</td>
                          <td className="text-end pe-4">
                            <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3">Enrolled</span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center py-5">
                          <div className="opacity-25 mb-3">
                             <i className="bi bi-people fs-1"></i>
                          </div>
                          <p className="text-muted fw-medium">
                            {selectedBatchId ? "No students assigned to this batch yet." : "Select a batch from the left to view participants."}
                          </p>
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
    </div>
  );
};

export default BatchPage;