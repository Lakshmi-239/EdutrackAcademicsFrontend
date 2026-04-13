import React, { useState, useEffect } from "react";

const CourseModal = ({ onSave, editingCourse }) => {
  const [course, setCourse] = useState({
    courseName: "",
    credits: "",
    durationInWeeks: "",
    batchSize: "",
  });

  useEffect(() => {
    if (editingCourse) {
      setCourse(editingCourse);
    } else {
      setCourse({
        courseName: "",
        credits: "",
        durationInWeeks: "",
        batchSize: "",
      });
    }
  }, [editingCourse]);

  const handleChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (
      !course.courseName ||
      !course.credits ||
      !course.durationInWeeks ||
      !course.batchSize
    )
      return;
    onSave(course);
  };

  return (
    <div className="modal fade" id="courseModal" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content shadow">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              {editingCourse ? "Edit Course" : "Add Course"}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div className="modal-body">
            <input
              type="text"
              name="courseName"
              placeholder="Course Name"
              className="form-control mb-2"
              value={course.courseName}
              onChange={handleChange}
            />
            <input
              type="number"
              name="credits"
              placeholder="Credits"
              className="form-control mb-2"
              value={course.credits}
              onChange={handleChange}
            />
            <input
              type="number"
              name="durationInWeeks"
              placeholder="Duration (Weeks)"
              className="form-control mb-2"
              value={course.durationInWeeks}
              onChange={handleChange}
            />
            <input
              type="number"
              name="batchSize"
              placeholder="Batch Size"
              className="form-control mb-2"
              value={course.batchSize}
              onChange={handleChange}
            />
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" data-bs-dismiss="modal">
              Cancel
            </button>
            <button
              className="btn btn-success"
              onClick={handleSave}
              data-bs-dismiss="modal"
            >
              {editingCourse ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseModal;