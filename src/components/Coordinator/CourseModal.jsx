import React, { useState, useEffect } from "react";
import { FiSave, FiX, FiInfo, FiHash, FiClock, FiFileText, FiUsers } from "react-icons/fi";

const CourseModal = ({ onSave, editingCourse }) => {
  const [course, setCourse] = useState({
    courseName: "",
    credits: "",
    durationInWeeks: "",
    batchSize: "" // ✅ Added batchSize state
  });

  useEffect(() => {
    if (editingCourse) {
      setCourse(editingCourse);
    } else {
      setCourse({ courseName: "", credits: "", durationInWeeks: "", batchSize: "" });
    }
  }, [editingCourse]);

  const handleChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // ✅ Added batchSize to validation check
    if (!course.courseName || !course.credits || !course.durationInWeeks || !course.batchSize) return;
    onSave(course);
  };

  return (
    <div className="modal fade" id="courseModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          
          {/* HEADER */}
          <div className="modal-header border-0 bg-primary p-4 text-white">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-white bg-opacity-25 rounded-3 p-2">
                <FiFileText size={24} />
              </div>
              <div>
                <h5 className="modal-title fw-bold m-0">
                  {editingCourse ? "Modify Module" : "New Module Entry"}
                </h5>
                <small className="text-white-50">Course Structure Configuration</small>
              </div>
            </div>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>

          <div className="modal-body p-4">
            <form>
              {/* COURSE NAME */}
              <div className="input-group-custom mb-4">
                <label className="small fw-bold text-muted mb-2 d-flex align-items-center gap-2">
                  <FiFileText /> COURSE NAME
                </label>
                <input
                  type="text"
                  name="courseName"
                  placeholder="e.g. Advanced Java"
                  className="form-control form-control-lg rounded-3 border-light-subtle shadow-none"
                  value={course.courseName}
                  onChange={handleChange}
                />
              </div>

              <div className="row">
                {/* CREDITS */}
                <div className="col-md-6 mb-4">
                  <label className="small fw-bold text-muted mb-2 d-flex align-items-center gap-2">
                    <FiHash /> CREDIT WEIGHT
                  </label>
                  <input
                    type="number"
                    name="credits"
                    placeholder="0"
                    className="form-control form-control-lg rounded-3 border-light-subtle shadow-none"
                    value={course.credits}
                    onChange={handleChange}
                  />
                </div>

                {/* DURATION */}
                <div className="col-md-6 mb-4">
                  <label className="small fw-bold text-muted mb-2 d-flex align-items-center gap-2">
                    <FiClock /> DURATION
                  </label>
                  <input
                    type="number"
                    name="durationInWeeks"
                    placeholder="Weeks"
                    className="form-control form-control-lg rounded-3 border-light-subtle shadow-none"
                    value={course.durationInWeeks}
                    onChange={handleChange}
                  />
                </div>

                {/* ✅ BATCH SIZE */}
                <div className="col-md-12 mb-4">
                  <label className="small fw-bold text-muted mb-2 d-flex align-items-center gap-2">
                    <FiUsers /> BATCH SIZE
                  </label>
                  <input
                    type="number"
                    name="batchSize"
                    placeholder="Maximum students per batch"
                    className="form-control form-control-lg rounded-3 border-light-subtle shadow-none"
                    value={course.batchSize}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* INFO BOX */}
              <div className="mt-2 p-3 bg-light rounded-3 d-flex gap-2">
                <FiInfo className="text-primary mt-1 flex-shrink-0" />
                <p className="small text-muted mb-0">
                  Ensure the module name, credits, and batch size match the university guidelines.
                </p>
              </div>
            </form>
          </div>

          {/* FOOTER */}
          <div className="modal-footer border-0 p-4 pt-0">
            <button className="btn btn-light px-4 py-2 rounded-3 fw-semibold text-muted d-flex align-items-center gap-2" data-bs-dismiss="modal">
              <FiX /> Discard
            </button>
            <button
              className="btn btn-primary px-4 py-2 rounded-3 fw-semibold shadow-sm d-flex align-items-center gap-2"
              onClick={handleSave}
              data-bs-dismiss="modal"
            >
              <FiSave /> {editingCourse ? "Update Module" : "Establish Course"}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .input-group-custom input:focus { border-color: #4361ee; background-color: #f8faff; }
        .form-control-lg { font-size: 1rem; padding: 0.75rem 1rem; }
      `}</style>
    </div>
  );
};

export default CourseModal;