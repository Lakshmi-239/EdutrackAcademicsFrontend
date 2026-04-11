import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [courses, setCourses] = useState([]);

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

  return (
    <div className="container my-5">
      <h1 className="mb-4 text-primary fw-bold">Programs Management</h1>

      {/* Program Selection */}
      <div className="row mb-3">
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

        {/* Year Selection */}
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

      {/* Display Selected Program & Year */}
      {selectedProgram && selectedYear && (
        <div className="card shadow-sm mt-4">
          <div className="card-header bg-info text-white fw-bold">
            Selected Program & Year
          </div>
          <div className="card-body">
            <p>
              <strong>Program:</strong> {selectedProgram.programName}
            </p>
            <p>
              <strong>Year:</strong> {selectedYear.display}
            </p>
          </div>
        </div>
      )}

      {/* Courses Display */}
      {courses.length > 0 && (
        <div className="card shadow-sm mt-4">
          <div className="card-header bg-success text-white fw-bold">
            Courses in {selectedProgram.programName} - {selectedYear.display}
          </div>
          <div className="card-body">
            <ul className="list-group">
              {courses.map((course) => (
                <li
                  key={course.courseId}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {course.courseName}
                  <span className="badge bg-primary rounded-pill">
                    {course.credits} Credits
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {selectedYear && courses.length === 0 && (
        <p className="text-muted mt-3">
          No courses available for {selectedYear.display}.
        </p>
      )}
    </div>
  );
};

export default Programs;