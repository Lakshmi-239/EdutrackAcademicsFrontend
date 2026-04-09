import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const BatchPage = () => {
  const [programs, setPrograms] = useState([]);
  const [years, setYears] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);

  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Fetch programs
  useEffect(() => {
    axios
      .get("https://localhost:7157/api/coordinator/programs")
      .then((res) => setPrograms(res.data))
      .catch((err) => console.error("Error fetching programs:", err));
  }, []);

  // Fetch years when program changes
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

  // Fetch courses when year changes
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
      setSelectedCourse(null);
    }
  }, [selectedYear]);

  // Fetch batches & students when course changes
  useEffect(() => {
    if (selectedCourse) {
      axios
        .get(
          `https://localhost:7157/api/coordinator/course/${selectedCourse.courseId}/batches`
        )
        .then((res) => setBatches(res.data))
        .catch((err) => console.error("Error fetching batches:", err));

      axios
        .get(
          `https://localhost:7157/api/coordinator/course/${selectedCourse.courseId}/students`
        )
        .then((res) => setStudents(res.data))
        .catch((err) => console.error("Error fetching students:", err));
    } else {
      setBatches([]);
      setStudents([]);
    }
  }, [selectedCourse]);

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-primary fw-bold">Batch Management</h2>

      {/* Program, Year, Course Selection */}
      <div className="row mb-4">
        <div className="col-md-4">
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
              setSelectedCourse(null);
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

        <div className="col-md-4">
          <label className="form-label fw-bold">Select Year</label>
          <select
            className="form-select"
            value={selectedYear ? selectedYear.academicYearId : ""}
            onChange={(e) => {
              const year = years.find((y) => y.academicYearId === e.target.value);
              setSelectedYear(year || null);
              setSelectedCourse(null);
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

        <div className="col-md-4">
          <label className="form-label fw-bold">Select Course</label>
          <select
            className="form-select"
            value={selectedCourse ? selectedCourse.courseId : ""}
            onChange={(e) => {
              const course = courses.find((c) => c.courseId === e.target.value);
              setSelectedCourse(course || null);
            }}
            disabled={!selectedYear}
          >
            <option value="">-- Choose Course --</option>
            {courses.map((course) => (
              <option key={course.courseId} value={course.courseId}>
                {course.courseName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Batches Overview */}
      {selectedCourse && (
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-info text-white fw-bold">
            Batches for {selectedCourse.courseName}
          </div>
          <div className="card-body">
            {batches.length > 0 ? (
              batches.map((batch, idx) => {
                const percent = Math.min(
                  (batch.currentStudents / batch.maxStudents) * 100,
                  100
                );
                return (
                  <div key={idx} className="mb-3">
                    <h6>
                      {batch.batchName} ({batch.currentStudents}/{batch.maxStudents}) - Instructor:{" "}
                      <span className="text-primary">{batch.instructor}</span>
                    </h6>
                    <div className="progress">
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: `${percent}%` }}
                      >
                        {percent.toFixed(0)}%
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-muted">No batches found for this course.</p>
            )}
          </div>
        </div>
      )}

      {/* Students Overview */}
      {selectedCourse && (
        <div className="card shadow-sm">
          <div className="card-header bg-secondary text-white fw-bold">
            Students in {selectedCourse.courseName}
          </div>
          <div className="card-body">
            {students.length > 0 ? (
              <table className="table table-striped table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>Name</th>
                    <th>Batch</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((stu, idx) => (
                    <tr key={idx}>
                      <td>{stu.name}</td>
                      <td>{stu.batchName || "Unassigned"}</td>
                      <td>
                        <span className="badge bg-success">{stu.grade}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-muted">No students enrolled in this course.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchPage;