import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiLayers, FiCalendar, FiBookOpen, FiArrowRight, FiInfo, FiActivity } from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.min.css";

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [courses, setCourses] = useState([]);

  // Logics remain untouched as per your requirement
  useEffect(() => {
    axios.get("https://localhost:7157/api/coordinator/programs")
      .then((res) => setPrograms(res.data))
      .catch((err) => console.error("Error:", err));
  }, []);

  useEffect(() => {
    if (selectedProgram) {
      axios.get(`https://localhost:7157/api/coordinator/program/${selectedProgram.programId}/years`)
        .then((res) => setYears(res.data));
    } else {
      setYears([]); setSelectedYear(null); setCourses([]);
    }
  }, [selectedProgram]);

  useEffect(() => {
    if (selectedYear) {
      axios.get(`https://localhost:7157/api/coordinator/academic-year/${selectedYear.academicYearId}/courses`)
        .then((res) => setCourses(res.data));
    } else {
      setCourses([]);
    }
  }, [selectedYear]);

  return (
    <div className="modern-dashboard">
      <div className="container py-5">
        
        {/* --- DYNAMIC HEADER --- */}
        <header className="mb-5 text-center">
          <span className="badge rounded-pill bg-soft-primary text-primary mb-3 px-3 py-2">
            <FiActivity className="me-2" />
            Academic Portal v2.0
          </span>
          <h1 className="display-5 fw-bold text-dark-blue">Curriculum Designer</h1>
          <p className="text-muted mx-auto" style={{ maxWidth: "600px" }}>
            Seamlessly navigate through programs, academic years, and course structures with our unified management interface.
          </p>
        </header>

        <div className="row g-4">
          
          {/* --- STEP 1: PROGRAM SELECTION (Horizontal Scroll Style) --- */}
          <div className="col-12 mb-2">
            <div className="section-label">
              <FiLayers className="me-2" /> 1. Choose Your Program
            </div>
            <div className="program-grid">
              {programs.map((p) => (
                <div 
                  key={p.programId}
                  onClick={() => { setSelectedProgram(p); setSelectedYear(null); }}
                  className={`program-pill ${selectedProgram?.programId === p.programId ? "active" : ""}`}
                >
                  {p.programName}
                </div>
              ))}
            </div>
          </div>

          {/* --- STEP 2: YEAR SELECTION (Glass Cards) --- */}
          {selectedProgram && (
            <div className="col-12 animate-slide-up">
              <div className="section-label">
                <FiCalendar className="me-2" /> 2. Select Academic Year
              </div>
              <div className="year-container">
                {years.map((y) => (
                  <button
                    key={y.academicYearId}
                    onClick={() => setSelectedYear(y)}
                    className={`year-card ${selectedYear?.academicYearId === y.academicYearId ? "active" : ""}`}
                  >
                    <span className="year-label">Session</span>
                    <span className="year-value">{y.display}</span>
                    <FiArrowRight className="arrow-icon" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* --- STEP 3: COURSE DISPLAY (The Modern Grid) --- */}
          <div className="col-12 mt-4">
            {!selectedYear ? (
              <div className="empty-state">
                <div className="icon-circle">
                  <FiBookOpen size={32} />
                </div>
                <h4>Awaiting Selection</h4>
                <p>Please complete the steps above to unlock the course catalog.</p>
              </div>
            ) : (
              <div className="animate-fade-in">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <h3 className="fw-bold m-0 h4">
                    Course Catalog <span className="text-primary-subtle fs-6">({courses.length} modules)</span>
                  </h3>
                </div>

                {courses.length > 0 ? (
                  <div className="row g-3">
                    {courses.map((course) => (
                      <div className="col-xl-4 col-md-6" key={course.courseId}>
                        <div className="course-card">
                          <div className="course-accent"></div>
                          <div className="p-4">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <span className="credit-tag">{course.credits} Credits</span>
                              <FiInfo className="text-muted" />
                            </div>
                            <h5 className="course-title">{course.courseName}</h5>
                            <div className="course-footer">
                              <code>REF-{course.courseId}</code>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="modern-alert">
                    <FiInfo className="me-2" /> No curriculum data found for this period.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        :root {
          --primary-color: #4361ee;
          --secondary-color: #3f37c9;
          --bg-gray: #f8f9fd;
          --text-dark: #2b2d42;
        }

        .modern-dashboard {
          background-color: var(--bg-gray);
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
          color: var(--text-dark);
        }

        .text-dark-blue { color: #001233; }
        .bg-soft-primary { background: #e0e7ff; }

        .section-label {
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #64748b;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
        }

        /* Program Selection Styles */
        .program-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .program-pill {
          padding: 12px 24px;
          background: white;
          border-radius: 100px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }

        .program-pill:hover {
          transform: translateY(-2px);
          border-color: var(--primary-color);
          color: var(--primary-color);
        }

        .program-pill.active {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
          box-shadow: 0 10px 15px -3px rgba(67, 97, 238, 0.3);
        }

        /* Year Selection Styles */
        .year-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
        }

        .year-card {
          background: white;
          border: none;
          padding: 20px;
          border-radius: 16px;
          text-align: left;
          position: relative;
          transition: all 0.3s ease;
          border: 1px solid transparent;
        }

        .year-card.active {
          background: #ffffff;
          border-color: #10b981;
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
        }

        .year-card .year-label {
          display: block;
          font-size: 0.75rem;
          color: #94a3b8;
          text-transform: uppercase;
          font-weight: 600;
        }

        .year-card .year-value {
          display: block;
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
        }

        .year-card.active .year-value { color: #10b981; }

        .arrow-icon {
          position: absolute;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          opacity: 0;
          transition: all 0.3s ease;
        }

        .year-card.active .arrow-icon {
          opacity: 1;
          right: 15px;
          color: #10b981;
        }

        /* Course Card Styles */
        .course-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          transition: all 0.3s ease;
          border: 1px solid #edf2f7;
          height: 100%;
        }

        .course-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
        }

        .course-accent {
          height: 4px;
          background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
          width: 100%;
        }

        .credit-tag {
          background: #f1f5f9;
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #475569;
        }

        .course-title {
          font-weight: 700;
          color: #1e293b;
          min-height: 50px;
        }

        /* States & Animations */
        .empty-state {
          padding: 80px;
          text-align: center;
          background: rgba(255,255,255,0.5);
          border: 2px dashed #cbd5e1;
          border-radius: 30px;
        }

        .icon-circle {
          width: 80px;
          height: 80px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: var(--primary-color);
          box-shadow: 0 10px 15px rgba(0,0,0,0.05);
        }

        .animate-slide-up { animation: slideUp 0.5s ease-out; }
        .animate-fade-in { animation: fadeIn 0.6s ease-in; }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modern-alert {
          background: white;
          padding: 20px;
          border-radius: 12px;
          border-left: 4px solid var(--primary-color);
          color: #64748b;
        }
      `}</style>
    </div>
  );
};

export default Programs;