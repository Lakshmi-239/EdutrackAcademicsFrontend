// import React, { useState, useEffect } from 'react';
// import { api } from '../services/Api';
// import AttendanceCard from '../components/InstructorAttendance/AttendanceCard';
// import MarkAttendanceModal from '../components/InstructorAttendance/MarkAttendanceModal';
// import { Search, Filter, Plus, RefreshCcw, UserCheck } from 'lucide-react';

// export default function InstructorAttendancePage() {
//   const [attendanceRecords, setAttendanceRecords] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('All');
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       setSearchTerm('');
//       setStatusFilter('All');

//       // Fetching from your backend GetAllAttendanceAsync endpoint
//       const res = await api.getAttendanceHistory();
//       const data = Array.isArray(res.data) ? res.data : [];
      
//       setAttendanceRecords(data);
//       setFilteredData(data);
//     } catch (error) {
//       console.error("Fetch error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchData(); }, []);

//   useEffect(() => {
//     const results = attendanceRecords.filter(item => {
//       const searchLower = searchTerm.toLowerCase();
//       const formattedDate = new Date(item.sessionDate).toLocaleDateString();

//       const searchableText = [
//         item.attendanceID,
//         item.studentName,
//         item.enrollmentID,
//         item.courseName,
//         item.batchId,
//         formattedDate
//       ].filter(Boolean).join(' ').toLowerCase();

//       const matchesSearch = searchableText.includes(searchLower);
//       const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      
//       return matchesSearch && matchesStatus;
//     });
//     setFilteredData(results);
//   }, [searchTerm, statusFilter, attendanceRecords]);

//   if (loading) return (
//     <div className="d-flex justify-content-center align-items-center vh-100">
//       <div className="spinner-grow text-primary" role="status"></div>
//     </div>
//   );

//   return (
//     <div className="container py-4 min-vh-100">
//       {/* GLOSSY HEADER */}
//       <div className="d-flex justify-content-between align-items-center mb-4 p-4 rounded-4 bg-white shadow-sm border-start border-4 border-success">
//         <div>
//           <h2 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
//             <UserCheck className="text-success" size={28} /> 
//             Attendance Logs
//           </h2>
//           <p className="text-muted small mb-0">Track and manage student daily presence</p>
//         </div>
        
//         <button 
//           onClick={() => setIsModalOpen(true)}
//           className="btn d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-sm text-white border-0 transition-all hover-scale"
//           style={{ 
//             background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', // Success gradient
//             minWidth: '180px',
//             fontWeight: '600',
//             color: '#1a5c37'
//           }}
//         >
//           <Plus size={20} strokeWidth={3} />
//           <span>Mark Attendance</span>
//         </button>
//       </div>

//       {/* COMPACT FILTER BAR */}
//       <div className="row g-0 mb-4 align-items-center bg-white rounded-pill shadow-sm border mx-0 px-3" style={{ height: '50px' }}>
//         <div className="col-md-6 h-100">
//           <div className="d-flex align-items-center h-100">
//             <Search size={18} className="text-muted me-2" />
//             <input 
//               type="text" 
//               className="form-control border-0 shadow-none bg-transparent" 
//               placeholder="Search Student, ID, Batch or Date..." 
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               style={{ fontSize: '0.95rem' }}
//             />
//           </div>
//         </div>
        
//         <div className="col-md-6 d-flex justify-content-end align-items-center gap-2 h-100">
//           <Filter size={14} className="text-muted" />
//           <select 
//             className="form-select form-select-sm border-0 bg-light rounded-pill fw-bold shadow-none" 
//             style={{ width: '130px', cursor: 'pointer' }} 
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//           >
//             <option value="All">All Status</option>
//             <option value="Present">Present</option>
//             <option value="Absent">Absent</option>
//           </select>
          
//           <button 
//             className="btn btn-light btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center" 
//             onClick={fetchData}
//             title="Refresh"
//           >
//             <RefreshCcw size={14} className="text-success" />
//           </button>
//           <span className="badge bg-success-subtle text-success rounded-pill px-2 ms-2" style={{ fontSize: '0.75rem' }}>
//             {filteredData.length} Records
//           </span>
//         </div>
//       </div>

//       {/* GRID SECTION */}
//       <div className="row g-4">
//         {filteredData.length > 0 ? (
//           filteredData.map((item) => (
//             <div className="col-12 col-md-6 col-lg-4" key={item.attendanceID}>
//               <AttendanceCard attendance={item} onRefresh={fetchData} />
//             </div>
//           ))
//         ) : (
//           <div className="text-center py-5">
//             <div className="display-1 text-light">Empty</div>
//             <p className="text-muted">No attendance records found.</p>
//           </div>
//         )}
//       </div>

//       {/* Modal for adding new attendance */}
//       <MarkAttendanceModal 
//         isOpen={isModalOpen} 
//         onClose={() => setIsModalOpen(false)} 
//         onRefresh={fetchData} 
//       />
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { api } from '../services/Api'; // Using 'api' object
import AttendanceCard from '../components/InstructorAttendance/AttendanceCard';
import MarkAttendanceModal from '../components/InstructorAttendance/MarkAttendanceModal';
import { Search, Filter, Plus, RefreshCcw, UserCheck } from 'lucide-react';

export default function InstructorAttendancePage() {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 1. Call your [HttpGet("attendance")] via the api object
      const res = await api.getAttendanceHistory();
      
      // 2. Your backend returns a list of objects 
      // with AttendanceID, StudentName, CourseName, etc.
      const data = Array.isArray(res.data) ? res.data : [];
      
      setAttendanceRecords(data);
      setFilteredData(data);
    } catch (error) {
      console.error("Error fetching attendance history:", error);
      setAttendanceRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchData(); 
  }, []);

  // Search and Filter Logic
  useEffect(() => {
    const results = attendanceRecords.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      // Ensure we check all visible fields for the search
      const searchableText = [
        item.attendanceID,
        item.studentName,
        item.courseName,
        item.batchId,
        item.enrollmentID
      ].filter(Boolean).join(' ').toLowerCase();

      const matchesSearch = searchableText.includes(searchLower);
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    setFilteredData(results);
  }, [searchTerm, statusFilter, attendanceRecords]);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-success" role="status"></div>
    </div>
  );

  return (
    <div className="container py-4 min-vh-100">
      {/* HEADER SECTION */}
      <div className="d-flex justify-content-between align-items-center mb-4 p-4 rounded-4 bg-white shadow-sm border-start border-4 border-success">
        <div>
          <h2 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
            <UserCheck className="text-success" size={28} /> 
            Attendance Records
          </h2>
          <p className="text-muted small mb-0">View and manage history of student presence</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-sm text-white border-0 transition-all hover-scale"
          style={{ 
            background: 'linear-gradient(135deg, #28a745 0%, #85e085 100%)',
            fontWeight: '600'
          }}
        >
          <Plus size={20} />
          <span>Mark New Attendance</span>
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="row g-0 mb-4 align-items-center bg-white rounded-pill shadow-sm border mx-0 px-3" style={{ height: '50px' }}>
        <div className="col-md-6 d-flex align-items-center">
          <Search size={18} className="text-muted me-2" />
          <input 
            type="text" 
            className="form-control border-0 shadow-none bg-transparent" 
            placeholder="Search by student, ID, or batch..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-6 d-flex justify-content-end align-items-center gap-2">
          <Filter size={14} className="text-muted" />
          <select 
            className="form-select form-select-sm border-0 bg-light rounded-pill fw-bold" 
            style={{ width: '130px' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
          <button className="btn btn-light btn-sm rounded-circle" onClick={fetchData}>
            <RefreshCcw size={14} className="text-success" />
          </button>
        </div>
      </div>

      {/* CARDS GRID */}
      <div className="row g-4">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <div className="col-12 col-md-6 col-lg-4" key={item.attendanceID}>
              <AttendanceCard attendance={item} onRefresh={fetchData} />
            </div>
          ))
        ) : (
          <div className="text-center py-5 w-100">
            <h3 className="text-light">No History Found</h3>
            <p className="text-muted">Start by marking attendance for a batch.</p>
          </div>
        )}
      </div>

      <MarkAttendanceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={fetchData} 
      />
    </div>
  );
}