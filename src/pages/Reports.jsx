import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  EnrollmentChart,
  PerformanceChart,
  StudentsByProgramChart,
  GenderDistributionChart,
} from "../components/Coordinator/Charts.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

const Reports = () => {
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [studentsByProgramData, setStudentsByProgramData] = useState([]);
  const [genderDistributionData, setGenderDistributionData] = useState([]);

  useEffect(() => {
    // Enrollment trends -> { month, count }
    axios.get("https://localhost:7157/api/coordinator/dashboard/enrollment-trends")
      .then(res => {
        const formatted = res.data.map(item => ({
          course: `Month ${item.month}`,
          students: item.count
        }));
        setEnrollmentData(formatted);
      });

    // Performance -> { batchId, progress }
    axios.get("https://localhost:7157/api/coordinator/dashboard/performance")
      .then(res => {
        const formatted = res.data.map(item => ({
          batch: item.batchId,
          performance: item.progress
        }));
        setPerformanceData(formatted);
      });

    // Students by program -> { program, count }
    axios.get("https://localhost:7157/api/coordinator/dashboard/students-by-program")
      .then(res => {
        const formatted = res.data.map(item => ({
          program: item.program,
          students: item.count
        }));
        setStudentsByProgramData(formatted);
      });

    // Gender distribution -> { gender, count }
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
    <div className="container-fluid">
      <h1 className="my-4">Analytics & Reports</h1>
      <div className="row g-4">
        <div className="col-md-6">
          <h5>Course Enrollment</h5>
          <EnrollmentChart data={enrollmentData} />
        </div>
        <div className="col-md-6">
          <h5>Batch Performance</h5>
          <PerformanceChart data={performanceData} />
        </div>
      </div>
      <div className="row g-4 mt-4">
        <div className="col-md-6">
          <h5>Students by Program</h5>
          <StudentsByProgramChart data={studentsByProgramData} />
        </div>
        <div className="col-md-6">
          <h5>Gender Distribution</h5>
          <GenderDistributionChart data={genderDistributionData} />
        </div>
      </div>
    </div>
  );
};

export default Reports;