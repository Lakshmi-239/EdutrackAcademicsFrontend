import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

const navItems = [
  { path: "/coordinator/dashboard", label: "Dashboard", icon: "bi-speedometer2" },
  { path: "/coordinator/programs", label: "Programs", icon: "bi-journal-bookmark" },
  { path: "/coordinator/courses", label: "Courses", icon: "bi-book" },
  { path: "/coordinator/batch", label: "Batch Management", icon: "bi-diagram-3" },
  { path: "/coordinator/instructors", label: "Instructors", icon: "bi-person-badge" },
  { path: "/coordinator/students", label: "Students", icon: "bi-person-lines-fill" },
  { path: "/coordinator/reports", label: "Reports", icon: "bi-bar-chart" },
    { path: "/coordinator/notifications", label: "Notifications", icon: "bi-bell-fill" },
];
const {logout}=useAuth();
const navigate=useNavigate();
const handleLogout=()=>{
  logout();
  navigate("/login");
}

  return (
    <aside className="bg-dark text-white p-3 vh-100">
      <h4 className="mb-4">Coordinator Dashboard</h4>
      <ul className="nav flex-column">
        {navItems.map((item) => (
          <li className="nav-item mb-2" key={item.path}>
            <Link
              className={`nav-link text-white ${
                location.pathname === item.path ? "fw-bold bg-secondary rounded" : ""
              }`}
              to={item.path}
            >
              <i className={`${item.icon} me-2`}></i>
              {item.label}
            </Link>

          </li>
        ))}
      </ul>
      <div className="mt-auto pt-3">
  <button
    onClick={handleLogout}
    className="w-100 py-2 text-white bg-danger border-0 rounded"
    style={{ fontWeight: "500" }}
  >
    Logout
  </button>
</div>
    </aside>
  );
};

export default Sidebar;