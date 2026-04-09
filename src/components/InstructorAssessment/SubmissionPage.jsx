// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { api } from '../../services/Api';
// import { ArrowLeft, CheckCircle, Clock, User, Download } from 'lucide-react';

// export default function SubmissionsPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [submissions, setSubmissions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchSubmissions = async () => {
//       try {
//         // Assuming you have an API endpoint for this
//         const data = await api.getSubmissionsByAssessment(id);
//         setSubmissions(data);
//       } catch (error) {
//         console.error("Error loading submissions", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSubmissions();
//   }, [id]);

//   return (
//     <div className="container py-5">
//       {/* Header */}
//       <div className="d-flex align-items-center gap-3 mb-4">
//         <button onClick={() => navigate(-1)} className="btn btn-light rounded-circle p-2">
//           <ArrowLeft size={20} />
//         </button>
//         <div>
//           <h2 className="fw-bold mb-0">Student Submissions</h2>
//           <p className="text-muted small">Assessment ID: {id}</p>
//         </div>
//       </div>

//       <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
//         <div className="table-responsive">
//           <table className="table table-hover align-middle mb-0">
//             <thead className="bg-light">
//               <tr>
//                 <th className="px-4 py-3 border-0">Student Details</th>
//                 <th className="py-3 border-0">Submission Timestamp</th>
//                 <th className="py-3 border-0">Grading Status</th>
//                 <th className="py-3 border-0 text-end px-4">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {submissions.map((sub) => (
//                 <tr key={sub.id}>
//                   <td className="px-4">
//                     <div className="d-flex align-items-center gap-2">
//                       <div className="bg-primary-subtle p-2 rounded-circle text-primary">
//                         <User size={16} />
//                       </div>
//                       <div>
//                         <div className="fw-bold">{sub.studentName}</div>
//                         <div className="text-muted small">{sub.studentEmail}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td>
//                     <div className="d-flex align-items-center gap-1 text-muted">
//                       <Clock size={14} />
//                       {new Date(sub.submittedAt).toLocaleString()}
//                     </div>
//                   </td>
//                   <td>
//                     <span className={`badge rounded-pill ${
//                       sub.isGraded ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'
//                     }`}>
//                       {sub.isGraded ? 'Graded' : 'Pending'}
//                     </span>
//                   </td>
//                   <td className="text-end px-4">
//                     <button className="btn btn-sm btn-outline-dark rounded-pill px-3">
//                       View Work
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
        
//         {submissions.length === 0 && !loading && (
//           <div className="text-center py-5">
//             <p className="text-muted">No submissions found yet.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Clock, Search, FileText, Download, Award } from 'lucide-react';
import { api } from '../../services/Api';

const SubmissionsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await api.getSubmissionsByAssessment(id);
        
        // Backend returns: { status: 200, data: [...] }
        // We set state to result.data because 'result' is already the Axios response.data
        if (result && result.data) {
          setSubmissions(result.data);
        }
      } catch (err) {
        console.error("Component load error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) loadData();
  }, [id]);

  const filtered = submissions.filter(s => 
    s.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.submissionId?.toString().includes(searchTerm)
  );

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <button onClick={() => navigate(-1)} className="btn btn-outline-dark rounded-circle p-2">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="fw-bold mb-0">Submissions</h2>
            <span className="badge bg-light text-dark border">Assessment: {id}</span>
          </div>
        </div>
        <div className="input-group w-25">
          <span className="input-group-text bg-white border-end-0"><Search size={18}/></span>
          <input 
            type="text" 
            className="form-control border-start-0 ps-0" 
            placeholder="Search students..." 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-4">Submission ID</th>
                <th>Student ID</th>
                <th>Score</th>
                <th>Feedback</th>
                <th className="text-end pe-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center py-5">Loading...</td></tr>
              ) : filtered.length > 0 ? (
                filtered.map((sub) => (
                  <tr key={sub.submissionId}>
                    <td className="ps-4 fw-bold">#{sub.submissionId}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <User size={16} className="text-muted" />
                        {sub.studentId}
                      </div>
                    </td>
                    <td>
                      <span className="fw-bold text-primary">{sub.score ?? 0}</span>
                    </td>
                    <td className="text-muted small text-truncate" style={{maxWidth: '200px'}}>
                      {sub.feedback || "No feedback provided"}
                    </td>
                    <td className="pe-4 text-end">
                      <span className={`badge rounded-pill ${sub.score !== null ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {sub.score !== null ? 'Graded' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="text-center py-5 text-muted">No submissions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubmissionsPage;