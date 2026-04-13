import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [courseId, setCourseId] = useState("");

  // Fetch all students on mount
  useEffect(() => {
    axios
      .get("https://localhost:7157/api/coordinator/details")
      .then((res) => setStudents(res.data))
      .catch((err) => console.error("Error fetching students:", err));
  }, []);

  // Handle course filter
  const handleCourseChange = (e) => {
    const selectedCourseId = e.target.value.trim();
    setCourseId(selectedCourseId);

    if (!selectedCourseId) {
      // Reload all students if filter cleared
      axios
        .get("https://localhost:7157/api/coordinator/details")
        .then((res) => setStudents(res.data))
        .catch((err) => console.error("Error fetching students:", err));
    } else {
      // Fetch students filtered by courseId
      axios
        .get(`https://localhost:7157/api/coordinator/details/${selectedCourseId}`)
        .then((res) => setStudents(res.data))
        .catch((err) => console.error("Error fetching students:", err));
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-primary fw-bold">Student Management</h2>

      {/* Course Filter */}
      <div className="mb-3">
        <label className="form-label fw-bold">Filter by Course ID</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter course ID (e.g. C001)"
          value={courseId}
          onChange={handleCourseChange}
        />
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white fw-bold">Student List</div>
        <div className="card-body">
          {students.length === 0 ? (
            <p className="text-muted">No students found.</p>
          ) : (
            <table className="table table-striped table-hover text-center align-middle">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Batch</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((stu) => (
                  <tr key={stu.studentId}>
                    <td>{stu.studentId}</td>
                    <td>{stu.studentName}</td>
                    <td>{stu.studentEmail}</td>
                    <td>{stu.courseId}</td>
                    <td>{stu.batchName}</td>
                    <td>
                      {stu.batchName && stu.batchName !== "Unassigned" ? (
                        <span className="badge bg-success">Assigned</span>
                      ) : (
                        <span className="badge bg-secondary">Unassigned</span>
                      )}
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2">
                        <i className="bi bi-pencil"></i> Edit
                      </button>
                      <button className="btn btn-sm btn-outline-danger">
                        <i className="bi bi-trash"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Students;