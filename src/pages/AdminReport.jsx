


import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getFullReport, getBatchStartDates, updateStudent, deleteStudent } from "../services/Api"; 
import { FaGraduationCap, FaChevronDown, FaRegEdit, FaRegTrashAlt, FaTimes, FaSearch, FaChalkboardTeacher } from "react-icons/fa";
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const AdminReport = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedBatch, setExpandedBatch] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState(null); 
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editName, setEditName] = useState("");

  const fetchReport = async () => {
    try {
      setLoading(true);
      const [reportRes, datesRes] = await Promise.all([
        getFullReport(),
        getBatchStartDates()
      ]);

      const batches = reportRes?.batches || (Array.isArray(reportRes) ? reportRes : []);
      const datesArray = Array.isArray(datesRes) ? datesRes : [];

      let mergedData = batches.map(batch => {
        const dateMatch = datesArray.find(d => d.batchId === batch.batchId);
        return { ...batch, startDate: dateMatch ? dateMatch.startDate : null };
      });

      mergedData.sort((a, b) => new Date(b.startDate || 0) - new Date(a.startDate || 0));
      setReportData(mergedData);
    } catch (err) { 
      console.error("Fetch Error:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchReport(); }, []);

  const filteredData = reportData.filter((batch) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      batch.courseName.toLowerCase().includes(searchLower) ||
      batch.batchId.toLowerCase().includes(searchLower) ||
      batch.instructorName?.toLowerCase().includes(searchLower) ||
      batch.students?.some(s => s.studentName.toLowerCase().includes(searchLower))
    );
  });

  const formatDate = (dateString) => {
    if (!dateString) return "Yet to Start";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handleConfirmAction = async () => {
    try {
      if (currentAction === 'edit') {
        await updateStudent(selectedStudent.studentId, { studentName: editName });
      } else {
        await deleteStudent(selectedStudent.studentId);
      }
      setIsModalOpen(false);
      fetchReport();
    } catch (err) { alert("Action failed."); }
  };

  if (loading) return (
    <div className="h-screen bg-slate-950 flex items-center justify-center text-indigo-500 font-black tracking-widest uppercase">
      Updating Dashboard...
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
      <Navbar />
      
      <div className="max-w-6xl mx-auto p-6 pt-24 pb-12 space-y-8">
        <header className="mb-8 text-center">
            <h1 className="text-4xl font-black text-white tracking-tight uppercase">Performance <span className="text-indigo-500">Dashboard</span></h1>
        </header>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            </div>
            <input 
                type="text"
                placeholder="Search Batch ID, Course, Instructor or Student..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-800 text-white pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all backdrop-blur-xl"
            />
        </div>

        {/* Data List */}
        <div className="space-y-6">
            {filteredData.map((batch) => {
                const isExpanded = expandedBatch === batch.batchId;
                return (
                    <div key={batch.batchId} className="w-full space-y-4">
                        <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl p-6 border border-slate-800 hover:border-indigo-500/40 transition-all shadow-2xl">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                
                                {/* Course & Batch Info */}
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-500 text-2xl">
                                        <FaGraduationCap />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-xl font-bold text-white uppercase tracking-tight">{batch.courseName}</h2>
                                            <span className="bg-slate-800 text-indigo-400 text-[10px] font-black px-2 py-0.5 rounded border border-slate-700 uppercase tracking-widest">{batch.batchId}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">
                                            Started: <span className="text-slate-300">{formatDate(batch.startDate)}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* NEW: Instructor Info Section */}
                                <div className="flex items-center gap-4 px-6 border-l border-slate-800">
                                    <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-500">
                                        <FaChalkboardTeacher size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Instructor</p>
                                        <p className="text-sm font-bold text-slate-200">{batch.instructorName || "Unassigned"}</p>
                                        <p className="text-[10px] text-emerald-500/70 font-mono">{batch.instructorId || "ID: N/A"}</p>
                                    </div>
                                </div>

                                {/* KPI & Toggle */}
                                <div className="flex items-center gap-8">
                                    <div className="hidden lg:flex gap-8">
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-slate-600 uppercase">Attendance</p>
                                            <p className="text-lg font-black text-emerald-400">{batch.batchAverageAttendance}%</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-slate-600 uppercase">Progress</p>
                                            <p className="text-lg font-black text-indigo-400">{batch.batchAverageCompletionPercentage}%</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setExpandedBatch(isExpanded ? null : batch.batchId)} 
                                        className="p-3 bg-slate-800/50 rounded-xl text-indigo-400 border border-slate-700 hover:bg-indigo-600 hover:text-white transition-all"
                                    >
                                        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}><FaChevronDown size={20} /></motion.div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Student Table Expansion (Remains the same as previous) */}
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="px-2">
                                    <div className="bg-slate-900/20 border border-slate-800/50 rounded-2xl p-4 overflow-x-auto">
                                        <table className="w-full border-separate border-spacing-y-2">
                                            <thead>
                                                <tr className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                                                    <th className="px-6 py-2 text-left">Student ID</th>
                                                    <th className="px-6 py-2 text-left">Student</th>
                                                    <th className="px-6 py-2 text-center">Avg Score</th>
                                                    <th className="px-6 py-2 text-center">Attendance</th>
                                                    <th className="px-6 py-2 text-center">Progress</th>
                                                    <th className="px-6 py-2 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {batch.students?.map((s) => (
                                                    <tr key={s.studentId} className="bg-slate-900/60 hover:bg-slate-800/80 transition-all">
                                                        <td className="px-6 py-4 text-sm font-mono text-slate-500 rounded-l-xl">{s.studentId}</td>
                                                        <td className="px-6 py-4 text-base font-bold text-slate-200">{s.studentName}</td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className="text-white font-bold bg-slate-800/50 px-3 py-1 rounded-lg border border-slate-700">{s.avgScore?.toFixed(1)}</span>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className="text-emerald-400 font-bold">{s.attendancePercentage}%</span>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <div className="flex flex-col items-center">
                                                                <span className="text-indigo-400 font-black text-sm">{s.completionPercentage}%</span>
                                                                <div className="w-20 h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                                                                    <div className="h-full bg-indigo-500" style={{width: `${s.completionPercentage}%`}}></div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-right rounded-r-xl">
                                                            <div className="flex justify-end gap-4 text-slate-500">
                                                                <button onClick={() => { setSelectedStudent(s); setEditName(s.studentName); setCurrentAction('edit'); setIsModalOpen(true); }} className="hover:text-amber-400"><FaRegEdit size={18}/></button>
                                                                <button onClick={() => { setSelectedStudent(s); setCurrentAction('delete'); setIsModalOpen(true); }} className="hover:text-rose-500"><FaRegTrashAlt size={18}/></button>
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
                );
            })}
        </div>
      </div>

      <Footer />

      {/* Action Modal (Remains the same) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-slate-900 border border-slate-800 rounded-3xl p-8 w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-6 text-white font-bold">
                {currentAction === 'edit' ? 'EDIT STUDENT' : 'REMOVE RECORD'}
                <button onClick={() => setIsModalOpen(false)}><FaTimes /></button>
              </div>
              {currentAction === 'edit' ? (
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-500" />
              ) : (
                <p className="text-slate-400">Delete record for <span className="text-white font-bold">{selectedStudent?.studentName}</span>?</p>
              )}
              <div className="flex gap-4 mt-8">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-3 bg-slate-800 text-slate-300 rounded-xl font-bold">Cancel</button>
                <button onClick={handleConfirmAction} className={`flex-1 px-6 py-3 text-white rounded-xl font-bold ${currentAction === 'edit' ? 'bg-indigo-600' : 'bg-rose-600'}`}>
                  {currentAction === 'edit' ? 'Save' : 'Confirm'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminReport;


