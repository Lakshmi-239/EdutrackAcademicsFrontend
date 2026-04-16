


import React, { useState, useEffect, useRef } from "react";
import { api } from "../services/Api";
import { ChevronDown, ChevronUp, GraduationCap, Calendar, Download, Search, X } from "lucide-react";
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
          
          return { 
            ...batch, 
            startDate: dateInfo?.startDate, 
            endDate: dateInfo?.endDate
          };
        });

        mergedData.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
        setReportData(mergedData);
      } catch (err) {
        console.error("Sync Error:", err);
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

  const downloadFullReport = () => {
    const doc = new jsPDF("p", "mm", "a4");
    doc.setFontSize(22);
    doc.setTextColor(20, 185, 129); 
    doc.text("PERFORMANCE DASHBOARD", 14, 20);
    
    let currentY = 40;
    reportData.forEach((batch) => {
      if (currentY > 240) { doc.addPage(); currentY = 20; }
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text(`${batch.courseName} (${batch.batchId})`, 14, currentY);

      autoTable(doc, {
        startY: currentY + 5,
        head: [["ID", "Name", "Score", "Attendance", "Completion"]],
        body: batch.students.map(s => [s.studentId, s.studentName, s.avgScore, `${s.attendancePercentage}%`, `${s.completionPercentage}%`]),
        theme: 'grid',
        headStyles: { fillColor: [16, 185, 129] },
        columnStyles: { 4: { halign: 'right' } }
      });
      currentY = doc.lastAutoTable.finalY + 15;
    });
    doc.save("Full_Dashboard_Report.pdf");
  };

  const downloadBatchReport = (batch) => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["ID", "Name", "Avg Score", "Attendance", "Completion"]],
      body: batch.students.map(s => [s.studentId, s.studentName, s.avgScore, `${s.attendancePercentage}%`, `${s.completionPercentage}%`]),
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] },
      columnStyles: { 4: { halign: 'right' } }
    });
    doc.save(`${batch.batchId}_Report.pdf`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-teal-400 font-black italic">SYNCING...</div>;

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-slate-900 text-white p-8 pt-32 font-sans relative overflow-hidden group/page"
      style={{ "--mouse-x": "0px", "--mouse-y": "0px" }}
    >
      <div 
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500 opacity-0 group-hover/page:opacity-100"
        style={{
          background: `radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(20, 184, 166, 0.1), transparent 80%)`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
        <div className="text-left w-full md:w-auto">
          <h1 className="text-5xl font-black uppercase tracking-tight italic">
            PERFORMANCE <span className="text-teal-400">DASHBOARD</span>
          </h1>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative group/search w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/search:text-teal-400 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Search Course or Batch ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/40 border border-slate-700/50 rounded-full py-3 pl-12 pr-10 text-sm focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/10 transition-all placeholder:text-slate-600 placeholder:font-bold placeholder:uppercase placeholder:text-[9px]"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>

          <button onClick={downloadFullReport} className="whitespace-nowrap flex items-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-3 rounded-full font-black text-xs uppercase shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all active:scale-95">
            <Download size={18} /> Full Dashboard Export
          </button>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-4">
        {filteredData.length > 0 ? (
          filteredData.map((batch) => (
            <div 
              key={batch.batchId} 
              className="group bg-slate-800/40 border border-slate-700/50 rounded-3xl overflow-hidden transition-all duration-300 ease-out hover:border-teal-500/50 hover:bg-slate-800/60 hover:-translate-y-1 hover:shadow-[0_10px_30px_-15px_rgba(20,184,166,0.2)]"
            >
              <div className="h-32 px-8 flex items-center justify-between">
                <div className="flex items-center gap-6 w-[35%]">
                  <div className="bg-teal-500/10 p-4 rounded-2xl text-teal-400 transition-transform duration-300 group-hover:scale-110">
                    <GraduationCap size={28} />
                  </div>
                  <div>
                    <h2 className="text-[20px] font-black uppercase tracking-tighter transition-colors group-hover:text-teal-400">{batch.courseName}</h2>
                    <p className="text-teal-500 text-[10px] font-bold uppercase">{batch.batchId} • {batch.instructorName}</p>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center w-[15%] text-slate-500 font-bold text-[9px] uppercase">
                  <div className="flex items-center gap-2">
                    <Calendar size={12} className="text-teal-500" />
                    <span>{formatDate(batch.startDate)} — {formatDate(batch.endDate)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-12 w-[50%]">
                  <div className="text-center">
                    <p className="text-[8px] text-slate-500 uppercase">Attendance</p>
                    <p className="text-2xl font-black text-emerald-400">{batch.batchAverageAttendance}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[8px] text-slate-500 uppercase">Completion</p>
                    <p className="text-2xl font-black text-teal-400">100%</p>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <button onClick={() => downloadBatchReport(batch)} className="p-2 bg-slate-700 hover:bg-teal-600 rounded-lg text-slate-400 hover:text-white transition-colors">
                      <Download size={14} />
                    </button>
                    <button onClick={() => setExpandedBatchId(expandedBatchId === batch.batchId ? null : batch.batchId)} className={`p-2 rounded-lg transition-colors ${expandedBatchId === batch.batchId ? 'bg-teal-600' : 'bg-slate-700 hover:bg-slate-600'}`}>
                      {expandedBatchId === batch.batchId ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              {expandedBatchId === batch.batchId && (
                <div className="px-8 pb-8">
                  <div className="bg-slate-900/60 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
                    <div className="grid grid-cols-[1fr_3fr_1fr_1fr_1fr] text-[9px] text-slate-500 font-black uppercase tracking-widest bg-slate-950/80 border-b border-slate-700">
                      <div className="px-8 py-5">ID</div>
                      <div className="py-5">Student Name</div>
                      <div className="py-5 text-center">Avg Score</div>
                      <div className="py-5 text-center">Attendance</div>
                      <div className="py-5 text-right px-8">Completion</div>
                    </div>

                    <div className="divide-y divide-slate-800/30">
                      {batch.students?.map((student) => (
                        <div key={student.studentId} className="grid grid-cols-[1fr_3fr_1fr_1fr_1fr] hover:bg-teal-500/5 transition-colors items-center">
                          <div className="px-8 py-4 text-[11px] font-bold text-teal-500/80">{student.studentId}</div>
                          <div className="py-4 text-[11px] font-medium uppercase text-slate-400">{student.studentName}</div>
                          <div className="py-4 text-center text-[11px] font-black text-slate-200">{student.avgScore}</div>
                          <div className="py-4 text-center text-[11px] font-black text-emerald-400">{student.attendancePercentage}%</div>
                          <div className="py-4 text-right px-8 text-teal-500 font-black text-xs">{student.completionPercentage}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-3xl">
             <p className="text-slate-500 font-bold uppercase tracking-widest">No batches found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReport;

