import React, { useState, useEffect } from "react";
import axios from "axios";

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Replace with your actual dynamic student ID logic if needed
  const studentId = "S001"; 
  const BASE_URL = "https://localhost:7157/api/Enrollment";

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        // Calling your [HttpGet("student-attendance/{studentId}")] endpoint
        const response = await axios.get(`${BASE_URL}/student-attendance/${studentId}`);
        
        if (response.data && response.data.attendance) {
          setAttendanceData(response.data.attendance);
        }
      } catch (err) {
        console.error("Error fetching attendance:", err);
        setError("Failed to load attendance data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [studentId]);

  return (
    <div className="container-fluid min-vh-100 bg-white p-0">
      <div className="row g-0">
        {/* Main Content Area */}
        <div className="col-12 p-5">
          {/* Header based on wireframe */}
          <div className="mb-5">
            <div className="border border-dark p-2 px-4 d-inline-block fs-3">
              Attendance
            </div>
          </div>

          {loading ? (
            <div className="text-center mt-5">Loading Attendance...</div>
          ) : error ? (
            <div className="text-danger mt-5">{error}</div>
          ) : attendanceData.length === 0 ? (
            <div className="text-muted mt-5">No attendance records found for enrolled courses.</div>
          ) : (
            <div className="d-flex flex-column gap-4">
              {attendanceData.map((item, index) => (
                <div 
                  key={item.courseId || index} 
                  className="p-4 shadow-sm" 
                  style={{ backgroundColor: "#D9D9D9", borderRadius: "4px", maxWidth: "800px" }}
                >
                  <h4 className="fw-normal mb-3">{item.courseName}</h4>
                  
                  <div className="d-flex align-items-center gap-3">
                    {/* Progress Bar Container */}
                    <div className="flex-grow-1" style={{ height: "15px", backgroundColor: "#F5F5F5", borderRadius: "2px" }}>
                      <div 
                        style={{ 
                          width: `${item.attendancePercentage}%`, 
                          height: "100%", 
                          backgroundColor: "#6FFF8D", // Green color from wireframe
                          transition: "width 0.5s ease-in-out",
                          borderRadius: "2px"
                        }}
                      ></div>
                    </div>
                    
                    {/* Percentage Text */}
                    <span className="fs-4 fw-normal" style={{ minWidth: "60px" }}>
                      {item.attendancePercentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;