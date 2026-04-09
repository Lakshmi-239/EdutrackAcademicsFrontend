
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getBatchDetails } from "../services/Api";
import { 
  FaUserGraduate, FaChartBar, FaTrophy, FaBookOpen, 
  FaDownload, FaArrowLeft, FaTrash, FaEdit, FaCheck, FaSearch 
} from "react-icons/fa";
import { MdOutlineAssignmentTurnedIn } from "react-icons/md";

const BatchDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const res = await getBatchDetails(id);
      if (res) {
        setData(res);
        setStudents(res.students || []);
      }
    } catch (err) {
      console.error("Failed to load batch data");
    }
  };

  // ✅ Real-world CSV Download Logic
  const downloadCSV = () => {
    const headers = ["Enrollment ID", "Student Name", "Score", "Progress", "Attendance"];
    const rows = students.map(s => [
      s.enrollmentId || `E-${s.studentId}`,
      s.studentName,
      s.avgScore,
      `${s.completionPercentage}%`,
      `${s.attendancePercentage}%`
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Batch_${id}_Performance_Report.csv`;
    link.click();
  };

  const getStatusColor = (value) => {
    if (value >= 80) return "bg-emerald-500";
    if (value >= 60) return "bg-amber-500";
    return "bg-rose-500";
  };

  const filteredStudents = students.filter(s => 
    s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.enrollmentId && s.enrollmentId.toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div className="flex flex-col gap-1">
            <button 
              onClick={() => navigate(-1)} 
              className="text-slate-400 text-[11px] font-bold hover:text-blue-600 flex items-center gap-2 transition-colors uppercase tracking-widest"
            >
              <FaArrowLeft /> Dashboard
            </button>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Batch Performance</h1>
          </div>

          <div className="relative w-full md:w-80">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
            <input 
              type="text" 
              placeholder="Search by ID or Name..." 
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all shadow-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {data && (
          <>
            {/* ✅ MEDIUM PROFESSIONAL KPI CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[
                { label: "Students", value: students.length, icon: <FaUserGraduate />, color: "blue" },
                { label: "Avg Score", value: data.batchAverageScore.toFixed(2), icon: <FaChartBar />, color: "emerald" },
                { label: "Completion", value: `${data.batchAverageCompletionPercentage}%`, icon: <MdOutlineAssignmentTurnedIn />, color: "amber" },
                { label: "Top Performer", value: data.topPerformer, icon: <FaTrophy />, color: "purple" },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05)" }}
                  className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden transition-all"
                >
                  <div className={`absolute -right-4 -bottom-4 opacity-[0.03] text-7xl text-slate-900`}>{item.icon}</div>
                  <div className="flex justify-between items-start z-10">
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{item.label}</p>
                    <div className={`bg-${item.color}-50 text-${item.color}-600 p-2.5 rounded-xl text-lg shadow-sm shadow-${item.color}-100`}>{item.icon}</div>
                  </div>
                  <h3 className={`font-black text-slate-800 z-10 ${item.label === "Top Performer" ? 'text-sm' : 'text-2xl'}`}>
                    {item.value}
                  </h3>
                </motion.div>
              ))}
            </div>

            {/* COURSE STRIP */}
            <div className="flex justify-between items-center bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-sm mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-slate-900 text-white p-2.5 rounded-xl"><FaBookOpen size={16}/></div>
                <span className="text-sm font-black text-slate-700 uppercase tracking-tighter">{data.courseName} Overview</span>
              </div>
              <motion.button 
                whileTap={{ scale: 0.96 }}
                onClick={downloadCSV}
                className="flex items-center gap-2 bg-blue-600 text-white text-[11px] font-bold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
              >
                <FaDownload /> DOWNLOAD CSV
              </motion.button>
            </div>

            {/* ✅ REAL-WORLD TABLE UI */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <th className="px-8 py-5">ID</th>
                    <th className="px-6 py-5">Student Details</th>
                    <th className="px-6 py-5 text-center">Batch Score</th>
                    <th className="px-6 py-5">Course Progress</th>
                    <th className="px-6 py-5">Attendance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <AnimatePresence>
                    {filteredStudents.map((s, idx) => (
                      <motion.tr 
                        key={s.studentId}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`group transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'} hover:bg-blue-50/40`}
                      >
                        <td className="px-8 py-5">
                          <span className="text-[11px] font-mono font-bold text-slate-400">
                            {s.enrollmentId || `ENR-${s.studentId.toString().padStart(3, '0')}`}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                {s.studentName.charAt(0)}
                              </div>
                              <span className="font-bold text-slate-700 text-[13px]">{s.studentName}</span>
                            </div>
                            {/* INLINE ACTIONS */}
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                               <button className="p-2 text-slate-300 hover:text-blue-600 hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-slate-100"><FaEdit size={12}/></button>
                               <button className="p-2 text-slate-300 hover:text-rose-600 hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-slate-100"><FaTrash size={12}/></button>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className="font-mono font-bold text-blue-600 bg-blue-50/50 px-2.5 py-1 rounded-lg text-xs border border-blue-100/50">
                            {typeof s.avgScore === 'number' ? s.avgScore.toFixed(2) : s.avgScore}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="w-32">
                            <div className="flex justify-between items-center mb-1.5">
                               <span className="text-[9px] font-bold text-slate-400">PROGRESS</span>
                               <span className="text-[9px] font-black text-slate-600">{s.completionPercentage}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${s.completionPercentage}%` }}
                                className={`h-full ${getStatusColor(s.completionPercentage)} shadow-sm`} 
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="w-32">
                            <div className="flex justify-between items-center mb-1.5">
                               <span className="text-[9px] font-bold text-slate-400">ATTENDANCE</span>
                               <span className="text-[9px] font-black text-slate-600">{s.attendancePercentage}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${s.attendancePercentage}%` }}
                                className={`h-full ${getStatusColor(s.attendancePercentage)} shadow-sm`} 
                              />
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
              {filteredStudents.length === 0 && (
                <div className="py-20 text-center">
                   <p className="text-slate-400 text-sm font-medium">No students found matching your search.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BatchDetails;