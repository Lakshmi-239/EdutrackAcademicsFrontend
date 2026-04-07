import React, { useState, useEffect } from "react";
import axios from "axios";

function InstructorList() {
  const [instructor, setInstructors] = useState([]);

  useEffect(() => {
    axios
      .get("https://localhost:7157/api/coordinator/students/all")
      .then((res) => setInstructors(res.data))
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
        <h5>Total Students: {instructor.length}</h5>
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
          {students.map((s) => (
            <tr key={s.instructorId}>
              <td>{s.instructorId}</td>
              <td>{s.instructorName}</td>
              <td>{s.instructorEmail}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Card view (optional, looks nice for smaller lists) */}
      {/* <div className="row mt-4">
        {students.map((s) => (
          <div className="col-md-4 mb-3" key={s.studentId}>
            <div className="card shadow-sm p-3">
              <h5>{s.studentName}</h5>
              <p className="text-muted">{s.studentEmail}</p>
              <small>ID: {s.studentId}</small>
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
}

export default InstructorList;