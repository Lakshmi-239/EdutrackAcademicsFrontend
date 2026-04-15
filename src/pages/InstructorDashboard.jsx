import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { api } from '../services/Api'; 

const InstructorDashboard = () => {
  const navigate = useNavigate(); 
  const [curriculumData, setCurriculumData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todaysDeadlines, setTodaysDeadlines] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date()); 
  
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeCourses: 0,
    activeAssessments: 0,
    totalModules: 0
  });

  const instructorId = "I003";
  const today = new Date();
  const currentMonth = today.toLocaleString('default', { month: 'long' });
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, today.getMonth() + 1, 0).getDate();
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const fetchDeadlinesByDate = async (date) => {
    try {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;
      
      const response = await api.getAssessmentsByDate(dateStr); 
      const data = response.data || response;
      setTodaysDeadlines(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching date-specific assessments:", err);
      setTodaysDeadlines([]);
    }
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await api.getInstructorCurriculumData(instructorId);
        const safeData = Array.isArray(data) ? data : [];
        setCurriculumData(safeData);

        await fetchDeadlinesByDate(new Date());

        const totals = safeData.reduce((acc, curr) => {
          acc.totalStudents += curr.currentStudents || 0;
          acc.activeAssessments += curr.totalAssessments || 0;
          acc.totalModules += curr.totalModules || 0;
          return acc;
        }, { totalStudents: 0, activeAssessments: 0, totalModules: 0 });

        setStats({
          totalStudents: totals.totalStudents,
          activeCourses: safeData.length,
          activeAssessments: totals.activeAssessments,
          totalModules: totals.totalModules
        });
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [instructorId]);

  const handleDateClick = (dayNumber) => {
    const newDate = new Date(currentYear, today.getMonth(), dayNumber);
    setSelectedDate(newDate);
    fetchDeadlinesByDate(newDate);
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary"></div>
    </div>
  );

  return (
    <div className="container-fluid py-5 px-4" style={{ backgroundColor: '#F4F7FE', minHeight: '100vh' }}>
      <h2 className="fw-bold mb-4" style={{ color: '#2B3674' }}>Hi Jyothirmyee,</h2>

      {/* CURRICULUM OVERVIEW */}
      <div className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: '20px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="fw-bold m-0" style={{ color: '#2B3674' }}>Curriculum Overview</h5>
          
          {/* Live Session Button */}
          <button 
  className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2 shadow-sm"
  onClick={() => window.open('https://teams.microsoft.com/l/meetup-join/YOUR_TEAMS_LINK', '_blank')}
  style={{ 
    fontSize: '0.9rem', 
    fontWeight: '600', 
    backgroundColor: '#464EB8', // Official Teams Purple
    border: 'none' 
  }}
>
  {/* Pulsing indicator to show it's "Live" */}
  <span 
    className="spinner-grow spinner-grow-sm" 
    style={{ width: '10px', height: '10px' }} 
    role="status" 
    aria-hidden="true"
  ></span>
  Go Live Session
</button>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="text-secondary small">
              <tr>
                <th className="border-0">COURSE NAME</th>
                <th className="border-0">BATCH</th>
                <th className="border-0">MODULES</th>
                <th className="border-0">ASSESSMENTS</th>
                <th className="border-0">STUDENTS</th>
              </tr>
            </thead>
            <tbody style={{ color: '#2B3674', fontWeight: '600' }}>
              {curriculumData.map((item, index) => (
                <tr key={index}>
                  <td>{item.courseName}</td>
                  <td><span className="badge rounded-pill bg-light text-dark px-3">{item.batchId}</span></td>
                  <td>{item.totalModules} Units</td>
                  <td><span className="text-primary">{item.totalAssessments} Active</span></td>
                  <td>{item.currentStudents} / {item.batchSize}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="row g-4 align-items-start">
        {/* CALENDAR SECTION */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '20px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h6 className="fw-bold m-0" style={{ color: '#2B3674' }}>{currentMonth} {currentYear}</h6>
              <i className="bi bi-calendar3 text-primary"></i>
            </div>
            
            <div className="row g-0 text-center mb-2">
              {['S','M','T','W','T','F','S'].map(d => (
                <div key={d} className="col fw-bold small text-secondary" style={{ fontSize: '0.7rem' }}>{d}</div>
              ))}
            </div>

            <div className="row g-0 text-center">
              {calendarDays.map(day => {
                const isSelected = day === selectedDate.getDate();
                const isToday = day === today.getDate() && selectedDate.getMonth() === today.getMonth();
                
                return (
                  <div key={day} className="col-auto" style={{ width: '14.28%' }}>
                    <div 
                      className="p-1 small fw-bold" 
                      onClick={() => handleDateClick(day)}
                      style={{ 
                        borderRadius: '8px',
                        backgroundColor: isSelected ? '#4318FF' : 'transparent',
                        color: isSelected ? '#FFF' : (isToday ? '#4318FF' : '#2B3674'),
                        border: isToday && !isSelected ? '1px solid #4318FF' : 'none',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {day}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* DEADLINES LIST SECTION */}
        <div className="col-md-8">
          {/* Changed minHeight to height: 'fit-content' for automatic resizing */}
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '20px', height: 'fit-content', minHeight: '300px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold m-0" style={{ color: '#2B3674' }}>Assessments Ending</h5>
              <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: '#eef0ff', color: '#4318FF' }}>
                {selectedDate.getDate()} {currentMonth}
              </span>
            </div>

            {todaysDeadlines.length > 0 ? (
              <div className="list-group list-group-flush">
                {todaysDeadlines.map((item, idx) => (
                  <div key={idx} className="list-group-item border-0 d-flex align-items-center p-3 mb-3 shadow-sm" 
                       style={{ borderRadius: '16px', backgroundColor: '#fff', border: '1px solid #f0f2f8' }}>
                    
                    <div className="rounded-3 d-flex align-items-center justify-content-center me-3" 
                         style={{ width: '45px', height: '45px', backgroundColor: '#F4F7FE', flexShrink: 0 }}>
                      <i className="bi bi-file-text-fill text-primary" style={{ fontSize: '1.2rem' }}></i>
                    </div>
                    
                    <div className="flex-grow-1 text-start">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span className="badge" style={{ backgroundColor: '#E9EDF7', color: '#4318FF', fontSize: '0.7rem' }}>
                          {item.assessmentID}
                        </span>
                        <span className="text-secondary fw-bold" style={{ fontSize: '0.8rem' }}>
                          CID: {item.courseId}
                        </span>
                      </div>
                      
                      <h6 className="fw-bold mb-1" style={{ color: '#2B3674', margin: 0 }}>
                        {item.courseName} <span className="text-muted fw-normal mx-1">|</span> {item.type}
                      </h6>
                      
                      <div className="d-flex align-items-center text-muted small">
                         <i className="bi bi-bookmark-check me-1 text-success"></i>
                         Max Marks: <strong className="ms-1 text-dark">{item.maxMarks}</strong>
                      </div>
                    </div>

                    <div className="ms-3">
                      <button 
                        className="btn btn-primary rounded-pill btn-sm px-4"
                        onClick={() => navigate(`/submissions/${item.assessmentID}`)}
                        style={{ backgroundColor: '#4318FF', border: 'none', fontWeight: '600' }}
                      >
                        View Submissions
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-5">
                <i className="bi bi-calendar-x text-secondary" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
                <p className="text-secondary mt-3 fw-medium">No deadlines for this date.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;