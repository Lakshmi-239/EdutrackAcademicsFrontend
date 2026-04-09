import React, { useState, useEffect } from "react";
import axios from "axios";
 
const NotificationPanel = () => {
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    targetRole: "Instructor",
  });
  const [adminNotifications, setAdminNotifications] = useState([]);
  const [sentNotifications, setSentNotifications] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
 
  // get token from localStorage instead of AuthContext
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
 
      const admin = res.data.filter((n) => n.createdByRole === "Admin");
      const sent = res.data.filter(
        (n) => n.createdByRole === "Coordinator" || n.createdByRole === "System"
      );
 
      setAdminNotifications(admin);
      setSentNotifications(sent);
      setErrorMsg("");
    } catch (err) {
      console.error("Error fetching notifications:", err.response || err.message);
      setErrorMsg(err.response?.data || "Error fetching notifications. Check console.");
    }
  };
 
  useEffect(() => {
    fetchNotifications();
  }, []); // only on mount
 
  const handleChange = (e) => {
    setNewNotification({ ...newNotification, [e.target.name]: e.target.value });
  };
 
  const handleSend = async () => {
    if (!newNotification.title || !newNotification.message) {
      setErrorMsg("Please enter both title and message.");
      return;
    }
 
    if (!token) {
      setErrorMsg("Authorization token missing! Please login again.");
      return;
    }
 
    try {
      const res = await axios.post(
        "https://localhost:7157/api/notifications/create",
        newNotification,
        { headers: { Authorization: `Bearer ${token}` } }
      );
 
      console.log("Notification sent:", res.data);
      setErrorMsg("");
      setNewNotification({ title: "", message: "", targetRole: "Instructor" });
      fetchNotifications();
    } catch (err) {
      console.error("Error sending notification:", err.response || err.message);
      setErrorMsg(err.response?.data || "Error sending notification");
    }
  };
 
  return (
    <div className="container my-4">
      <h2 className="mb-4 text-primary fw-bold">Notifications Center</h2>
 
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
 
      {/* Admin Notifications */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-info text-white fw-bold">
          Notifications from Admin
        </div>
        <div className="card-body">
          {adminNotifications.length > 0 ? (
            adminNotifications.map((note) => (
              <div key={note.notificationId} className="alert alert-light border mb-3">
                <strong>{note.title}</strong>
                <p className="mb-0 text-muted">{note.message}</p>
                <small className="text-muted">{new Date(note.createdOn).toLocaleString()}</small>
              </div>
            ))
          ) : (
            <p className="text-muted">No notifications from admin.</p>
          )}
        </div>
      </div>
 
      {/* Send Notification Form */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-success text-white fw-bold">
          Send Notification
        </div>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label fw-bold">Title</label>
            <input
              type="text"
              className="form-control"
              name="title"
              value={newNotification.title}
              onChange={handleChange}
              placeholder="Enter notification title"
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Message</label>
            <textarea
              className="form-control"
              name="message"
              value={newNotification.message}
              onChange={handleChange}
              placeholder="Enter notification message"
              rows="3"
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Recipient Role</label>
            <select
              className="form-select"
              name="targetRole"
              value={newNotification.targetRole}
              onChange={handleChange}
            >
              <option value="Instructor">Instructor</option>
              <option value="Student">Student</option>
              <option value="Batch">Batch</option>
              <option value="All">All</option>
            </select>
          </div>
          <button className="btn btn-success" onClick={handleSend}>
            Send Notification
          </button>
        </div>
      </div>
 
      {/* Sent Notifications */}
      <div className="card shadow-sm">
        <div className="card-header bg-warning fw-bold">Sent Notifications</div>
        <div className="card-body">
          {sentNotifications.length > 0 ? (
            sentNotifications.map((note) => (
              <div key={note.notificationId} className="alert alert-secondary mb-3">
                <strong>{note.title}</strong>
                <p className="mb-0 text-muted">{note.message}</p>
                <small className="text-muted">{new Date(note.createdOn).toLocaleString()}</small>
                <span className="badge bg-info ms-2">{note.targetRole}</span>
                <span className="badge bg-dark ms-2">{note.createdByRole}</span>
              </div>
            ))
          ) : (
            <p className="text-muted">No notifications sent yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};
 
export default NotificationPanel;