import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import { 
  FiSearch, FiMail, FiBook, FiUsers, FiPlus,
  FiStar, FiX, FiPhone, FiAward, 
  FiCalendar, FiDownload, FiActivity, FiUser, FiLock, FiTrash2
} from "react-icons/fi";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Instructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [skill, setSkill] = useState("");
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // --- REGISTRATION STATE ---
  const [formData, setFormData] = useState({
    InstructorName: "",
    InstructorEmail: "",
    InstructorPhone: "",
    InstructorQualification: "",
    InstructorSkills: "",
    InstructorExperience: "",
    InstructorJoinDate: new Date().toISOString().split('T')[0],
    InstructorGender: "Male",
    InstructorPassword: "",
    InstructorResume: null
  });

  const fetchAll = () => {
    axios
      .get("https://localhost:7157/api/coordinator/instructors/all")
      .then((res) => setInstructors(res.data))
      .catch((err) => console.error("Error fetching instructors:", err));
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // --- DELETE HANDLER ---
  const handleDeleteInstructor = async (id, name) => {
    const confirmDelete = window.confirm(`Are you sure you want to permanently remove ${name} from the database? This action cannot be undone.`);
    
    if (confirmDelete) {
      try {
        await axios.delete(`https://localhost:7157/api/coordinator/instructor/${id}/delete`);
        alert("Instructor deleted successfully");
        
        // Close profile modal if it was open
        const modalElement = document.getElementById('profileModal');
        const modalInstance = Modal.getInstance(modalElement);
        if (modalInstance) modalInstance.hide();

        fetchAll(); // Refresh the list
      } catch (err) {
        console.error("Delete Error:", err);
        alert("Failed to delete instructor. Ensure they are not assigned to active batches first.");
      }
    }
  };

  // --- REGISTRATION HANDLERS ---
  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsRegistering(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });

    try {
      const response = await axios.post("https://localhost:7157/api/Registration/Instructor", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert(response.data.message || "Instructor registered successfully");
      
      const modalElement = document.getElementById('registerModal');
      const modalInstance = Modal.getInstance(modalElement);
      modalInstance.hide();
      
      fetchAll();
    } catch (err) {
      console.error("Registration Error:", err);
      alert("Registration failed.");
    } finally {
      setIsRegistering(false);
    }
  };

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
      .catch((err) => console.error("Fetch Error:", err))
      .finally(() => setLoadingProfile(false));
  };

  return (
    <div className="instructor-mgmt-dark">
      <div className="container py-5">
        
        {/* --- HEADER --- */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3 status-pill">
              <FiActivity className="text-teal" />
              <span className="text-teal fw-bold small uppercase">Faculty Directory</span>
            </div>
            <h1 className="display-6 fw-bold text-white mb-2">Specialized Instructors</h1>
            <p className="text-slate-400 mb-0">Monitor academic staff expertise and availability.</p>
          </div>
          
          <button 
            className="btn-download-teal px-4 py-2" 
            data-bs-toggle="modal" 
            data-bs-target="#registerModal"
          >
            <FiPlus className="me-2" /> Add Instructor
          </button>
        </div>

        {/* --- SEARCH --- */}
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
                  <div className="d-flex justify-content-between align-items-start mb-4">
                    <div className="d-flex align-items-center gap-3">
                      <div className="faculty-avatar">{inst.instructorName.charAt(0)}</div>
                      <div>
                        <h5 className="fw-bold text-white mb-0">{inst.instructorName}</h5>
                        <span className="badge-teal-sm">{inst.expertise || "Specialist"}</span>
                      </div>
                    </div>
                    {/* Quick Delete Icon */}
                    <button 
                       className="btn btn-link text-slate-600 hover-danger p-0"
                       onClick={() => handleDeleteInstructor(inst.instructorId, inst.instructorName)}
                    >
                      <FiTrash2 size={18} />
                    </button>
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

                  <button className="btn-profile-teal w-100" onClick={() => handleViewProfile(inst.instructorId)}>
                    View Faculty Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- REGISTRATION MODAL --- */}
      <div className="modal fade" id="registerModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content modal-dark">
            <div className="modal-header border-slate-800 p-4">
              <h5 className="modal-title text-white fw-bold">Register New Faculty</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <form onSubmit={handleRegisterSubmit}>
              <div className="modal-body p-4 bg-slate-950">
                <div className="row g-3">
                  <div className="col-md-6"><label className="modal-section-label">Name *</label><input type="text" name="InstructorName" className="form-control-dark-input" required onChange={handleFormChange} /></div>
                  <div className="col-md-6"><label className="modal-section-label">Email *</label><input type="email" name="InstructorEmail" className="form-control-dark-input" required onChange={handleFormChange} /></div>
                  <div className="col-md-6"><label className="modal-section-label">Phone *</label><input type="number" name="InstructorPhone" className="form-control-dark-input" required onChange={handleFormChange} /></div>
                  <div className="col-md-6"><label className="modal-section-label">Gender *</label><select name="InstructorGender" className="form-control-dark-input" onChange={handleFormChange}><option value="Male">Male</option><option value="Female">Female</option></select></div>
                  <div className="col-md-6"><label className="modal-section-label">Qualification *</label><input type="text" name="InstructorQualification" className="form-control-dark-input" required onChange={handleFormChange} /></div>
                  <div className="col-md-6"><label className="modal-section-label">Skills *</label><input type="text" name="InstructorSkills" className="form-control-dark-input" placeholder="Java, SQL, React" required onChange={handleFormChange} /></div>
                  <div className="col-md-4"><label className="modal-section-label">Experience (Y) *</label><input type="number" name="InstructorExperience" className="form-control-dark-input" required onChange={handleFormChange} /></div>
                  <div className="col-md-4"><label className="modal-section-label">Join Date</label><input type="date" name="InstructorJoinDate" className="form-control-dark-input" value={formData.InstructorJoinDate} onChange={handleFormChange} /></div>
                  <div className="col-md-4"><label className="modal-section-label">Password *</label><input type="password" name="InstructorPassword" className="form-control-dark-input" required onChange={handleFormChange} /></div>
                  <div className="col-12 mt-3">
                    <div className="upload-zone"><label className="modal-section-label d-block mb-2">Resume Upload *</label><input type="file" name="InstructorResume" className="form-control text-slate-400" required onChange={handleFormChange} /></div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-slate-800 p-3 bg-slate-950">
                <button type="button" className="btn btn-outline-secondary text-white" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn-download-teal px-5" disabled={isRegistering}>{isRegistering ? "Processing..." : "Register Instructor"}</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* --- PROFILE MODAL WITH DELETE --- */}
      <div className="modal fade" id="profileModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content modal-dark">
            {selectedInstructor ? (
              <>
                <div className="modal-header-teal p-4">
                  <div className="d-flex align-items-center gap-3">
                    <div className="modal-avatar">{selectedInstructor.instructorName.charAt(0)}</div>
                    <div>
                      <h4 className="modal-title fw-bold text-white m-0">{selectedInstructor.instructorName}</h4>
                      <small className="text-slate-400">ID: {selectedInstructor.instructorId}</small>
                    </div>
                  </div>
                  <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div className="modal-body p-4 bg-slate-950">
                  <div className="row g-4">
                    <div className="col-md-5">
                      <div className="modal-info-card p-4">
                        <h6 className="modal-section-label mb-4">Primary Contact</h6>
                        <div className="d-flex flex-column gap-3 text-slate-300 small">
                          <div className="d-flex align-items-center gap-2"><FiMail className="text-teal" /> {selectedInstructor.instructorEmail}</div>
                          <div className="d-flex align-items-center gap-2"><FiPhone className="text-teal" /> +91 {selectedInstructor.instructorPhone}</div>
                          <div className="d-flex align-items-center gap-2"><FiCalendar className="text-teal" /> Joined {selectedInstructor.instructorJoinDate}</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-7">
                      <div className="modal-info-card p-4 mb-4">
                        <h6 className="modal-section-label mb-3">Expertise</h6>
                        <div className="mb-3 d-flex gap-2">
                          <span className="credit-pill-dark"><FiAward className="me-1"/> {selectedInstructor.instructorQualification}</span>
                          <span className="credit-pill-dark">{selectedInstructor.instructorExperience}Y Experience</span>
                        </div>
                        <div className="d-flex flex-wrap gap-2">
                          {selectedInstructor.instructorSkills?.split(',').map((s, i) => (<span key={i} className="skill-tag">{s.trim()}</span>))}
                        </div>
                      </div>
                      
                      <div className="d-flex gap-2">
                         <button 
                           className="btn btn-outline-danger flex-grow-1 fw-bold" 
                           onClick={() => handleDeleteInstructor(selectedInstructor.instructorId, selectedInstructor.instructorName)}
                         >
                           Terminate Faculty
                         </button>
                         {selectedInstructor.resumePath && (
                            <a href={`https://localhost:7157/${selectedInstructor.resumePath}`} target="_blank" rel="noreferrer" className="btn-download-teal px-4">
                               <FiDownload />
                            </a>
                         )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : <div className="p-5 text-center text-slate-400">Loading...</div>}
          </div>
        </div>
      </div>

      <style>{`
        .instructor-mgmt-dark { background-color: #020617; min-height: 100vh; color: white; }
        .text-teal { color: #14b8a6 !important; }
        .status-pill { background: rgba(20, 184, 166, 0.1); border: 1px solid rgba(20, 184, 166, 0.2); }
        .search-box-dark { background: #0f172a; border-radius: 50px; border: 1px solid #1e293b; display: flex; align-items: center; }
        .form-control-dark { background: transparent; border: none; color: white; width: 100%; outline: none; padding: 5px; }
        .faculty-card-dark { background: #0f172a; border-radius: 20px; border: 1px solid #1e293b; transition: 0.3s; }
        .faculty-card-dark:hover { transform: translateY(-5px); border-color: #14b8a6; }
        .faculty-avatar { width: 50px; height: 50px; background: rgba(20, 184, 166, 0.1); color: #14b8a6; display: flex; align-items: center; justify-content: center; font-weight: bold; border-radius: 12px; }
        .badge-teal-sm { color: #14b8a6; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; }
        .faculty-info-box { background: #020617; border-radius: 12px; padding: 15px; }
        .btn-profile-teal { background: transparent; border: 1px solid #1e293b; color: white; border-radius: 10px; padding: 8px; transition: 0.3s; }
        .btn-profile-teal:hover { background: #14b8a6; border-color: #14b8a6; }
        .btn-download-teal { background: #14b8a6; color: white; border: none; border-radius: 10px; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .modal-dark { background: #0f172a; border-radius: 20px; border: 1px solid #1e293b; }
        .form-control-dark-input { background: #0f172a; border: 1px solid #1e293b; color: white; width: 100%; padding: 8px; border-radius: 8px; }
        .modal-section-label { font-size: 10px; color: #475569; font-weight: bold; text-transform: uppercase; }
        .upload-zone { border: 2px dashed #1e293b; padding: 15px; border-radius: 12px; }
        .skill-tag { background: #020617; border: 1px solid #1e293b; padding: 4px 10px; border-radius: 6px; font-size: 12px; }
        .credit-pill-dark { background: rgba(20, 184, 166, 0.1); color: #14b8a6; padding: 4px 10px; border-radius: 6px; font-size: 12px; }
        .hover-danger:hover { color: #ef4444 !important; }
      `}</style>
    </div>
  );
};

export default Instructors;