import React, { useState, useEffect } from 'react';
import { api } from '../services/Api';
import ModuleCard from '../components/InstructorModule/ModuleCard';
import { Search, Plus, RefreshCcw, Layers } from 'lucide-react';

export default function InstructorModulePage() {
  const [modules, setModules] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Example Course ID - normally you'd get this from a dropdown or URL params
  const currentCourseId = "C001"; 

  const fetchData = async () => {
    try {
      setLoading(true);
      setSearchTerm('');
      const data = await api.getModulesByCourse(currentCourseId);
      // Ensure data is array and map consistent casing
      const rawData = Array.isArray(data.data) ? data.data : [];
      setModules(rawData);
      setFilteredData(rawData);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Filter Logic
  useEffect(() => {
    const results = modules.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      const searchableText = [item.ModuleID, item.Name, item.CourseId]
        .filter(Boolean).join(' ').toLowerCase();
      return searchableText.includes(searchLower);
    });
    setFilteredData(results);
  }, [searchTerm, modules]);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-grow text-primary" role="status"></div>
    </div>
  );

  return (
    <div className="container py-4 min-vh-100">
      {/* HEADER PART */}
      <div className="d-flex justify-content-between align-items-center mb-4 p-4 rounded-4 bg-white shadow-sm border-start border-4 border-primary">
        <div>
          <h2 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
            <Layers className="text-primary" size={28} /> 
            Course Modules
          </h2>
          <p className="text-muted small mb-0">Organize and sequence your course content</p>
        </div>
        
        <button 
          className="btn d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-sm text-white border-0 transition-all hover-scale"
          style={{ background: 'linear-gradient(135deg, #a7a7deff 0%, #312ab1ff 100%)', fontWeight: '600' }}
        >
          <Plus size={20} color="white" strokeWidth={3} />
          <span>Add Module</span>
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="row g-0 mb-4 align-items-center bg-white rounded-pill shadow-sm border mx-0 px-3" style={{ height: '50px' }}>
        <div className="col-md-8 h-100">
          <div className="d-flex align-items-center h-100">
            <Search size={18} className="text-muted me-2" />
            <input 
              type="text" 
              className="form-control border-0 shadow-none bg-transparent" 
              placeholder="Search by Module Name, ID or Course..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="col-md-4 d-flex justify-content-end align-items-center gap-2 h-100">
          <button className="btn btn-light btn-sm rounded-circle p-2" onClick={fetchData}>
            <RefreshCcw size={14} className="text-primary" />
          </button>
          <span className="badge bg-primary-subtle text-primary rounded-pill px-2 ms-2">
            {filteredData.length} Modules Found
          </span>
        </div>
      </div>

      {/* GRID */}
      <div className="row g-4">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <div className="col-12 col-md-6 col-lg-4" key={item.ModuleID}>
              <ModuleCard module={item} onRefresh={fetchData} />
            </div>
          ))
        ) : (
          <div className="text-center py-5">
            <div className="display-1 text-light">No Modules</div>
            <p className="text-muted">Start by creating your first course module.</p>
          </div>
        )}
      </div>
    </div>
  );
}