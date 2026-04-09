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

  // Progress & Persistence State
  const [watchedProgress, setWatchedProgress] = useState({}); 
  const [completedContentIds, setCompletedContentIds] = useState(new Set());

  const studentId = "S001";
  const BASE_URL = "https://localhost:7157/api/Enrollment";

  useEffect(() => {
    const loadPageData = async () => {
      setLoading(true);
      try {
        await axios.patch(`${BASE_URL}/sync-status`, null, {
          params: { studentId: studentId }
        });
      } catch (err) {
        console.error("Dropout sync failed:", err);
      }
      await fetchEnrolledIds();
      await fetchData();
      setLoading(false);
    };
    loadPageData();
  }, [activeTab]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      fetchData();
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      handleSearch();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

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
              const progRes = await axios.get(`${BASE_URL}/progress`, {
                params: { StudentId: studentId, CourseId: course.courseId }
              });
              const statusRes = await axios.get(`${BASE_URL}/status`, {
                params: { StudentId: studentId, CourseId: course.courseId }
              });
              return { 
                ...course, 
                progress: progRes.data.progress, 
                status: statusRes.data.currentStatus 
              };
            } catch (err) {
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

  const handleSearch = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === "available" 
        ? `${BASE_URL}/search-by-name` 
        : `${BASE_URL}/search-my-courses`;

      const response = await axios.get(endpoint, {
        params: { studentId: studentId, courseName: searchTerm }
      });
      setCourses(response.data.data || []);
    } catch (err) {
      setCourses([]);
    } finally {
      setLoading(false);
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
        
        // PERSISTENCE LOGIC: 
        // If the course is already marked 'Completed' in the DB, 
        // we fill our local state so the checkboxes are checked on load.
        if (course.status === "Completed") {
            const allIds = new Set();
            response.data.data.forEach(m => m.contents.forEach(c => allIds.add(c.contentID)));
            setCompletedContentIds(allIds);
        }
        
        setShowModal(true);
      }
    } catch (err) {
      alert("Error loading content.");
    }
  };

  // Extract YouTube ID for Iframe
  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const renderContentItem = (content) => {
    const uri = content.contentURI || "";
    const youtubeId = getYouTubeId(uri);
    const isDoc = uri.toLowerCase().endsWith(".pdf") || uri.toLowerCase().endsWith(".ppt") || uri.toLowerCase().endsWith(".pptx");

    if (isDoc) {
      return (
        <div className="p-5 text-center bg-light border rounded">
          <h5>{content.title}</h5>
          <a href={uri} target="_blank" rel="noreferrer" className="btn btn-primary mt-2"
             onClick={() => setWatchedProgress(prev => ({ ...prev, [content.contentID]: 100 }))}>
            View / Download Document
          </a>
        </div>
      );
    }

    if (youtubeId) {
      return (
        <div className="ratio ratio-16x9">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
            title={content.title}
            allowFullScreen
            onLoad={() => {
                // Auto-enable Mark as Read for YouTube after 5 seconds to simulate viewing
                setTimeout(() => {
                    setWatchedProgress(prev => ({ ...prev, [content.contentID]: 100 }));
                }, 5000);
            }}
          ></iframe>
        </div>
      );
    }

    return (
      <video 
        key={uri} controls className="w-100 rounded" style={{ height: "400px", backgroundColor: "#000" }}
        onTimeUpdate={(e) => {
          if (e.target.duration) {
            const progress = (e.target.currentTime / e.target.duration) * 100;
            if (progress > (watchedProgress[content.contentID] || 0)) {
              setWatchedProgress(prev => ({ ...prev, [content.contentID]: progress }));
            }
          }
        }}
      >
        <source src={uri} type="video/mp4" />
      </video>
    );
  };

  const handleMarkAsRead = async (contentId) => {
    try {
      const response = await axios.post(`${BASE_URL}/mark-completed`, {
        StudentId: studentId,
        CourseId: selectedCourse.courseId,
        ContentId: contentId
      });

      if (response.data.status === 200) {
        setCompletedContentIds(prev => new Set(prev).add(contentId));
        
        const statusRes = await axios.get(`${BASE_URL}/status`, {
          params: { StudentId: studentId, CourseId: selectedCourse.courseId }
        });

        const newStatus = statusRes.data.currentStatus;
        const newProgress = response.data.progress;

        setCourses(prev => prev.map(c => 
          c.courseId === selectedCourse.courseId 
            ? { ...c, progress: newProgress, status: newStatus }
            : c
        ));
        
        setSelectedCourse(prev => ({ ...prev, progress: newProgress, status: newStatus }));

        if (newStatus === "Completed") {
          alert("🎉 Congratulations! You've completed the course.");
        }
      }
    } catch (err) {
      alert("Progress update failed.");
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      const add_enroll="https://localhost:7157/api/coordinator/add-enrollment";
      const response = await axios.post(`${add_enroll}`, { studentId, courseId: String(courseId) });
      if (response.status === 200) {
        alert("Enrollment successful!");
        await fetchEnrolledIds();
        await fetchData();
      }
    } catch (err) {
      alert("Enrollment failed.");
    }
  };

  return (
    <div className="container-fluid py-4 px-4 bg-white min-vh-100">
      {/* Search & Tabs remain unchanged */}
      <div className="mb-4 d-flex align-items-center">
        <input
          type="text"
          className="form-control w-25 border-secondary"
          placeholder={activeTab === "available" ? "Search all courses..." : "Search my courses..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="d-flex mb-4 border-bottom">
        <button className={`btn me-5 pb-2 rounded-0 border-0 ${activeTab === "available" ? "border-bottom border-dark border-3 fw-bold text-dark" : "text-muted"}`} onClick={() => setActiveTab("available")}>Courses</button>
        <button className={`btn pb-2 rounded-0 border-0 ${activeTab === "enrolled" ? "border-bottom border-dark border-3 fw-bold text-dark" : "text-muted"}`} onClick={() => setActiveTab("enrolled")}>Enrolled</button>
      </div>

      {/* Course Cards */}
      <div className="row g-4">
        {loading ? <div className="text-center mt-5">Loading...</div> : (
          courses.map((course) => {
            const isEnrolled = enrolledCourseIds.has(course.courseId);
            return (
              <div className="col-12" key={course.courseId}>
                <div className="card border-0 shadow-sm" style={{ backgroundColor: "#D9D9D9", borderRadius: "12px" }}>
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center">
                        <h4 className="fw-bold mb-0 me-3">{course.courseName}</h4>
                        {activeTab === "enrolled" && (
                          <span className={`badge ${course.status === 'Completed' ? 'bg-success' : 'bg-primary'}`}>{course.status || 'Assigned'}</span>
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
                    <p className="mb-4 text-muted">{course.learningObjective}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold">Weeks- {course.durationInWeeks || 8}</span>
                      <h6 className="fw-bold mb-0 me-3">Credits- {course.credits || 0}</h6>
                      {activeTab === "available" ? (
                        <button className="btn btn-outline-dark px-4" onClick={() => handleEnroll(course.courseId)} disabled={isEnrolled}>{isEnrolled ? "Enrolled" : "Enroll Now"}</button>
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

      {/* Content Modal */}
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
                    <div className="border border-light p-3 px-4 mb-4 d-inline-block fs-5 shadow-sm" style={{ minWidth: "350px", backgroundColor: "#fcfcfc" }}>{module.moduleName}</div>

                    {module.contents && module.contents.map((content, cIdx) => {
                      // 90% Threshold Logic
                      const isThresholdMet = (watchedProgress[content.contentID] || 0) >= 90;
                      // Persistance Logic: Checks local state set during handleStartCourse
                      const isAlreadyDone = completedContentIds.has(content.contentID) || selectedCourse?.status === "Completed";

                      return (
                        <div key={content.contentID || cIdx} className="ms-5 mb-5 border-bottom pb-4">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 className="fw-normal">{content.title}</h4>
                            <div className="d-flex align-items-center">
                              <span className={`me-2 small ${isAlreadyDone ? "text-success fw-bold" : "text-muted"}`}>
                                {isAlreadyDone ? "Completed" : isThresholdMet ? "Ready to Mark" : "Watch 90% to Enable"}
                              </span>
                              <input 
                                type="checkbox" 
                                className="form-check-input ms-2" 
                                style={{ width: "25px", height: "25px", cursor: isAlreadyDone ? "default" : "pointer" }}
                                checked={isAlreadyDone}
                                disabled={isAlreadyDone || !isThresholdMet} 
                                onChange={() => handleMarkAsRead(content.contentID)}
                              />
                            </div>
                          </div>
                          {renderContentItem(content)}
                        </div>
                      );
                    })}
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