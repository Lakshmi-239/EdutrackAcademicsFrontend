import React, { useState, useEffect, useRef } from "react";
import { api } from "../services/Api";
import { ChevronDown, GraduationCap, Calendar, Download, Search, Trophy, Clock, Users } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AdminReport = () => {
  const [reportData, setReportData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedBatchId, setExpandedBatchId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const { left, top } = containerRef.current.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      containerRef.current.style.setProperty("--mouse-x", `${x}px`);
      containerRef.current.style.setProperty("--mouse-y", `${y}px`);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [reportRes, datesRes] = await Promise.all([
          api.getAdminFullReport(),
          api.getBatchStartDates()
        ]);
        const batches = reportRes.batches || [];
        const dateMapping = datesRes || [];
        const mergedData = batches.map((batch) => {
          const dateInfo = dateMapping.find(d => d.batchId === batch.batchId);
          return { ...batch, startDate: dateInfo?.startDate, endDate: dateInfo?.endDate };
        });
        
        mergedData.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
        setReportData(mergedData);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []); 

  const filteredData = reportData.filter((batch) => 
    batch.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.batchId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStudents = filteredData.reduce((acc, b) => acc + (b.students?.length || 0), 0);
  const topBatch = filteredData.length > 0 
    ? [...filteredData].sort((a, b) => (b.batchAverageCompletionPercentage || 0) - (a.batchAverageCompletionPercentage || 0))[0]
    : null;
  const latestBatchId = filteredData.length > 0 ? filteredData[0].batchId : "N/A";

  const downloadFullReport = () => {
    const doc = new jsPDF("p", "mm", "a4");
    doc.text("PERFORMANCE DASHBOARD", 14, 20);
    doc.save("Admin_Dashboard_Report.pdf");
  };

  const downloadBatchReport = (batch) => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["ID", "Name", "Avg Score", "Attendance", "Completion"]],
      body: batch.students.map(s => [s.studentId, s.studentName, s.avgScore, `${s.attendancePercentage}%`, `${s.completionPercentage}%`]),
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] }
    });
    doc.save(`${batch.batchId}_Report.pdf`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };

  if (loading) return <div className="h-full bg-slate-900 flex items-center justify-center text-teal-400 font-black italic animate-pulse">LOADING...</div>;

  return (
    <div ref={containerRef} className="h-full w-full bg-slate-900 text-white p-4 md:p-6 font-sans relative overflow-y-auto group/main" style={{ "--mouse-x": "0px", "--mouse-y": "0px" }}>
      
      {/* RADIANT HOVER BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover/main:opacity-100 transition-opacity duration-700"
        style={{ background: `radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(20, 184, 166, 0.07), transparent 80%)` }} />

      {/* HEADER */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-black uppercase italic tracking-tighter animate-in fade-in slide-in-from-left duration-500">
          PERFORMANCE <span className="text-teal-400 drop-shadow-[0_0_10px_rgba(45,212,191,0.2)]">DASHBOARD</span>
        </h1>
        <div className="flex items-center gap-3 w-full md:w-auto animate-in fade-in slide-in-from-right duration-500">
          <div className="relative flex-grow md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
            <input type="text" placeholder="SEARCH..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/40 border border-slate-700/50 rounded-lg py-2 pl-10 pr-4 text-[11px] focus:outline-none focus:border-teal-500/50 uppercase" />
          </div>
          <button onClick={downloadFullReport} className="bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-lg font-black text-[10px] uppercase flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-500/10">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* TOP STATS CARDS */}
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-800/20 border border-slate-700/40 p-4 rounded-xl flex items-center gap-3 hover:bg-slate-800/40 hover:-translate-y-1 transition-all duration-300">
          <div className="bg-blue-400/10 text-blue-400 p-2.5 rounded-lg flex-shrink-0"><Users size={18} /></div>
          <div>
            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Total Students</p>
            <p className="text-lg font-black text-blue-400 leading-none">{totalStudents}</p>
          </div>
        </div>

        <div className="bg-slate-800/20 border border-slate-700/40 p-4 rounded-xl flex items-center gap-3 hover:bg-slate-800/40 hover:-translate-y-1 transition-all duration-300 min-w-0">
          <div className="bg-emerald-400/10 text-emerald-400 p-2.5 rounded-lg flex-shrink-0"><Trophy size={18} /></div>
          <div className="min-w-0 flex-1">
            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Top Performer</p>
            <p className="text-[10px] font-black text-emerald-400 uppercase leading-tight break-words line-clamp-2 italic">
              {topBatch ? topBatch.courseName : "N/A"}
            </p>
          </div>
        </div>

        <div className="bg-slate-800/20 border border-slate-700/40 p-4 rounded-xl flex items-center gap-3 hover:bg-slate-800/40 hover:-translate-y-1 transition-all duration-300 min-w-0">
          <div className="bg-teal-400/10 text-teal-400 p-2.5 rounded-lg flex-shrink-0"><Clock size={18} /></div>
          <div className="min-w-0">
            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Recent Batch</p>
            <p className="text-lg font-black text-teal-400 leading-none uppercase">{latestBatchId}</p>
          </div>
        </div>
      </div>

      {/* BATCH LIST */}
      <div className="relative z-10 max-w-7xl mx-auto space-y-4">
        {filteredData.map((batch, idx) => (
          <div key={batch.batchId} className="group/row bg-slate-800/30 border border-slate-700/40 rounded-xl overflow-hidden hover:border-teal-500/30 hover:shadow-[0_0_20px_rgba(20,184,166,0.05)] transition-all duration-300 animate-in slide-in-from-bottom-2 fade-in" style={{ animationDelay: `${idx * 80}ms` }}>
            <div className="p-5 flex flex-col lg:flex-row items-center gap-6">
              
              <div className="flex items-center gap-4 w-full lg:flex-1 min-w-0">
                <div className="bg-teal-500/10 p-3.5 rounded-lg text-teal-400 group-hover/row:bg-teal-400 group-hover/row:text-slate-900 transition-all duration-300">
                  <GraduationCap size={22} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl font-black uppercase tracking-tight leading-none group-hover/row:text-teal-400 transition-colors">
                    {batch.courseName}
                  </h2>
                  <p className="text-teal-500/50 text-[9px] font-bold mt-1.5 uppercase">
                    {batch.batchId} • {batch.instructorName}
                  </p>
                </div>
              </div>

              <div className="hidden xl:flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-700/20 text-[9px] font-bold text-slate-500 italic">
                <Calendar size={12} className="text-teal-500" />
                {formatDate(batch.startDate)} — {formatDate(batch.endDate)}
              </div>

              <div className="flex items-center justify-between lg:justify-end gap-8 w-full lg:w-auto">
                <div className="flex gap-8 text-center">
                  <div className="transition-transform group-hover/row:scale-110">
                    <p className="text-[8px] text-slate-500 uppercase font-bold mb-1">Attendance</p>
                    <p className="text-xl font-black text-emerald-400 leading-none">
                      {batch.batchAverageAttendancePercentage ?? batch.batchAverageAttendance ?? 0}%
                    </p>
                  </div>
                  <div className="transition-transform group-hover/row:scale-110">
                    <p className="text-[8px] text-slate-500 uppercase font-bold mb-1">Completion</p>
                    <p className="text-xl font-black text-teal-400 leading-none">
                      {batch.batchAverageCompletionPercentage ?? 0}%
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {/* RESTORED DOWNLOAD BUTTON */}
                  <button onClick={() => downloadBatchReport(batch)} className="p-2 bg-slate-700/50 hover:bg-emerald-600 rounded-lg text-slate-300 transition-all hover:scale-110 active:scale-90">
                    <Download size={16} />
                  </button>
                  <button onClick={() => setExpandedBatchId(expandedBatchId === batch.batchId ? null : batch.batchId)} 
                    className={`p-2 rounded-lg transition-all hover:scale-110 ${expandedBatchId === batch.batchId ? 'bg-teal-600 rotate-180' : 'bg-slate-700 hover:bg-slate-600'}`}>
                    <ChevronDown size={18} />
                  </button>
                </div>
              </div>
            </div>
            
            {/* EXPANDED TABLE */}
            {expandedBatchId === batch.batchId && (
              <div className="px-5 pb-5 animate-in slide-in-from-top-2 duration-300 origin-top">
                <div className="bg-slate-950/40 rounded-lg border border-slate-700/30 overflow-hidden">
                  <div className="grid grid-cols-5 text-[8px] text-slate-600 font-black uppercase p-3 border-b border-slate-800 bg-slate-900/40">
                    <div>ID</div><div>STUDENT</div><div className="text-center">SCORE</div><div className="text-center">ATT.</div><div className="text-right pr-2">COMP.</div>
                  </div>
                  {batch.students?.map((s, sIdx) => (
                    <div key={s.studentId} className="grid grid-cols-5 p-3 text-[10px] items-center border-b border-slate-800/20 hover:bg-teal-500/5 transition-all animate-in slide-in-from-left-2" style={{ animationDelay: `${sIdx * 30}ms` }}>
                      <div className="text-teal-600 font-bold group-hover/row:translate-x-1 transition-transform">{s.studentId}</div>
                      <div className="text-slate-400 uppercase truncate pr-2 font-medium group-hover/row:text-white">{s.studentName}</div>
                      <div className="text-center text-slate-200 font-bold">{s.avgScore}</div>
                      <div className="text-center text-emerald-400 font-black">{s.attendancePercentage}%</div>
                      <div className="text-right text-teal-400 font-black pr-2">{s.completionPercentage}%</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReport;