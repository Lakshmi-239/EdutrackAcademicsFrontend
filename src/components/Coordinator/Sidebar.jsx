import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { path: "/coordinator/dashboard", label: "Dashboard", icon: "bi-grid-1x2-fill" },
    { path: "/coordinator/programs", label: "Programs", icon: "bi-journal-code" },
    { path: "/coordinator/courses", label: "Courses", icon: "bi-book-half" },
    { path: "/coordinator/batch", label: "Batch Management", icon: "bi-people-fill" },
    { path: "/coordinator/instructors", label: "Instructors", icon: "bi-person-badge-fill" },
    { path: "/coordinator/students", label: "Students", icon: "bi-mortarboard-fill" },
    { path: "/coordinator/reports", label: "Reports", icon: "bi-pie-chart-fill" },
    { path: "/coordinator/notifications", label: "Notifications", icon: "bi-bell-fill" },
  ];

  return (
    <aside className="d-flex flex-column p-4 vh-100 sticky-top" style={{ width: "280px", backgroundColor: "#0f172a" }}>
      <div className="mb-5 d-flex align-items-center">
        <div className="p-2 bg-primary rounded-3 me-3">
          <i className="bi bi-mortarboard text-white fs-4"></i>
        </div>
        <h5 className="text-white fw-bold mb-0">EduPortal</h5>
      </div>

      <div className="nav flex-column gap-2 mb-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link-custom ${location.pathname === item.path ? "active" : ""}`}
          >
            <i className={`${item.icon} me-3 fs-5`}></i>
            <span className="fw-medium">{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="pt-4 border-top border-secondary">
        <button
          onClick={() => { logout(); navigate("/login"); }}
          className="btn btn-outline-danger w-100 rounded-3 d-flex align-items-center justify-content-center"
        >
          <i className="bi bi-box-arrow-left me-2"></i> Logout
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;