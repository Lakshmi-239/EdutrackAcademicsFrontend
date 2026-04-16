import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import { 
  FiSearch, FiMail, FiBook, FiUsers, 
  FiStar, FiX, FiPhone, FiAward, 
  FiCalendar, FiDownload, FiCheckCircle, FiActivity
} from "react-icons/fi";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Instructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [skill, setSkill] = useState("");
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const fetchAll = () => {
    axios
      .get("https://localhost:7157/api/coordinator/instructors/all")
      .then((res) => setInstructors(res.data))
      .catch((err) => console.error("Error fetching instructors:", err));
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleSkillChange = (e) => {
    const selectedSkill = e.target.value;
    setSkill(selectedSkill);
    if (!selectedSkill) {
      fetchAll();
    } else {
      axios
        .get(`https://localhost:7157/api/coordinator/instructors?skill=${selectedSkill}`)
        .then((res) => setInstructors(res.data))
        .catch((err) => console.error("Error filtering:", err));
    }
  };

  const handleViewProfile = (id) => {
    setLoadingProfile(true);
    axios
      .get(`https://localhost:7157/api/coordinator/instructor/${id}/details`)
      .then((res) => {
        setSelectedInstructor(res.data);
        const modalElement = document.getElementById('profileModal');
        const modalInstance = new Modal(modalElement); 
        modalInstance.show();
      })
      .catch((err) => {
        console.error("Fetch Error:", err);
        alert("Failed to load instructor details.");
      })
      .finally(() => setLoadingProfile(false));
  };

  return (
    <div className="instructor-mgmt-dark">
      <div className="container py-5">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-5">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3" 
               style={{ background: "rgba(20, 184, 166, 0.1)", border: "1px solid rgba(20, 184, 166, 0.2)" }}>
            <FiActivity className="text-teal" />
            <span className="text-teal fw-bold small uppercase tracking-wider">Faculty Directory</span>
          </div>
          <h1 className="display-6 fw-bold text-white mb-2">Specialized Instructors</h1>
          <p className="text-slate-400 mx-auto" style={{ maxWidth: '600px' }}>
            Monitor academic staff expertise, module allocations, and availability.
          </p>
        </div>

        {/* --- SEARCH BOX --- */}
        <div className="row mb-5">
          <div className="col-lg-6 mx-auto">
            <div className="search-box-dark px-4 py-2">
              <FiSearch className="text-teal me-3" size={20} />
              <input
                type="text"
                className="form-control-dark"
                placeholder="Filter by skill (e.g. Java, React)..."
                value={skill}
                onChange={handleSkillChange}
              />
              {skill && (
                <button className="btn btn-link text-slate-500 p-0" onClick={() => {setSkill(""); fetchAll();}}>
                  <FiX />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* --- INSTRUCTOR GRID --- */}
        <div className="row g-4 animate-fade-in">
          {instructors.map((inst) => (
            <div className="col-xl-4 col-md-6" key={inst.instructorId}>
              <div className="faculty-card-dark h-100">
                <div className="faculty-card-body p-4">
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="faculty-avatar">
                      {inst.instructorName.charAt(0)}
                    </div>
                    <div>
                      <h5 className="fw-bold text-white mb-0">{inst.instructorName}</h5>
                      <span className="badge-teal-sm">
                        {inst.expertise || "Specialist"}
                      </span>
                    </div>
                  </div>

                  <div className="faculty-info-box mb-4">
                    <div className="d-flex gap-2 mb-2">
                      <FiBook className="text-teal flex-shrink-0 mt-1" />
                      <span className="text-slate-400 small">
                        <strong className="text-slate-200">Modules:</strong> {inst.courses?.join(", ") || "None"}
                      </span>
                    </div>
                    <div className="d-flex gap-2">
                      <FiUsers className="text-teal flex-shrink-0 mt-1" />
                      <span className="text-slate-400 small">
                        <strong className="text-slate-200">Batches:</strong> {inst.batches?.join(", ") || "Available"}
                      </span>
                    </div>
                  </div>

                  <button 
                    className="btn-profile-teal w-100"
                    onClick={() => handleViewProfile(inst.instructorId)}
                  >
                    View Faculty Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- PROFILE MODAL --- */}
      <div className="modal fade" id="profileModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content modal-dark border-slate-800 shadow-2xl">
            {selectedInstructor ? (
              <>
                <div className="modal-header-teal p-4">
                  <div className="d-flex align-items-center gap-3">
                    <div className="modal-avatar">
                      {selectedInstructor.instructorName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="modal-title fw-bold text-white m-0">{selectedInstructor.instructorName}</h4>
                      <small className="text-slate-400">ID: {selectedInstructor.instructorId} • {selectedInstructor.role}</small>
                    </div>
                  </div>
                  <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                
                <div className="modal-body p-4 bg-slate-950">
                  <div className="row g-4">
                    <div className="col-md-5">
                      <div className="modal-info-card p-4 h-100">
                        <h6 className="modal-section-label mb-4">Primary Contact</h6>
                        <div className="d-flex flex-column gap-3">
                          <div className="d-flex align-items-center gap-2 text-slate-300">
                            <FiMail className="text-teal" /> <span className="small">{selectedInstructor.instructorEmail}</span>
                          </div>
                          <div className="d-flex align-items-center gap-2 text-slate-300">
                            <FiPhone className="text-teal" /> <span className="small">+91 {selectedInstructor.instructorPhone}</span>
                          </div>
                          <div className="d-flex align-items-center gap-2 text-slate-300">
                            <FiCalendar className="text-teal" /> <span className="small">Joined {selectedInstructor.instructorJoinDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-7">
                      <div className="modal-info-card p-4 mb-4">
                        <h6 className="modal-section-label mb-3">Academic Background</h6>
                        <div className="mb-3 d-flex gap-2">
                          <span className="credit-pill-dark">
                            <FiAward className="me-1"/> {selectedInstructor.instructorQualification}
                          </span>
                          <span className="credit-pill-dark">
                            {selectedInstructor.instructorExperience}Y Experience
                          </span>
                        </div>
                        <div className="d-flex flex-wrap gap-2">
                          {selectedInstructor.instructorSkills?.split(',').map((skill, i) => (
                            <span key={i} className="skill-tag">
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      </div>

                      {selectedInstructor.resumePath && (
                        <a href={`https://localhost:7157/${selectedInstructor.resumePath}`} target="_blank" rel="noreferrer" 
                           className="btn-download-teal w-100 py-3">
                          <FiDownload /> Access Resume
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-5 text-center text-slate-400">Loading profile data...</div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .instructor-mgmt-dark { background-color: #020617; min-height: 100vh; font-family: 'Inter', sans-serif; }
        .text-teal { color: #14b8a6 !important; }
        .text-slate-400 { color: #94a3b8 !important; }

        /* Search Box */
        .search-box-dark {
          background: #0f172a; border-radius: 50px; border: 1px solid #1e293b;
          display: flex; align-items: center; transition: 0.3s;
        }
        .search-box-dark:focus-within { border-color: #14b8a6; box-shadow: 0 0 20px rgba(20, 184, 166, 0.1); }
        .form-control-dark {
          background: transparent; border: none; color: white; width: 100%; outline: none;
        }
        .form-control-dark::placeholder { color: #475569; }

        /* Faculty Card */
        .faculty-card-dark {
          background: #0f172a; border-radius: 24px; border: 1px solid #1e293b;
          transition: all 0.3s ease; position: relative; overflow: hidden;
        }
        .faculty-card-dark:hover { transform: translateY(-8px); border-color: #14b8a6; box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
        
        .faculty-avatar {
          width: 54px; height: 54px; border-radius: 14px; background: rgba(20, 184, 166, 0.1);
          color: #14b8a6; display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 1.2rem; border: 1px solid rgba(20, 184, 166, 0.2);
        }

        .badge-teal-sm {
          font-size: 10px; font-weight: 800; text-transform: uppercase; color: #14b8a6;
          background: rgba(20, 184, 166, 0.05); padding: 2px 8px; border-radius: 4px;
        }

        .faculty-info-box { background: rgba(2, 6, 23, 0.4); border-radius: 16px; padding: 15px; }
        
        .btn-profile-teal {
          background: transparent; border: 1px solid #1e293b; color: white;
          padding: 10px; border-radius: 12px; font-weight: 600; transition: 0.3s;
        }
        .btn-profile-teal:hover { background: #14b8a6; border-color: #14b8a6; color: white; }

        /* Modal Redesign */
        .modal-dark { background: #0f172a; border-radius: 28px; border: 1px solid #1e293b; }
        .modal-header-teal { border-bottom: 1px solid #1e293b; display: flex; justify-content: space-between; align-items: center; }
        .modal-avatar { width: 60px; height: 60px; background: #14b8a6; color: white; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 800; }
        .modal-info-card { background: #020617; border-radius: 20px; border: 1px solid #1e293b; }
        .modal-section-label { font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 1px; }
        
        .credit-pill-dark { background: rgba(20, 184, 166, 0.1); color: #14b8a6; padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 700; border: 1px solid rgba(20, 184, 166, 0.2); }
        .skill-tag { background: #0f172a; border: 1px solid #1e293b; color: #94a3b8; padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; }
        
        .btn-download-teal {
          background: #14b8a6; color: white; border: none; border-radius: 15px;
          font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; transition: 0.3s;
        }
        .btn-download-teal:hover { background: #0d9488; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(20, 184, 166, 0.2); }

        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default Instructors;