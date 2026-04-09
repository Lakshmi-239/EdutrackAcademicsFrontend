// import React, { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { getFullReport } from "../services/Api"; 
// import { 
//   FaFileAlt, FaChevronDown, FaChevronUp, FaGraduationCap, 
//   FaSearch, FaClipboardCheck, FaUsers, FaChartLine
// } from "react-icons/fa";

// const AdminReport = () => {
//   const [reportData, setReportData] = useState({ batches: [] });
//   const [loading, setLoading] = useState(true);
//   const [expandedBatch, setExpandedBatch] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => { fetchReport(); }, []);

//   const fetchReport = async () => {
//     try {
//       const data = await getFullReport();
//       setReportData(data || { batches: [] });
//     } catch (err) { console.error(err); } 
//     finally { setLoading(false); }
//   };

//   const filteredBatches = reportData?.batches?.filter((batch) => {
//     const searchLower = searchTerm.toLowerCase();
//     return batch.courseName.toLowerCase().includes(searchLower) ||
//            batch.students?.some(s => s.studentName.toLowerCase().includes(searchLower));
//   });

//   if (loading) return <div className="p-10 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">Loading...</div>;

//   return (
//     <div className="min-h-screen bg-[#f4f7fa] p-4 lg:p-6 font-sans text-slate-800">
//       <div className="max-w-6xl mx-auto">
        
//         {/* SLIM HEADER */}
//         <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-indigo-600 rounded-lg shadow-md shadow-indigo-100">
//               <FaFileAlt className="text-white text-sm" />
//             </div>
//             <h1 className="text-xl font-bold tracking-tight text-slate-800">Academic Report</h1>
//           </div>

//           <div className="relative w-full sm:w-72">
//             <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
//             <input 
//               type="text" 
//               placeholder="Search data..." 
//               className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500/20"
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//         </div>

//         {/* BATCH LIST */}
//         <div className="space-y-3">
//           {filteredBatches.map((batch) => (
//             <div key={batch.batchId} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:border-indigo-200 transition-colors">
              
//               {/* COMPACT BATCH HEADER */}
//               <div 
//                 className="p-4 cursor-pointer flex items-center justify-between gap-4"
//                 onClick={() => setExpandedBatch(expandedBatch === batch.batchId ? null : batch.batchId)}
//               >
//                 <div className="flex items-center gap-4 w-1/3">
//                   <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center text-lg">
//                     <FaGraduationCap />
//                   </div>
//                   <div>
//                     <h2 className="text-sm font-bold text-slate-900 leading-tight uppercase">{batch.courseName}</h2>
//                     <span className="text-[10px] font-bold text-slate-400">ID: {batch.batchId}</span>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-8 text-center">
//                   <div>
//                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Students</p>
//                     <p className="text-xs font-black">{batch.totalStudents}</p>
//                   </div>
//                   <div className="hidden sm:block">
//                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Avg Score</p>
//                     <p className="text-xs font-black text-indigo-600">{batch.batchAverageScore.toFixed(2)}</p>
//                   </div>
//                   <div className="hidden sm:block">
//                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Attendance</p>
//                     <p className="text-xs font-black text-emerald-500">{batch.batchAverageAttendance}%</p>
//                   </div>
//                 </div>

//                 <div className={`text-slate-300 transition-transform ${expandedBatch === batch.batchId ? 'rotate-180 text-indigo-600' : ''}`}>
//                   <FaChevronDown size={12} />
//                 </div>
//               </div>

//               {/* DATA TABLE */}
//               <AnimatePresence>
//                 {expandedBatch === batch.batchId && (
//                   <motion.div 
//                     initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
//                     className="border-t border-slate-100 bg-slate-50/50"
//                   >
//                     <div className="p-4">
//                       <table className="w-full text-left">
//                         <thead>
//                           <tr className="text-[9px] font-bold text-slate-400 uppercase border-b border-slate-100">
//                             <th className="pb-3 pl-2">Enrollment ID</th>
//                             <th className="pb-3">Student Name</th>
//                             <th className="pb-3 text-center">Score</th>
//                             <th className="pb-3 text-center">Tasks</th>
//                             <th className="pb-3">Progress</th>
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y divide-slate-100">
//                           {batch.students.map((student) => (
//                             <tr key={student.studentId} className="group hover:bg-white">
//                               <td className="py-3 pl-2 font-mono text-[10px] text-slate-400">{student.enrollmentId}</td>
//                               <td className="py-3 text-xs font-bold text-slate-700">{student.studentName}</td>
//                               <td className="py-3 text-center">
//                                 <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md font-bold text-[10px]">
//                                   {student.avgScore.toFixed(2)}
//                                 </span>
//                               </td>
//                               <td className="py-3 text-center">
//                                 <div className="inline-flex items-center gap-1.5 text-amber-600 text-[10px] font-bold">
//                                   <FaClipboardCheck size={10} />
//                                   <span>{student.completedAssessments}/{student.totalAssessments}</span>
//                                 </div>
//                               </td>
//                               <td className="py-3">
//                                 <div className="w-32">
//                                   <div className="flex justify-between text-[8px] font-bold text-slate-400 mb-1">
//                                     <span>{student.completionPercentage}% Done</span>
//                                   </div>
//                                   <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
//                                     <div style={{ width: `${student.completionPercentage}%` }} className="h-full bg-emerald-500" />
//                                   </div>
//                                 </div>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminReport;
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getFullReport } from "../services/Api"; 
import { 
  FaFileAlt, FaChevronDown, FaChevronUp, FaGraduationCap, 
  FaSearch, FaClipboardCheck, FaCircle
} from "react-icons/fa";

const AdminReport = () => {
  const [reportData, setReportData] = useState({ batches: [] });
  const [loading, setLoading] = useState(true);
  const [expandedBatch, setExpandedBatch] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => { fetchReport(); }, []);

  const fetchReport = async () => {
    try {
      const data = await getFullReport();
      setReportData(data || { batches: [] });
    } catch (err) { console.error("Data Fetch Error:", err); } 
    finally { setLoading(false); }
  };

  // ✅ ENHANCED SEARCH: Handles Name, Batch ID, and Enrollment ID
  const filteredBatches = reportData?.batches?.filter((batch) => {
    const s = searchTerm.toLowerCase();
    
    // Check Batch Level
    const matchesBatch = batch.courseName.toLowerCase().includes(s) || 
                         batch.batchId.toLowerCase().includes(s);

    // Check Student Level
    const matchesStudent = batch.students?.some(student => 
      student.studentName.toLowerCase().includes(s) || 
      student.enrollmentId.toLowerCase().includes(s)
    );

    return matchesBatch || matchesStudent;
  });

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50 text-indigo-600 font-bold text-xs tracking-widest animate-pulse">
      LOADING ACADEMIC DATA...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* COMPACT DASHBOARD HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-100">
              <FaFileAlt className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight">Academic Report</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Master Overview</p>
            </div>
          </div>

          <div className="relative w-full md:w-80">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
            <input 
              type="text" 
              placeholder="Search Name, Batch ID, or Enroll ID..." 
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* BATCH REPOSITORY */}
        <div className="space-y-4">
          {filteredBatches.map((batch) => (
            <div key={batch.batchId} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md">
              
              {/* COMPACT BATCH HEADER */}
              <div 
                className="p-5 cursor-pointer flex items-center justify-between gap-6"
                onClick={() => setExpandedBatch(expandedBatch === batch.batchId ? null : batch.batchId)}
              >
                <div className="flex items-center gap-5 w-1/3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-colors ${expandedBatch === batch.batchId ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                    <FaGraduationCap />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight leading-none mb-1">{batch.courseName}</h2>
                    <span className="bg-slate-100 text-slate-500 text-[9px] font-black px-2 py-0.5 rounded-md">ID: {batch.batchId}</span>
                  </div>
                </div>

                <div className="flex items-center gap-10 text-center">
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">Students</p>
                    <p className="text-sm font-black text-slate-700">{batch.totalStudents}</p>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">Avg Score</p>
                    <p className="text-sm font-black text-indigo-600">{batch.batchAverageScore.toFixed(2)}</p>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">Persistence</p>
                    <p className="text-sm font-black text-emerald-500">{batch.batchAverageAttendance}%</p>
                  </div>
                </div>

                <div className={`p-2 rounded-full transition-all ${expandedBatch === batch.batchId ? 'bg-slate-800 text-white rotate-180' : 'text-slate-300'}`}>
                  <FaChevronDown size={10} />
                </div>
              </div>

              {/* NESTED STUDENT DATA */}
              <AnimatePresence>
                {expandedBatch === batch.batchId && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="bg-slate-50/50 border-t border-slate-100 p-5"
                  >
                    <div className="bg-white rounded-xl border border-slate-100 shadow-inner overflow-hidden">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                          <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            <th className="px-6 py-4">Enroll ID</th>
                            <th className="px-4 py-4">Student</th>
                            <th className="px-4 py-4 text-center">Score</th>
                            <th className="px-4 py-4 text-center">Tasks</th>
                            <th className="px-6 py-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {batch.students.map((student) => (
                            <tr key={student.studentId} className="hover:bg-indigo-50/30 transition-colors group">
                              <td className="px-6 py-4 font-mono text-[10px] text-slate-400 font-bold group-hover:text-indigo-600">{student.enrollmentId}</td>
                              <td className="px-4 py-4 text-xs font-black text-slate-700">{student.studentName}</td>
                              <td className="px-4 py-4 text-center">
                                <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md font-black text-[10px]">
                                  {student.avgScore.toFixed(2)}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-center">
                                <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-amber-50 text-amber-600 rounded-md font-black text-[10px]">
                                  <FaClipboardCheck size={10} />
                                  <span>{student.completedAssessments}/{student.totalAssessments}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="w-32">
                                  <div className="flex justify-between text-[8px] font-bold text-slate-400 mb-1">
                                    <span>PROGRESS</span>
                                    <span className="text-emerald-500">{student.completionPercentage}%</span>
                                  </div>
                                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                      style={{ width: `${student.completionPercentage}%` }} 
                                      className="h-full bg-emerald-500 shadow-sm"
                                    />
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminReport;