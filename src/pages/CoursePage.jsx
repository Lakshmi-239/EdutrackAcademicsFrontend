import React, { useState, useEffect } from "react";
import CourseModal from "../components/Coordinator/CourseModal.jsx";
import axios from "axios";
import { FiPlus, FiBook, FiClock, FiAward, FiEdit3, FiTrash2, FiSearch, FiFilter } from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const CoursesPage = () => {
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    axios.get("https://localhost:7157/api/coordinator/programs")
      .then((res) => setPrograms(res.data))
      .catch((err) => console.error("Error fetching programs:", err));
  }, []);

  useEffect(() => {
    if (selectedProgram) {
      axios.get(`https://localhost:7157/api/coordinator/program/${selectedProgram.programId}/years`)
        .then((res) => setYears(res.data))
        .catch((err) => console.error("Error fetching years:", err));
    } else {
      setYears([]); setSelectedYear(null); setCourses([]);
    }
  }, [selectedProgram]);

  useEffect(() => {
    if (selectedYear) {
      axios.get(`https://localhost:7157/api/coordinator/academic-year/${selectedYear.academicYearId}/courses`)
        .then((res) => setCourses(res.data))
        .catch((err) => console.error("Error fetching courses:", err));
    } else {
      setCourses([]);
    }
  }, [selectedYear]);

  const handleSaveCourse = async (course) => {
    try {
      if (editingCourse) {
        setCourses(courses.map((c) => c.courseId === editingCourse.courseId ? { ...course, courseId: editingCourse.courseId } : c));
        setEditingCourse(null);
      } else {
        const payload = {
          programId: selectedProgram.programId,
          academicYearId: selectedYear.academicYearId,
          courseName: course.courseName,
          credits: course.credits,
          durationInWeeks: course.durationInWeeks,
        };
        const res = await axios.post("https://localhost:7157/api/coordinator/course", payload);
        setCourses([...courses, res.data]);
      }
    } catch (err) { console.error("Error saving course:", err); }
  };

  const handleDelete = (id) => {
    setCourses(courses.filter((c) => c.courseId !== id));
  };

  return (
    <div className="course-mgmt-page pb-5">
      <div className="container py-5">
        {/* HEADER SECTION */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h1 className="display-6 fw-bold text-dark">Module Repository</h1>
            <p className="text-muted mb-0">Manage course structures and credit distributions</p>
          </div>
          {selectedYear && (
            <button 
              className="btn btn-primary px-4 py-2 rounded-pill shadow-sm d-flex align-items-center gap-2"
              data-bs-toggle="modal" data-bs-target="#courseModal"
              onClick={() => setEditingCourse(null)}
            >
              <FiPlus /> Create New Course
            </button>
          )}
        </div>

        {/* SELECTION AREA */}
        <div className="row g-4 mb-5">
          <div className="col-md-6">
            <div className="selection-box p-4 bg-white rounded-4 shadow-sm">
              <label className="small text-uppercase fw-bold text-muted mb-2 d-block"><FiSearch className="me-1"/> Target Program</label>
              <select className="form-select border-0 fs-5 fw-semibold ps-0 bg-transparent cursor-pointer"
                value={selectedProgram ? selectedProgram.programId : ""}
                onChange={(e) => {
                  const program = programs.find((p) => p.programId === e.target.value);
                  setSelectedProgram(program || null);
                  setSelectedYear(null);
                }}
              >
                <option value="">Choose a Program...</option>
                {programs.map((p) => <option key={p.programId} value={p.programId}>{p.programName}</option>)}
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className={`selection-box p-4 rounded-4 shadow-sm transition-all ${!selectedProgram ? 'bg-light opacity-50' : 'bg-white'}`}>
              <label className="small text-uppercase fw-bold text-muted mb-2 d-block"><FiFilter className="me-1"/> Academic Cycle</label>
              <select className="form-select border-0 fs-5 fw-semibold ps-0 bg-transparent cursor-pointer"
                value={selectedYear ? selectedYear.academicYearId : ""}
                disabled={!selectedProgram}
                onChange={(e) => {
                  const year = years.find((y) => y.academicYearId === e.target.value);
                  setSelectedYear(year || null);
                }}
              >
                <option value="">Select Year...</option>
                {years.map((y) => <option key={y.academicYearId} value={y.academicYearId}>{y.display}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* CONTENT AREA */}
        {selectedYear ? (
          <div className="animate-fade-in">
            <div className="row g-4">
              {courses.length === 0 ? (
                <div className="col-12 text-center py-5 bg-white rounded-4 border-2 border-dashed">
                  <FiBook size={48} className="text-light mb-3" />
                  <h4 className="text-muted">No courses found for this cycle</h4>
                  <p className="text-light-emphasis">Get started by creating your first course module.</p>
                </div>
              ) : (
                courses.map((c) => (
                  <div className="col-xl-4 col-md-6" key={c.courseId}>
                    <div className="mgmt-card h-100 bg-white rounded-4 shadow-sm border-0 overflow-hidden">
                      <div className="p-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-3">
                            <FiAward className="me-1"/> {c.credits} Credits
                          </span>
                          <div className="dropdown">
                            <button className="btn btn-link text-muted p-0" type="button" data-bs-toggle="dropdown">
                              <FiEdit3 />
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3">
                              <li>
                                <button className="dropdown-item py-2" data-bs-toggle="modal" data-bs-target="#courseModal" onClick={() => setEditingCourse(c)}>
                                  <FiEdit3 className="me-2 text-warning"/> Edit Module
                                </button>
                              </li>
                              <li><hr className="dropdown-divider"/></li>
                              <li>
                                <button className="dropdown-item py-2 text-danger" onClick={() => handleDelete(c.courseId)}>
                                  <FiTrash2 className="me-2"/> Remove
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <h4 className="fw-bold text-dark mb-3">{c.courseName}</h4>
                        <div className="d-flex gap-4 text-muted small mt-auto">
                          <span className="d-flex align-items-center gap-1"><FiClock /> {c.durationInWeeks} Weeks</span>
                          <span className="d-flex align-items-center gap-1 font-monospace">ID: {c.courseId.slice(0,8)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-5 mt-4">
            <div className="selection-prompt mx-auto">
              <div className="pulse-icon"><FiBook size={40}/></div>
              <h3 className="mt-4 fw-bold">Ready to manage?</h3>
              <p className="text-muted">Select a program and year above to view course details.</p>
            </div>
          </div>
        )}
      </div>

      <CourseModal onSave={handleSaveCourse} editingCourse={editingCourse} />

      <style>{`
        .course-mgmt-page { background-color: #fcfdfe; min-height: 100vh; font-family: 'Plus Jakarta Sans', sans-serif; }
        .selection-box { border: 1px solid #f1f3f5; transition: 0.3s; }
        .selection-box:hover { border-color: #4361ee; box-shadow: 0 10px 30px rgba(67, 97, 238, 0.05) !important; }
        .mgmt-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); border: 1px solid #f1f3f5 !important; }
        .mgmt-card:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.06) !important; border-color: #4361ee !important; }
        .form-select:focus { box-shadow: none; }
        .pulse-icon { width: 80px; height: 80px; background: #eef2ff; color: #4361ee; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(67, 97, 238, 0.4); } 70% { box-shadow: 0 0 0 20px rgba(67, 97, 238, 0); } 100% { box-shadow: 0 0 0 0 rgba(67, 97, 238, 0); } }
        .animate-fade-in { animation: fadeIn 0.6s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default CoursesPage;