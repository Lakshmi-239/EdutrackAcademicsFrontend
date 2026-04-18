import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate
import { FiBell, FiClock, FiShield, FiAlertCircle, FiArrowLeft } from "react-icons/fi"; // Added FiArrowLeft

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate(); // 2. Initialize navigate

  const token = localStorage.getItem("authToken");

  const fetchNotifications = async () => {
    if (!token) {
      setErrorMsg("Authorization token missing! Please login again.");
      return;
    }

    try {
      const res = await axios.get(
        "https://localhost:7157/api/notifications/my-notifications",
        { headers: { Authorization: `Bearer ${token}` } }
      );

    const studentNotes = res.data.filter(
  (n) => n.targetRole === "Student" || n.targetRole === "All" || n.targetRole === "Batch"
);

      setNotifications(studentNotes);
      setErrorMsg("");
    } catch (err) {
      console.error("Error fetching notifications:", err.response || err.message);
      setErrorMsg(err.response?.data || "Error fetching notifications.");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="notifications-wrapper" style={{ backgroundColor: "#020617", minHeight: "100vh", color: "#f8fafc", padding: "2rem" }}>
      <div className="container" style={{ maxWidth: "900px" }}>
        
        {/* Navigation / Back Button Section */}
        <div className="mb-4">
          <button 
            onClick={() => navigate("/studentdashboard")} // Adjust path as needed
            className="btn d-inline-flex align-items-center gap-2 text-slate-400 p-0 border-0 hover-text-white transition-all"
            style={{ background: 'none' }}
          >
            <FiArrowLeft /> Back to Student Dashboard
          </button>
        </div>

        {/* Header Section */}
        <div className="mb-4 d-flex align-items-center gap-3">
          <div className="bg-info bg-opacity-10 p-3 rounded-4">
            <FiBell size={28} className="text-info" />
          </div>
          <div>
            <h2 className="fw-bold text-white mb-0">Student Notifications</h2>
            <p className="text-slate-400 mb-0">Stay updated with the latest campus announcements.</p>
          </div>
        </div>

        {errorMsg && (
          <div className="alert border-0 bg-danger bg-opacity-10 text-danger rounded-4 d-flex align-items-center gap-2 mb-4">
            <FiAlertCircle /> {errorMsg}
          </div>
        )}

        {/* Notifications List */}
        <div className="d-flex flex-column gap-3">
          {notifications.length > 0 ? (
            notifications.map((note) => (
              <div 
                key={note.notificationId} 
                className="card border-slate-800 bg-slate-900 shadow-sm rounded-4 hover-dark-bg transition-all overflow-hidden"
              >
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="fw-bold text-white mb-0">{note.title}</h5>
                    <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 px-3 py-2 rounded-pill small">
                      <FiShield className="me-1" /> {note.createdByRole}
                    </span>
                  </div>
                  
                  <p className="text-slate-400 mb-3" style={{ fontSize: "1rem", lineHeight: "1.6" }}>
                    {note.message}
                  </p>

                  <div className="d-flex align-items-center gap-2 text-slate-500 extra-small mt-2 pt-3 border-top border-slate-800">
                    <FiClock />
                    <span>{new Date(note.createdOn).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-5 rounded-4 border border-dashed border-slate-800">
              <FiBell size={40} className="text-slate-700 mb-3" />
              <p className="text-slate-500">No new notifications for you at this time.</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .hover-dark-bg:hover { 
          background-color: #1e293b !important; 
          transform: translateY(-2px);
        }
        .hover-text-white:hover {
          color: #ffffff !important;
          transform: translateX(-3px);
        }
        .text-slate-400 { color: #94a3b8 !important; }
        .text-slate-500 { color: #64748b !important; }
        .text-slate-700 { color: #334155 !important; }
        .border-slate-800 { border-color: #1e293b !important; }
        .bg-slate-900 { background-color: #0f172a !important; }
        .extra-small { font-size: 12px; }
        .transition-all { transition: all 0.2s ease-in-out; }
      `}</style>
    </div>
  );
};

export default Notifications;