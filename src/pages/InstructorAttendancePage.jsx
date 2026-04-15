import React, { useState, useEffect } from 'react';
import { api } from '../services/Api';
import AttendanceCard from '../components/InstructorAttendance/AttendanceCard';
import MarkAttendanceModal from '../components/InstructorAttendance/MarkAttendanceModal';
import AttendanceDetailModal from '../components/InstructorAttendance/AttendanceDetailsModal';
import { Search, Plus, RefreshCcw, Loader2, SearchX, CalendarCheck } from 'lucide-react';

export default function InstructorAttendancePage() {
  const [summaries, setSummaries] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);
  const [selectedSummary, setSelectedSummary] = useState(null);

  const handleReset = () => {
  setSearchTerm('');
};

const fetchSummary = async () => {
  try {
    setLoading(true);
    const [activeRes, deletedRes] = await Promise.all([
      api.getAttendanceSummary(),
      api.getDeletedAttendanceSummary()
    ]);

    // AXIOS returns data in .data, but if your API method 
    // already returns .data (like in your api.js), adjust accordingly:
    const activeData = activeRes.data || activeRes;
    const deletedData = deletedRes.data || deletedRes;

    const active = (Array.isArray(activeData) ? activeData : []).map(i => ({ ...i, isDeleted: false }));
    const deleted = (Array.isArray(deletedData) ? deletedData : []).map(i => ({ ...i, isDeleted: true }));

    const combined = [...active, ...deleted].sort((a, b) => 
      new Date(b.sessionDate) - new Date(a.sessionDate)
    );

    setSummaries(combined);
    setFilteredData(combined);
  } catch (err) {
    console.error("Error fetching attendance data:", err);
    // If unauthorized, the token might be expired
    if (err.response?.status === 401) {
        window.location.href = "/login";
    }
  } finally {
    setLoading(false);
  }
};

  // const fetchSummary = async () => {
  //   try {
  //     setLoading(true);
  //     const [activeRes, deletedRes] = await Promise.all([
  //       api.getAttendanceSummary(),
  //       api.getDeletedAttendanceSummary()
  //     ]);

  //     const active = (activeRes.data || []).map(i => ({ ...i, isDeleted: false }));
  //     const deleted = (deletedRes.data || []).map(i => ({ ...i, isDeleted: true }));

  //     const combined = [...active, ...deleted].sort((a, b) => 
  //       new Date(b.sessionDate) - new Date(a.sessionDate)
  //     );

  //     setSummaries(combined);
  //     setFilteredData(combined);
  //   } catch (err) {
  //     console.error("Error fetching attendance data:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => { fetchSummary(); }, []);

  useEffect(() => {
    const results = summaries.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      const formattedDate = item.sessionDate 
        ? new Date(item.sessionDate).toLocaleDateString().toLowerCase() 
        : '';

      return (
        item.batchId?.toLowerCase().includes(searchLower) ||
        item.courseName?.toLowerCase().includes(searchLower) ||
        item.courseId?.toLowerCase().includes(searchLower) ||
        formattedDate.includes(searchLower)
      );
    });
    setFilteredData(results);
  }, [searchTerm, summaries]);

  const handleBulkDelete = async (item) => {
    const reason = window.prompt(`Enter reason for deleting Batch ${item.batchId}:`);
    if (!reason) return;
    try {
      const res = await api.deleteBatchAttendance(item.batchId, item.sessionDate, reason);
      alert(res.data);
      fetchSummary(); 
    } catch (err) {
      alert(err.response?.data || "Deletion failed");
    }
  };

  const handleBulkRestore = async (item) => {
    try {
      const res = await api.restoreBatchAttendance(item.batchId, item.sessionDate);
      alert(res.data);
      fetchSummary();
    } catch (err) {
      alert(err.response?.data || "Restore failed");
    }
  };

  if (loading) return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100" style={{ backgroundColor: '#F4F7FE' }}>
      <Loader2 className="animate-spin text-primary mb-3" size={40} />
      <span className="fw-bold text-muted">Loading Attendance Records...</span>
    </div>
  );

  return (
    <div className="container-fluid py-4 px-4 px-lg-5" style={{ backgroundColor: '#F4F7FE', minHeight: '100vh' }}>
      
      {/* --- HEADER (LEFT ALIGNED BLUE THEME) --- */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="p-4 rounded-4 bg-white shadow-sm d-flex justify-content-between align-items-center" 
               style={{ borderLeft: '5px solid #4318FF' }}> 
            <div className="text-start">
              <h2 className="fw-bold mb-1 d-flex align-items-center gap-2" style={{ color: '#1B2559' }}>
                <CalendarCheck className="text-primary" size={28} /> Batch Attendance
              </h2>
              <p className="text-secondary small mb-0 fw-medium">Monitor and manage student presence across all active batches.</p>
            </div>
            <button 
              onClick={() => setIsMarkModalOpen(true)}
              className="btn d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-sm text-white border-0 hover-lift"
              style={{ background: 'linear-gradient(135deg, #4318FF 0%, #5E3BFF 100%)', fontWeight: '600' }}
            >
              <Plus size={20} />
              <span>Mark Attendance</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- CONSOLIDATED SEARCH PILL-BAR --- */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="card border-0 shadow-sm p-2 rounded-pill bg-white px-3">
            <div className="d-flex align-items-center justify-content-between">
              
              {/* Left: Search Input */}
              <div className="d-flex align-items-center flex-grow-1">
                <Search size={18} className="text-muted ms-2 me-2" />
                <input 
                  type="text" 
                  className="form-control border-0 shadow-none bg-transparent" 
                  placeholder="Search by Batch, Course Name, or Date..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ fontSize: '0.95rem', color: '#1B2559', fontWeight: '500' }}
                />
              </div>

              {/* Right: Refresh and Count Badge (Now Blue) */}
              <div className="d-flex align-items-center gap-2">
                <button 
                  className="btn btn-white rounded-circle p-2 shadow-sm border hover-rotate" 
                  onClick={fetchSummary}
                  style={{ width: '38px', height: '38px', backgroundColor: '#fff' }}
                >
                  <RefreshCcw size={14} className="text-primary" />
                </button>

                <div className="badge rounded-pill px-4 py-2" style={{ backgroundColor: '#7c94cdff', color: '#fff', fontWeight: '700', fontSize: '0.8rem', boxShadow: '0 4px 14px 0 rgba(67, 24, 255, 0.3)' }}>
                  {filteredData.length} Found
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- GRID OR EMPTY STATE --- */}
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

      {/* Modals */}
      <MarkAttendanceModal 
        isOpen={isMarkModalOpen} 
        onClose={() => setIsMarkModalOpen(false)} 
        onRefresh={fetchSummary} 
      />
      {selectedSummary && (
        <AttendanceDetailModal 
          isOpen={!!selectedSummary}
          batchId={selectedSummary.batchId}
          date={selectedSummary.sessionDate}
          onClose={() => setSelectedSummary(null)}
          onUpdate={fetchSummary} 
        />
      )}

      {/* --- STYLES --- */}
      <style>{`
        .hover-rotate:hover { transform: rotate(180deg); transition: transform 0.4s ease; }
        .hover-lift { transition: transform 0.2s ease; }
        .hover-lift:hover { transform: translateY(-2px); }
        .animate-pulse { animation: pulse 2.5s infinite; }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.08); }
        }
      `}</style>
    </div>
  );
  
}