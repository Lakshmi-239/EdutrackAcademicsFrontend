import React, { useState, useEffect } from 'react';
import { api } from '../services/Api';
import CourseCard from '../components/InstructorCourse/CourseCard'; 
import { Search, Filter, RefreshCcw, GraduationCap, UserCheck, Loader2, SearchX } from 'lucide-react';

export default function InstructorCoursePage() {
  const [courses, setCourses] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // const instructorId = localStorage.getItem("userId") || "I003";
 const instructorId = "I003";
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.getInstructorCourses(instructorId);
      const rawData = response.data || response || [];
      setCourses(rawData);
      setFilteredData(rawData);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setStatusFilter('All');
    fetchData();
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const results = courses.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      const bId = String(item.batchId || item.BatchId || "").toLowerCase();
      const cId = String(item.courseId || item.CourseId || "").toLowerCase();
      const cName = String(item.courseName || item.CourseName || "").toLowerCase();

      const enrolled = item.currentStudents || 0;
      const capacity = item.batchSize || 0;
      const displayStatus = (enrolled === capacity && capacity > 0) ? 'Active' : 'Inactive';

      const matchesSearch = bId.includes(searchLower) || cId.includes(searchLower) || cName.includes(searchLower);
      const matchesStatus = statusFilter === 'All' || displayStatus === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    setFilteredData(results);
  }, [searchTerm, statusFilter, courses]);

  if (loading) return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100" style={{ backgroundColor: '#F4F7FE' }}>
      <Loader2 className="animate-spin text-primary mb-3" size={40} />
      <span className="fw-bold text-muted">Syncing Course Data...</span>
    </div>
  );

  return (
    <div className="container-fluid py-4 px-4 px-lg-5" style={{ backgroundColor: '#F4F7FE', minHeight: '100vh' }}>
      
      {/* --- HEADER --- */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="p-4 rounded-4 bg-white shadow-sm d-flex justify-content-between align-items-center" 
               style={{ borderLeft: '5px solid #4318FF' }}> 
            <div className="text-start">
              <h2 className="fw-bold mb-1 d-flex align-items-center gap-2" style={{ color: '#1B2559' }}>
                <GraduationCap className="text-primary" size={28} /> My Courses
              </h2>
              <p className="text-secondary small mb-0 fw-medium">Monitor enrollment status and manage course modules.</p>
            </div>
            <div className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill shadow-sm" style={{ backgroundColor: '#E9EDF7', border: '1px solid #D1DBFF' }}>
              <UserCheck size={16} className="text-primary" />
              <span className="fw-bold text-primary small">Instructor: {instructorId}</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- SEARCH BAR --- */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="card border-0 shadow-sm p-2 rounded-pill bg-white px-3">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center flex-grow-1">
                <Search size={18} className="text-muted ms-2 me-2" />
                <input 
                  type="text" 
                  className="form-control border-0 shadow-none bg-transparent" 
                  placeholder="Search by Batch ID, Course ID, or Name..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ fontSize: '0.95rem', color: '#2B3674', fontWeight: '500' }}
                />
              </div>

              <div className="d-flex align-items-center gap-2">
                <div className="d-flex align-items-center bg-light rounded-pill px-3 py-1 border">
                  <Filter size={14} className="text-muted me-2" />
                  <select 
                    className="form-select border-0 bg-transparent shadow-none fw-bold p-0 py-1" 
                    style={{ width: '100px', fontSize: '0.85rem', cursor: 'pointer', color: '#4318FF' }} 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <button 
                  className="btn btn-white rounded-circle p-2 shadow-sm border hover-rotate" 
                  onClick={handleReset}
                  style={{ width: '38px', height: '38px', backgroundColor: '#fff' }}
                >
                  <RefreshCcw size={14} className="text-primary" />
                </button>

                <div className="badge rounded-pill px-4 py-2" style={{ backgroundColor: '#7c94cdff', color: '#fff', fontWeight: '700', fontSize: '0.8rem' }}>
                  {filteredData.length} Found
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- GRID --- */}
      {/* Removed justify-content-center to keep cards aligned to the left */}
      <div className="row g-4">
        {filteredData.length > 0 ? (
          filteredData.map((course, index) => (
            <div className="col-12 col-md-6 col-lg-4" key={course.batchId || index}>
              <CourseCard course={course} />
            </div>
          ))
        ) : (
          /* --- COMPACT EMPTY STATE --- */
          <div className="col-12 d-flex justify-content-center mt-4"> {/* Aligned left to match headers */}
            <div 
              className="bg-white p-4 rounded-4 shadow-sm border border-dashed d-flex flex-column align-items-center justify-content-center" 
              style={{ maxWidth: '400px', minHeight: '280px', borderColor: '#E9EDF7', borderWidth: '2px' }}
            >
              <div className="position-relative mb-3 d-flex align-items-center justify-content-center">
                <div 
                  className="rounded-circle animate-pulse" 
                  style={{ width: '80px', height: '80px', backgroundColor: '#F4F7FE', position: 'absolute' }}
                ></div>
                <SearchX size={40} className="text-muted opacity-40 position-relative z-1" />
              </div>

              <h5 className="fw-bold mb-2" style={{ color: '#2B3674' }}>
                No Matches Found
              </h5>
              
              <p className="text-secondary small mb-4 text-center px-3">
                Adjust your filters or keywords to find what you're looking for.
              </p>

              <button 
                className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm" 
                onClick={handleReset}
                style={{ backgroundColor: '#4318FF', border: 'none', fontSize: '0.8rem' }}
              >
                Clear Search
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .hover-rotate:hover { transform: rotate(180deg); transition: transform 0.4s ease; }
        .animate-pulse { animation: pulse 2.5s infinite; }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        .form-select { background-image: none !important; }
      `}</style>
    </div>
  );
}