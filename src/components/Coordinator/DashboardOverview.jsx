import axios from "axios";
import { useState, useEffect } from "react";

export default function DashboardOverview() {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    axios
      .get("https://localhost:7157/api/coordinator/programs")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setPrograms(res.data);
        } else {
          setPrograms([]);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const c = programs.length;

  return (
    <div>
      <h2 className="fw-bold mb-3">Dashboard Overview</h2>
      <p className="text-muted">
        Welcome back! Here's what's happening with your academic programs.
      </p>

      <div className="row mt-4">
        <div className="col-md-3">
          <div className="card p-3 shadow-sm">
            <h6>Total Programs</h6>
            <h3>{c}</h3>
            <small className="text-success">↑ 2 new</small>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 shadow-sm">
            <h6>Active Courses</h6>
            <h3>6</h3>
            <small className="text-success">↑ 1 added</small>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 shadow-sm">
            <h6>Active Batches</h6>
            <h3>8</h3>
            <small className="text-success">↑ 3 ongoing</small>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card p-3 shadow-sm">
            <h6>Enrolled Students</h6>
            <h3>8</h3>
            <small className="text-success">↑ 12%</small>
          </div>
        </div>
      </div>
    </div>
  );
}