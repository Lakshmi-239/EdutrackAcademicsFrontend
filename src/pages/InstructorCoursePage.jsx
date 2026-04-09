// import React, { useState, useEffect } from 'react';
// import { api } from '../services/Api';
// // Import your Auth hook - adjust this path to where your AuthContext lives
// // import { useAuth } from '../context/AuthContext'; 

// const InstructorCoursePage = () => {
//   // Option A: Get ID from context if available
//   // const { user } = useAuth();
//   // const instructorId = user?.id || localStorage.getItem("userId");
  
//   // Option B: Hardcoded for testing - Replace with your actual ID logic
//   const instructorId = localStorage.getItem("userId") || "I001"; 

//   const [myBatches, setMyBatches] = useState([]);
//   const [selectedBatch, setSelectedBatch] = useState(null);
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchAssignedWork = async () => {
//       if (!instructorId) {
//         setError("No Instructor ID detected. Please log in again.");
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         const response = await api.getInstructorBatches(instructorId);
        
//         // .NET often wraps data in a 'data' property via Axios
//         const batchData = response.data?.data || response.data || [];
//         setMyBatches(Array.isArray(batchData) ? batchData : []);
//       } catch (err) {
//         console.error("Failed to load batches:", err);
//         setError("Connection to EduTrack failed.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAssignedWork();
//   }, [instructorId]);

//   const handleBatchClick = async (batch) => {
//     setSelectedBatch(batch);
//     setStudents([]); // Clear list for loading state
//     try {
//       const response = await api.getStudentsInBatch(batch.batchId || batch.BatchId);
//       const studentData = response.data?.data || response.data || [];
//       setStudents(studentData);
//     } catch (err) {
//       console.error("Error loading students:", err);
//     }
//   };

//   if (loading) return (
//     <div className="flex items-center justify-center h-screen bg-gray-50">
//       <div className="flex flex-col items-center">
//         <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
//         <p className="text-indigo-600 font-semibold">Syncing Workload...</p>
//       </div>
//     </div>
//   );

//   return (
//     <div className="flex h-screen bg-gray-100 font-sans">
//       {/* Sidebar: Assigned Batches */}
//       <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
//         <div className="p-6 border-b border-gray-100">
//           <h2 className="text-xl font-bold text-gray-800">My Courses</h2>
//           <p className="text-xs text-gray-500 mt-1 uppercase tracking-tighter">ID: {instructorId}</p>
//         </div>
        
//         <nav className="p-4 space-y-3">
//           {myBatches.length > 0 ? myBatches.map((batch) => (
//             <div 
//               key={batch.batchId || batch.BatchId}
//               onClick={() => handleBatchClick(batch)}
//               className={`p-4 rounded-xl cursor-pointer transition-all border ${
//                 selectedBatch?.batchId === batch.batchId || selectedBatch?.BatchId === batch.BatchId
//                 ? 'bg-indigo-600 text-white shadow-lg border-indigo-600 scale-[1.02]' 
//                 : 'bg-white text-gray-700 hover:bg-indigo-50 border-gray-200 shadow-sm'
//               }`}
//             >
//               <div className="flex justify-between items-start mb-2">
//                 <span className="text-[10px] font-bold opacity-80 uppercase">
//                   {batch.batchId || batch.BatchId}
//                 </span>
//                 {batch.isActive || batch.IsActive ? (
//                   <span className="bg-green-400 w-2 h-2 rounded-full shadow-[0_0_5px_#4ade80]"></span>
//                 ) : (
//                   <span className="text-[9px] bg-yellow-100 text-yellow-700 px-1.5 rounded font-bold">FILLING</span>
//                 )}
//               </div>
//               <h3 className="font-bold leading-tight text-sm">
//                 {batch.courseName || batch.CourseName}
//               </h3>
//               <div className="mt-3 text-[11px] flex justify-between opacity-90">
//                 <span>{batch.currentStudents || batch.CurrentStudents} Students</span>
//                 <span>Max: {batch.maxStudents || batch.MaxStudents}</span>
//               </div>
//             </div>
//           )) : (
//             <div className="text-center py-20">
//                <p className="text-sm text-gray-400 italic">No batches found.</p>
//                {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
//             </div>
//           )}
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-8 overflow-y-auto">
//         {selectedBatch ? (
//           <div className="space-y-6">
//             <header className="flex justify-between items-end bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
//               <div>
//                 <h1 className="text-3xl font-extrabold text-gray-900">
//                     {selectedBatch.courseName || selectedBatch.CourseName}
//                 </h1>
//                 <p className="text-gray-500">Student Roster for Batch {selectedBatch.batchId || selectedBatch.BatchId}</p>
//               </div>
//               <div className="flex gap-3">
//                 <button className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-bold hover:bg-indigo-100 transition">
//                   Export
//                 </button>
//                 <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-md transition">
//                   Mark Attendance
//                 </button>
//               </div>
//             </header>

//             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//               <table className="w-full text-left">
//                 <thead className="bg-gray-50 border-b border-gray-200">
//                   <tr>
//                     <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Student Name</th>
//                     <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">ID</th>
//                     <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Email Address</th>
//                     <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {students.map((student) => (
//                     <tr key={student.studentId || student.StudentId} className="hover:bg-gray-50 transition">
//                       <td className="px-6 py-4 font-bold text-gray-700">
//                         {student.studentName || student.StudentName}
//                       </td>
//                       <td className="px-6 py-4 text-sm font-mono text-gray-500">
//                         {student.studentId || student.StudentId}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-600">
//                         {student.studentEmail || student.StudentEmail}
//                       </td>
//                       <td className="px-6 py-4 text-sm">
//                         <button className="text-indigo-600 font-bold hover:underline">Profile</button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               {students.length === 0 && (
//                 <div className="p-20 text-center text-gray-400">Select a batch to see enrolled students.</div>
//               )}
//             </div>
//           </div>
//         ) : (
//           <div className="h-full flex flex-col items-center justify-center text-gray-300">
//              <svg className="w-16 h-16 mb-4 opacity-20" fill="currentColor" viewBox="0 0 20 20">
//                 <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.435.292-3.483.804A7.969 7.969 0 015.5 11c1.255 0 2.435-.292 3.483-.804V4.804zM11 4.804A7.968 7.968 0 0114.5 4c1.255 0 2.435.292 3.483.804A7.969 7.969 0 0014.5 11c-1.255 0-2.435-.292-3.483-.804V4.804z" />
//              </svg>
//              <p className="text-xl font-medium">Please select a batch from the sidebar</p>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default InstructorCoursePage;



// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { api } from '../services/Api';
// import { 
//   Search, 
//   Filter, 
//   RefreshCcw, 
//   BookOpen, 
//   Users, 
//   Edit3, 
//   GraduationCap 
// } from 'lucide-react';

// export default function InstructorCoursePage() {
//   const navigate = useNavigate();
//   const instructorId = localStorage.getItem("userId") || "I001";

//   const [batches, setBatches] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('All');
//   const [loading, setLoading] = useState(true);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       setSearchTerm('');
//       setStatusFilter('All');

//       const response = await api.getInstructorBatches(instructorId);
//       const rawData = response.data?.data || response.data || [];
      
//       const enhancedData = rawData.map(item => ({
//         ...item,
//         // Ensure consistent naming for search
//         displayId: String(item.batchId || item.BatchId || 'N/A'),
//         displayName: item.courseName || item.CourseName || 'Unknown Course',
//         displayStatus: (item.isActive || item.IsActive) ? 'Active' : 'Closed'
//       }));

//       setBatches(enhancedData);
//       setFilteredData(enhancedData);
//     } catch (error) {
//       console.error("Fetch error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchData(); }, []);

//   useEffect(() => {
//     const results = batches.filter(item => {
//       const searchLower = searchTerm.toLowerCase();
//       const searchableText = `${item.displayId} ${item.displayName} ${item.displayStatus}`.toLowerCase();
      
//       const matchesSearch = searchableText.includes(searchLower);
//       const matchesStatus = statusFilter === 'All' || item.displayStatus === statusFilter;
      
//       return matchesSearch && matchesStatus;
//     });
//     setFilteredData(results);
//   }, [searchTerm, statusFilter, batches]);

//   if (loading) return (
//     <div className="d-flex justify-content-center align-items-center vh-100">
//       <div className="spinner-grow text-primary" role="status"></div>
//     </div>
//   );

//   return (
//     <div className="container py-4 min-vh-100">
      
//       {/* GLOSSY HEADER - MATCHES IMAGE 1 STYLE */}
//       <div className="d-flex justify-content-between align-items-center mb-4 p-4 rounded-4 bg-white shadow-sm border-start border-4 border-primary">
//         <div>
//           <h2 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
//             <GraduationCap className="text-primary" size={28} /> 
//             My Courses
//           </h2>
//           <p className="text-muted small mb-0">Monitor and manage your active teaching batches</p>
//         </div>
        
//         {/* INSTRUCTOR ID DISPLAY ON THE RIGHT SIDE */}
//         <div className="d-flex align-items-center gap-2 px-3 py-2 bg-primary-subtle rounded-pill border border-primary-subtle">
//           <UserCheck size={18} className="text-primary" />
//           <span className="fw-bold text-primary small">Instructor: {instructorId || "Not Logged In"}</span>
//         </div>
//       </div>

//       {/* PILL-SHAPED SEARCH BAR */}
//       <div className="row g-0 mb-4 align-items-center bg-white rounded-pill shadow-sm border mx-0 px-3" style={{ height: '50px' }}>
//         <div className="col-md-6 h-100">
//           <div className="d-flex align-items-center h-100">
//             <Search size={18} className="text-muted me-2" />
//             <input 
//               type="text" 
//               className="form-control border-0 shadow-none bg-transparent" 
//               placeholder="Search by Course Name, Batch ID, or Status..." 
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
//             <option value="Active">Active</option>
//             <option value="Closed">Closed</option>
//           </select>
          
//           <button 
//             className="btn btn-light btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center" 
//             onClick={fetchData}
//           >
//             <RefreshCcw size={14} className="text-primary" />
//           </button>
//           <span className="badge bg-primary-subtle text-primary rounded-pill px-2 ms-2" style={{ fontSize: '0.75rem' }}>
//             {filteredData.length} Found
//           </span>
//         </div>
//       </div>

//       {/* GRID SECTION - CARDS BASED ON IMAGE 2, 3, 4 */}
//       <div className="row g-4">
//         {filteredData.length > 0 ? (
//           filteredData.map((course) => (
//             <div className="col-12 col-md-6 col-lg-4" key={course.displayId}>
//               <div className="card h-100 border-0 shadow-sm rounded-4 transition-all hover-shadow overflow-hidden">
//                 <div className="card-body p-4">
//                   {/* Status & Edit Icon */}
//                   <div className="d-flex justify-content-between align-items-start mb-3">
//                     <span className={`badge rounded-pill ${course.displayStatus === 'Active' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
//                       {course.displayStatus}
//                     </span>
//                     <button className="btn btn-link p-0 text-muted">
//                       <Edit3 size={18} />
//                     </button>
//                   </div>

//                   {/* Course Info */}
//                   <h5 className="fw-bold text-dark mb-1">{course.displayName}</h5>
//                   <p className="text-primary small fw-semibold font-monospace mb-3">{course.displayId}</p>
                  
//                   <p className="text-muted small mb-4 line-clamp-2">
//                     {course.description || "Comprehensive course coverage including assessments and modules management."}
//                   </p>

//                   {/* Links: Students & Modules */}
//                   <div className="d-flex gap-4 pt-3 border-top">
//                     <div 
//                       className="d-flex align-items-center gap-2 cursor-pointer hover-indigo"
//                       onClick={() => navigate(`/Ibatches?batchId=${course.displayId}`)}
//                       style={{ cursor: 'pointer' }}
//                     >
//                       <div className="p-2 bg-light rounded-3">
//                         <Users size={16} className="text-primary" />
//                       </div>
//                       <div>
//                         <div className="fw-bold small">{course.currentStudents || 0}</div>
//                         <div className="text-muted" style={{ fontSize: '0.7rem' }}>Students</div>
//                       </div>
//                     </div>

//                     <div 
//                       className="d-flex align-items-center gap-2 cursor-pointer hover-indigo"
//                       onClick={() => navigate(`/Imodules?courseId=${course.courseId || course.CourseId}`)}
//                       style={{ cursor: 'pointer' }}
//                     >
//                       <div className="p-2 bg-light rounded-3">
//                         <BookOpen size={16} className="text-primary" />
//                       </div>
//                       <div>
//                         <div className="fw-bold small">{course.moduleCount || 8}</div>
//                         <div className="text-muted" style={{ fontSize: '0.7rem' }}>Modules</div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="text-center py-5">
//             <div className="display-4 text-light">No Courses Found</div>
//             <p className="text-muted">Try adjusting your filters or search terms.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { api } from '../services/Api';
import CourseCard from '../components/InstructorCourse/CourseCard'; // Adjust path if needed
import { Search, Filter, RefreshCcw, GraduationCap, UserCheck } from 'lucide-react';

export default function InstructorCoursePage() {
  const [batches, setBatches] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  
  const instructorId = localStorage.getItem("userId") || "I001";

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.getInstructorBatches(instructorId);
      const rawData = response.data?.data || response.data || [];
      setBatches(rawData);
      setFilteredData(rawData);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    const results = batches.filter(item => {
      const name = (item.courseName || item.CourseName || "").toLowerCase();
      const id = (item.batchId || item.BatchId || "").toLowerCase();
      const status = (item.isActive || item.IsActive) ? 'Active' : 'Closed';
      
      const matchesSearch = name.includes(searchTerm.toLowerCase()) || id.includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    setFilteredData(results);
  }, [searchTerm, statusFilter, batches]);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-grow text-primary" role="status"></div>
    </div>
  );

  return (
    <div className="container py-4 min-vh-100">
      {/* GLOSSY HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4 p-4 rounded-4 bg-white shadow-sm border-start border-4 border-primary">
        <div>
          <h2 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2">
            <GraduationCap className="text-primary" size={28} /> My Courses
          </h2>
          <p className="text-muted small mb-0">Monitor and manage your active teaching batches</p>
        </div>
        <div className="d-flex align-items-center gap-2 px-3 py-2 bg-primary-subtle rounded-pill border border-primary-subtle">
          <UserCheck size={18} className="text-primary" />
          <span className="fw-bold text-primary small">Instructor: {instructorId}</span>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="row g-0 mb-4 align-items-center bg-white rounded-pill shadow-sm border mx-0 px-3" style={{ height: '50px' }}>
        <div className="col-md-6 d-flex align-items-center h-100">
          <Search size={18} className="text-muted me-2" />
          <input 
            type="text" 
            className="form-control border-0 shadow-none bg-transparent" 
            placeholder="Search by name or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-6 d-flex justify-content-end align-items-center gap-2 h-100">
          <Filter size={14} className="text-muted" />
          <select 
            className="form-select form-select-sm border-0 bg-light rounded-pill fw-bold shadow-none" 
            style={{ width: '130px' }} 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Closed">Closed</option>
          </select>
          <button className="btn btn-light btn-sm rounded-circle p-2" onClick={fetchData}>
            <RefreshCcw size={14} className="text-primary" />
          </button>
        </div>
      </div>

      {/* GRID CONNECTED TO COURSECARD */}
      <div className="row g-4">
        {filteredData.map((course, index) => (
          <div className="col-12 col-md-6 col-lg-4" key={index}>
            <CourseCard course={course} onRefresh={fetchData} />
          </div>
        ))}
      </div>
    </div>
  );
}