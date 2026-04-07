import React, { useState, useEffect } from "react";
import axios from "axios";

const MyCourses = () => {
  const [activeTab, setActiveTab] = useState("available");
  const [courses, setCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal & Content State
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseModules, setCourseModules] = useState([]);

  const studentId = "S001";
  const BASE_URL = "https://localhost:7157/api/Enrollment";

  useEffect(() => {
    const loadPageData = async () => {
      setLoading(true);
      try {
        await axios.patch(`${BASE_URL}/sync-status`, null, {
          params: { studentId: studentId }
        });
        console.log("Dropout sync completed.");
      } catch (err) {
        console.error("Dropout sync failed:", err);
      }
      await fetchEnrolledIds();
      await fetchData();
      setLoading(false);
    };
    loadPageData();
  }, [activeTab]);

  // FETCH DATA: Separately calls /progress and /status for each course
  const fetchData = async () => {
    try {
      const endpoint = activeTab === "available"
        ? `${BASE_URL}/available-courses/${studentId}`
        : `${BASE_URL}/my-courses/${studentId}`;

      const response = await axios.get(endpoint);
      let fetchedCourses = response.data.data || [];

      if (activeTab === "enrolled" && fetchedCourses.length > 0) {
        const coursesWithDetails = await Promise.all(
          fetchedCourses.map(async (course) => {
            try {
              // 1. Fetch numeric progress
              const progRes = await axios.get(`${BASE_URL}/progress`, {
                params: { StudentId: studentId, CourseId: course.courseId }
              });

              // 2. Fetch enrollment status string from the separate endpoint
              const statusRes = await axios.get(`${BASE_URL}/status`, {
                params: { StudentId: studentId, CourseId: course.courseId }
              });
              console.log("Status API Response:", statusRes.data.currentStatus);
              return { 
                ...course, 
                progress: progRes.data.progress, 
                status: statusRes.data.currentStatus // Matches your new action method
              };
            } catch (err) {
              console.error(`Error fetching details for ${course.courseId}`, err);
              return { ...course, progress: 0, status: "Active" };
            }
          })
        );
        fetchedCourses = coursesWithDetails;
      }
      setCourses(fetchedCourses);
    } catch (err) {
      setCourses([]);
    }
  };

  const fetchEnrolledIds = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/my-courses/${studentId}`);
      const ids = new Set((response.data.data || []).map((c) => c.courseId));
      setEnrolledCourseIds(ids);
    } catch (err) {
      console.error("Error fetching enrolled IDs:", err);
    }
  };

  const handleStartCourse = async (course) => {
    try {
      const response = await axios.get(`${BASE_URL}/content`, {
        params: { StudentId: studentId, CourseId: course.courseId }
      });
      if (response.data.status === 200) {
        setCourseModules(response.data.data);
        setSelectedCourse(course);
        setShowModal(true);
      }
    } catch (err) {
      alert("Error loading content. Please check your API connection.");
    }
  };

  // MARK AS READ: Updates progress and then checks status independently
  const handleMarkAsRead = async (contentId) => {
    try {
      const response = await axios.post(`${BASE_URL}/mark-completed`, {
        StudentId: studentId,
        CourseId: selectedCourse.courseId,
        ContentId: contentId
      });

      if (response.data.status === 200) {
        // Fetch the latest status independently after the update
        const statusRes = await axios.get(`${BASE_URL}/status`, {
          params: { StudentId: studentId, CourseId: selectedCourse.courseId }
        });

        const newStatus = statusRes.data.currentStatus;
        const newProgress = response.data.progress;

        // Sync main list
        setCourses(prev => prev.map(c => 
          c.courseId === selectedCourse.courseId 
            ? { ...c, progress: newProgress, status: newStatus }
            : c
        ));
        
        // Sync Modal Reference
        setSelectedCourse(prev => ({
          ...prev,
          progress: newProgress,
          status: newStatus
        }));

        if (newStatus === "Completed") {
          alert("🎉 Congratulations! You have completed the course.");
        }
      }
    } catch (err) {
      alert("Failed to update progress.");
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      const response = await axios.post(`${BASE_URL}`, { studentId, courseId: String(courseId) });
      if (response.data.status === 200) {
        alert(response.data.data);
        await fetchEnrolledIds();
        await fetchData();
      }
    } catch (err) {
      alert("Enrollment failed.");
    }
  };

  return (
    <div className="container-fluid py-4 px-4 bg-white min-vh-100">
      <div className="mb-4">
        <input
          type="text"
          className="form-control w-25 border-secondary"
          placeholder="Search your courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="d-flex mb-4 border-bottom">
        <button
          className={`btn me-5 pb-2 rounded-0 border-0 ${activeTab === "available" ? "border-bottom border-dark border-3 fw-bold text-dark" : "text-muted"}`}
          onClick={() => setActiveTab("available")}
        >Courses</button>
        <button
          className={`btn pb-2 rounded-0 border-0 ${activeTab === "enrolled" ? "border-bottom border-dark border-3 fw-bold text-dark" : "text-muted"}`}
          onClick={() => setActiveTab("enrolled")}
        >Enrolled</button>
      </div>

      <div className="row g-4">
        {loading ? (
          <div className="text-center mt-5">Loading...</div>
        ) : (
          courses.map((course) => {
            const isEnrolled = enrolledCourseIds.has(course.courseId);
            return (
              <div className="col-12" key={course.courseId}>
                <div className="card border-0 shadow-sm" style={{ backgroundColor: "#D9D9D9", borderRadius: "12px" }}>
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center">
                        <h4 className="fw-bold mb-0 me-3">{course.courseName}</h4>
                        {/* Status Badge from separate endpoint */}
                        {activeTab === "enrolled" && (
                          <span className={`badge ${course.status === 'Completed' ? 'bg-success' : 'bg-primary'}`}>
                            {course.status || 'Active'}
                          </span>
                        )}
                      </div>
                      {activeTab === "enrolled" && (
                        <div className="d-flex align-items-center" style={{ width: "250px" }}>
                          <div className="progress flex-grow-1 me-2" style={{ height: "10px", backgroundColor: "#BBB" }}>
                            <div className="progress-bar bg-secondary" style={{ width: `${course.progress || 0}%`, transition: "0.4s" }}></div>
                          </div>
                          <span className="small fw-bold">{course.progress || 0}%</span>
                        </div>
                      )}
                    </div>
                    <p className="mb-4 text-muted">{course.learningObjective || "Course description details..."}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Weeks- {course.durationInWeeks || 8}</span>
                      <h6 className="fw-bold mb-0 me-3">Credits- {course.credits || 0}</h6>
                      {activeTab === "available" ? (
                        <button className="btn btn-outline-dark px-4" onClick={() => handleEnroll(course.courseId)} disabled={isEnrolled}>
                          {isEnrolled ? "Enrolled" : "Enroll Now"}
                        </button>
                      ) : (
                        <button className="btn btn-dark px-4 py-2" onClick={() => handleStartCourse(course)} disabled={course.status === "Dropped"}>Start Course</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL POPUP */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered">
            <div className="modal-content border-0 p-5 shadow-lg">
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div className="border border-dark p-2 px-4 fs-4 fw-bold">{selectedCourse?.courseName}</div>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>

              <div className="modal-body p-0" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                {courseModules.map((module, mIdx) => (
                  <div key={module.moduleID || mIdx} className="mb-5">
                    <p className="text-muted mb-2">Section {mIdx + 1}</p>
                    <div className="border border-light p-3 px-4 mb-4 d-inline-block fs-5 shadow-sm" style={{ minWidth: "350px", backgroundColor: "#fcfcfc" }}>
                      {module.moduleName}
                    </div>

                    {module.contents && module.contents.map((content, cIdx) => (
                      <div key={content.contentID || cIdx} className="ms-5 mb-5">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h4 className="fw-normal">{content.title}</h4>
                          <div className="d-flex align-items-center">
                            <span className="me-2 text-muted small">Mark as Read</span>
                            <input 
                              type="checkbox" 
                              className="form-check-input ms-2" 
                              style={{ width: "25px", height: "25px", border: "2px solid #ccc" }}
                              onChange={() => handleMarkAsRead(content.contentID)}
                            />
                          </div>
                        </div>

                        {/* Video Player Placeholder */}
                        <div className="bg-light border position-relative rounded" style={{ height: "350px", width: "100%", backgroundColor: "#e9e9e9" }}>
                          <div className="position-absolute top-50 start-50 translate-middle border border-danger p-3 bg-white" style={{ cursor: "pointer" }}>
                            <span className="text-danger fs-1">▶</span>
                          </div>
                          <div className="position-absolute bottom-0 start-50 translate-middle-x w-75 mb-4 px-3">
                            <div className="bg-secondary" style={{ height: "4px", width: "100%" }}></div>
                            <div className="d-flex justify-content-between small mt-2 fw-bold text-dark">
                              <span>0:00</span>
                              <span>{content.duration || "12:37"}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCourses;