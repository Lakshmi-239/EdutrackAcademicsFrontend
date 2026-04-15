import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  EnrollmentChart,
  PerformanceChart,
  StudentsByProgramChart,
  GenderDistributionChart,
} from "../components/Coordinator/Charts.jsx";
import { FiTrendingUp, FiPieChart, FiBarChart2, FiActivity } from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.min.css";

const Reports = () => {
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [studentsByProgramData, setStudentsByProgramData] = useState([]);
  const [genderDistributionData, setGenderDistributionData] = useState([]);

  useEffect(() => {
    // Enrollment trends
    axios.get("https://localhost:7157/api/coordinator/dashboard/enrollment-trends")
      .then(res => {
        const formatted = res.data.map(item => ({
          course: `Month ${item.month}`,
          students: item.count
        }));
        setEnrollmentData(formatted);
      });

    // Performance
    axios.get("https://localhost:7157/api/coordinator/dashboard/performance")
      .then(res => {
        const formatted = res.data.map(item => ({
          batch: item.batchId,
          performance: item.progress
        }));
        setPerformanceData(formatted);
      });

    // Students by program
    axios.get("https://localhost:7157/api/coordinator/dashboard/students-by-program")
      .then(res => {
        const formatted = res.data.map(item => ({
          program: item.program,
          students: item.count
        }));
        setStudentsByProgramData(formatted);
      });

    // Gender distribution
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
    <div className="container-fluid py-4 px-lg-5" style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      
      {/* HEADER SECTION */}
      <div className="mb-5">
        <h2 className="fw-bold text-dark" style={{ letterSpacing: "-1px" }}>Analytics & Insights</h2>
        <p className="text-muted">Real-time data visualization of institutional performance and student metrics.</p>
      </div>

      {/* TOP SUMMARY MINI-CARDS */}
      <div className="row g-4 mb-5 text-center">
        <div className="col-md-3">
          <div className="p-3 bg-white rounded-4 shadow-sm border-0">
            <small className="text-uppercase text-muted fw-bold x-small">Avg Growth</small>
            <h4 className="mb-0 text-primary">+12.5%</h4>
          </div>
        </div>
        <div className="col-md-3">
          <div className="p-3 bg-white rounded-4 shadow-sm border-0">
            <small className="text-uppercase text-muted fw-bold x-small">Active Batches</small>
            <h4 className="mb-0 text-success">{performanceData.length}</h4>
          </div>
        </div>
        <div className="col-md-3">
          <div className="p-3 bg-white rounded-4 shadow-sm border-0">
            <small className="text-uppercase text-muted fw-bold x-small">Total Programs</small>
            <h4 className="mb-0 text-warning">{studentsByProgramData.length}</h4>
          </div>
        </div>
        <div className="col-md-3">
          <div className="p-3 bg-white rounded-4 shadow-sm border-0">
            <small className="text-uppercase text-muted fw-bold x-small">Live Sync</small>
            <h4 className="mb-0 text-info">Active</h4>
          </div>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="row g-4">
        {/* Course Enrollment */}
        <div className="col-xl-6">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h6 className="fw-bold text-dark m-0 d-flex align-items-center gap-2">
                  <FiTrendingUp className="text-primary" /> Course Enrollment Trends
                </h6>
              </div>
              <div style={{ width: '100%', height: '320px' }}>
                <EnrollmentChart data={enrollmentData} />
              </div>
            </div>
          </div>
        </div>

        {/* Batch Performance */}
        <div className="col-xl-6">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h6 className="fw-bold text-dark m-0 d-flex align-items-center gap-2">
                  <FiActivity className="text-success" /> Batch Progress Performance
                </h6>
              </div>
              <div style={{ width: '100%', height: '320px' }}>
                <PerformanceChart data={performanceData} />
              </div>
            </div>
          </div>
        </div>

        {/* Students by Program */}
        <div className="col-xl-6">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h6 className="fw-bold text-dark m-0 d-flex align-items-center gap-2">
                  <FiBarChart2 className="text-warning" /> Students Distribution by Program
                </h6>
              </div>
              <div style={{ width: '100%', height: '320px' }}>
                <StudentsByProgramChart data={studentsByProgramData} />
              </div>
            </div>
          </div>
        </div>

        {/* Gender Distribution */}
        <div className="col-xl-6">
          <div className="card border-0 shadow-sm rounded-4 h-100 text-center">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-4 text-start">
                <h6 className="fw-bold text-dark m-0 d-flex align-items-center gap-2">
                  <FiPieChart className="text-info" /> Gender Demographics
                </h6>
              </div>
              <div className="d-flex justify-content-center align-items-center" style={{ width: '100%', height: '320px' }}>
                <GenderDistributionChart data={genderDistributionData} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .x-small { font-size: 0.7rem; letter-spacing: 0.5px; }
        .card { transition: transform 0.3s ease; }
        .card:hover { transform: translateY(-5px); }
      `}</style>
    </div>
  );
};

export default Reports;