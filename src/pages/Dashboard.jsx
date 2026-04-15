import React, { useEffect, useState } from "react";
import axios from "axios";
<<<<<<< HEAD
=======
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import the Auth Context
>>>>>>> 18bbe9b (adding data)
import DashboardCard from "../components/Coordinator/DashboardCard.jsx";
import {
  EnrollmentChart,
  PerformanceChart,
  StudentsByProgramChart,
  GenderDistributionChart,
} from "../components/Coordinator/Charts.jsx";
<<<<<<< HEAD
import "bootstrap/dist/css/bootstrap.min.css";
=======
import { FiHome, FiUser, FiLogOut, FiRefreshCw } from "react-icons/fi";
>>>>>>> 18bbe9b (adding data)

const Dashboard = () => {
  const { user, logout } = useAuth(); // Access user info and logout function
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const [stats, setStats] = useState([]);
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [studentsByProgramData, setStudentsByProgramData] = useState([]);
  const [genderDistributionData, setGenderDistributionData] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [batches, setBatches] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
<<<<<<< HEAD
  // Stats summary (already matches DashboardCard props)
  axios.get("https://localhost:7157/api/coordinator/dashboard/stats")
    .then(res => setStats(res.data));

  // Enrollment trends → backend gives { month, count }
  axios.get("https://localhost:7157/api/coordinator/dashboard/enrollment-trends")
    .then(res => {
      const formatted = res.data.map(item => ({
        course: `Month ${item.month}`,   // rename to "course"
        students: item.count             // rename to "students"
      }));
      setEnrollmentData(formatted);
    });

  // Performance → backend gives { batchId, progress }
  axios.get("https://localhost:7157/api/coordinator/dashboard/performance")
    .then(res => {
      const formatted = res.data.map(item => ({
        batch: item.batchId,             // rename to "batch"
        performance: item.progress       // rename to "performance"
      }));
      setPerformanceData(formatted);
    });

  // Students by program → backend gives { program, count }
  axios.get("https://localhost:7157/api/coordinator/dashboard/students-by-program")
    .then(res => {
      const formatted = res.data.map(item => ({
        program: item.program,           // keep "program"
        students: item.count             // rename to "students"
      }));
      setStudentsByProgramData(formatted);
    });

  // Gender distribution → backend gives { gender, count }
  axios.get("https://localhost:7157/api/coordinator/dashboard/gender-distribution")
    .then(res => {
      const formatted = res.data.map(item => ({
        gender: item.gender,             // keep "gender"
        value: item.count                // rename to "value"
      }));
      setGenderDistributionData(formatted);
    });

  // Notifications (already matches your UI)
  axios.get("https://localhost:7157/api/coordinator/dashboard/notifications")
    .then(res => setNotifications(res.data));

  // Batches overview
  axios.get("https://localhost:7157/api/coordinator/batches")
    .then(res => setBatches(res.data));

  // Instructors overview
  axios.get("https://localhost:7157/api/coordinator/instructors/all")
    .then(res => setInstructors(res.data));

  // Students overview
  axios.get("https://localhost:7157/api/coordinator/details")
    .then(res => setStudents(res.data));
}, []);
=======
    // API logic
    axios.get("https://localhost:7157/api/coordinator/dashboard/stats").then(res => setStats(res.data));
    axios.get("https://localhost:7157/api/coordinator/dashboard/enrollment-trends").then(res => {
      const formatted = res.data.map(item => ({ course: `Month ${item.month}`, students: item.count }));
      setEnrollmentData(formatted);
    });
    axios.get("https://localhost:7157/api/coordinator/dashboard/performance").then(res => {
      const formatted = res.data.map(item => ({ batch: item.batchId, performance: item.progress }));
      setPerformanceData(formatted);
    });
    axios.get("https://localhost:7157/api/coordinator/dashboard/students-by-program").then(res => {
      const formatted = res.data.map(item => ({ program: item.program, students: item.count }));
      setStudentsByProgramData(formatted);
    });
    axios.get("https://localhost:7157/api/coordinator/dashboard/gender-distribution").then(res => {
      const formatted = res.data.map(item => ({ gender: item.gender, value: item.count }));
      setGenderDistributionData(formatted);
    });
    axios.get("https://localhost:7157/api/coordinator/dashboard/notifications").then(res => setNotifications(res.data));
    axios.get("https://localhost:7157/api/coordinator/instructors/all").then(res => setInstructors(res.data));
    axios.get("https://localhost:7157/api/coordinator/details").then(res => setStudents(res.data));
  }, []);
>>>>>>> 18bbe9b (adding data)

  // Handle Logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-wrapper" style={{ backgroundColor: "#020617", minHeight: "100vh", color: "#f8fafc" }}>
      
      {/* --- TOP NAVIGATION BAR --- */}
      <nav className="navbar navbar-expand-lg border-bottom border-slate-800 sticky-top" style={{ backgroundColor: "#0f172a", padding: "0.75rem 2rem", zIndex: 1050 }}>
        <div className="container-fluid d-flex justify-content-between align-items-center">
          
          {/* Logo Section */}
          <Link to="/" className="text-decoration-none d-flex align-items-center">
            <span className="bg-primary text-white px-3 py-2 rounded-3 fw-bold shadow-sm me-2" style={{ backgroundColor: "#3b82f6 !important" }}>Edu</span>
            <span className="fs-4 fw-bold text-white">Track</span>
          </Link>

          {/* Right Action Cluster */}
          <div className="d-flex align-items-center gap-3">
            <button 
              className="btn btn-outline-light rounded-pill px-4 d-flex align-items-center gap-2 border-slate-700 hover-bg-slate"
              onClick={() => navigate("/")}
              style={{ fontSize: "0.9rem", fontWeight: "500" }}
            >
              <FiHome size={18} className="text-primary" /> <span className="d-none d-md-inline">Home</span>
            </button>

            <button 
              className="btn rounded-pill px-4 d-flex align-items-center gap-2"
              onClick={() => window.location.reload()}
              style={{ backgroundColor: "#1e293b", color: "#cbd5e1", fontSize: "0.9rem" }}
            >
              <FiRefreshCw size={16} /> <span className="d-none d-md-inline">Refresh</span>
            </button>

            {/* --- UPDATED PROFILE SECTION WITH DROPDOWN --- */}
            <div className="position-relative">
              <div 
                className="d-flex align-items-center gap-2 bg-slate-800 border border-slate-700 rounded-pill p-1 pe-3"
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProfileMenu(!showProfileMenu);
                }}
              >
                <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px', backgroundColor: '#1e293b' }}>
                  <FiUser size={20} className="text-info" />
                </div>
                <div className="text-start d-none d-md-block">
                  <div className="fw-bold text-white" style={{ fontSize: '0.85rem', lineHeight: '1.2' }}>
                    {user?.roles?.[0] || "Coordinator"}
                  </div>
                  <div className="text-muted" style={{ fontSize: '10px' }}>Manage Account</div>
                </div>
              </div>

              {/* Profile Dropdown Menu */}
             {/* Profile Dropdown Menu */}
{showProfileMenu && (
  <div 
    className="position-absolute end-0 mt-3 shadow-lg rounded-4 border border-slate-700 p-3" 
    style={{ backgroundColor: "#0f172a", minWidth: "260px", zIndex: 1100 }}
    onClick={(e) => e.stopPropagation()}
  >
    <div className="text-center mb-3">
      <div className="bg-info bg-opacity-10 text-info rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{ width: '50px', height: '50px' }}>
        <FiUser size={24} />
      </div>
      {/* Displaying the Role Name here */}
      <h6 className="text-white mb-0">
        {user?.roles?.length > 0 ? user.roles[0] : "Coordinator"}
      </h6>
      <small className="text-slate-500">{user?.email}</small>
    </div>
    
    <div className="border-top border-slate-800 pt-3 mt-2">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="text-slate-400 small">Role:</span>
        {/* This dynamically gets the role from your token */}
        <span className="text-info small fw-bold">
          {user?.roles?.includes("Coordinator") ? "Coordinator" : user?.roles?.[0] || "User"}
        </span>
      </div>
      
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-slate-400 small">Status:</span>
        <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 small">
          Active
        </span>
      </div>

      <button 
        className="btn btn-outline-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-2 rounded-pill mt-2"
        onClick={handleLogout}
      >
        <FiLogOut size={14} /> Log Out
      </button>
    </div>
  </div>
)}
            </div>
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <div className="p-4 mx-auto" style={{ maxWidth: "1600px" }} onClick={() => setShowProfileMenu(false)}>
        
        {/* HEADER */}
        <div className="mb-4 d-flex justify-content-between align-items-end">
          <div>
            <h2 className="fw-bold text-white mb-1">Management Insights</h2>
            <p className="text-slate-400 mb-0">Welcome back! Here is what's happening today.</p>
          </div>
          <div className="text-end d-none d-md-block">
            <span className="badge border border-slate-700 text-slate-300 px-3 py-2 rounded-pill bg-slate-900 shadow-sm">
              Date: {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* TOP STATS */}
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-5">
          {stats.map((item, index) => (
            <div className="col" key={index}>
              <div className="card border-slate-800 bg-slate-900 shadow-lg h-100 rounded-4 overflow-hidden">
                <DashboardCard title={item.title} value={item.value} icon={item.icon} />
              </div>
            </div>
          ))}
        </div>

        {/* CHARTS GRID */}
        <div className="row g-4 mb-5">
          {[
            { title: "Enrollment Trends", chart: <EnrollmentChart data={enrollmentData} /> },
            { title: "Batch Performance", chart: <PerformanceChart data={performanceData} /> },
            { title: "Students By Program", chart: <StudentsByProgramChart data={studentsByProgramData} /> },
            { title: "Gender Distribution", chart: <GenderDistributionChart data={genderDistributionData} /> }
          ].map((item, idx) => (
            <div className="col-xl-6" key={idx}>
              <div className="card border-slate-800 bg-slate-900 shadow-sm rounded-4 h-100">
                <div className="card-body">
                  <h6 className="fw-bold text-slate-500 mb-4 text-uppercase small tracking-wider">{item.title}</h6>
                  <div style={{ width: '100%', height: '280px' }}>
                    {item.chart}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4">
          <div className="col-lg-4">
            <div className="card border-slate-800 bg-slate-900 shadow-sm rounded-4 h-100">
              <div className="card-header bg-transparent border-slate-800 py-3">
                <h6 className="fw-bold m-0 text-white">Recent Alerts</h6>
              </div>
              <div className="card-body p-0" style={{ maxHeight: "450px", overflowY: "auto" }}>
                {notifications.map((note, index) => (
                  <div key={index} className="p-3 border-bottom border-slate-800 hover-dark-bg transition-all">
                    <div className="d-flex justify-content-between">
                      <span className="fw-bold small text-info">{note.title}</span>
                      <span className="text-muted extra-small">{note.time}</span>
                    </div>
                    <p className="mb-0 text-slate-400 small mt-1">{note.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card border-slate-800 bg-slate-900 shadow-sm rounded-4 p-4 mb-4">
              <h6 className="fw-bold mb-3 text-white">Instructors Expertise</h6>
              <div className="row g-3">
                {instructors.slice(0, 4).map((inst, index) => (
                  <div className="col-md-6" key={index}>
                    <div className="p-3 rounded-4 border border-slate-800 bg-slate-950">
                      <div className="fw-bold small text-white">{inst.instructorName}</div>
                      <div className="text-info extra-small uppercase tracking-wider">{inst.expertise}</div>
                      <div className="mt-2"><span className="badge bg-primary bg-opacity-10 text-primary px-2">{inst.batches?.length || 0} Batches</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card border-slate-800 bg-slate-900 shadow-sm rounded-4 overflow-hidden">
              <div className="p-3 bg-slate-800 bg-opacity-30 border-bottom border-slate-800">
                <h6 className="fw-bold m-0 text-white">Live Student Feed</h6>
              </div>
              <div className="table-responsive">
                <table className="table table-dark table-hover align-middle mb-0" style={{ backgroundColor: "transparent" }}>
                  <thead>
                    <tr className="small text-slate-500">
                      <th className="ps-4 border-slate-800">Student Name</th>
                      <th className="border-slate-800">Course</th>
                      <th className="pe-4 text-end border-slate-800">Status</th>
                    </tr>
                  </thead>
                  <tbody className="border-0">
                    {students.slice(0, 6).map((stu, index) => (
                      <tr key={index} className="border-slate-800">
                        <td className="ps-4">
                          <div className="fw-bold text-white">{stu.studentName}</div>
                          <div className="text-muted extra-small">{stu.studentEmail}</div>
                        </td>
                        <td className="small text-slate-400">{stu.courseId}</td>
                        <td className="pe-4 text-end">
                          <span className={`badge rounded-pill ${stu.batchName ? "bg-success bg-opacity-20 text-success border border-success border-opacity-25" : "bg-secondary bg-opacity-20 text-secondary border border-secondary border-opacity-25"}`}>
                            {stu.batchName ? "Assigned" : "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hover-dark-bg:hover { background-color: #1e293b; cursor: pointer; }
        .hover-bg-slate:hover { background-color: #1e293b !important; }
        .hover-text-danger:hover { color: #f43f5e !important; }
        .extra-small { font-size: 11px; }
        .border-slate-700 { border-color: #334155 !important; }
        .border-slate-800 { border-color: #1e293b !important; }
        .text-slate-400 { color: #94a3b8 !important; }
        .text-slate-500 { color: #64748b !important; }
        .bg-slate-900 { background-color: #0f172a !important; }
        .bg-slate-950 { background-color: #020617 !important; }
      `}</style>
    </div>
  );
};

export default Dashboard;