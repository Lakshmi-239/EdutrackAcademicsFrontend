import React, { useState, useEffect } from 'react';
import { api } from '../services/Api';
import AssessmentCard from '../components/InstructorAssessment/AssessmentCard';
import CreateAssessmentModal from '../components/InstructorAssessment/CreateAssessmentModal';
import { Search, Filter, Plus, RefreshCcw, LayoutGrid } from 'lucide-react';

export default function InstructorAssessmentPage() {
  const [assessments, setAssessments] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

const fetchData = async () => {
  try {
    setLoading(true);
    
    // RESET SEARCH AND FILTERS ON REFRESH
    setSearchTerm('');
    setStatusFilter('All');

    const data = await api.getAllAssessments();
    const rawData = Array.isArray(data) ? data : [data];
    // const enhancedData = rawData.map(item => ({
    //   ...item,
    //   assessmentID: item.id || item.assessmentID || 'N/A',
    //   displayStatus: item.status || (new Date(item.date) > new Date() ? 'Open' : 'Closed')
    // }));

    // inside your fetchData mapping:
const enhancedData = rawData.map(item => ({
  ...item,
  // Force ID to string so .includes() works during search
  assessmentID: String(item.id || item.assessmentID || item.AssessmentID || 'N/A'),
  displayStatus: item.status || (new Date(item.date) > new Date() ? 'Open' : 'Closed')
}));
    
    setAssessments(enhancedData);
    setFilteredData(enhancedData);
  } catch (error) {
    console.error("Fetch error:", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const results = assessments.filter(item => {
      const searchLower = searchTerm.toLowerCase();

      // Convert the date to a readable string (e.g., "4/7/2026" or "April")
      // so the user can search by month, year, or day.
      const dateObj = item.date || item.Date || item.dueDate || item.DueDate;
      const formattedDate = dateObj ? new Date(dateObj).toLocaleDateString() : "";

      const searchableText = [
        item.assessmentID,
        item.assessmentName,
        item.courseId,
        item.courseName,
        item.type,
        formattedDate // Now includes the date in the search!
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesSearch = searchableText.includes(searchLower);
      const matchesStatus = statusFilter === 'All' || item.displayStatus === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    
    setFilteredData(results);
  }, [searchTerm, statusFilter, assessments]);

//   useEffect(() => {
//     const results = assessments.filter(item => {
//       const searchLower = searchTerm.toLowerCase();

//       // Collect all searchable fields into one string
//       // We check both camelCase and PascalCase to be safe
//       const searchableText = [
//         item.assessmentID,
//         item.AssessmentID,
//         item.assessmentName,
//         item.AssessmentName,
//         item.courseId,
//         item.CourseId,
//         item.courseName,
//         item.CourseName,
//         item.type,
//         item.Type
//       ]
//         .filter(Boolean) // Remove null/undefined values
//         .join(' ')
//         .toLowerCase();

//       const matchesSearch = searchableText.includes(searchLower);
//       const matchesStatus = statusFilter === 'All' || item.displayStatus === statusFilter;
      
//       return matchesSearch && matchesStatus;
//     });
    
//     setFilteredData(results);
//   }, [searchTerm, statusFilter, assessments]);

//   useEffect(() => {
//     const results = assessments.filter(item => {
//       const matchesSearch = (item.courseId + item.type).toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesStatus = statusFilter === 'All' || item.displayStatus === statusFilter;
//       return matchesSearch && matchesStatus;
//     });
//     setFilteredData(results);
//   }, [searchTerm, statusFilter, assessments]);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-grow text-primary" role="status"></div>
    </div>
  );

  return (
    <div className="container py-4 min-vh-100">
        {/* GLOSSY HEADER - REFIXED BUTTON VISIBILITY */}
<div className="d-flex justify-content-between align-items-center mb-4 p-4 rounded-4 bg-white shadow-sm border-start border-4 border-primary">
  <div>
    <h2 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
      <LayoutGrid className="text-primary" size={28} /> 
      Assessments
    </h2>
    <p className="text-muted small mb-0">Manage your academic evaluations</p>
  </div>
  
  <button 
    onClick={() => setIsModalOpen(true)}
    className="btn d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-sm text-white border-0 transition-all hover-scale"
    style={{ 
      background: 'linear-gradient(135deg, #a7a7deff 0%, #312ab1ff 100%)',
      minWidth: '160px',
      fontWeight: '600',
      display: 'flex' // Ensures it renders even if Bootstrap classes are conflicting
    }}
  >
    <Plus size={20} color="white" strokeWidth={3} />
    <span>Create Assessment</span>
  </button>
</div>


{/* COMPACT FILTER BAR - HEIGHT FIXED */}
<div className="row g-0 mb-4 align-items-center bg-white rounded-pill shadow-sm border mx-0 px-3" style={{ height: '50px' }}>
  <div className="col-md-6 h-100">
    <div className="d-flex align-items-center h-100">
      <Search size={18} className="text-muted me-2" />
      <input 
  type="text" 
  className="form-control border-0 shadow-none bg-transparent" 
  placeholder="Search by ID, Course, Type or Date..." 
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  style={{ fontSize: '0.95rem' }}
/>
      
    </div>
  </div>
  
  <div className="col-md-6 d-flex justify-content-end align-items-center gap-2 h-100">
    <Filter size={14} className="text-muted" />
    <select 
      className="form-select form-select-sm border-0 bg-light rounded-pill fw-bold shadow-none" 
      style={{ width: '130px', cursor: 'pointer' }} 
      value={statusFilter} // Bind the value so it clears on reset
      onChange={(e) => setStatusFilter(e.target.value)}
    >
      <option value="All">All Status</option>
      <option value="Open">Open</option>
      <option value="Closed">Closed</option>
    </select>
    
    <button 
      className="btn btn-light btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center" 
      onClick={fetchData}
      title="Refresh & Clear Filters"
    >
      <RefreshCcw size={14} className="text-primary" />
    </button>
    <span className="badge bg-primary-subtle text-primary rounded-pill px-2 ms-2" style={{ fontSize: '0.75rem' }}>
  {filteredData.length} Found
</span>
  </div>
</div>

      {/* GRID SECTION */}
      <div className="row g-4">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <div className="col-12 col-md-6 col-lg-4" key={item.assessmentID}>
              <AssessmentCard assessment={item} onRefresh={fetchData} />
            </div>
          ))
        ) : (
          <div className="text-center py-5">
            <div className="display-1 text-light">Empty</div>
            <p className="text-muted">No assessments found in this category.</p>
          </div>
        )}
      </div>

      <CreateAssessmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRefresh={fetchData} />
    </div>
  );
}