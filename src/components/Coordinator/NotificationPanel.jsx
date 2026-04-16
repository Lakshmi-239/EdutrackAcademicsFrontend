import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FiSend, FiBell, FiClock, FiCheckCircle, FiUsers, 
  FiAlertTriangle, FiLayers, FiUser, FiInfo 
} from "react-icons/fi";
import { IoMegaphoneOutline } from "react-icons/io5";

const NotificationPanel = () => {
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    targetRole: "Student",
    targetId: "",          
    batchIdString: ""      
  });

  const [instructors, setInstructors] = useState([]);
  const [batches, setBatches] = useState([]);
  const [adminNotifications, setAdminNotifications] = useState([]);
  const [sentNotifications, setSentNotifications] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    fetchInitialData();
    const savedSent = JSON.parse(localStorage.getItem("coordinator_sent_history")) || [];
    setSentNotifications(savedSent);
  }, []);

  const fetchInitialData = async () => {
    if (!token) return;
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [instRes, batchRes, notifRes] = await Promise.all([
        axios.get("https://localhost:7157/api/coordinator/instructorsList", config),
        axios.get("https://localhost:7157/api/coordinator/GetAllBatchess", config),
        axios.get("https://localhost:7157/api/notifications/my-notifications", config)
      ]);

      setInstructors(instRes.data);
      setBatches(batchRes.data);
      
      const admin = notifRes.data
        .filter((n) => n.createdByRole === "Admin")
        .sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn))
        .slice(0, 3);
      setAdminNotifications(admin);
    } catch (err) {
      console.error("Data Fetch Error:", err);
    }
  };

  const handleSend = async () => {
    if (!newNotification.title || !newNotification.message) {
      setErrorMsg("Please provide both a subject and a message.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: newNotification.title,
        message: newNotification.message,
        targetRole: newNotification.targetRole,
        targetId: newNotification.targetRole === "Instructor" && newNotification.targetId 
                  ? parseInt(newNotification.targetId) : null,
        batchIdString: newNotification.targetRole === "Batch" 
                       ? newNotification.batchIdString : null
      };

      await axios.post("https://localhost:7157/api/notifications/create", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const sentItem = { ...payload, createdOn: new Date().toISOString() };
      const updatedSent = [sentItem, ...sentNotifications].slice(0, 10);
      localStorage.setItem("coordinator_sent_history", JSON.stringify(updatedSent));
      setSentNotifications(updatedSent);
      
      setNewNotification({ title: "", message: "", targetRole: "Student", targetId: "", batchIdString: "" });
      setErrorMsg("");
    } catch (err) {
      setErrorMsg("Failed to broadcast. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="notif-dashboard py-5" style={{ background: "#fcfdfe", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <div className="container" style={{ maxWidth: "1300px" }}>
        
        {/* Header Section */}
        <div className="mb-5 text-center">
          <h1 className="fw-bold text-dark display-6 mb-2">Notification Hub</h1>
          <p className="text-secondary fs-5">Broadcast real-time announcements and review admin briefings.</p>
        </div>

        <div className="row g-4 justify-content-center">
          
          {/* LEFT COLUMN: COMPOSE (Expanded Width) */}
          <div className="col-xl-6 col-lg-7">
            <div className="card border-0 shadow-lg p-4 p-md-5 rounded-5 bg-white h-100">
              <div className="d-flex align-items-center gap-3 mb-5">
                <div className="bg-primary bg-opacity-10 p-3 rounded-4">
                  <IoMegaphoneOutline size={30} className="text-primary" />
                </div>
                <div>
                  <h3 className="fw-bold mb-0">Create New Announcement</h3>
                  <small className="text-muted">Fill in the details to notify your target group.</small>
                </div>
              </div>

              {errorMsg && (
                <div className="alert alert-danger border-0 rounded-4 mb-4 d-flex align-items-center gap-2">
                  <FiAlertTriangle /> {errorMsg}
                </div>
              )}

              <div className="mb-4">
                <label className="form-label fw-bold text-muted small text-uppercase ls-1">Announcement Subject</label>
                <input 
                  className="form-control form-control-lg border-2 bg-light bg-opacity-50 rounded-4 py-3"
                  placeholder="e.g., Final Exam Schedule"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                />
              </div>

              <div className="row g-3 mb-4">
                <div className={newNotification.targetRole === "Student" || newNotification.targetRole === "All" ? "col-12" : "col-md-6"}>
                  <label className="form-label fw-bold text-muted small text-uppercase ls-1">Target Group</label>
                  <div className="position-relative">
                    <FiUsers className="position-absolute top-50 translate-middle-y ms-3 text-secondary" />
                    <select 
                      className="form-select form-select-lg ps-5 border-2 bg-light bg-opacity-50 rounded-4 py-3"
                      value={newNotification.targetRole}
                      onChange={(e) => setNewNotification({...newNotification, targetRole: e.target.value, targetId: "", batchIdString: ""})}
                    >
                      <option value="Student">All Students</option>
                      <option value="Instructor">Instructors</option>
                      <option value="Batch">Specific Batch</option>
                      <option value="All">Everyone</option>
                    </select>
                  </div>
                </div>

                {/* Specific Targeting Dropdowns */}
                {newNotification.targetRole === "Instructor" && (
                  <div className="col-md-6 animate-fade-in">
                    <label className="form-label fw-bold text-primary small text-uppercase ls-1">Select Instructor</label>
                    <div className="position-relative">
                      <FiUser className="position-absolute top-50 translate-middle-y ms-3 text-primary" />
                      <select 
                        className="form-select form-select-lg ps-5 border-primary border-opacity-25 bg-primary bg-opacity-10 rounded-4 py-3 text-primary"
                        value={newNotification.targetId}
                        onChange={(e) => setNewNotification({...newNotification, targetId: e.target.value})}
                      >
                        <option value="">All Instructors</option>
                        {instructors.map(i => <option key={i.userId} value={i.userId}>{i.fullName}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                {newNotification.targetRole === "Batch" && (
                  <div className="col-md-6 animate-fade-in">
                    <label className="form-label fw-bold text-primary small text-uppercase ls-1">Select Batch ID</label>
                    <div className="position-relative">
                      <FiLayers className="position-absolute top-50 translate-middle-y ms-3 text-primary" />
                      <select 
                        className="form-select form-select-lg ps-5 border-primary border-opacity-25 bg-primary bg-opacity-10 rounded-4 py-3 text-primary"
                        value={newNotification.batchIdString}
                        onChange={(e) => setNewNotification({...newNotification, batchIdString: e.target.value})}
                      >
                        <option value="">Choose Batch...</option>
                        {batches.map(b => <option key={b.batchId} value={b.batchId}>{b.batchId}</option>)}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-5">
                <label className="form-label fw-bold text-muted small text-uppercase ls-1">Message Content</label>
                <textarea 
                  className="form-control border-2 bg-light bg-opacity-50 rounded-4 p-3"
                  rows="6"
                  placeholder="Describe the update in detail..."
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                ></textarea>
              </div>

              <button 
                className={`btn btn-primary btn-lg w-100 rounded-4 py-3 fw-bold shadow-blue transition-all ${loading ? 'disabled' : ''}`}
                onClick={handleSend}
              >
                {loading ? "Broadcasting..." : <><FiSend className="me-2" /> Send Notification</>}
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: FEEDS */}
          <div className="col-xl-5 col-lg-5">
            <div className="d-flex flex-column gap-4">
              
              {/* ADMIN FEED */}
              <div className="card border-0 shadow-sm p-4 rounded-5 bg-white">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <h6 className="fw-bold text-dark text-uppercase mb-0 d-flex align-items-center gap-2">
                    <FiBell className="text-warning" /> Admin Briefings
                  </h6>
                  <span className="badge bg-light text-secondary rounded-pill">Inbound</span>
                </div>
                <div className="admin-scroll pe-1" style={{maxHeight: '250px', overflowY: 'auto'}}>
                  {adminNotifications.length > 0 ? (
                    adminNotifications.map((n, i) => (
                      <div key={i} className="p-3 border-start border-4 border-warning rounded-3 mb-3 bg-light bg-opacity-25">
                        <p className="fw-bold small mb-1">{n.title}</p>
                        <p className="text-muted small mb-0">{n.message}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 rounded-4 border border-dashed">
                      <FiInfo className="text-muted mb-2" size={24} />
                      <p className="text-muted small mb-0">No administrative alerts.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* HISTORY LOG */}
              <div className="card border-0 shadow-sm p-4 rounded-5 bg-white">
                <h6 className="fw-bold text-dark text-uppercase mb-4 d-flex align-items-center gap-2">
                  <FiClock className="text-primary" /> Dispatch Log
                </h6>
                <div className="history-timeline ps-3">
                  {sentNotifications.length > 0 ? (
                    sentNotifications.map((n, i) => (
                      <div key={i} className="position-relative border-start ps-4 pb-4">
                        <div className="position-absolute translate-middle-x bg-success rounded-circle shadow-sm" style={{width: 12, height: 12, left: 0, top: 12}}></div>
                        <div className="p-3 rounded-4 bg-light bg-opacity-50">
                          <div className="d-flex justify-content-between mb-2">
                            <span className="fw-bold small">{n.title}</span>
                            <span className="badge bg-primary px-2 py-1 rounded-pill" style={{fontSize: '9px'}}>{n.targetRole}</span>
                          </div>
                          <p className="text-muted mb-2" style={{fontSize: '13px'}}>{n.message}</p>
                          <div className="d-flex align-items-center gap-1 text-muted" style={{fontSize: '10px'}}>
                            <FiCheckCircle className="text-success" /> {new Date(n.createdOn).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted text-center py-3 small">No recent activity.</p>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      <style>{`
        .ls-1 { letter-spacing: 1px; }
        .animate-fade-in { animation: fadeIn 0.4s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }
        .form-control, .form-select { transition: all 0.2s ease; border-color: #eee; }
        .form-control:focus, .form-select:focus { 
          border-color: #4361ee !important; 
          background: #fff !important; 
          box-shadow: 0 0 0 4px rgba(67, 97, 238, 0.1) !important; 
        }
        .btn-primary { background: #4361ee; border: none; }
        .btn-primary:hover { background: #3046c9; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(67, 97, 238, 0.25); }
        .transition-all { transition: all 0.3s ease; }
        .shadow-blue { box-shadow: 0 4px 14px 0 rgba(67, 97, 238, 0.3); }
        .border-dashed { border: 2px dashed #e2e8f0; }
        .history-timeline .border-start { border-color: #e2e8f0 !important; border-width: 2px !important; }
      `}</style>
    </div>
  );
};

export default NotificationPanel;