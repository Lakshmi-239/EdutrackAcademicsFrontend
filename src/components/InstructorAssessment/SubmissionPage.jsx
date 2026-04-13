// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { ArrowLeft, User, Search, Award, MessageSquare, Fingerprint } from 'lucide-react';
// import { api } from '../../services/Api';

// const SubmissionsPage = () => {
//   const { id: assessmentId } = useParams();
//   const navigate = useNavigate();
//   const [submissions, setSubmissions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         setLoading(true);
//         const result = await api.getSubmissionsByAssessment(assessmentId);
        
//         // Handling the Axios response structure
//         if (result && result.data) {
//           setSubmissions(result.data);
//         } else if (Array.isArray(result)) {
//           setSubmissions(result);
//         }
//       } catch (err) {
//         console.error("Component load error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (assessmentId) loadData();
//   }, [assessmentId]);

//   // Search logic: filters by Name, Student ID, or Submission ID
//   const filtered = submissions.filter(s => 
//     s.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     s.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) || 
//     s.submissionId?.toString().includes(searchTerm)
//   );

//   return (
//     <div className="container py-4">
//       {/* Header Section */}
//       <div className="d-flex align-items-center justify-content-between mb-4 bg-white p-3 rounded-4 shadow-sm border">
//         <div className="d-flex align-items-center gap-3">
//           <button onClick={() => navigate(-1)} className="btn btn-light rounded-circle p-2 border shadow-sm">
//             <ArrowLeft size={20} />
//           </button>
//           <div>
//             <h4 className="fw-bold mb-0 text-dark">Assessment Results</h4>
//             <div className="d-flex gap-2 align-items-center mt-1">
//                 <span className="badge bg-primary-subtle text-primary border border-primary-subtle">ID: {assessmentId}</span>
//                 <span className="text-muted small fw-medium">{filtered.length} Submissions Found</span>
//             </div>
//           </div>
//         </div>

//         {/* Search Bar */}
//         <div className="input-group w-25 shadow-sm rounded-pill overflow-hidden border">
//           <span className="input-group-text bg-white border-0"><Search size={18} className="text-muted"/></span>
//           <input 
//             type="text" 
//             className="form-control border-0 ps-0 shadow-none" 
//             placeholder="Search by name or ID..." 
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Submissions Table */}
//       <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
//         <div className="table-responsive">
//           <table className="table table-hover align-middle mb-0">
//             <thead className="bg-dark text-white">
//               <tr>
//                 <th className="ps-4 py-3 fw-semibold" style={{ fontSize: '0.85rem' }}>SUBMISSION</th>
//                 <th className="py-3 fw-semibold" style={{ fontSize: '0.85rem' }}>STUDENT DETAILS</th>
//                 <th className="py-3 fw-semibold text-center" style={{ fontSize: '0.85rem' }}>SCORE</th>
//                 <th className="py-3 fw-semibold" style={{ fontSize: '0.85rem' }}>FEEDBACK</th>
//                 <th className="text-end pe-4 py-3 fw-semibold" style={{ fontSize: '0.85rem' }}>STATUS</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr><td colSpan="5" className="text-center py-5"><div className="spinner-border spinner-border-sm text-primary me-2"></div>Loading results...</td></tr>
//               ) : filtered.length > 0 ? (
//                 filtered.map((sub) => (
//                   <tr key={sub.submissionId}>
//                     {/* Submission ID */}
//                     <td className="ps-4">
//                         <div className="d-flex align-items-center gap-2">
//                             <Fingerprint size={16} className="text-primary opacity-75" />
//                             <span className="fw-bold text-dark">#{sub.submissionId}</span>
//                         </div>
//                     </td>

//                     {/* Student Name & ID */}
//                     <td>
//                       <div className="d-flex align-items-center gap-3">
//                         <div className="bg-light p-2 rounded-circle border">
//                             <User size={18} className="text-secondary" />
//                         </div>
//                         <div>
//                           <div className="fw-bold text-dark">{sub.studentName || "Unknown Student"}</div>
//                           <div className="text-muted small fw-medium">{sub.studentId}</div>
//                         </div>
//                       </div>
//                     </td>

//                     {/* Score */}
//                     <td className="text-center">
//                       <div className="d-inline-flex align-items-center gap-1 bg-primary-subtle text-primary px-3 py-1 rounded-pill fw-bold border border-primary-subtle">
//                         <Award size={14} />
//                         {sub.score ?? 0}
//                       </div>
//                     </td>

//                     {/* Feedback */}
//                     <td>
//                       <div className="d-flex align-items-start gap-2 text-muted small" style={{ maxWidth: '250px' }}>
//                         <MessageSquare size={14} className="mt-1 flex-shrink-0" />
//                         <span className="text-truncate-2">
//                             {sub.feedback || <span className="fst-italic opacity-50">No feedback given</span>}
//                         </span>
//                       </div>
//                     </td>

//                     {/* Status */}
//                     <td className="pe-4 text-end">
//                       <span className={`badge rounded-pill px-3 py-2 border ${
//                         sub.score !== null 
//                           ? 'bg-success-subtle text-success border-success-subtle' 
//                           : 'bg-warning-subtle text-warning border-warning-subtle'
//                       }`}>
//                         {sub.score !== null ? '● Graded' : '○ Pending'}
//                       </span>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="5" className="text-center py-5">
//                     <div className="text-muted">No submissions matching "{searchTerm}"</div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
      
//       <style>{`
//         .text-truncate-2 {
//             display: -webkit-box;
//             -webkit-line-clamp: 2;
//             -webkit-box-orient: vertical;
//             overflow: hidden;
//         }
//         .table-hover tbody tr:hover {
//             background-color: #f8fafc;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default SubmissionsPage;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Added 'Filter' to the imports to fix your error
import { 
  ArrowLeft, User, Search, Clock, 
  CheckCircle, Filter, Hash 
} from 'lucide-react';
import { api } from '../../services/Api';

const SubmissionsPage = () => {
  const { id: assessmentId } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await api.getSubmissionsByAssessment(assessmentId);
        if (response && response.data) {
          setSubmissions(response.data);
        }
      } catch (err) {
        console.error("Load error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (assessmentId) loadData();
  }, [assessmentId]);

  // Comprehensive Search Logic
  const filtered = submissions.filter(s => {
    const term = searchTerm.toLowerCase();
    // Format date to string so we can search it (e.g., "12 Apr")
    const dateStr = new Date(s.submissionDateTime).toLocaleString('en-GB', {
      day: '2-digit', month: 'short'
    }).toLowerCase();

    return (
      s.studentName?.toLowerCase().includes(term) ||
      s.studentId?.toLowerCase().includes(term) ||
      s.submissionId?.toLowerCase().includes(term) ||
      s.feedback?.toLowerCase().includes(term) ||
      dateStr.includes(term)
    );
  });

  return (
    <div className="container py-4">
      {/* Header Section */}
      <div className="d-flex align-items-center justify-content-between mb-4 bg-white p-3 rounded-4 shadow-sm border">
        <div className="d-flex align-items-center gap-3">
          <button onClick={() => navigate(-1)} className="btn btn-light rounded-circle p-2 border shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h4 className="fw-bold mb-0 text-dark">Assessment Results</h4>
            <div className="mt-1">
               <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                 ID: {assessmentId}
               </span>
            </div>
          </div>
        </div>

        {/* Search Bar with Results Pill */}
        <div className="d-flex align-items-center gap-2 w-50">
          <div className="input-group shadow-sm rounded-pill overflow-hidden border flex-nowrap bg-white">
            <span className="input-group-text bg-white border-0">
              <Search size={18} className="text-muted"/>
            </span>
            <input 
              type="text" 
              className="form-control border-0 ps-0 shadow-none" 
              placeholder="Search name, ID, feedback or date..." 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* The "Found" Pill beside the search input */}
            <div className="d-flex align-items-center pe-2">
              <span className="badge rounded-pill bg-light text-dark border fw-bold px-3 py-2">
                {filtered.length} Found
              </span>
            </div>
            <button className="btn bg-white border-0 text-muted pe-3">
              <Filter size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="ps-4 py-3 border-0 text-muted small fw-bold" style={{ width: '10%' }}>STUDENT</th>
                <th className="py-3 border-0 text-muted small fw-bold text-center" style={{ width: '15%' }}>SUBMISSION ID</th>
                <th className="py-3 border-0 text-muted small fw-bold text-center" style={{ width: '14%' }}>SCORE / %</th>
                <th className="py-3 border-0 text-muted small fw-bold text-center" style={{ width: '1%' }}>FEEDBACK</th>
                <th className="py-3 border-0 text-muted small fw-bold text-center" style={{ width: '8%' }}>DATE & TIME</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center py-5">Loading records...</td></tr>
              ) : filtered.length > 0 ? (
                filtered.map((sub) => (
                  <tr key={sub.submissionId}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center gap-3">
                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px', flexShrink: 0 }}>
                          <User size={18} />
                        </div>
                        <div>
                          <div className="fw-bold text-dark mb-0">{sub.studentName}</div>
                          <div className="text-muted small">{sub.studentId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center">
                      <span className="badge bg-light text-primary border border-primary-subtle px-3 py-2 fw-bold">
                        {sub.submissionId}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="fw-bold text-dark mb-0 fs-5">{sub.score}</div>
                      <div className="text-muted small">({sub.percentage}%)</div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <CheckCircle size={18} className="text-success" />
                        <span className="fw-bold text-dark">{sub.feedback}</span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2 text-muted fw-medium">
                        <Clock size={16} />
                        <span>
                          {new Date(sub.submissionDateTime).toLocaleString('en-GB', {
                            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false
                          })}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    No results found for "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubmissionsPage;