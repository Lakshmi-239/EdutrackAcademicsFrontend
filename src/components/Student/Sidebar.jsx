import { FaBars, FaHome, FaBook, FaClipboardList, FaGraduationCap } from "react-icons/fa";
import { NavLink } from "react-router-dom";

function Sidebar({ collapsed, setCollapsed }) {
  return (
    <div
      className="h-full p-4 flex flex-col transition-all duration-300 bg-transparent"
      style={{ width: collapsed ? "80px" : "260px" }}
    >
      {/* Sidebar Header & Hamburger Menu */}
      <div className={`flex items-center mb-10 ${collapsed ? "justify-center" : "px-2"}`}>
        <button 
          className="p-2 rounded-xl transition-all bg-transparent border-0 shadow-none flex items-center justify-center group" 
          onClick={() => setCollapsed(!collapsed)}
        >
          {/* Hamburger icon changes to Teal on hover to match brand */}
          <FaBars size={22} className="text-slate-400 group-hover:text-teal-400 transition-colors" /> 
        </button>
        {!collapsed && (
          <span className="font-black ms-3 text-white tracking-widest uppercase text-[11px] opacity-60">
            EduTrack Portal
          </span>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-3">
        <MenuLink to="/studentdashboard" icon={<FaHome />} label="Dashboard" collapsed={collapsed} />
        <MenuLink to="/courses" icon={<FaBook />} label="My Learning" collapsed={collapsed} />
        <MenuLink to="/assignments" icon={<FaClipboardList />} label="Assignments" collapsed={collapsed} />
        <MenuLink to="/attendance" icon={<FaGraduationCap />} label="Attendance" collapsed={collapsed} />
      </div>
    </div>
  );
}

const MenuLink = ({ to, icon, label, collapsed }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => `
      flex items-center transition-all duration-300 rounded-xl py-3 !no-underline
      ${collapsed ? "justify-center px-0" : "px-4"}
      ${isActive 
        ? "bg-emerald-500/10 !text-teal-400 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)] font-bold" 
        : "!text-slate-400 hover:!text-slate-100 hover:bg-slate-800/40"}
    `}
  >
    <span className="text-xl">{icon}</span>
    {!collapsed && <span className="ml-3 text-sm tracking-wide">{label}</span>}
  </NavLink>
);

export default Sidebar;