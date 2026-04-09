import React, { useEffect, useState } from "react";
import axios from "axios";
 
const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
 
  // Get token from localStorage
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
 
      // Filter only notifications for Student role
      const studentNotes = res.data.filter(
        (n) =>
          n.targetRole === "Student" || n.targetRole === "All"
      );
 
      setNotifications(studentNotes);
      setErrorMsg("");
    } catch (err) {
      console.error("Error fetching notifications:", err.response || err.message);
      setErrorMsg(err.response?.data || "Error fetching notifications. Check console.");
    }
  };
 
  useEffect(() => {
    fetchNotifications();
  }, []);
 
  return (
    <div className="container my-4">
      <h2 className="mb-4 text-primary fw-bold">Student Notifications</h2>
 
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
 
      <div className="card shadow-sm">
        <div className="card-body">
          {notifications.length > 0 ? (
            notifications.map((note) => (
              <div key={note.notificationId} className="alert alert-light border mb-3">
                <strong>{note.title}</strong>
                <p className="mb-0 text-muted">{note.message}</p>
                <small className="text-muted">{new Date(note.createdOn).toLocaleString()}</small>
                <span className="badge bg-info ms-2">{note.createdByRole}</span>
              </div>
            ))
          ) : (
            <p className="text-muted">No notifications for you.</p>
          )}
        </div>
      </div>
    </div>
  );
};
 
export default Notifications;