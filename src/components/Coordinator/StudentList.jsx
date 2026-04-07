import React, { useState, useEffect } from "react";
import axios from "axios";

function StudentList() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios
      .get("https://localhost:7157/api/coordinator/students/all")
      .then((res) => {
        // Ensure data is always an array
        if (Array.isArray(res.data)) {
          setStudents(res.data);
        } else {
          setStudents([]);
        }
      })
      .catch((err) => console.error("Error fetching students:", err));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-3">Student List</h2>
      <p className="text-muted">
        Here’s the complete list of students enrolled in your programs.
      </p>

      {/* Summary card */}
      <div className="card shadow-sm p-3 mb-4">
        <h5>Total Students: {students.length}</h5>
      </div>

      {/* Table view */}
      <table className="table table-striped table-hover shadow-sm">
        <thead className="table-dark">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(students) &&
            students.map((s) => (
              <tr key={s.studentId}>
                <td>{s.studentId}</td>
                <td>{s.studentName}</td>
                <td>{s.studentEmail}</td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Card view */}
      <div className="row mt-4">
        {Array.isArray(students) &&
          students.map((s) => (
            <div className="col-md-4 mb-3" key={s.studentId}>
              <div className="card shadow-sm p-3">
                <h5>{s.studentName}</h5>
                <p className="text-muted">{s.studentEmail}</p>
                <small>ID: {s.studentId}</small>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default StudentList;