import { FaBars, FaHome, FaBook, FaClipboardList, FaGraduationCap } from "react-icons/fa";
import { NavLink } from "react-router-dom";

function Sidebar({ collapsed, setCollapsed }) {
  return (
    <div 
      className={`bg-body-tertiary border-end vh-100 p-2 transition-all ${collapsed ? "col-1" : "col-2"}`} 
      style={{ width: collapsed ? "70px" : "240px", transition: "0.3s" }}
    >
      <div className="d-flex align-items-center p-2 mb-4">
        <button className="btn btn-outline-secondary border-0" onClick={() => setCollapsed(!collapsed)}>
          <FaBars /> 
        </button>
        {!collapsed && <span className="fw-bold ms-2 text-body text-nowrap">EduTrack Portal</span>}
      </div>

      <div className="nav flex-column nav-pills">
        <NavLink to="/studentdashboard" className="nav-link text-body mb-2 d-flex align-items-center">
          <FaHome /> {!collapsed && <span className="ms-2">Home</span>}
        </NavLink>
        <NavLink to="/courses" className="nav-link text-body mb-2 d-flex align-items-center">
          <FaBook /> {!collapsed && <span className="ms-2">My Courses</span>}
        </NavLink>
        <NavLink to="/assignments" className="nav-link text-body mb-2 d-flex align-items-center">
          <FaClipboardList /> {!collapsed && <span className="ms-2">Assignments</span>}
        </NavLink>
        <NavLink to="/attendance" className="nav-link text-body mb-2 d-flex align-items-center">
          <FaGraduationCap /> {!collapsed && <span className="ms-2">Attendance</span>}
        </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;