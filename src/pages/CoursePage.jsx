import React, { useState, useEffect } from "react";
import CourseModal from "../components/Coordinator/CourseModal.jsx";
import axios from "axios";
import { FiPlus, FiBook, FiClock, FiAward, FiEdit3, FiTrash2, FiSearch, FiFilter, FiActivity, FiUsers } from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const CoursesPage = () => {
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);

  const API_BASE = "https://localhost:7157/api/coordinator";

  // Fetch Programs on load
  useEffect(() => {
    axios.get(`${API_BASE}/programs`)
      .then((res) => setPrograms(res.data))
      .catch((err) => console.error("Error fetching programs:", err));
  }, []);

  // Fetch Years when program changes
  useEffect(() => {
    if (selectedProgram) {
      axios.get(`${API_BASE}/program/${selectedProgram.programId}/years`)
        .then((res) => setYears(res.data))
        .catch((err) => console.error("Error fetching years:", err));
    } else {
      setYears([]); setSelectedYear(null); setCourses([]);
    }
  }, [selectedProgram]);

  // Fetch Courses when year changes
  useEffect(() => {
    if (selectedYear) {
      axios.get(`${API_BASE}/academic-year/${selectedYear.academicYearId}/courses`)
        .then((res) => setCourses(res.data))
        .catch((err) => {
           console.error("Error fetching courses:", err);
           setCourses([]); // Prevent crash if backend returns error
        });
    } else {
      setCourses([]);
    }
  }, [selectedYear]);

  // --- SAVE / UPDATE LOGIC ---
  const handleSaveCourse = async (courseData) => {
    try {
      const payload = {
        academicYearId: selectedYear.academicYearId,
        courseName: courseData.courseName,
        credits: parseInt(courseData.credits),
        durationInWeeks: parseInt(courseData.durationInWeeks),
        batchSize: parseInt(courseData.batchSize) 
      };

      if (editingCourse) {
        // PUT Request for Update
        const res = await axios.put(`${API_BASE}/course/${editingCourse.courseId}`, payload);
        // Update local state without re-fetching
        setCourses(courses.map((c) => (c.courseId === editingCourse.courseId ? res.data : c)));
        setEditingCourse(null);
      } else {
        // POST Request for Create
        // Include programId if your backend requires it for creation
        const createPayload = { ...payload, programId: selectedProgram.programId };
        const res = await axios.post(`${API_BASE}/course`, createPayload);
        setCourses([...courses, res.data]);
      }
    } catch (err) {
      console.error("Save failed:", err);
      alert("System error: Could not save course.");
    }
  };

  // --- DELETE LOGIC ---
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course permanently?")) {
      try {
        await axios.delete(`${API_BASE}/course/${id}`);
        // Remove from UI
        setCourses(courses.filter((c) => c.courseId !== id));
      } catch (err) {
        console.error("Delete failed:", err);
        alert("System error: Could not remove course.");
      }
    }
  };

  return (
    <div className="course-mgmt-dark">
      <div className="container py-5">
        
        {/* HEADER */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5 gap-3">
          <div>
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2" 
                 style={{ background: "rgba(20, 184, 166, 0.1)", border: "1px solid rgba(20, 184, 166, 0.2)" }}>
              <FiActivity className="text-teal" />
              <span className="text-teal fw-bold small uppercase">Administration</span>
            </div>
            <h1 className="display-6 fw-bold text-white mb-1">Course Management</h1>
            <p className="text-slate-400 mb-0">Define course structures and batch capacities</p>
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

        {/* SELECTION AREA */}
        <div className="row g-4 mb-5">
          <div className="col-md-6">
            <div className="selection-card-dark">
              <label className="selection-label-dark"><FiSearch className="me-1"/> Target Program</label>
              <select className="form-select-dark"
                value={selectedProgram ? selectedProgram.programId : ""}
                onChange={(e) => {
                  const p = programs.find((x) => x.programId === e.target.value);
                  setSelectedProgram(p || null);
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
                  const y = years.find((x) => x.academicYearId === e.target.value);
                  setSelectedYear(y || null);
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
                        <div className="d-flex justify-content-between align-items-start mb-4">
                          <span className="credit-pill">
                            <FiAward className="me-1"/> {c.credits} Credits
                          </span>
                          
                          {/* UPDATED ACTION BUTTONS */}
                          <div className="d-flex gap-2">
                            <button 
                                className="action-btn-circle edit" 
                                data-bs-toggle="modal" 
                                data-bs-target="#courseModal" 
                                onClick={() => setEditingCourse(c)}
                                title="Edit Course"
                            >
                                <FiEdit3 size={14}/>
                            </button>
                            <button 
                                className="action-btn-circle delete" 
                                onClick={() => handleDelete(c.courseId)}
                                title="Delete Course"
                            >
                                <FiTrash2 size={14}/>
                            </button>
                          </div>
                        </div>

                        <h4 className="fw-bold text-white mb-3 h5">{c.courseName}</h4>
                        
                        <div className="d-flex flex-wrap align-items-center justify-content-between text-slate-500 small border-top border-slate-800 pt-3">
                          <div className="d-flex gap-3">
                            <span className="d-flex align-items-center gap-1"><FiClock className="text-teal" /> {c.durationInWeeks}w</span>
                            {/* <span className="d-flex align-items-center gap-1"><FiUsers className="text-teal" /> Cap: {c.batchSize || '0'}</span> */}
                          </div>
                          <span className="font-monospace opacity-50">ID: {String(c.courseId).slice(0,8)}</span>
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

      <CourseModal onSave={handleSaveCourse} editingCourse={editingCourse} />

      <style>{`
        .course-mgmt-dark { background-color: #020617; min-height: 100vh; font-family: 'Inter', sans-serif; }
        .text-teal { color: #14b8a6 !important; }
        .text-slate-400 { color: #94a3b8 !important; }
        .text-slate-500 { color: #64748b !important; }
        .btn-teal-action { background: #14b8a6; color: white; border: none; padding: 10px 24px; border-radius: 50px; font-weight: 600; display: flex; align-items: center; gap: 8px; transition: 0.3s; }
        .btn-teal-action:hover { background: #0d9488; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(20, 184, 166, 0.2); }
        .selection-card-dark { background: #0f172a; padding: 20px; border-radius: 16px; border: 1px solid #1e293b; transition: 0.3s; }
        .selection-card-dark:hover { border-color: #14b8a6; }
        .disabled-card { opacity: 0.4; filter: grayscale(1); pointer-events: none; }
        .selection-label-dark { font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; margin-bottom: 8px; display: block; }
        .form-select-dark { background-color: transparent; border: none; color: #f1f5f9; font-weight: 600; font-size: 1.1rem; padding-left: 0; cursor: pointer; width: 100%; outline: none; }
        .form-select-dark option { background-color: #0f172a; color: white; }
        .course-mgmt-card { background: #0f172a; border-radius: 20px; border: 1px solid #1e293b; height: 100%; transition: all 0.3s ease; position: relative; }
        .course-mgmt-card:hover { transform: translateY(-8px); border-color: #14b8a6; background: #1e293b; box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
        .credit-pill { background: rgba(20, 184, 166, 0.1); color: #14b8a6; border: 1px solid rgba(20, 184, 166, 0.2); padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 700; }
        
        .action-btn-circle {
          width: 32px; height: 32px; border-radius: 50%; border: none;
          display: flex; align-items: center; justify-content: center;
          transition: 0.2s; background: #1e293b; color: #94a3b8;
        }
        .action-btn-circle.edit:hover { background: #f59e0b; color: white; }
        .action-btn-circle.delete:hover { background: #ef4444; color: white; }

        .empty-state-dark { background: #0f172a; border: 2px dashed #1e293b; border-radius: 24px; }
        .pulse-icon-dark { width: 70px; height: 70px; background: rgba(20, 184, 166, 0.1); color: #14b8a6; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto; animation: pulse-teal 2s infinite; }
        @keyframes pulse-teal { 0% { box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.4); } 70% { box-shadow: 0 0 0 15px rgba(20, 184, 166, 0); } 100% { box-shadow: 0 0 0 0 rgba(20, 184, 166, 0); } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default CoursesPage;