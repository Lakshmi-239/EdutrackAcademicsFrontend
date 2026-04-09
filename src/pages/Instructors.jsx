import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Instructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [skill, setSkill] = useState("");

  // Fetch all instructors on mount
  useEffect(() => {
    axios
      .get("https://localhost:7157/api/coordinator/instructors/all")
      .then((res) => setInstructors(res.data))
      .catch((err) => console.error("Error fetching instructors:", err));
  }, []);

  // Handle skill filter
  const handleSkillChange = (e) => {
    const selectedSkill = e.target.value;
    setSkill(selectedSkill);

    if (!selectedSkill) {
      // Reload all instructors if skill is cleared
      axios
        .get("https://localhost:7157/api/coordinator/instructors/all")
        .then((res) => setInstructors(res.data))
        .catch((err) => console.error("Error fetching instructors:", err));
    } else {
      // Fetch instructors filtered by skill
      axios
        .get(
          `https://localhost:7157/api/coordinator/instructors?skill=${selectedSkill}`
        )
        .then((res) => setInstructors(res.data))
        .catch((err) => console.error("Error fetching instructors:", err));
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-primary fw-bold">Instructor Management</h2>

      {/* Skill Filter */}
      <div className="mb-3">
        <label className="form-label fw-bold">Filter by Skill</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter skill (e.g. Java, Python)"
          value={skill}
          onChange={handleSkillChange}
        />
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <span className="fw-bold">Instructor List</span>
          <button
            className="btn btn-primary btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#addInstructorModal"
          >
            <i className="bi bi-person-plus me-2"></i>Add Instructor
          </button>
        </div>
        <div className="card-body">
          <table className="table table-striped table-bordered text-center align-middle">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Expertise</th>
                <th>Courses</th>
                <th>Batches</th>
              </tr>
            </thead>
            <tbody>
              {instructors.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-muted">
                    No Instructors Found
                  </td>
                </tr>
              ) : (
                instructors.map((inst) => (
                  <tr key={inst.instructorId}>
                    <td>{inst.instructorName}</td>
                    <td>{inst.expertise || "N/A"}</td>
                    <td>
                      {inst.courses && inst.courses.length > 0
                        ? inst.courses.join(", ")
                        : "N/A"}
                    </td>
                    <td>
                      {inst.batches && inst.batches.length > 0
                        ? inst.batches.join(", ")
                        : "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Instructor Modal */}
      <div className="modal fade" id="addInstructorModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content shadow">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">Add Instructor</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <input type="text" placeholder="Name" className="form-control mb-2" />
              <input type="text" placeholder="Expertise" className="form-control mb-2" />
              <input type="text" placeholder="Courses" className="form-control mb-2" />
              <input type="text" placeholder="Batches" className="form-control mb-2" />
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button className="btn btn-success" data-bs-dismiss="modal">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Instructors;