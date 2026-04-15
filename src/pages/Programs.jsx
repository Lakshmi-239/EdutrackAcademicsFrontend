import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [courses, setCourses] = useState([]);

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

  return (
    <div className="modern-dashboard-dark">
      <div className="container py-5">
        
        {/* --- HEADER --- */}
        <header className="mb-5 text-center">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3" 
               style={{ background: "rgba(20, 184, 166, 0.1)", border: "1px solid rgba(20, 184, 166, 0.2)" }}>
            <FiActivity className="text-teal" />
            <span className="text-teal fw-bold small uppercase tracking-wider">Curriculum Manager</span>
          </div>
          <h1 className="display-5 fw-bold text-white mb-2">Academic Designer</h1>
          <p className="text-slate-400 mx-auto" style={{ maxWidth: "600px" }}>
            Manage program structures and navigate course catalogs through our unified interface.
          </p>
        </header>

        <div className="row g-4">
          
          {/* --- STEP 1: PROGRAM SELECTION --- */}
          <div className="col-12 mb-4">
            <div className="section-label">
              <FiLayers className="me-2 text-teal" /> 1. Select Program
            </div>
            <div className="program-grid">
              {programs.map((p) => (
                <div 
                  key={p.programId}
                  onClick={() => { setSelectedProgram(p); setSelectedYear(null); }}
                  className={`program-pill-dark ${selectedProgram?.programId === p.programId ? "active" : ""}`}
                >
                  {p.programName}
                </div>
              ))}
            </div>
          </div>

          {/* --- STEP 2: YEAR SELECTION --- */}
          {selectedProgram && (
            <div className="col-12 animate-slide-up mb-4">
              <div className="section-label">
                <FiCalendar className="me-2 text-teal" /> 2. Academic Year
              </div>
              <div className="year-container-dark">
                {years.map((y) => (
                  <button
                    key={y.academicYearId}
                    onClick={() => setSelectedYear(y)}
                    className={`year-card-dark ${selectedYear?.academicYearId === y.academicYearId ? "active" : ""}`}
                  >
                    <div className="year-content">
                      <span className="year-label">Session</span>
                      <span className="year-value">{y.display}</span>
                    </div>
                    <FiArrowRight className="arrow-icon" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* --- STEP 3: COURSE DISPLAY --- */}
          <div className="col-12">
            {!selectedYear ? (
              <div className="empty-state-dark">
                <div className="icon-circle-dark">
                  <FiBookOpen size={32} />
                </div>
                <h4 className="text-white">Awaiting Selection</h4>
                <p className="text-slate-500">Choose a program and year to reveal the curriculum.</p>
              </div>
            ) : (
              <div className="animate-fade-in">
                <div className="d-flex align-items-center justify-content-between mb-4 px-2">
                  <h3 className="fw-bold text-white m-0 h4">
                    Course Catalog <span className="text-teal fs-6 fw-normal">({courses.length} Modules)</span>
                  </h3>
                </div>

                {courses.length > 0 ? (
                  <div className="row g-3">
                    {courses.map((course) => (
                      <div className="col-xl-4 col-md-6" key={course.courseId}>
                        <div className="course-card-dark">
                          <div className="p-4">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <span className="credit-tag-dark">{course.credits} Credits</span>
                              <FiInfo className="text-slate-500" />
                            </div>
                            <h5 className="course-title-dark">{course.courseName}</h5>
                            <div className="course-footer-dark">
                              <code>REF-{course.courseId}</code>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="modern-alert-dark">
                    <FiInfo className="me-2 text-teal" /> No course data available for this selection.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .modern-dashboard-dark {
          background-color: #020617;
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
          color: #94a3b8;
        }

        .text-teal { color: #14b8a6 !important; }
        .text-slate-400 { color: #94a3b8 !important; }
        .text-slate-500 { color: #64748b !important; }

        .section-label {
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #475569;
          margin-bottom: 1.25rem;
          display: flex;
          align-items: center;
        }

        /* Program Pill */
        .program-grid { display: flex; flex-wrap: wrap; gap: 10px; }
        .program-pill-dark {
          padding: 10px 20px;
          background: #0f172a;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 500;
          color: #94a3b8;
          transition: all 0.2s ease;
          border: 1px solid #1e293b;
        }
        .program-pill-dark:hover {
          border-color: #14b8a6;
          color: #14b8a6;
          background: rgba(20, 184, 166, 0.05);
        }
        .program-pill-dark.active {
          background: #14b8a6;
          color: #ffffff;
          border-color: #14b8a6;
          box-shadow: 0 0 20px rgba(20, 184, 166, 0.3);
        }

        /* Year Cards */
        .year-container-dark {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 12px;
        }
        .year-card-dark {
          background: #0f172a;
          border: 1px solid #1e293b;
          padding: 18px;
          border-radius: 16px;
          text-align: left;
          position: relative;
          transition: all 0.3s ease;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .year-card-dark.active {
          border-color: #14b8a6;
          background: #1e293b;
        }
        .year-card-dark .year-label {
          display: block;
          font-size: 10px;
          color: #64748b;
          text-transform: uppercase;
          font-weight: 700;
        }
        .year-card-dark .year-value {
          display: block;
          font-size: 1.1rem;
          font-weight: 700;
          color: #f1f5f9;
        }
        .year-card-dark.active .year-value { color: #14b8a6; }
        .arrow-icon { color: #64748b; opacity: 0.3; transition: 0.3s; }
        .year-card-dark.active .arrow-icon { opacity: 1; color: #14b8a6; transform: translateX(5px); }

        /* Course Cards */
        .course-card-dark {
          background: #0f172a;
          border-radius: 16px;
          border: 1px solid #1e293b;
          height: 100%;
          transition: 0.3s;
        }
        .course-card-dark:hover {
          transform: translateY(-5px);
          border-color: #334155;
          background: #1e293b;
        }
        .credit-tag-dark {
          background: rgba(20, 184, 166, 0.1);
          color: #14b8a6;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          border: 1px solid rgba(20, 184, 166, 0.2);
        }
        .course-title-dark {
          font-weight: 700;
          color: #f1f5f9;
          font-size: 1rem;
          margin-bottom: 1rem;
        }
        .course-footer-dark code {
          color: #475569;
          font-size: 10px;
        }

        /* Empty State */
        .empty-state-dark {
          padding: 60px;
          text-align: center;
          background: #0f172a;
          border: 2px dashed #1e293b;
          border-radius: 24px;
        }
        .icon-circle-dark {
          width: 64px; height: 64px;
          background: #1e293b;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 15px;
          color: #14b8a6;
        }

        .modern-alert-dark {
          background: #0f172a;
          padding: 15px 20px;
          border-radius: 12px;
          border-left: 3px solid #14b8a6;
          color: #94a3b8;
          font-size: 14px;
        }

        .animate-slide-up { animation: slideUp 0.4s ease-out; }
        .animate-fade-in { animation: fadeIn 0.5s ease-in; }

        @keyframes slideUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default Programs;