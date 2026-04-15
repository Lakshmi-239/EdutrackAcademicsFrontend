import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  EnrollmentChart,
  PerformanceChart,
  StudentsByProgramChart,
  GenderDistributionChart,
} from "../components/Coordinator/Charts.jsx";
<<<<<<< HEAD
=======
import { FiTrendingUp, FiPieChart, FiBarChart2, FiActivity, FiArrowUpRight, FiZap } from "react-icons/fi";
>>>>>>> 18bbe9b (adding data)
import "bootstrap/dist/css/bootstrap.min.css";

const Reports = () => {
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [studentsByProgramData, setStudentsByProgramData] = useState([]);
  const [genderDistributionData, setGenderDistributionData] = useState([]);

  // --- Logic remains untouched ---
  useEffect(() => {
<<<<<<< HEAD
    // Enrollment trends -> { month, count }
=======
>>>>>>> 18bbe9b (adding data)
    axios.get("https://localhost:7157/api/coordinator/dashboard/enrollment-trends")
      .then(res => {
        const formatted = res.data.map(item => ({
          course: `Month ${item.month}`,
          students: item.count
        }));
        setEnrollmentData(formatted);
      });

<<<<<<< HEAD
    // Performance -> { batchId, progress }
=======
>>>>>>> 18bbe9b (adding data)
    axios.get("https://localhost:7157/api/coordinator/dashboard/performance")
      .then(res => {
        const formatted = res.data.map(item => ({
          batch: item.batchId,
          performance: item.progress
        }));
        setPerformanceData(formatted);
      });

<<<<<<< HEAD
    // Students by program -> { program, count }
=======
>>>>>>> 18bbe9b (adding data)
    axios.get("https://localhost:7157/api/coordinator/dashboard/students-by-program")
      .then(res => {
        const formatted = res.data.map(item => ({
          program: item.program,
          students: item.count
        }));
        setStudentsByProgramData(formatted);
      });

    axios.get("https://localhost:7157/api/coordinator/dashboard/gender-distribution")
      .then(res => {
        const formatted = res.data.map(item => ({
          gender: item.gender,
          value: item.count
        }));
        setGenderDistributionData(formatted);
      });
  }, []);

  return (
    <div className="reports-dark-page min-vh-100 pb-5">
      <div className="container-fluid py-5 px-lg-5">
        
        {/* --- HEADER SECTION --- */}
        <div className="row mb-5 align-items-center">
          <div className="col-md-8">
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3" 
                 style={{ background: "rgba(20, 184, 166, 0.1)", border: "1px solid rgba(20, 184, 166, 0.2)" }}>
              <FiZap className="text-teal" />
              <span className="text-teal fw-bold small uppercase tracking-wider">Live Analytics</span>
            </div>
            <h1 className="display-6 fw-bold text-white mb-2">Institutional Insights</h1>
            <p className="text-slate-400">Comprehensive data visualization for enrollment, performance, and demographics.</p>
          </div>
          <div className="col-md-4 text-md-end">
            <button className="btn btn-outline-teal rounded-pill px-4 py-2">
              <FiArrowUpRight className="me-2"/> Export Report
            </button>
          </div>
        </div>

        {/* --- STATS SUMMARY BAR --- */}
        <div className="row g-4 mb-5">
          <div className="col-md-3">
            <div className="stat-card-dark text-center">
              <span className="stat-label">Avg Growth</span>
              <h3 className="text-teal fw-bold mb-0">+12.5%</h3>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card-dark text-center border-emerald">
              <span className="stat-label">Active Batches</span>
              <h3 className="text-white fw-bold mb-0">{performanceData.length}</h3>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card-dark text-center">
              <span className="stat-label">Mapped Programs</span>
              <h3 className="text-white fw-bold mb-0">{studentsByProgramData.length}</h3>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stat-card-dark text-center">
              <span className="stat-label">Data Sync</span>
              <h3 className="text-teal fw-bold mb-0" style={{ fontSize: '1.2rem' }}>
                <span className="pulse-dot me-2"></span>REAL-TIME
              </h3>
            </div>
          </div>
        </div>

        {/* --- CHARTS GRID --- */}
        <div className="row g-4">
          {/* Enrollment Trend */}
          <div className="col-xl-7">
            <div className="chart-container-dark h-100">
              <div className="p-4">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="icon-circle-teal"><FiTrendingUp /></div>
                  <h6 className="fw-bold text-white mb-0">Enrollment Trends</h6>
                </div>
                <div className="chart-wrapper">
                  <EnrollmentChart data={enrollmentData} />
                </div>
              </div>
            </div>
          </div>

          {/* Gender Demographics */}
          <div className="col-xl-5">
            <div className="chart-container-dark h-100">
              <div className="p-4">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="icon-circle-teal"><FiPieChart /></div>
                  <h6 className="fw-bold text-white mb-0">Gender Demographics</h6>
                </div>
                <div className="chart-wrapper d-flex justify-content-center align-items-center">
                  <GenderDistributionChart data={genderDistributionData} />
                </div>
              </div>
            </div>
          </div>

          {/* Performance Heatmap Area */}
          <div className="col-xl-6">
            <div className="chart-container-dark h-100">
              <div className="p-4">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="icon-circle-teal"><FiActivity /></div>
                  <h6 className="fw-bold text-white mb-0">Batch Completion Progress (%)</h6>
                </div>
                <div className="chart-wrapper">
                  <PerformanceChart data={performanceData} />
                </div>
              </div>
            </div>
          </div>

          {/* Program Distribution */}
          <div className="col-xl-6">
            <div className="chart-container-dark h-100">
              <div className="p-4">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="icon-circle-teal"><FiBarChart2 /></div>
                  <h6 className="fw-bold text-white mb-0">Program Distribution</h6>
                </div>
                <div className="chart-wrapper">
                  <StudentsByProgramChart data={studentsByProgramData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .reports-dark-page { background-color: #020617; font-family: 'Inter', sans-serif; }
        .text-teal { color: #14b8a6 !important; }
        .text-slate-400 { color: #94a3b8 !important; }
        .btn-outline-teal { border-color: #14b8a6; color: #14b8a6; transition: 0.3s; }
        .btn-outline-teal:hover { background: #14b8a6; color: white; }

        /* Stat Cards */
        .stat-card-dark {
          background: #0f172a; border-radius: 20px; border: 1px solid #1e293b;
          padding: 24px; transition: 0.3s;
        }
        .stat-card-dark.border-emerald { border-left: 4px solid #14b8a6; }
        .stat-label { font-size: 10px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px; }

        /* Chart Containers */
        .chart-container-dark {
          background: #0f172a; border-radius: 28px; border: 1px solid #1e293b;
          transition: 0.3s ease;
        }
        .chart-container-dark:hover { border-color: #334155; transform: translateY(-5px); }
        .chart-wrapper { width: 100%; height: 320px; }

        .icon-circle-teal {
          width: 40px; height: 40px; background: rgba(20, 184, 166, 0.1);
          color: #14b8a6; border-radius: 12px; display: flex; align-items: center;
          justify-content: center; font-size: 1.2rem;
        }

        /* Sync Pulse */
        .pulse-dot {
          display: inline-block; width: 8px; height: 8px; background: #14b8a6;
          border-radius: 50%; box-shadow: 0 0 0 rgba(20, 184, 166, 0.4);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(20, 184, 166, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(20, 184, 166, 0); }
        }

        @media (max-width: 768px) {
          .chart-wrapper { height: 250px; }
        }
      `}</style>
    </div>
  );
};

export default Reports;