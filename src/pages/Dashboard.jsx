import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Added for navigation
import DashboardCard from "../components/Coordinator/DashboardCard.jsx";
import {
  EnrollmentChart,
  PerformanceChart,
  StudentsByProgramChart,
  GenderDistributionChart,
} from "../components/Coordinator/Charts.jsx";
import { FiHome, FiUser, FiLogOut, FiSettings } from "react-icons/fi"; // Added Icons
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [studentsByProgramData, setStudentsByProgramData] = useState([]);
  const [genderDistributionData, setGenderDistributionData] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [students, setStudents] = useState([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    // API calls remain exactly as your working version
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

  return (
    <div className="dashboard-wrapper" style={{ backgroundColor: "#f4f7fe", minHeight: "100vh" }}>
      
      {/* --- TOP NAVIGATION BAR --- */}
     {/* --- TOP NAVIGATION BAR --- */}
<nav className="navbar navbar-expand-lg navbar-light bg-white px-4 py-3 shadow-sm sticky-top">
  <div className="container-fluid">
    <div className="d-flex align-items-center">
      {/* Brand links back to the main public landing page */}
      <Link to="/" className="navbar-brand fw-bold text-primary d-flex align-items-center">
        <span className="bg-primary text-white p-2 rounded-3 me-2 shadow-sm">Edu</span> Track
      </Link>
    </div>

    <div className="d-flex align-items-center gap-3">
      {/* Home button returns to the public home */}
      <button 
        className="btn btn-outline-primary rounded-pill px-3 d-flex align-items-center gap-2"
        onClick={() => navigate("/")}
      >
        <FiHome size={18} /> <span className="d-none d-md-inline">Home</span>
      </button>

      {/* Dashboard link (Optional: if you want a button to refresh the dashboard view) */}
      <button 
        className="btn btn-light rounded-pill px-3 d-flex align-items-center gap-2"
        onClick={() => navigate("/coordinator/dashboard")}
      >
        <FiSettings size={18} /> <span className="d-none d-md-inline">Refresh</span>
      </button>

      {/* Profile Dropdown... remains same */}



            {/* Profile Dropdown */}
            <div className="dropdown">
              <button 
                className="btn btn-white border rounded-pill p-1 d-flex align-items-center gap-2"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ paddingRight: '12px !important' }}
              >
                <div className="bg-soft-primary text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px', backgroundColor: '#eef2ff' }}>
                  <FiUser size={20} />
                </div>
                <div className="text-start d-none d-md-block pe-2">
                  <div className="fw-bold small lh-1">Coordinator</div>
                  <div className="text-muted" style={{ fontSize: '10px' }}>Active Session</div>
                </div>
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-3 mt-2">
                <li><Link className="dropdown-item py-2" to="/profile"><FiUser className="me-2" /> My Profile</Link></li>
                <li><Link className="dropdown-item py-2" to="/settings"><FiSettings className="me-2" /> Settings</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item py-2 text-danger" onClick={() => {/* Logout Logic */}}><FiLogOut className="me-2" /> Logout</button></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <div className="p-4 p-md-5">
        {/* HEADER */}
        <div className="mb-4 d-flex justify-content-between align-items-end">
          <div>
            <h2 className="fw-bold text-dark mb-1">Management Insights</h2>
            <p className="text-muted mb-0">Welcome back! Here is what's happening today.</p>
          </div>
          <div className="text-end d-none d-md-block">
            <span className="badge bg-white text-dark border px-3 py-2 rounded-pill shadow-sm">
              Date: {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* TOP STATS */}
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-5">
          {stats.map((item, index) => (
            <div className="col" key={index}>
              <div className="card border-0 shadow-sm h-100 rounded-4 p-2">
                <DashboardCard title={item.title} value={item.value} icon={item.icon} />
              </div>
            </div>
          ))}
        </div>

        {/* CHARTS GRID */}
        <div className="row g-4 mb-5">
          <div className="col-xl-6">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body">
                <h6 className="fw-bold text-muted mb-4 text-uppercase small">Enrollment Trends</h6>
                <div style={{ width: '100%', height: '300px' }}>
                  <EnrollmentChart data={enrollmentData} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-6">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body">
                <h6 className="fw-bold text-muted mb-4 text-uppercase small">Batch Performance</h6>
                <div style={{ width: '100%', height: '300px' }}>
                  <PerformanceChart data={performanceData} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-6">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body">
                <h6 className="fw-bold text-muted mb-4 text-uppercase small">Students By Program</h6>
                <div style={{ width: '100%', height: '300px' }}>
                  <StudentsByProgramChart data={studentsByProgramData} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-6">
            <div className="card border-0 shadow-sm rounded-4 h-100 text-center">
              <div className="card-body">
                <h6 className="fw-bold text-muted mb-4 text-uppercase small text-start">Gender Distribution</h6>
                <div className="d-flex justify-content-center" style={{ width: '100%', height: '300px' }}>
                  <GenderDistributionChart data={genderDistributionData} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* NOTIFICATIONS */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-header bg-white border-0 py-3">
                <h6 className="fw-bold m-0">Recent Alerts</h6>
              </div>
              <div className="card-body p-0" style={{ maxHeight: "500px", overflowY: "auto" }}>
                {notifications.map((note, index) => (
                  <div key={index} className="p-3 border-bottom border-light hover-bg" style={{ transition: '0.2s' }}>
                    <div className="d-flex justify-content-between">
                      <span className="fw-bold small text-primary">{note.title}</span>
                      <span className="text-muted extra-small">{note.time}</span>
                    </div>
                    <p className="mb-0 text-muted small mt-1">{note.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* INSTRUCTORS & STUDENTS GRID */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
              <h6 className="fw-bold mb-3">Instructors Expertise</h6>
              <div className="row g-3">
                {instructors.slice(0, 4).map((inst, index) => (
                  <div className="col-md-6" key={index}>
                    <div className="p-3 rounded-4" style={{ border: "1px solid #eee", background: '#ffffff' }}>
                      <div className="fw-bold small text-dark">{inst.instructorName}</div>
                      <div className="text-primary extra-small">{inst.expertise}</div>
                      <div className="mt-2"><span className="badge bg-soft-primary text-primary px-2" style={{ backgroundColor: '#eef2ff' }}>{inst.batches?.length || 0} Batches</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="p-3 bg-white border-bottom border-light">
                <h6 className="fw-bold m-0">Live Student Feed</h6>
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light">
                    <tr className="small text-muted">
                      <th className="ps-4">Student Name</th>
                      <th>Course</th>
                      <th className="pe-4 text-end">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.slice(0, 6).map((stu, index) => (
                      <tr key={index}>
                        <td className="ps-4">
                          <div className="fw-bold text-dark">{stu.studentName}</div>
                          <div className="text-muted extra-small">{stu.studentEmail}</div>
                        </td>
                        <td className="small text-secondary">{stu.courseId}</td>
                        <td className="pe-4 text-end">
                          <span className={`badge rounded-pill ${stu.batchName ? "bg-success bg-opacity-10 text-success" : "bg-secondary bg-opacity-10 text-secondary"}`}>
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
        .hover-bg:hover { background-color: #f8faff; cursor: pointer; }
        .bg-soft-primary { background-color: #eef2ff !important; }
        .ls-1 { letter-spacing: 0.5px; }
        .extra-small { font-size: 11px; }
      `}</style>
    </div>
  );
};

export default Dashboard;