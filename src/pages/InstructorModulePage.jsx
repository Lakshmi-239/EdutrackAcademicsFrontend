import React, { useState, useEffect } from 'react';
import { api } from '../services/Api';
import ModuleCard from '../components/InstructorModule/ModuleCard';
import CreateModuleModal from '../components/InstructorModule/CreateModuleModal';
import { Search, Plus, RefreshCcw, Layers, Loader2, SearchX, BookOpen } from 'lucide-react';

export default function InstructorModulePage() {
  const [modules, setModules] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleReset = () => {
  // Logic to clear search filters or inputs
  setSearchTerm(''); 
  setFilterStatus('All');
};

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.getAllModules(); 
      const rawData = Array.isArray(response.data) ? response.data : [];
      
      const enhancedData = rawData.map(item => ({
        ...item,
        moduleID: String(item.moduleID || 'N/A'),
        courseId: String(item.courseId || 'N/A')
      }));

      // Grouping logic: Sort by Course ID first, then by Sequence
      const sortedData = enhancedData.sort((a, b) => 
        a.courseId.localeCompare(b.courseId) || a.sequenceOrder - b.sequenceOrder
      );

      setModules(sortedData);
      setFilteredData(sortedData);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const results = modules.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      return (
        item.name.toLowerCase().includes(searchLower) ||
        item.courseId.toLowerCase().includes(searchLower) ||
        (item.learningObjectives && item.learningObjectives.toLowerCase().includes(searchLower))
      );
    });
    setFilteredData(results);
  }, [searchTerm, modules]);

  if (loading) return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100" style={{ backgroundColor: '#F4F7FE' }}>
      <Loader2 className="animate-spin text-primary mb-3" size={40} />
      <span className="fw-bold text-muted">Syncing Global Curriculum...</span>
    </div>
  );

  return (
    <div className="container-fluid py-4 px-4 px-lg-5" style={{ backgroundColor: '#F4F7FE', minHeight: '100vh' }}>
      
      {showCreateModal && (
        <CreateModuleModal 
          onClose={() => setShowCreateModal(false)} 
          onRefresh={fetchData} 
        />
      )}

      {/* --- HEADER --- */}
      <div className="row mb-4">
        <div className="col-12 text-start">
          <div className="p-4 rounded-4 bg-white shadow-sm d-flex justify-content-between align-items-center" 
               style={{ borderLeft: '5px solid #4318FF' }}> 
            <div>
              <h2 className="fw-bold mb-1 d-flex align-items-center gap-2" style={{ color: '#1B2559' }}>
                <Layers className="text-primary" size={28} /> Global Course Modules
              </h2>
              <p className="text-secondary small mb-0 fw-medium">Managing modules across all registered courses.</p>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-sm text-white border-0"
              style={{ background: 'linear-gradient(135deg, #4318FF 0%, #5E3BFF 100%)', fontWeight: '600' }}
            >
              <Plus size={20} strokeWidth={3} />
              <span>Create Module</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- SEARCH BAR --- */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm p-2 rounded-pill bg-white px-3 d-flex flex-row align-items-center">
            <Search size={18} className="text-muted mx-2" />
            <input 
              type="text" 
              className="form-control border-0 shadow-none bg-transparent" 
              placeholder="Search by Course ID or Module Title..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
             <button className="btn btn-white rounded-circle p-2 mx-2" onClick={fetchData}>
                <RefreshCcw size={16} className="text-primary" />
             </button>
            <div className="badge rounded-pill px-3 py-2 ms-2" style={{ backgroundColor: '#4318FF' }}>
              {filteredData.length} Modules
            </div>
          </div>
        </div>
      </div>

      {/* --- MODULE CARDS GRID WITH COURSE HEADERS --- */}
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
      {/* <div className="row">
        {filteredData.length > 0 ? (
          filteredData.map((module, index) => {
            const showCourseHeader = index === 0 || module.courseId !== filteredData[index - 1].courseId;
            
            return (
              <React.Fragment key={module.moduleID}>
                <div className="col-12 mb-3">
                  <ModuleCard module={module} onRefresh={fetchData} />
                </div>
              </React.Fragment>
            );
          })
        ) : (
          <div className="col-12 text-center py-5 mt-5">
            <SearchX size={60} className="text-muted opacity-25 mb-3" />
            <h4 className="fw-bold text-muted">No modules found</h4>
            <p className="text-secondary">Try adjusting your search or clearing filters.</p>
            <button className="btn btn-primary rounded-pill px-4" onClick={() => setSearchTerm('')}>
              Clear Search
            </button>
          </div>
        )}
      </div> */}
    </div>
  );
}