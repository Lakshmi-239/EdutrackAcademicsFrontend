import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FiSend, FiClock, FiCheckCircle, FiUsers, 
  FiAlertTriangle, FiLayers, FiUser, FiZap, FiTarget, FiShield
} from "react-icons/fi";
import { IoMegaphoneOutline } from "react-icons/io5";

const NotificationAdmin = () => {
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    targetRole: "Student",
    targetId: "",          
    batchIdString: ""      
  });

  const [coordinators, setCoordinators] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [batches, setBatches] = useState([]);
  const [sentNotifications, setSentNotifications] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (token) {
      fetchInitialData();
    }
    const savedSent = JSON.parse(localStorage.getItem("admin_sent_history")) || [];
    setSentNotifications(savedSent);
  }, [token]);

  const fetchInitialData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // Note: Using standard admin endpoints to get all entity lists
      const [coordRes, instRes, batchRes] = await Promise.all([
        axios.get("https://localhost:7157/api/admin/coordinatorsList", config),
        axios.get("https://localhost:7157/api/admin/instructorsList", config),
        axios.get("https://localhost:7157/api/admin/batchesList", config)
      ]);

      setCoordinators(coordRes.data);
      setInstructors(instRes.data);
      setBatches(batchRes.data);
    } catch (err) {
      setErrorMsg("Failed to load user lists. Please check your admin permissions.");
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
        // targetId handles both Coordinator and Instructor selection
        targetId: ["Instructor", "Coordinator"].includes(newNotification.targetRole) 
                  ? Number(newNotification.targetId) : null,
        batchIdString: newNotification.targetRole === "Batch" ? newNotification.batchIdString : null
      };

      await axios.post("https://localhost:7157/api/notifications/create", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const sentItem = { ...payload, createdOn: new Date().toISOString() };
      const updatedSent = [sentItem, ...sentNotifications]; 
      localStorage.setItem("admin_sent_history", JSON.stringify(updatedSent.slice(0, 15)));
      setSentNotifications(updatedSent);
      
      setNewNotification({ title: "", message: "", targetRole: "Student", targetId: "", batchIdString: "" });
      alert("Admin Global Broadcast Successful!");
      
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to broadcast notification.");
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
            <FiShield className="text-teal" />
            <span className="text-teal fw-bold small uppercase tracking-wider">System Administrator</span>
          </div>
          <h1 className="display-6 fw-bold text-white mb-2">Global <span className="text-teal">Broadcast</span></h1>
          <p className="text-slate-400">Dispatch authoritative notifications across all institutional roles.</p>
        </div>

        <div className="row g-4">
          
          {/* LEFT: BROADCAST FORM */}
          <div className="col-xl-8 col-lg-7">
            <div className="form-card-dark p-4 p-md-5">
              <div className="d-flex align-items-center gap-3 mb-5">
                <div className="icon-box-teal">
                  <IoMegaphoneOutline size={26} />
                </div>
                <div>
                  <h4 className="fw-bold text-white mb-0">Compose Notification</h4>
                  <small className="text-slate-500">Target specific roles or individuals system-wide</small>
                </div>
              </div>

              {errorMsg && (
                <div className="alert-dark mb-4">
                  <FiAlertTriangle className="me-2" /> {errorMsg}
                </div>
              )}

              <div className="mb-4">
                <label className="label-dark">Subject / Title</label>
                <input 
                  className="input-dark"
                  placeholder="e.g., End of Semester Holiday Notice"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                />
              </div>

              <div className="row g-3 mb-4">
                <div className={["Instructor", "Batch", "Coordinator"].includes(newNotification.targetRole) ? "col-md-6" : "col-12"}>
                  <label className="label-dark">Select Target Audience</label>
                  <div className="position-relative">
                    <FiTarget className="select-icon" />
                    <select 
                      className="input-dark ps-5"
                      value={newNotification.targetRole}
                      onChange={(e) => setNewNotification({...newNotification, targetRole: e.target.value, targetId: "", batchIdString: ""})}
                    >
                      <option value="Student">All Students</option>
                      <option value="Coordinator">Specific Coordinator</option>
                      <option value="Instructor">Specific Instructor</option>
                      <option value="Batch">Specific Batch</option>
                      <option value="All">Everyone (Global)</option>
                    </select>
                  </div>
                </div>

                {newNotification.targetRole === "Coordinator" && (
                  <div className="col-md-6 animate-fade-in">
                    <label className="label-dark text-teal">Choose Coordinator</label>
                    <div className="position-relative">
                      <FiUser className="select-icon text-teal" />
                      <select 
                        className="input-dark ps-5 border-teal-soft"
                        value={newNotification.targetId}
                        onChange={(e) => setNewNotification({...newNotification, targetId: e.target.value})}
                      >
                        <option value="">-- All Coordinators --</option>
                        {coordinators.map(c => <option key={c.userId} value={c.userId}>{c.fullName}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                {newNotification.targetRole === "Instructor" && (
                  <div className="col-md-6 animate-fade-in">
                    <label className="label-dark text-teal">Choose Instructor</label>
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
                    <label className="label-dark text-teal">Choose Batch</label>
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
                <label className="label-dark">Announcement Content</label>
                <textarea 
                  className="input-dark p-3"
                  rows="6"
                  placeholder="Detailed message content..."
                  value={newNotification.message}
                  onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                ></textarea>
              </div>

              <button 
                className={`btn-teal-lg w-100 ${loading ? 'opacity-50' : ''}`}
                onClick={handleSend}
                disabled={loading}
              >
                {loading ? "Global Sending..." : <><FiSend className="me-2" /> Dispatch Global Notice</>}
              </button>
            </div>
          </div>

          {/* RIGHT: BROADCAST HISTORY */}
          <div className="col-xl-4 col-lg-5">
            <div className="form-card-dark p-4">
              <h6 className="fw-bold text-slate-300 text-uppercase mb-4 d-flex align-items-center gap-2" style={{fontSize: '0.75rem', letterSpacing: '1px'}}>
                <FiClock className="text-teal" /> Outgoing Logs (Last 5)
              </h6>
              <div className="history-timeline-dark ps-2">
                {sentNotifications.length > 0 ? (
                  sentNotifications.slice(0, 5).map((n, i) => (
                    <div key={i} className="timeline-item-dark">
                      <div className="timeline-dot-teal"></div>
                      <div className="timeline-content-dark">
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <span className="fw-bold text-white text-truncate me-2" style={{fontSize: '0.85rem'}}>{n.title}</span>
                          <span className="badge-teal-tiny">{n.targetRole}</span>
                        </div>
                        <p className="text-slate-500 mb-2 text-truncate-2 small">{n.message}</p>
                        <div className="text-slate-600 d-flex align-items-center gap-1" style={{fontSize: '10px'}}>
                          <FiCheckCircle className="text-teal" /> {new Date(n.createdOn).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-5">
                    <FiSend size={30} className="text-slate-700 mb-2" />
                    <p className="text-slate-600 small">No notifications sent yet.</p>
                  </div>
                )}
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
        .text-slate-300 { color: #cbd5e1 !important; }

        .form-card-dark {
          background: #0f172a; border-radius: 28px; border: 1px solid #1e293b;
          box-shadow: 0 20px 50px rgba(0,0,0,0.4);
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

        .history-timeline-dark { border-left: 1px solid #1e293b; }
        .timeline-item-dark { position: relative; padding-left: 24px; padding-bottom: 24px; }
        .timeline-dot-teal { position: absolute; left: -5px; top: 5px; width: 9px; height: 9px; background: #14b8a6; border-radius: 50%; box-shadow: 0 0 8px #14b8a6; }
        .timeline-content-dark { background: #020617; padding: 12px; border-radius: 12px; border: 1px solid #1e293b; }
        .badge-teal-tiny { background: rgba(20, 184, 166, 0.1); color: #14b8a6; padding: 2px 8px; border-radius: 6px; font-size: 9px; font-weight: 800; text-transform: uppercase; }
        .text-truncate-2 {
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }

        .animate-fade-in { animation: fadeIn 0.4s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default NotificationAdmin;