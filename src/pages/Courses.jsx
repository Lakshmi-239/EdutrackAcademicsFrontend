import { useEffect, useState } from "react";
import axios from "axios";

export default function CoursesTable({ yearId, refresh }) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (yearId) {
      axios
        .get(`https://localhost:7157/api/coordinator/academic-year/${yearId}/courses`)
        .then(res => setCourses(res.data))
        .catch(err => console.error(err));
    }
  }, [yearId, refresh]);

  const handleDelete = async (id) => {
    await axios.delete(`https://localhost:7157/api/coordinator/course/${id}`);
    setCourses(courses.filter(c => c.courseId !== id));
  };
  if (!yearId) {
    return <p className="text-danger">Select Program & Year first</p>;
  }

  return (
    <div className="card">
      <div className="card-body">
        <h5>Courses (Year: {yearId})</h5>

        <table className="table table-bordered text-center mt-3">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Credits</th>
              <th>Duration</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr>
                <td colSpan="4">No Courses Found</td>
              </tr>
            ) : (
              courses.map(c => (
                <tr key={c.courseId}>
                  <td>{c.courseName}</td>
                  <td>{c.credits}</td>
                  <td>{c.durationInWeeks}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(c.courseId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}