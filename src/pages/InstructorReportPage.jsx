


// import React, { useState, useEffect } from "react";
// import { api } from "../services/Api"; 
// import { Phone, Mail, ChevronLeft, Download, SearchX } from "lucide-react";
// import toast from "react-hot-toast";
// import jsPDF from "jspdf"; 
// import autoTable from "jspdf-autotable";

// const InstructorReportPage = () => {
//   const [instructorId, setInstructorId] = useState("");
//   const [searchId, setSearchId] = useState("");
//   const [batches, setBatches] = useState([]);
//   const [filteredBatches, setFilteredBatches] = useState([]);
//   const [batchSearchQuery, setBatchSearchQuery] = useState(""); 
  
//   const [instructorProfile, setInstructorProfile] = useState({
//     name: "N/A", email: "N/A", phone: "N/A", id: "N/A"
//   });

//   const [stats, setStats] = useState({ totalBatches: 0, totalStudents: 0, totalClasses: 0, ongoing: 0 });
//   const [loading, setLoading] = useState(false);
//   const [selectedBatch, setSelectedBatch] = useState(null);
//   const [studentSearch, setStudentSearch] = useState("");
//   const [studentAssessmentData, setStudentAssessmentData] = useState({});

//   const colors = {
//     background: "#020617",
//     cardBg: "#0f172a",
//     accent: "#3b82f6",
//     textMain: "#f8fafc",
//     textDim: "#94a3b8",
//     border: "#1e293b"
//   };

//   const animations = `
//     @keyframes fadeIn {
//       from { opacity: 0; transform: translateY(10px); }
//       to { opacity: 1; transform: translateY(0); }
//     }
//     @keyframes barFill {
//       from { width: 0%; }
//     }
//     @keyframes pulseGlow {
//       0% { box-shadow: 0 0 0 0px rgba(59, 130, 246, 0.4); }
//       70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
//       100% { box-shadow: 0 0 0 0px rgba(59, 130, 246, 0); }
//     }
//     .animate-page { animation: fadeIn 0.6s ease-out forwards; }
//     .animate-bar { animation: barFill 1.2s cubic-bezier(0.1, 1, 0.1, 1) forwards; }
//     .pulse-btn { animation: pulseGlow 2s infinite; }
//     .hover-card { transition: all 0.3s ease !important; }
//     .hover-card:hover { transform: translateY(-5px); border-color: ${colors.accent} !important; box-shadow: 0 10px 30px -15px rgba(59, 130, 246, 0.3); }
//     .table-row { transition: background-color 0.2s ease; cursor: pointer; }
//     .table-row:hover { background-color: #1e293b !important; }
//   `;

//   const loadInstructorData = async (id) => {
//     if (!id) return;
//     setLoading(true);
//     try {
//       const results = await Promise.allSettled([
//         api.getInstructorBatches(id),
//         api.getBatchCompletionRate(id),
//         api.getClassCounts(id)
//       ]);

//       const batchRes = results[0].status === 'fulfilled' ? results[0].value : [];
//       const completionRes = results[1].status === 'fulfilled' ? results[1].value : [];
//       const classRes = results[2].status === 'fulfilled' ? results[2].value : [];

//       const batchData = Array.isArray(batchRes) ? batchRes : [];
      
//       const enhancedBatches = await Promise.all(batchData.map(async (batch) => {
//         const progressInfo = (completionRes || []).find(c => c.batchId === batch.batchId);
//         const classInfo = (classRes || []).find(c => c.batchId === batch.batchId);
        
//         const dropoutId = batch.CourseId || batch.courseId || batch.courseID;
        
//         let dropoutRateValue = 0;
//         if (dropoutId && String(dropoutId).startsWith('C')) {
//           try {
//             const res = await api.getCourseDropout(dropoutId);
//             if (res && typeof res === 'object') {
//                 dropoutRateValue = res.dropoutRate !== undefined ? res.dropoutRate : 0;
//             } else if (typeof res === 'number') {
//                 dropoutRateValue = res;
//             }
//           } catch (e) {
//             console.error("Dropout fetch error", e);
//             dropoutRateValue = 0;
//           }
//         }

//         return { 
//           ...batch, 
//           progress: progressInfo ? progressInfo.completion : 0,
//           // FIX: Changed totalclasses to totalClasses to match API
//           totalClasses: classInfo ? classInfo.totalClasses : 0, 
//           dropoutRate: dropoutRateValue 
//         };
//       }));

//       const sortedBatches = enhancedBatches.sort((a, b) => {
//         return new Date(b.startDate || 0) - new Date(a.startDate || 0);
//       });

//       setBatches(sortedBatches);
//       setFilteredBatches(sortedBatches);

//       if (enhancedBatches.length > 0) {
//         const b = enhancedBatches[0];
//         setInstructorProfile({
//           name: b.instructorName || "N/A",
//           email: b.instructorEmail || "N/A",
//           phone: b.instructorPhone || "N/A",
//           id: b.instructorId || id
//         });
//       }

//       setStats({
//         totalBatches: enhancedBatches.length,
//         totalStudents: enhancedBatches.reduce((s, b) => s + (b.studentCount || 0), 0),
//         totalClasses: enhancedBatches.reduce((s, b) => s + (b.totalClasses || 0), 0),
//         ongoing: enhancedBatches.filter(b => b.isActive).length
//       });

//     } catch (err) {
//       toast.error("Failed to fetch instructor details");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchStudentAssessments = async (students, courseId) => {
//     if (!courseId || !students) return;
//     const assessmentMap = {};
    
//     await Promise.all(students.map(async (student) => {
//       try {
//         const sId = student.studentId || student.StudentId;
//         const response = await api.getStudentAssessmentStats(sId, courseId);
        
//         if (response && Array.isArray(response) && response.length > 0) {
//           assessmentMap[sId] = response[0];
//         } else if (response && !Array.isArray(response)) {
//           assessmentMap[sId] = response;
//         }
//       } catch (e) {
//         console.error(`Error fetching assessment for ${student.studentId}`, e);
//       }
//     }));
    
//     setStudentAssessmentData(prev => ({ ...prev, ...assessmentMap }));
//   };

//   useEffect(() => {
//     const filtered = batches.filter(batch => 
//       batch.courseName?.toLowerCase().includes(batchSearchQuery.toLowerCase()) ||
//       batch.batchId?.toLowerCase().includes(batchSearchQuery.toLowerCase())
//     );
//     setFilteredBatches(filtered);
//   }, [batchSearchQuery, batches]);

//   useEffect(() => {
//     if (searchId) loadInstructorData(searchId);
//   }, [searchId]);

//   const downloadPDF = () => {
//     try {
//       const doc = new jsPDF();
//       doc.setFontSize(20);
//       doc.text("EDUTRACK PERFORMANCE REPORT", 14, 22);
//       doc.setFontSize(11);
//       doc.setTextColor(100);
//       doc.text(`Instructor: ${instructorProfile.name}`, 14, 32);
//       doc.text(`Batch: ${selectedBatch.batchId} | Course: ${selectedBatch.courseName}`, 14, 38);

//       const tableColumn = ["ID", "Name", "Avg Score", "Total Assmnt", "Submitted", "Comp %", "Attd %"];
//       const tableRows = selectedBatch.students.map(s => [
//         s.studentId, 
//         s.studentName, 
//         s.avgScore?.toFixed(2), 
//         studentAssessmentData[s.studentId]?.totalAssessments || 0,
//         studentAssessmentData[s.studentId]?.submittedAssessments || 0,
//         `${s.completionPercentage}%`, 
//         `${s.attendancePercentage}%`
//       ]);

//       autoTable(doc, {
//         startY: 45,
//         head: [tableColumn],
//         body: tableRows,
//         theme: 'grid',
//         headStyles: { fillColor: [59, 130, 246] }
//       });

//       doc.save(`Report_${selectedBatch.batchId}.pdf`);
//       toast.success("PDF Downloaded");
//     } catch (error) {
//       toast.error("PDF generation failed");
//     }
//   };

//   const StatCard = ({ title, value, icon, shrinkText = false }) => {
//     const valueSize = shrinkText && String(value).length > 12 ? "14px" : "22px";
//     return (
//       <div className="hover-card animate-page" style={{ 
//         flex: 1, minHeight: "140px", background: colors.cardBg, padding: "20px", 
//         borderRadius: "15px", border: `1px solid ${colors.border}`, textAlign: "center", 
//         display: 'flex', flexDirection: 'column', justifyContent: 'center' 
//       }}>
//         <div style={{ fontSize: "24px", marginBottom: '5px' }}>{icon}</div>
//         <div style={{ fontSize: "10px", color: colors.textDim, textTransform: 'uppercase' }}>{title}</div>
//         <div style={{ fontSize: valueSize, color: colors.accent, fontWeight: 'bold', marginTop: '5px' }}>{value}</div>
//       </div>
//     );
//   };

//   if (selectedBatch) {
//     return (
//       <div className="animate-page" style={{ background: colors.background, minHeight: "100vh", color: colors.textMain, padding: "20px" }}>
//         <style>{animations}</style>
        
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//           <button onClick={() => setSelectedBatch(null)} style={{ display: 'flex', alignItems: 'center', gap: '5px', color: colors.accent, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
//             <ChevronLeft size={20} /> BACK TO DASHBOARD
//           </button>
//           <button onClick={downloadPDF} className="pulse-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: colors.accent, color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
//             <Download size={16} /> DOWNLOAD PDF
//           </button>
//         </div>

//         <div style={{ marginBottom: '30px' }}>
//           <h2 style={{ margin: 0, fontSize: '24px' }}>Batch Details: {selectedBatch.courseName}</h2>
//           <p style={{ color: colors.textDim, fontSize: '14px' }}>Batch ID: {selectedBatch.batchId}</p>
//         </div>
        
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "15px", marginBottom: "30px" }}>
//           <StatCard title="Enrolled" value={selectedBatch.totalStudents} icon="🎓" />
//           {/* FIX: Use 0 as default instead of 1, and ensure property name is consistent */}
//           <StatCard title="Total Classes" value={selectedBatch.totalClasses || 0} icon="⏰" />
//           <StatCard title="Batch Attd" value={`${selectedBatch.batchAverageAttendance || 0}%`} icon="🚀" />
//           <StatCard title="Syllabus" value={`${selectedBatch.batchAverageCompletionPercentage || 0}%`} icon="📚" />
//           <StatCard title="Top Rank" value={selectedBatch.topPerformer || "N/A"} icon="🏆" shrinkText={true} />
//         </div>

//         <div className="animate-page" style={{ background: colors.cardBg, borderRadius: '15px', border: `1px solid ${colors.border}`, padding: '20px' }}>
//           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
//               <h3 style={{ margin: 0 }}>Student Performance Table</h3>
//               <input 
//                 placeholder="Search Name or ID..." 
//                 onChange={(e) => setStudentSearch(e.target.value)}
//                 style={{ background: colors.background, border: `1px solid ${colors.border}`, color: 'white', padding: '8px 15px', borderRadius: '8px', width: '280px', outline: 'none' }}
//               />
//           </div>
//           <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
//             <thead>
//               <tr style={{ color: colors.textDim, borderBottom: `1px solid ${colors.border}` }}>
//                 <th style={{ padding: '12px' }}>ID</th>
//                 <th style={{ padding: '12px' }}>NAME</th>
//                 <th style={{ padding: '12px' }}>AVG SCORE</th>
//                 <th style={{ padding: '12px' }}>TOTAL ASSMNT</th>
//                 <th style={{ padding: '12px' }}>SUBMITTED</th>
//                 <th style={{ padding: '12px' }}>PENDING</th>
//                 <th style={{ padding: '12px' }}>COMP %</th>
//                 <th style={{ padding: '12px' }}>ATTD %</th>
//               </tr>
//             </thead>
//             <tbody>
//               {selectedBatch.students?.filter(s => 
//                 s.studentName.toLowerCase().includes(studentSearch.toLowerCase()) ||
//                 s.studentId.toLowerCase().includes(studentSearch.toLowerCase())
//               ).map(s => (
//                 <tr key={s.studentId} className="table-row" style={{ borderBottom: `1px solid ${colors.border}` }}>
//                   <td style={{ padding: '12px', color: colors.accent, fontWeight: 'bold' }}>{s.studentId}</td>
//                   <td style={{ padding: '12px' }}>{s.studentName}</td>
//                   <td style={{ padding: '12px' }}>{s.avgScore?.toFixed(2)}</td>
//                   <td style={{ padding: '12px' }}>{studentAssessmentData[s.studentId]?.totalAssessments || 0}</td>
//                   <td style={{ padding: '12px' }}>{studentAssessmentData[s.studentId]?.submittedAssessments || 0}</td>
//                   <td style={{ padding: '12px', color: '#ef4444', fontWeight: 'bold' }}>{studentAssessmentData[s.studentId]?.pendingAssessments || 0}</td>
//                   <td style={{ padding: '12px' }}>{s.completionPercentage}%</td>
//                   <td style={{ padding: '12px' }}>{s.attendancePercentage}%</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="animate-page" style={{ background: colors.background, minHeight: "100vh", color: colors.textMain, padding: "20px" }}>
//       <style>{animations}</style>

//       <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
//         <div className="animate-page">
//           <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>INSIGHTS & PROGRESS</h1>
//           <p style={{ fontSize: '10px', color: colors.accent, letterSpacing: '1px' }}>Monitor your batches, students, and progress</p>
//         </div>
//         {searchId && (
//           <div className="pulse-btn" style={{ background: colors.cardBg, padding: '15px 25px', borderRadius: '12px', border: `1px solid ${colors.border}`, textAlign: 'right' }}>
//             <div style={{ fontWeight: 'bold', fontSize: '18px', color: 'white' }}>{instructorProfile.name}</div>
//             <div style={{ fontSize: '12px', color: colors.textDim, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '5px' }}>
//               <Mail size={12} /> {instructorProfile.email}
//             </div>
//             <div style={{ fontSize: '12px', color: colors.textDim, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '5px' }}>
//               <Phone size={12} /> {instructorProfile.phone}
//             </div>
//             <div style={{ fontSize: '11px', color: colors.accent, fontWeight: 'bold', marginTop: '5px' }}>ID: {instructorProfile.id}</div>
//           </div>
//         )}
//       </header>

//       <div style={{ display: "flex", gap: "10px", justifyContent: 'center', marginBottom: "50px" }}>
//         <input
//           type="text"
//           placeholder="Enter Instructor ID (e.g., I001)"
//           value={instructorId}
//           onChange={(e) => setInstructorId(e.target.value)}
//           style={{ padding: "12px 20px", borderRadius: "30px", border: `1px solid ${colors.border}`, background: colors.cardBg, color: "#fff", width: '350px', outline: 'none' }}
//         />
//         <button className="pulse-btn" onClick={() => setSearchId(instructorId)} style={{ padding: "10px 30px", borderRadius: "30px", background: colors.accent, color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}>
//           {loading ? "Searching..." : "Search"}
//         </button>
//       </div>

//       {searchId && (
//         <>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "15px", marginBottom: "50px" }}>
//             <StatCard title="Total Batches" value={stats.totalBatches} icon="📚" />
//             <StatCard title="Total Students" value={stats.totalStudents} icon="🎓" />
//             <StatCard title="Total Classes" value={stats.totalClasses} icon="⏰" />
//             <StatCard title="Ongoing" value={stats.ongoing} icon="🚀" />
//           </div>

//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//             <h2 style={{ fontSize: '22px', margin: 0 }}>Your Batches</h2>
//             <input
//               type="text"
//               placeholder="Search Name, Batch ID, Course..."
//               value={batchSearchQuery}
//               onChange={(e) => setBatchSearchQuery(e.target.value)}
//               style={{ padding: "10px 20px", borderRadius: "10px", border: `1px solid ${colors.border}`, background: colors.cardBg, color: "#fff", width: '300px', outline: 'none' }}
//             />
//           </div>

//           {filteredBatches.length > 0 ? (
//             <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "25px" }}>
//               {filteredBatches.map((batch) => (
//                 <div key={batch.batchId} className="hover-card" style={{ background: colors.cardBg, padding: "25px", borderRadius: "20px", border: `1px solid ${colors.border}` }}>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
//                     <h3 style={{ margin: 0, fontSize: '18px' }}>{batch.courseName}</h3>
//                     <span style={{ fontSize: '10px', color: colors.accent, fontWeight: 'bold' }}>{batch.startDate || "N/A"}</span>
//                   </div>
                  
//                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//                       <div style={{ fontSize: '11px', color: colors.textDim }}>ID: {batch.batchId}</div>
//                       <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: 'bold' }}>Dropout: {batch.dropoutRate || 0}%</div>
//                   </div>
                  
//                   <div style={{ marginBottom: '20px' }}>
//                     <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: colors.textDim, marginBottom: '5px' }}>
//                       <span>PROGRESS</span>
//                       <span>{batch.progress}%</span>
//                     </div>
//                     <div style={{ height: '6px', background: colors.border, borderRadius: '10px', overflow: 'hidden' }}>
//                       <div className="animate-bar" style={{ height: '100%', background: colors.accent, width: `${batch.progress}%` }}></div>
//                     </div>
//                   </div>

//                   <button 
//                     className="view-btn"
//                     onClick={async () => {
//                       const data = await api.getBatchReport(batch.batchId);
//                       // FIX: Pass the totalClasses from the batch object into the selected batch state
//                       setSelectedBatch({
//                         ...data,
//                         totalClasses: batch.totalClasses
//                       });
//                       const cId = data?.courseId || data?.CourseId;
//                       if (data && data.students && cId) {
//                         await fetchStudentAssessments(data.students, cId);
//                       }
//                     }} 
//                     style={{ width: "100%", padding: "10px", borderRadius: "8px", fontWeight: 'bold' }}
//                   >
//                     View Full Details
//                   </button>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="animate-page" style={{ textAlign: 'center', padding: '100px 0', background: colors.cardBg, borderRadius: '20px', border: `1px dashed ${colors.border}` }}>
//               <SearchX size={48} style={{ color: colors.textDim, marginBottom: '15px', opacity: 0.5 }} />
//               <h3 style={{ color: colors.textMain, margin: '0 0 10px 0' }}>No Batches Found</h3>
//               <p style={{ color: colors.textDim, margin: 0 }}>We couldn't find any results matching "{batchSearchQuery}"</p>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default InstructorReportPage;



import React, { useState, useEffect } from "react";
import { api } from "../services/Api"; 
import { Phone, Mail, ChevronLeft, Download, SearchX, User } from "lucide-react";
import toast from "react-hot-toast";
import jsPDF from "jspdf"; 
import autoTable from "jspdf-autotable";

const InstructorReportPage = () => {
  const [instructorId, setInstructorId] = useState("");
  const [searchId, setSearchId] = useState("");
  const [batches, setBatches] = useState([]);
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [batchSearchQuery, setBatchSearchQuery] = useState(""); 
  
  const [instructorProfile, setInstructorProfile] = useState({
    name: "N/A", email: "N/A", phone: "N/A", id: "N/A"
  });

  const [stats, setStats] = useState({ totalBatches: 0, totalStudents: 0, totalClasses: 0, ongoing: 0 });
  const [loading, setLoading] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [studentSearch, setStudentSearch] = useState("");
  const [studentAssessmentData, setStudentAssessmentData] = useState({});

  const colors = {
    background: "#020617",
    cardBg: "#0f172a",
    accent: "#3b82f6",
    textMain: "#f8fafc",
    textDim: "#94a3b8",
    border: "#1e293b"
  };

  const animations = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes barFill {
      from { width: 0%; }
    }
    @keyframes pulseGlow {
      0% { box-shadow: 0 0 0 0px rgba(59, 130, 246, 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
      100% { box-shadow: 0 0 0 0px rgba(59, 130, 246, 0); }
    }
    .animate-page { animation: fadeIn 0.6s ease-out forwards; }
    .animate-bar { animation: barFill 1.2s cubic-bezier(0.1, 1, 0.1, 1) forwards; }
    .pulse-btn { animation: pulseGlow 2s infinite; }
    .hover-card { transition: all 0.3s ease !important; }
    .hover-card:hover { transform: translateY(-5px); border-color: ${colors.accent} !important; box-shadow: 0 10px 30px -15px rgba(59, 130, 246, 0.3); }
    .table-row { transition: background-color 0.2s ease; cursor: pointer; }
    .table-row:hover { background-color: #1e293b !important; }
  `;

  // Helper to format dates to YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString || dateString === "N/A") return "N/A";
    return dateString.split('T')[0];
  };

  const loadInstructorData = async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        api.getInstructorBatches(id),
        api.getBatchCompletionRate(id),
        api.getClassCounts(id)
      ]);

      const batchRes = results[0].status === 'fulfilled' ? results[0].value : [];
      const completionRes = results[1].status === 'fulfilled' ? results[1].value : [];
      const classRes = results[2].status === 'fulfilled' ? results[2].value : [];

      const batchData = Array.isArray(batchRes) ? batchRes : [];
      
      const enhancedBatches = await Promise.all(batchData.map(async (batch) => {
        const progressInfo = (completionRes || []).find(c => c.batchId === batch.batchId);
        const classInfo = (classRes || []).find(c => c.batchId === batch.batchId);
        
        const dropoutId = batch.CourseId || batch.courseId || batch.courseID;
        
        let dropoutRateValue = 0;
        if (dropoutId && String(dropoutId).startsWith('C')) {
          try {
            const res = await api.getCourseDropout(dropoutId);
            if (res && typeof res === 'object') {
                dropoutRateValue = res.dropoutRate !== undefined ? res.dropoutRate : 0;
            } else if (typeof res === 'number') {
                dropoutRateValue = res;
            }
          } catch (e) {
            console.error("Dropout fetch error", e);
            dropoutRateValue = 0;
          }
        }

        return { 
          ...batch, 
          progress: progressInfo ? progressInfo.completion : 0,
          totalClasses: classInfo ? classInfo.totalClasses : 0, 
          dropoutRate: dropoutRateValue 
        };
      }));

      const sortedBatches = enhancedBatches.sort((a, b) => {
        return new Date(b.startDate || 0) - new Date(a.startDate || 0);
      });

      setBatches(sortedBatches);
      setFilteredBatches(sortedBatches);

      if (enhancedBatches.length > 0) {
        const b = enhancedBatches[0];
        setInstructorProfile({
          name: b.instructorName || "N/A",
          email: b.instructorEmail || "N/A",
          phone: b.instructorPhone || "N/A",
          id: b.instructorId || id
        });
      }

      setStats({
        totalBatches: enhancedBatches.length,
        totalStudents: enhancedBatches.reduce((s, b) => s + (b.studentCount || 0), 0),
        totalClasses: enhancedBatches.reduce((s, b) => s + (b.totalClasses || 0), 0),
        ongoing: enhancedBatches.filter(b => b.isActive).length
      });

    } catch (err) {
      toast.error("Failed to fetch instructor details");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentAssessments = async (students, courseId) => {
    if (!courseId || !students) return;
    const assessmentMap = {};
    
    await Promise.all(students.map(async (student) => {
      try {
        const sId = student.studentId || student.StudentId;
        const response = await api.getStudentAssessmentStats(sId, courseId);
        
        if (response && Array.isArray(response) && response.length > 0) {
          assessmentMap[sId] = response[0];
        } else if (response && !Array.isArray(response)) {
          assessmentMap[sId] = response;
        }
      } catch (e) {
        console.error(`Error fetching assessment for ${student.studentId}`, e);
      }
    }));
    
    setStudentAssessmentData(prev => ({ ...prev, ...assessmentMap }));
  };

  useEffect(() => {
    const filtered = batches.filter(batch => 
      batch.courseName?.toLowerCase().includes(batchSearchQuery.toLowerCase()) ||
      batch.batchId?.toLowerCase().includes(batchSearchQuery.toLowerCase())
    );
    setFilteredBatches(filtered);
  }, [batchSearchQuery, batches]);

  useEffect(() => {
    if (searchId) loadInstructorData(searchId);
  }, [searchId]);

  const downloadPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text("EDUTRACK PERFORMANCE REPORT", 14, 22);
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Instructor: ${instructorProfile.name}`, 14, 32);
      doc.text(`Batch: ${selectedBatch.batchId} | Course: ${selectedBatch.courseName}`, 14, 38);

      const tableColumn = ["ID", "Name", "Avg Score", "Total Assmnt", "Submitted", "Comp %", "Attd %"];
      const tableRows = selectedBatch.students.map(s => [
        s.studentId, 
        s.studentName, 
        s.avgScore?.toFixed(2), 
        studentAssessmentData[s.studentId]?.totalAssessments || 0,
        studentAssessmentData[s.studentId]?.submittedAssessments || 0,
        `${s.completionPercentage}%`, 
        `${s.attendancePercentage}%`
      ]);

      autoTable(doc, {
        startY: 45,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] }
      });

      doc.save(`Report_${selectedBatch.batchId}.pdf`);
      toast.success("PDF Downloaded");
    } catch (error) {
      toast.error("PDF generation failed");
    }
  };

  const StatCard = ({ title, value, icon, shrinkText = false }) => {
    const valueSize = shrinkText && String(value).length > 12 ? "14px" : "22px";
    return (
      <div className="hover-card animate-page" style={{ 
        flex: 1, minHeight: "140px", background: colors.cardBg, padding: "20px", 
        borderRadius: "15px", border: `1px solid ${colors.border}`, textAlign: "center", 
        display: 'flex', flexDirection: 'column', justifyContent: 'center' 
      }}>
        <div style={{ fontSize: "24px", marginBottom: '5px' }}>{icon}</div>
        <div style={{ fontSize: "10px", color: colors.textDim, textTransform: 'uppercase' }}>{title}</div>
        <div style={{ fontSize: valueSize, color: colors.accent, fontWeight: 'bold', marginTop: '5px' }}>{value}</div>
      </div>
    );
  };

  if (selectedBatch) {
    return (
      <div className="animate-page" style={{ background: colors.background, minHeight: "100vh", color: colors.textMain, padding: "20px" }}>
        <style>{animations}</style>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <button onClick={() => setSelectedBatch(null)} style={{ display: 'flex', alignItems: 'center', gap: '5px', color: colors.accent, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
            <ChevronLeft size={20} /> BACK TO DASHBOARD
          </button>
          <button onClick={downloadPDF} className="pulse-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: colors.accent, color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
            <Download size={16} /> DOWNLOAD PDF
          </button>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ margin: 0, fontSize: '24px' }}>Batch Details: {selectedBatch.courseName}</h2>
          <p style={{ color: colors.textDim, fontSize: '14px' }}>Batch ID: {selectedBatch.batchId}</p>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "15px", marginBottom: "30px" }}>
          <StatCard title="Enrolled" value={selectedBatch.totalStudents} icon="🎓" />
          <StatCard title="Total Classes" value={selectedBatch.totalClasses || 0} icon="⏰" />
          <StatCard title="Batch Attd" value={`${selectedBatch.batchAverageAttendance || 0}%`} icon="🚀" />
          <StatCard title="Syllabus" value={`${selectedBatch.batchAverageCompletionPercentage || 0}%`} icon="📚" />
          <StatCard title="Top Rank" value={selectedBatch.topPerformer || "N/A"} icon="🏆" shrinkText={true} />
        </div>

        <div className="animate-page" style={{ background: colors.cardBg, borderRadius: '15px', border: `1px solid ${colors.border}`, padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>Student Performance Table</h3>
              <input 
                placeholder="Search Name or ID..." 
                onChange={(e) => setStudentSearch(e.target.value)}
                style={{ background: colors.background, border: `1px solid ${colors.border}`, color: 'white', padding: '8px 15px', borderRadius: '8px', width: '280px', outline: 'none' }}
              />
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ color: colors.textDim, borderBottom: `1px solid ${colors.border}` }}>
                <th style={{ padding: '12px' }}>ID</th>
                <th style={{ padding: '12px' }}>NAME</th>
                <th style={{ padding: '12px' }}>AVG SCORE</th>
                <th style={{ padding: '12px' }}>TOTAL ASSMNT</th>
                <th style={{ padding: '12px' }}>SUBMITTED</th>
                <th style={{ padding: '12px' }}>PENDING</th>
                <th style={{ padding: '12px' }}>COMP %</th>
                <th style={{ padding: '12px' }}>ATTD %</th>
              </tr>
            </thead>
            <tbody>
              {selectedBatch.students?.filter(s => 
                s.studentName.toLowerCase().includes(studentSearch.toLowerCase()) ||
                s.studentId.toLowerCase().includes(studentSearch.toLowerCase())
              ).map(s => (
                <tr key={s.studentId} className="table-row" style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <td style={{ padding: '12px', color: colors.accent, fontWeight: 'bold' }}>{s.studentId}</td>
                  <td style={{ padding: '12px' }}>{s.studentName}</td>
                  <td style={{ padding: '12px' }}>{s.avgScore?.toFixed(2)}</td>
                  <td style={{ padding: '12px' }}>{studentAssessmentData[s.studentId]?.totalAssessments || 0}</td>
                  <td style={{ padding: '12px' }}>{studentAssessmentData[s.studentId]?.submittedAssessments || 0}</td>
                  <td style={{ padding: '12px', color: '#ef4444', fontWeight: 'bold' }}>{studentAssessmentData[s.studentId]?.pendingAssessments || 0}</td>
                  <td style={{ padding: '12px' }}>{s.completionPercentage}%</td>
                  <td style={{ padding: '12px' }}>{s.attendancePercentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-page" style={{ background: colors.background, minHeight: "100vh", color: colors.textMain, padding: "20px" }}>
      <style>{animations}</style>

      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
        <div className="animate-page">
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>INSIGHTS & PROGRESS</h1>
          <p style={{ fontSize: '10px', color: colors.accent, letterSpacing: '1px' }}>Monitor your batches, students, and progress</p>
        </div>
        {searchId && (
          <div className="pulse-btn" style={{ background: colors.cardBg, padding: '15px 25px', borderRadius: '12px', border: `1px solid ${colors.border}`, textAlign: 'right' }}>
            <div style={{ fontWeight: 'bold', fontSize: '18px', color: 'white' }}>{instructorProfile.name}</div>
            <div style={{ fontSize: '12px', color: colors.textDim, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '5px' }}>
              <Mail size={12} /> {instructorProfile.email}
            </div>
            <div style={{ fontSize: '12px', color: colors.textDim, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '5px' }}>
              <Phone size={12} /> {instructorProfile.phone}
            </div>
            <div style={{ fontSize: '11px', color: colors.accent, fontWeight: 'bold', marginTop: '5px' }}>ID: {instructorProfile.id}</div>
          </div>
        )}
      </header>

      <div style={{ display: "flex", gap: "10px", justifyContent: 'center', marginBottom: "50px" }}>
        <input
          type="text"
          placeholder="Enter Instructor ID (e.g., I001)"
          value={instructorId}
          onChange={(e) => setInstructorId(e.target.value)}
          style={{ padding: "12px 20px", borderRadius: "30px", border: `1px solid ${colors.border}`, background: colors.cardBg, color: "#fff", width: '350px', outline: 'none' }}
        />
        <button className="pulse-btn" onClick={() => setSearchId(instructorId)} style={{ padding: "10px 30px", borderRadius: "30px", background: colors.accent, color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {searchId && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "15px", marginBottom: "50px" }}>
            <StatCard title="Total Batches" value={stats.totalBatches} icon="📚" />
            <StatCard title="Total Students" value={stats.totalStudents} icon="🎓" />
            <StatCard title="Total Classes" value={stats.totalClasses} icon="⏰" />
            <StatCard title="Ongoing" value={stats.ongoing} icon="🚀" />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '22px', margin: 0 }}>Your Batches</h2>
            <input
              type="text"
              placeholder="Search Name, Batch ID, Course..."
              value={batchSearchQuery}
              onChange={(e) => setBatchSearchQuery(e.target.value)}
              style={{ padding: "10px 20px", borderRadius: "10px", border: `1px solid ${colors.border}`, background: colors.cardBg, color: "#fff", width: '300px', outline: 'none' }}
            />
          </div>

          {filteredBatches.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "25px" }}>
              {filteredBatches.map((batch) => (
                <div key={batch.batchId} className="hover-card" style={{ background: colors.cardBg, padding: "25px", borderRadius: "20px", border: `1px solid ${colors.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0, fontSize: '18px' }}>{batch.courseName}</h3>
                    {/* UPDATED: Show both dates till the date only */}
                    <div style={{ fontSize: '10px', color: colors.accent, fontWeight: 'bold', textAlign: 'right' }}>
                      <div>S: {formatDate(batch.startDate)}</div>
                      <div>E: {formatDate(batch.endDate)}</div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                      <div style={{ fontSize: '11px', color: colors.textDim }}>ID: {batch.batchId}</div>
                      <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: 'bold' }}>Dropout: {batch.dropoutRate || 0}%</div>
                  </div>

                  {/* ADDED: Instructor ID in the middle of the card */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: colors.background, padding: '8px 12px', borderRadius: '8px', border: `1px solid ${colors.border}`, marginBottom: '20px', justifyContent: 'center' }}>
                    <User size={14} style={{ color: colors.accent }} />
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: colors.textMain }}>Instructor: {batch.instructorId}</span>
                  </div>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: colors.textDim, marginBottom: '5px' }}>
                      <span>PROGRESS</span>
                      <span>{batch.progress}%</span>
                    </div>
                    <div style={{ height: '6px', background: colors.border, borderRadius: '10px', overflow: 'hidden' }}>
                      <div className="animate-bar" style={{ height: '100%', background: colors.accent, width: `${batch.progress}%` }}></div>
                    </div>
                  </div>

                  <button 
                    className="view-btn"
                    onClick={async () => {
                      const data = await api.getBatchReport(batch.batchId);
                      setSelectedBatch({
                        ...data,
                        totalClasses: batch.totalClasses
                      });
                      const cId = data?.courseId || data?.CourseId;
                      if (data && data.students && cId) {
                        await fetchStudentAssessments(data.students, cId);
                      }
                    }} 
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", fontWeight: 'bold' }}
                  >
                    View Full Details
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="animate-page" style={{ textAlign: 'center', padding: '100px 0', background: colors.cardBg, borderRadius: '20px', border: `1px dashed ${colors.border}` }}>
              <SearchX size={48} style={{ color: colors.textDim, marginBottom: '15px', opacity: 0.5 }} />
              <h3 style={{ color: colors.textMain, margin: '0 0 10px 0' }}>No Batches Found</h3>
              <p style={{ color: colors.textDim, margin: 0 }}>We couldn't find any results matching "{batchSearchQuery}"</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InstructorReportPage;