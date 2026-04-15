import React, { useState, useEffect } from "react";
import CourseModal from "../components/Coordinator/CourseModal.jsx";
import axios from "axios";
<<<<<<< HEAD
=======
import { FiPlus, FiBook, FiClock, FiAward, FiEdit3, FiTrash2, FiSearch, FiFilter, FiActivity } from "react-icons/fi";
>>>>>>> 18bbe9b (adding data)
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const CoursesPage = () => {
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);

<<<<<<< HEAD
  // Fetch all programs on mount
=======
  // Logic remains untouched
>>>>>>> 18bbe9b (adding data)
  useEffect(() => {
    axios
      .get("https://localhost:7157/api/coordinator/programs")
      .then((res) => setPrograms(res.data))
      .catch((err) => console.error("Error fetching programs:", err));
  }, []);

  // Fetch years when a program is selected
  useEffect(() => {
    if (selectedProgram) {
      axios
        .get(
          `https://localhost:7157/api/coordinator/program/${selectedProgram.programId}/years`
        )
        .then((res) => setYears(res.data))
        .catch((err) => console.error("Error fetching years:", err));
    } else {
      setYears([]);
      setSelectedYear(null);
      setCourses([]);
    }
  }, [selectedProgram]);

  // Fetch courses when a year is selected
  useEffect(() => {
    if (selectedYear) {
      axios
        .get(
          `https://localhost:7157/api/coordinator/academic-year/${selectedYear.academicYearId}/courses`
        )
        .then((res) => setCourses(res.data))
        .catch((err) => console.error("Error fetching courses:", err));
    } else {
      setCourses([]);
    }
  }, [selectedYear]);

  const handleSaveCourse = async (course) => {
    try {
      if (editingCourse) {
        // Update existing course (PUT API can be added here)
        setCourses(
          courses.map((c) =>
            c.courseId === editingCourse.courseId
              ? { ...course, courseId: editingCourse.courseId }
              : c
          )
        );
        setEditingCourse(null);
      } else {
        // Build payload for backend
        const payload = {
          programId: selectedProgram.programId,
          academicYearId: selectedYear.academicYearId,
          courseName: course.courseName,
          credits: course.credits,
          durationInWeeks: course.durationInWeeks,
          batchSize: course.batchSize,
        };

        // POST to backend
        const res = await axios.post(
          "https://localhost:7157/api/coordinator/course",
          payload
        );

        // Add to local state (use backend response if available)
        setCourses([...courses, res.data]);
      }
    } catch (err) {
      console.error("Error saving course:", err);
    }
  };

  const handleDelete = (id) => {
    setCourses(courses.filter((c) => c.courseId !== id));
    // Optionally call DELETE API here
  };

  return (
    <div className="course-mgmt-dark">
      <div className="container py-5">
        
        {/* --- DYNAMIC HEADER --- */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-3">
          <div>
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2" 
                 style={{ background: "rgba(20, 184, 166, 0.1)", border: "1px solid rgba(20, 184, 166, 0.2)" }}>
              <FiActivity className="text-teal" />
              <span className="text-teal fw-bold small uppercase tracking-wider">Repository</span>
            </div>
            <h1 className="display-6 fw-bold text-white mb-1">Module Management</h1>
            <p className="text-slate-400 mb-0">Define course structures and credit distributions</p>
          </div>
          
          {selectedYear && (
            <button 
              className="btn-teal-action shadow-lg"
              data-bs-toggle="modal" data-bs-target="#courseModal"
              onClick={() => setEditingCourse(null)}
            >
              <FiPlus /> Create New Course
            </button>
          )}
        </div>

        {/* --- SELECTION AREA (Sleek Inputs) --- */}
        <div className="row g-4 mb-5">
          <div className="col-md-6">
            <div className="selection-card-dark">
              <label className="selection-label-dark"><FiSearch className="me-1"/> Target Program</label>
              <select className="form-select-dark"
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
            <div className={`selection-card-dark ${!selectedProgram ? 'disabled-card' : ''}`}>
              <label className="selection-label-dark"><FiFilter className="me-1"/> Academic Cycle</label>
              <select className="form-select-dark"
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

        {/* --- CONTENT AREA --- */}
        {selectedYear ? (
          <div className="animate-fade-in">
            <div className="row g-4">
              {courses.length === 0 ? (
                <div className="col-12 text-center py-5 empty-state-dark">
                  <FiBook size={48} className="text-slate-700 mb-3" />
                  <h4 className="text-white">No modules found</h4>
                  <p className="text-slate-500">Get started by creating your first course module.</p>
                </div>
              ) : (
                courses.map((c) => (
                  <div className="col-xl-4 col-md-6" key={c.courseId}>
                    <div className="course-mgmt-card">
                      <div className="p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <span className="credit-pill">
                            <FiAward className="me-1"/> {c.credits} Credits
                          </span>
                          <div className="dropdown">
                            <button className="btn-icon-dark" type="button" data-bs-toggle="dropdown">
                              <FiEdit3 />
                            </button>
                            <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow-lg border-slate-800">
                              <li>
                                <button className="dropdown-item py-2" data-bs-toggle="modal" data-bs-target="#courseModal" onClick={() => setEditingCourse(c)}>
                                  <FiEdit3 className="me-2 text-warning"/> Edit Module
                                </button>
                              </li>
                              <li><hr className="dropdown-divider border-slate-800"/></li>
                              <li>
                                <button className="dropdown-item py-2 text-danger" onClick={() => handleDelete(c.courseId)}>
                                  <FiTrash2 className="me-2"/> Remove
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <h4 className="fw-bold text-white mb-3 h5">{c.courseName}</h4>
                        <div className="d-flex align-items-center gap-3 text-slate-500 small mt-auto">
                          <span className="d-flex align-items-center gap-1"><FiClock className="text-teal" /> {c.durationInWeeks} Weeks</span>
                          <span className="font-monospace opacity-50">ID: {c.courseId.slice(0,8)}</span>
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
            <div className="selection-prompt-dark mx-auto">
              <div className="pulse-icon-dark"><FiBook size={32}/></div>
              <h4 className="mt-4 fw-bold text-white">System Ready</h4>
              <p className="text-slate-500">Select a program and cycle to manage the catalog.</p>
            </div>
          </div>
        )}
      </div>

      {/* Courses Table */}
      {selectedYear ? (
        <div className="card shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center">
            <span className="fw-bold">
              Courses for {selectedProgram.programName} - {selectedYear.display}
            </span>
            <button
              className="btn btn-primary btn-sm"
              data-bs-toggle="modal"
              data-bs-target="#courseModal"
              onClick={() => setEditingCourse(null)}
            >
              <i className="bi bi-plus-circle me-2"></i>Add Course
            </button>
          </div>
          <div className="card-body">
            <table className="table table-striped table-bordered text-center">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Credits</th>
                  <th>Duration (Weeks)</th>
                  <th>Batch Size</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {courses.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-muted">
                      No Courses Added Yet
                    </td>
                  </tr>
                ) : (
                  courses.map((c) => (
                    <tr key={c.courseId}>
                      <td>{c.courseName}</td>
                      <td>{c.credits}</td>
                      <td>{c.durationInWeeks}</td>
                      <td>{c.batchSize}</td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          data-bs-toggle="modal"
                          data-bs-target="#courseModal"
                          onClick={() => setEditingCourse(c)}
                        >
                          <i className="bi bi-pencil"></i> Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(c.courseId)}
                        >
                          <i className="bi bi-trash"></i> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-danger">Select Program & Year first</p>
      )}

      <style>{`
        .course-mgmt-dark { background-color: #020617; min-height: 100vh; font-family: 'Inter', sans-serif; }
        
        .text-teal { color: #14b8a6 !important; }
        .text-slate-400 { color: #94a3b8 !important; }
        .text-slate-500 { color: #64748b !important; }

        /* Buttons & Actions */
        .btn-teal-action {
          background: #14b8a6; color: white; border: none; padding: 10px 24px;
          border-radius: 50px; font-weight: 600; display: flex; align-items: center;
          gap: 8px; transition: 0.3s;
        }
        .btn-teal-action:hover { background: #0d9488; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(20, 184, 166, 0.2); }

        /* Selectors */
        .selection-card-dark {
          background: #0f172a; padding: 20px; border-radius: 16px; 
          border: 1px solid #1e293b; transition: 0.3s;
        }
        .selection-card-dark:hover { border-color: #14b8a6; }
        .disabled-card { opacity: 0.4; filter: grayscale(1); pointer-events: none; }
        .selection-label-dark { font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; margin-bottom: 8px; display: block; }
        .form-select-dark {
          background-color: transparent; border: none; color: #f1f5f9; font-weight: 600; font-size: 1.1rem;
          padding-left: 0; cursor: pointer; width: 100%; outline: none;
        }
        .form-select-dark option { background-color: #0f172a; color: white; }

        /* Module Cards */
        .course-mgmt-card {
          background: #0f172a; border-radius: 20px; border: 1px solid #1e293b;
          height: 100%; transition: all 0.3s ease; position: relative;
        }
        .course-mgmt-card:hover { transform: translateY(-8px); border-color: #334155; background: #1e293b; box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
        
        .credit-pill {
          background: rgba(20, 184, 166, 0.1); color: #14b8a6; border: 1px solid rgba(20, 184, 166, 0.2);
          padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 700;
        }

        .btn-icon-dark { background: none; border: none; color: #475569; padding: 0; transition: 0.2s; }
        .btn-icon-dark:hover { color: #14b8a6; }

        /* Empty States */
        .empty-state-dark { background: #0f172a; border: 2px dashed #1e293b; border-radius: 24px; }
        .pulse-icon-dark {
          width: 70px; height: 70px; background: rgba(20, 184, 166, 0.1); color: #14b8a6;
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          margin: 0 auto; animation: pulse-teal 2s infinite;
        }

        @keyframes pulse-teal {
          0% { box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(20, 184, 166, 0); }
          100% { box-shadow: 0 0 0 0 rgba(20, 184, 166, 0); }
        }

        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default CoursesPage;