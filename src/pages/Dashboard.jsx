import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardCard from "../components/Coordinator/DashboardCard.jsx";
import {
  EnrollmentChart,
  PerformanceChart,
  StudentsByProgramChart,
  GenderDistributionChart,
} from "../components/Coordinator/Charts.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = () => {
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

  return (
    <div className="container-fluid py-4">
      <h1 className="mb-4 text-primary fw-bold">Coordinator Dashboard</h1>

      {/* Top Stats */}
      <div className="row g-4">
        {stats.map((item, index) => (
          <div className="col-md-3" key={index}>
            <DashboardCard title={item.title} value={item.value} icon={item.icon} />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="row mt-5 g-4">
        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-info text-white fw-bold">Enrollment Trends</div>
            <div className="card-body">
              <EnrollmentChart data={enrollmentData} />
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-success text-white fw-bold">Batch Performance</div>
            <div className="card-body">
              <PerformanceChart data={performanceData} />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="row mt-5 g-4">
        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-warning text-dark fw-bold">Students by Program</div>
            <div className="card-body">
              <StudentsByProgramChart data={studentsByProgramData} />
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-danger text-white fw-bold">Gender Distribution</div>
            <div className="card-body">
              <GenderDistributionChart data={genderDistributionData} />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white fw-bold">Notifications</div>
            <div className="card-body">
              {notifications.map((note, index) => (
                <div key={index} className="d-flex justify-content-between border-bottom py-2">
                  <div>
                    <i className="bi bi-bell-fill text-info me-2"></i>
                    <strong>{note.title}</strong>
                    <p className="mb-0 text-muted small">{note.message}</p>
                  </div>
                  <span className="badge bg-secondary">{note.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-secondary text-white fw-bold">Recent Activities</div>
            <div className="card-body">

              {/* Batches Overview */}
              {/* <h5 className="fw-bold mb-3">Batches Overview</h5>
              <table className="table align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Batch Name</th>
                    <th>Enrolled</th>
                    <th>Capacity</th>
                    <th>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {batches.map((batch, index) => (
                    <tr key={index}>
                      <td>{batch.batchName}</td>
                      <td><span className="badge bg-info">{batch.enrolled}</span></td>
                      <td>{batch.capacity}</td>
                      <td style={{ width: "200px" }}>
                        <div className="progress">
                          <div
                            className="progress-bar bg-success"
                            role="progressbar"
                            style={{ width: `${(batch.enrolled / batch.capacity) * 100}%` }}
                          >
                            {((batch.enrolled / batch.capacity) * 100).toFixed(0)}%
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table> */}

              {/* Instructors Overview */}
              <h5 className="fw-bold mt-4 mb-3">Instructors Overview</h5>
              <div className="row">
                {instructors.map((inst, index) => (
                  <div className="col-md-6 mb-3" key={index}>
                    <div className="card h-100 shadow-sm border-0">
                      <div className="card-body">
                        <h6 className="fw-bold">{inst.instructorName}</h6>
                        <p className="text-muted mb-1">Expertise: {inst.expertise}</p>
                        <p className="mb-1"><i className="bi bi-book"></i> {inst.courses?.join(", ")}</p>
                        <span className="badge bg-primary">{inst.batches?.length || 0} Batches</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Students Overview */}
             <h5 className="fw-bold mt-4 mb-3">Students Overview</h5>
<div className="row">
  {students.map((stu, index) => (
    <div className="col-md-6 mb-3" key={index}>
      <div className="card h-100 shadow-sm border-0">
        <div className="card-body">
          <h6 className="fw-bold">{stu.studentName}</h6>
          <p className="mb-1">
            <i className="bi bi-envelope"></i> {stu.studentEmail || "N/A"}
          </p>
          <p className="mb-1">
            <i className="bi bi-book"></i> {stu.courseId || "N/A"}
          </p>
          <p className="mb-1">
            <i className="bi bi-people"></i> {stu.batchName || "Unassigned"}
          </p>
          <span
            className={`badge ${
              stu.batchName && stu.batchName !== "Unassigned"
                ? "bg-success"
                : "bg-secondary"
            }`}
          >
            {stu.batchName && stu.batchName !== "Unassigned"
              ? "Assigned"
              : "Unassigned"}
          </span>
        </div>
      </div>
    </div>
  ))}
</div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;