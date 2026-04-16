import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import { 
  FiSearch, FiMail, FiBook, FiUsers, 
  FiStar, FiX, FiPhone, FiAward, 
  FiCalendar, FiDownload, FiCheckCircle 
} from "react-icons/fi";

// Ensure Bootstrap JS is imported for modal functionality
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Instructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [skill, setSkill] = useState("");
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // 1. Fetch all instructors on component mount
  const fetchAll = () => {
    axios
      .get("https://localhost:7157/api/coordinator/instructors/all")
      .then((res) => setInstructors(res.data))
      .catch((err) => console.error("Error fetching instructors:", err));
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // 2. Handle Skill Filtering
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

  // 3. Fetch specific details and OPEN Modal
 const handleViewProfile = (id) => {
  setLoadingProfile(true);
  axios
    .get(`https://localhost:7157/api/coordinator/instructor/${id}/details`)
    .then((res) => {
      setSelectedInstructor(res.data);

      const modalElement = document.getElementById('profileModal');
      // Use the imported Modal class directly
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
    <div className="instructor-mgmt-page pb-5">
      <div className="container py-5">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-5">
          <h1 className="display-6 fw-bold text-dark">Faculty Directory</h1>
          <p className="text-muted mb-0">Centralized view of all specialized instructors and their allocations.</p>
        </div>

        {/* --- SEARCH BAR --- */}
        <div className="row mb-5">
          <div className="col-lg-6 mx-auto">
            <div className="search-box p-2 bg-white rounded-pill shadow-sm border d-flex align-items-center px-4">
              <FiSearch className="text-primary me-3" size={20} />
              <input
                type="text"
                className="form-control border-0 shadow-none bg-transparent"
                placeholder="Filter by skill (e.g. Java, React)..."
                value={skill}
                onChange={handleSkillChange}
              />
              {skill && (
                <button className="btn btn-link text-muted p-0" onClick={() => {setSkill(""); fetchAll();}}>
                  <FiX />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* --- INSTRUCTOR GRID --- */}
        <div className="row g-4">
          {instructors.map((inst) => (
            <div className="col-xl-4 col-md-6" key={inst.instructorId}>
              <div className="instructor-card h-100 bg-white rounded-4 shadow-sm border-0 overflow-hidden">
                <div className="instructor-accent"></div>
                <div className="p-4">
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="avatar-circle bg-primary-subtle text-primary">
                      {inst.instructorName.charAt(0)}
                    </div>
                    <div>
                      <h5 className="fw-bold text-dark mb-0">{inst.instructorName}</h5>
                      <small className="text-primary fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>
                        {inst.expertise || "Specialist"}
                      </small>
                    </div>
                  </div>

                  <div className="info-list mb-4">
                    <div className="small text-muted mb-2 d-flex gap-2">
                      <FiBook className="text-primary mt-1" />
                      <span><strong>Courses:</strong> {inst.courses?.join(", ") || "None"}</span>
                    </div>
                    <div className="small text-muted d-flex gap-2">
                      <FiUsers className="text-primary mt-1" />
                      <span><strong>Batches:</strong> {inst.batches?.join(", ") || "Available"}</span>
                    </div>
                  </div>

                  <button 
                    className="btn btn-outline-primary w-100 rounded-pill fw-bold"
                    onClick={() => handleViewProfile(inst.instructorId)}
                  >
                    View Full Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- REUSABLE PROFILE MODAL --- */}
      <div className="modal fade" id="profileModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
            {selectedInstructor ? (
              <>
                <div className="modal-header border-0 bg-primary p-4 text-white">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold shadow" style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
                      {selectedInstructor.instructorName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="modal-title fw-bold m-0">{selectedInstructor.instructorName}</h4>
                      <small className="opacity-75">ID: {selectedInstructor.instructorId} | {selectedInstructor.role}</small>
                    </div>
                  </div>
                  <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                
                <div className="modal-body p-4 bg-light">
                  <div className="row g-4">
                    {/* LEFT PANEL */}
                    <div className="col-md-5">
                      <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                        <h6 className="text-muted fw-bold mb-4 small">PRIMARY DETAILS</h6>
                        <p className="mb-3 d-flex align-items-center gap-2">
                          <FiMail className="text-primary" /> <span className="small fw-semibold">{selectedInstructor.instructorEmail}</span>
                        </p>
                        <p className="mb-3 d-flex align-items-center gap-2">
                          <FiPhone className="text-primary" /> <span className="small fw-semibold">+91 {selectedInstructor.instructorPhone}</span>
                        </p>
                        <p className="mb-3 d-flex align-items-center gap-2">
                          <FiCalendar className="text-primary" /> <span className="small fw-semibold">Joined: {selectedInstructor.instructorJoinDate}</span>
                        </p>
                        <p className="mb-0 d-flex align-items-center gap-2">
                          <FiCheckCircle className="text-primary" /> <span className="small fw-semibold">Gender: {selectedInstructor.instructorGender}</span>
                        </p>
                      </div>
                    </div>

                    {/* RIGHT PANEL */}
                    <div className="col-md-7">
                      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                        <h6 className="text-muted fw-bold mb-3 small">QUALIFICATION & SKILLS</h6>
                        <div className="mb-3">
                          <span className="badge bg-primary-subtle text-primary p-2 px-3 rounded-pill">
                            <FiAward className="me-1"/> {selectedInstructor.instructorQualification}
                          </span>
                          <span className="ms-2 badge bg-dark text-white p-2 px-3 rounded-pill">
                            Exp: {selectedInstructor.instructorExperience} Years
                          </span>
                        </div>
                        <div className="d-flex flex-wrap gap-2">
                          {selectedInstructor.instructorSkills?.split(',').map((skill, i) => (
                            <span key={i} className="bg-white border rounded px-3 py-1 small fw-bold text-muted shadow-xs">
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      </div>

                      {selectedInstructor.resumePath && (
                        <a href={`https://localhost:7157/${selectedInstructor.resumePath}`} target="_blank" rel="noreferrer" className="btn btn-primary w-100 py-3 rounded-4 shadow-sm d-flex align-items-center justify-content-center gap-2">
                          <FiDownload /> View Academic Resume
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-5 text-center">Loading Faculty Data...</div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .instructor-mgmt-page { background-color: #f8fafc; min-height: 100vh; }
        .instructor-card { transition: 0.3s; border: 1px solid #eef2f7 !important; }
        .instructor-card:hover { transform: translateY(-5px); box-shadow: 0 12px 24px rgba(0,0,0,0.05) !important; border-color: #4361ee !important; }
        .instructor-accent { height: 4px; background: #4361ee; }
        .avatar-circle { width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; }
        .search-box { transition: 0.3s; border: 1px solid #e2e8f0 !important; }
        .search-box:focus-within { border-color: #4361ee !important; box-shadow: 0 0 0 4px rgba(67,97,238,0.1) !important; }
        .bg-primary-subtle { background-color: #eef2ff !important; }
      `}</style>
    </div>
  );
};

export default Instructors;