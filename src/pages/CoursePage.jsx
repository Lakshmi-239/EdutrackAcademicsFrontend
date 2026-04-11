import React, { useState, useEffect } from "react";
import CourseModal from "../components/Coordinator/CourseModal.jsx";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const CoursesPage = () => {
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);

  // Fetch all programs on mount
  useEffect(() => {
    axios
      .get("https://localhost:7157/api/coordinator/programs")
      .then((res) => setPrograms(res.data))
      .catch((err) => console.error("Error fetching programs:", err));
  }, []);

  // Fetch years when a program is selected
  useEffect(() => {
    if (selectedProgram) {
      axios
        .get(
          `https://localhost:7157/api/coordinator/program/${selectedProgram.programId}/years`
        )
        .then((res) => setYears(res.data))
        .catch((err) => console.error("Error fetching years:", err));
    } else {
      setYears([]);
      setSelectedYear(null);
      setCourses([]);
    }
  }, [selectedProgram]);

  // Fetch courses when a year is selected
  useEffect(() => {
    if (selectedYear) {
      axios
        .get(
          `https://localhost:7157/api/coordinator/academic-year/${selectedYear.academicYearId}/courses`
        )
        .then((res) => setCourses(res.data))
        .catch((err) => console.error("Error fetching courses:", err));
    } else {
      setCourses([]);
    }
  }, [selectedYear]);

  const handleSaveCourse = async (course) => {
    try {
      if (editingCourse) {
        // Update existing course (PUT API can be added here)
        setCourses(
          courses.map((c) =>
            c.courseId === editingCourse.courseId
              ? { ...course, courseId: editingCourse.courseId }
              : c
          )
        );
        setEditingCourse(null);
      } else {
        // Build payload for backend
        const payload = {
          programId: selectedProgram.programId,
          academicYearId: selectedYear.academicYearId,
          courseName: course.courseName,
          credits: course.credits,
          durationInWeeks: course.durationInWeeks,
          batchSize: course.batchSize,
        };

        // POST to backend
        const res = await axios.post(
          "https://localhost:7157/api/coordinator/course",
          payload
        );

        // Add to local state (use backend response if available)
        setCourses([...courses, res.data]);
      }
    } catch (err) {
      console.error("Error saving course:", err);
    }
  };

  const handleDelete = (id) => {
    setCourses(courses.filter((c) => c.courseId !== id));
    // Optionally call DELETE API here
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-primary fw-bold">Courses Management</h2>

      {/* Program & Year Selection */}
      <div className="row mb-4">
        <div className="col-md-6">
          <label className="form-label fw-bold">Select Program</label>
          <select
            className="form-select"
            value={selectedProgram ? selectedProgram.programId : ""}
            onChange={(e) => {
              const program = programs.find(
                (p) => p.programId === e.target.value
              );
              setSelectedProgram(program || null);
              setSelectedYear(null);
              setCourses([]);
            }}
          >
            <option value="">-- Choose Program --</option>
            {programs.map((program) => (
              <option key={program.programId} value={program.programId}>
                {program.programName}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label fw-bold">Select Year</label>
          <select
            className="form-select"
            value={selectedYear ? selectedYear.academicYearId : ""}
            onChange={(e) => {
              const year = years.find((y) => y.academicYearId === e.target.value);
              setSelectedYear(year || null);
            }}
            disabled={!selectedProgram}
          >
            <option value="">-- Choose Year --</option>
            {years.map((year) => (
              <option key={year.academicYearId} value={year.academicYearId}>
                {year.display}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Courses Table */}
      {selectedYear ? (
        <div className="card shadow-sm">
          <div className="card-header d-flex justify-content-between align-items-center">
            <span className="fw-bold">
              Courses for {selectedProgram.programName} - {selectedYear.display}
            </span>
            <button
              className="btn btn-primary btn-sm"
              data-bs-toggle="modal"
              data-bs-target="#courseModal"
              onClick={() => setEditingCourse(null)}
            >
              <i className="bi bi-plus-circle me-2"></i>Add Course
            </button>
          </div>
          <div className="card-body">
            <table className="table table-striped table-bordered text-center">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Credits</th>
                  <th>Duration (Weeks)</th>
                  <th>Batch Size</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {courses.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-muted">
                      No Courses Added Yet
                    </td>
                  </tr>
                ) : (
                  courses.map((c) => (
                    <tr key={c.courseId}>
                      <td>{c.courseName}</td>
                      <td>{c.credits}</td>
                      <td>{c.durationInWeeks}</td>
                      <td>{c.batchSize}</td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          data-bs-toggle="modal"
                          data-bs-target="#courseModal"
                          onClick={() => setEditingCourse(c)}
                        >
                          <i className="bi bi-pencil"></i> Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(c.courseId)}
                        >
                          <i className="bi bi-trash"></i> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-danger">Select Program & Year first</p>
      )}

      {/* Modal for Adding/Editing Course */}
      <CourseModal onSave={handleSaveCourse} editingCourse={editingCourse} />
    </div>
  );
};

export default CoursesPage;