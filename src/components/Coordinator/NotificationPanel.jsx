import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FiSend, FiBell, FiClock, FiCheckCircle, FiUsers, 
  FiAlertTriangle, FiLayers, FiUser, FiZap, FiTarget 
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
    if (token) {
      fetchInitialData();
    }
    const savedSent = JSON.parse(localStorage.getItem("coordinator_sent_history")) || [];
    setSentNotifications(savedSent);
  }, [token]);

  const fetchInitialData = async () => {
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
      setErrorMsg("Failed to load list data. Please refresh.");
    }
  };

  const handleSend = async () => {
    if (!newNotification.title || !newNotification.message) {
      setErrorMsg("Please provide both a subject and a message.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const payload = {
        title: newNotification.title,
        message: newNotification.message,
        targetRole: newNotification.targetRole,
        targetId: newNotification.targetRole === "Instructor" ? Number(newNotification.targetId) : null,
        batchIdString: newNotification.targetRole === "Batch" ? newNotification.batchIdString : null
      };

      await axios.post("https://localhost:7157/api/notifications/create", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const sentItem = { ...payload, createdOn: new Date().toISOString() };
      const updatedSent = [sentItem, ...sentNotifications]; 
      localStorage.setItem("coordinator_sent_history", JSON.stringify(updatedSent.slice(0, 10)));
      setSentNotifications(updatedSent);
      
      setNewNotification({ title: "", message: "", targetRole: "Student", targetId: "", batchIdString: "" });
      alert("Notification Broadcasted Successfully!");
      
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to broadcast.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="notif-mgmt-dark min-vh-100 pb-5">
      <div className="container py-5">
        
        {/* Header Section */}
        <div className="mb-5">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3" 
               style={{ background: "rgba(20, 184, 166, 0.1)", border: "1px solid rgba(20, 184, 166, 0.2)" }}>
            <FiZap className="text-teal" />
            <span className="text-teal fw-bold small uppercase tracking-wider">Communication Hub</span>
          </div>
          <h1 className="display-6 fw-bold text-white mb-2">Notification Center</h1>
          <p className="text-slate-400">Manage real-time announcements and institutional broadcasts.</p>
        </div>

        <div className="row g-4 justify-content-center">
          
          {/* LEFT: BROADCAST FORM */}
          <div className="col-xl-7 col-lg-8">
            <div className="form-card-dark p-4 p-md-5">
              <div className="d-flex align-items-center gap-3 mb-5">
                <div className="icon-box-teal">
                  <IoMegaphoneOutline size={26} />
                </div>
                <div>
                  <h4 className="fw-bold text-white mb-0">New Announcement</h4>
                  <small className="text-slate-500">Reach specific audiences instantly</small>
                </div>
              </div>

              {errorMsg && (
                <div className="alert-dark mb-4">
                  <FiAlertTriangle className="me-2" /> {errorMsg}
                </div>
              )}

              <div className="mb-4">
                <label className="label-dark">Announcement Subject</label>
                <input 
                  className="input-dark"
                  placeholder="e.g., Campus Maintenance Update"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                />
              </div>

              <div className="row g-3 mb-4">
                <div className={["Instructor", "Batch"].includes(newNotification.targetRole) ? "col-md-6" : "col-12"}>
                  <label className="label-dark">Target Audience</label>
                  <div className="position-relative">
                    <FiTarget className="select-icon" />
                    <select 
                      className="input-dark ps-5"
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

                {newNotification.targetRole === "Instructor" && (
                  <div className="col-md-6 animate-fade-in">
                    <label className="label-dark text-teal">Select Instructor</label>
                    <div className="position-relative">
                      <FiUser className="select-icon text-teal" />
                      <select 
                        className="input-dark ps-5 border-teal-soft"
                        value={newNotification.targetId}
                        onChange={(e) => setNewNotification({...newNotification, targetId: e.target.value})}
                      >
                        <option value="">-- All Instructors --</option>
                        {instructors.map(i => <option key={i.userId} value={i.userId}>{i.fullName}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                {newNotification.targetRole === "Batch" && (
                  <div className="col-md-6 animate-fade-in">
                    <label className="label-dark text-teal">Select Batch</label>
                    <div className="position-relative">
                      <FiLayers className="select-icon text-teal" />
                      <select 
                        className="input-dark ps-5 border-teal-soft"
                        value={newNotification.batchIdString}
                        onChange={(e) => setNewNotification({...newNotification, batchIdString: e.target.value})}
                      >
                        <option value="">-- Choose Batch --</option>
                        {batches.map(b => <option key={b.batchId} value={b.batchId}>{b.batchId}</option>)}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-5">
                <label className="label-dark">Message Detail</label>
                <textarea 
                  className="input-dark p-3"
                  rows="5"
                  placeholder="Type your announcement here..."
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                ></textarea>
              </div>

              <button 
                className={`btn-teal-lg w-100 ${loading ? 'opacity-50 pointer-events-none' : ''}`}
                onClick={handleSend}
                disabled={loading}
              >
                {loading ? "Broadcasting..." : <><FiSend className="me-2" /> Dispatch Notification</>}
              </button>
            </div>
          </div>

          {/* RIGHT: ADMIN LOGS & HISTORY */}
          <div className="col-xl-5 col-lg-4">
            <div className="d-flex flex-column gap-4">
              
              {/* Incoming Alerts Card */}
              <div className="form-card-dark p-4">
                <h6 className="fw-bold text-slate-300 text-uppercase mb-4 d-flex align-items-center gap-2" style={{fontSize: '0.75rem', letterSpacing: '1px'}}>
                  <FiBell className="text-warning" /> Incoming Alerts
                </h6>
                <div className="custom-scroll">
                  {adminNotifications.length > 0 ? (
                    adminNotifications.map((n, i) => (
                      <div key={i} className="admin-msg-box mb-3">
                        <p className="fw-bold text-white small mb-1">{n.title}</p>
                        <p className="text-slate-400 small mb-0">{n.message}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-slate-500 small">No admin alerts found</div>
                  )}
                </div>
              </div>

              {/* Recent Activity Card */}
              <div className="form-card-dark p-4">
                <h6 className="fw-bold text-slate-300 text-uppercase mb-4 d-flex align-items-center gap-2" style={{fontSize: '0.75rem', letterSpacing: '1px'}}>
                  <FiClock className="text-teal" /> Recent Activity (Last 3)
                </h6>
                <div className="history-timeline-dark ps-2">
                  {sentNotifications.length > 0 ? (
                    sentNotifications.slice(0, 3).map((n, i) => (
                      <div key={i} className="timeline-item-dark">
                        <div className="timeline-dot-teal"></div>
                        <div className="timeline-content-dark">
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <span className="fw-bold text-white text-truncate me-2" style={{fontSize: '0.85rem'}}>{n.title}</span>
                            <span className="badge-teal-tiny">{n.targetRole}</span>
                          </div>
                          <p className="text-slate-500 mb-2 text-truncate small">{n.message}</p>
                          <div className="text-slate-600 d-flex align-items-center gap-1" style={{fontSize: '10px'}}>
                            <FiCheckCircle className="text-teal" /> {new Date(n.createdOn).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-600 text-center py-3 small">No recent broadcasts.</p>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      <style>{`
        .notif-mgmt-dark { background-color: #020617; font-family: 'Inter', sans-serif; }
        .text-teal { color: #14b8a6 !important; }
        .text-slate-400 { color: #94a3b8 !important; }
        .text-slate-500 { color: #64748b !important; }
        .text-slate-600 { color: #334155 !important; }
        .text-slate-300 { color: #cbd5e1 !important; } /* Made brighter as requested */

        .form-card-dark {
          background: #0f172a; border-radius: 28px; border: 1px solid #1e293b;
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        }

        .icon-box-teal {
          width: 54px; height: 54px; background: rgba(20, 184, 166, 0.1);
          color: #14b8a6; border-radius: 16px; display: flex; align-items: center; justify-content: center;
        }

        .label-dark {
          font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;
          letter-spacing: 0.5px; margin-bottom: 8px; display: block;
        }

        .input-dark {
          background: #020617; border: 1px solid #1e293b; border-radius: 14px;
          color: white; padding: 12px 16px; width: 100%; transition: 0.3s;
          outline: none;
        }
        .input-dark:focus { border-color: #14b8a6; box-shadow: 0 0 0 4px rgba(20, 184, 166, 0.1); }
        .border-teal-soft { border-color: rgba(20, 184, 166, 0.3) !important; }

        .select-icon { position: absolute; top: 50%; left: 18px; transform: translateY(-50%); color: #475569; }

        .btn-teal-lg {
          background: #14b8a6; color: white; border: none; padding: 16px;
          border-radius: 14px; font-weight: 700; transition: 0.3s;
        }
        .btn-teal-lg:hover { background: #0d9488; transform: translateY(-2px); }

        .alert-dark {
          background: rgba(244, 63, 94, 0.1); border: 1px solid rgba(244, 63, 94, 0.2);
          color: #fb7185; padding: 12px 16px; border-radius: 12px; font-size: 0.9rem;
        }

        .admin-msg-box { background: #020617; border-left: 3px solid #f59e0b; padding: 12px; border-radius: 8px; }
        .history-timeline-dark { border-left: 1px solid #1e293b; }
        .timeline-item-dark { position: relative; padding-left: 24px; padding-bottom: 24px; }
        .timeline-dot-teal { position: absolute; left: -5px; top: 5px; width: 9px; height: 9px; background: #14b8a6; border-radius: 50%; box-shadow: 0 0 8px #14b8a6; }
        .timeline-content-dark { background: #020617; padding: 12px; border-radius: 12px; border: 1px solid #1e293b; }
        .badge-teal-tiny { background: rgba(20, 184, 166, 0.1); color: #14b8a6; padding: 2px 8px; border-radius: 6px; font-size: 9px; font-weight: 800; text-transform: uppercase; }

        .animate-fade-in { animation: fadeIn 0.4s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default NotificationPanel;