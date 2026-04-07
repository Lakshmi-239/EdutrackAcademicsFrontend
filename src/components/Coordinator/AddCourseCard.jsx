import { useState } from "react";
import axios from "axios";
 
export default function AddCourseCard({ yearId, refreshCourses }) {
  const [form, setForm] = useState({
    courseName: "",
    credits: "",
    durationInWeeks: ""
  });
 
  const handleAdd = async () => {
    if (!yearId) {
      alert("Please select Program & Year");
      return;
    }
 
    try {
      const payload = {
        courseName: form.courseName,
        credits: parseInt(form.credits),
        durationInWeeks: parseInt(form.durationInWeeks),
        academicYearId: yearId
      };
 
      await axios.post(
        "https://localhost:7157/api/coordinator/course",
        payload
      );
 
      alert("Course Added ✅");
 
      setForm({
        courseName: "",
        credits: "",
        durationInWeeks: ""
      });
 
      refreshCourses();
 
    } catch (err) {
      console.error(err);
      alert("Error adding course ❌");
    }
  };
 
  return (
    <div className="card mb-4">
      <div className="card-body">
 
        <h5>Add Course</h5>
 
        <div className="row mb-3">
 
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Course Name"
              value={form.courseName}
              onChange={(e) =>
                setForm({ ...form, courseName: e.target.value })
              }
            />
          </div>
 
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Credits"
              value={form.credits}
              onChange={(e) =>
                setForm({ ...form, credits: e.target.value })
              }
            />
          </div>
 
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Duration (Weeks)"
              value={form.durationInWeeks}
              onChange={(e) =>
                setForm({ ...form, durationInWeeks: e.target.value })
              }
            />
          </div>
 
        </div>
 
        <button
          className="btn btn-success"
          disabled={!yearId}
          onClick={handleAdd}
        >
          + Add Course
        </button>
 
      </div>
    </div>
  );
}