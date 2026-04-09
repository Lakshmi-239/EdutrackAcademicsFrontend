import { FaBars, FaHome, FaFileAlt, FaUsers, FaBook, FaClipboardList, FaGraduationCap } from "react-icons/fa";
import { NavLink } from "react-router-dom";

function SideBar({ collapsed, setCollapsed }) {
  return (
    <div 
      className={`bg-body-tertiary border-end vh-100 p-2 transition-all ${collapsed ? "col-1" : "col-2"}`} 
      style={{ width: collapsed ? "70px" : "240px", transition: "0.3s" }}
    >
      <div className="d-flex align-items-center p-2 mb-4">
        <button className="btn btn-outline-secondary border-0" onClick={() => setCollapsed(!collapsed)}>
          <FaBars /> 
        </button>
        {!collapsed && <span className="fw-bold ms-2 text-body text-nowrap">Instructor Portal</span>}
      </div>

      <div className="nav flex-column nav-pills">
        <NavLink to="/instructordashboard" className="nav-link text-body mb-2 d-flex align-items-center">
          <FaHome /> {!collapsed && <span className="ms-2">Home</span>}
        </NavLink>
        <NavLink to="/Icourses" className="nav-link text-body mb-2 d-flex align-items-center">
          <FaBook /> {!collapsed && <span className="ms-2">Courses</span>}
        </NavLink>
        <NavLink to="/Iattendances" className="nav-link text-body mb-2 d-flex align-items-center">
          <FaGraduationCap /> {!collapsed && <span className="ms-2">Attendance</span>}
        </NavLink>
        <NavLink to="/Imodules" className="nav-link text-body mb-2 d-flex align-items-center">
          <FaFileAlt /> {!collapsed && <span className="ms-2">Modules</span>}
        </NavLink>
        <NavLink to="/Iassessments" className="nav-link text-body mb-2 d-flex align-items-center">
          <FaClipboardList /> {!collapsed && <span className="ms-2">Assessments</span>}
        </NavLink>
      </div>
    </div>
  );
}

export default SideBar;