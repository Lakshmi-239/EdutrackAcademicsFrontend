import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "bootstrap-icons/font/bootstrap-icons.css";

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
    <aside className="d-flex flex-column vh-100 sticky-top border-end border-slate-800" 
           style={{ width: "280px", backgroundColor: "#0f172a", transition: "all 0.3s", zIndex: 1050 }}>
      
      {/* --- BRAND HEADER --- */}
      <div className="p-4 mb-2 d-flex align-items-center">
        <div className="p-2 rounded-3 me-3 d-flex align-items-center justify-content-center shadow-sm" 
             style={{ background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)", width: "40px", height: "40px", minWidth: "40px" }}>
          <i className="bi bi-mortarboard-fill text-white fs-5"></i>
        </div>
        <div className="overflow-hidden">
          <h5 className="text-white fw-bold mb-0 tracking-tight">Edu<span className="text-teal">Track</span></h5>
          <span className="text-slate-500 uppercase fw-black d-block" style={{ fontSize: '10px', letterSpacing: '1px' }}>Coordinator</span>
        </div>
      </div>

      {/* --- NAV ITEMS --- */}
      {/* Ensure flex-column is strictly applied to the nav container */}
      <div className="nav flex-column gap-1 px-3 mb-auto overflow-y-auto custom-scrollbar flex-nowrap">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link d-flex align-items-center px-3 py-2.5 rounded-3 mb-1 transition-all text-decoration-none ${
                isActive ? "active-pill" : "inactive-pill"
              }`}
              style={{ width: '100%' }}
            >
              <i className={`${item.icon} fs-5 me-3 flex-shrink-0 ${isActive ? "text-teal" : "text-slate-400 opacity-70"}`}></i>
              <span className={`fw-medium text-truncate ${isActive ? "text-white" : "text-slate-400"}`} style={{ fontSize: '0.9rem' }}>
                {item.label}
              </span>
              {isActive && (
                <div className="ms-auto rounded-circle bg-teal flex-shrink-0" 
                     style={{ width: '6px', height: '6px', boxShadow: '0 0 10px #14b8a6' }}>
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* --- FOOTER / LOGOUT --- */}
      <div className="p-4 border-top border-slate-800">
        <button
          onClick={() => { logout(); navigate("/login"); }}
          className="btn logout-btn w-100 rounded-3 d-flex align-items-center justify-content-center py-2 border-0"
        >
          <i className="bi bi-box-arrow-left me-2"></i> Sign Out
        </button>
      </div>

      <style>{`
        .text-teal { color: #14b8a6 !important; }
        .bg-teal { background-color: #14b8a6 !important; }
        .border-slate-800 { border-color: #1e293b !important; }
        .text-slate-400 { color: #94a3b8 !important; }
        .text-slate-500 { color: #64748b !important; }

        .active-pill {
          background-color: rgba(20, 184, 166, 0.1) !important;
          border: 1px solid rgba(20, 184, 166, 0.2) !important;
        }

        .inactive-pill:hover {
          background-color: rgba(255, 255, 255, 0.03);
          transform: translateX(4px);
        }

        .inactive-pill:hover span {
          color: #f1f5f9 !important;
        }

        .logout-btn {
          background-color: rgba(244, 63, 94, 0.1);
          color: #fb7185;
          font-weight: 600;
          font-size: 0.85rem;
          transition: all 0.3s;
        }

        .logout-btn:hover {
          background-color: rgba(244, 63, 94, 0.2);
          color: #fda4af;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .tracking-tight { letter-spacing: -0.5px; }
        
        /* Fix for potential horizontal overflow/wrapping */
        .nav-link {
            white-space: nowrap;
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;