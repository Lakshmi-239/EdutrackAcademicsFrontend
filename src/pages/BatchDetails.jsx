


import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBatchDetails, getBatchClassCount } from "../services/Api";
import { FaTrash, FaEdit, FaUserGraduate, FaClock, FaChartLine, FaCheckCircle, FaTrophy, FaSearch, FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const BatchDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [data, setData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalClasses, setTotalClasses] = useState(1);
  const [syllabusComp, setSyllabusComp] = useState(0);

  const colors = {
    bg: "#020617",
    card: "#0f172a",
    accent: "#3b82f6",
    danger: "#ef4444",
    text: "#f8fafc",
    dim: "#94a3b8",
    border: "#1e293b"
  };

  useEffect(() => { 
    if (id) loadData(); 
  }, [id]);

  const loadData = async () => {
    try {
      const instructorId = localStorage.getItem("instructorId");
      const [batchRes, classCounts, completionRes] = await Promise.all([
        getBatchDetails(id),
        getBatchClassCount(instructorId),
        fetch(`https://localhost:7157/api/Performance/completion-rate/${instructorId}`).then(res => res.json())
      ]);

      setData(batchRes);

      if (Array.isArray(classCounts)) {
        const batchInfo = classCounts.find(b => b.batchId === id);
        setTotalClasses(batchInfo ? batchInfo.totalClasses : 1);
      }

      if (Array.isArray(completionRes)) {
        const batchCompletion = completionRes.find(c => c.batchId === id);
        setSyllabusComp(batchCompletion ? batchCompletion.completion : 0);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  const downloadPDF = () => {
    if (!data) return;
    try {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text("Batch Performance Report", 14, 22);
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Batch ID: ${id} | Completion: ${syllabusComp}%`, 14, 32);
      doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 14, 38);

      const tableColumn = ["ID", "Student Name", "Avg Score", "Comp %", "Attd %"];
      const tableRows = filteredStudents.map(s => [
        s.enrollmentId,
        s.studentName,
        s.avgScore?.toFixed(2),
        `${s.completionPercentage}%`,
        `${s.attendancePercentage}%`
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 45,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] }
      });

      doc.save(`Report_${id}.pdf`);
    } catch (error) {
      console.error("PDF Export Error:", error);
    }
  };

  const filteredStudents = data?.students?.filter(s => 
    s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.enrollmentId.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (!data) return <div style={{color: 'white', padding: '50px'}}>Loading...</div>;

  return (
    <div style={{ backgroundColor: colors.bg, minHeight: "100vh", padding: "40px", color: colors.text }}>
      
      {/* Top Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px' }}>
        <div>
          <button onClick={() => navigate(-1)} style={{ color: colors.dim, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: '10px' }}>← BACK TO DASHBOARD</button>
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>{id} Details</h1>
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); downloadPDF(); }}
          className="download-btn"
          style={{ 
            background: colors.accent, 
            color: "white", 
            border: "none", 
            padding: "12px 20px", 
            borderRadius: "8px", 
            cursor: "pointer", 
            display: "flex", 
            alignItems: "center", 
            gap: "10px", 
            fontWeight: "bold",
            transition: "0.3s"
          }}
        >
          <FaDownload /> Export Report
        </button>
      </div>

      {/* Search Bar Row */}
      <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ position: 'relative', width: '350px' }}>
          <FaSearch style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: colors.dim }} />
          <input 
            type="text" 
            placeholder="Search by ID or Name..." 
            className="search-input"
            style={{ width: '100%', padding: '12px 15px 12px 45px', borderRadius: '10px', background: colors.card, border: `1px solid ${colors.border}`, color: 'white', outline: 'none', transition: '0.3s' }}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Cards with Hover */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "15px", marginBottom: "40px" }}>
        {[
          { label: "ENROLLED", value: data.students?.length, icon: <FaUserGraduate /> },
          { label: "CLASSES", value: totalClasses, icon: <FaClock /> },
          { label: "ATTENDANCE", value: `${data.batchAverageAttendance}%`, icon: <FaChartLine /> },
          { label: "SYLLABUS", value: `${syllabusComp}%`, icon: <FaCheckCircle /> },
          { label: "TOPPER", value: data.students?.[0]?.studentName.split(' ')[0] || "N/A", icon: <FaTrophy /> }
        ].map((item, i) => (
          <div key={i} className="mini-stats-card" style={{ background: colors.card, padding: "20px", borderRadius: "12px", border: `1px solid ${colors.border}`, textAlign: "center", transition: "0.3s" }}>
            <div style={{ color: colors.accent, marginBottom: "8px", fontSize: '18px' }}>{item.icon}</div>
            <p style={{ fontSize: "10px", color: colors.dim, margin: 0, fontWeight: 'bold' }}>{item.label}</p>
            <h3 style={{ margin: "5px 0 0 0", fontSize: '20px' }}>{item.value}</h3>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: colors.card, borderRadius: "12px", border: `1px solid ${colors.border}`, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ color: colors.dim, fontSize: "11px", borderBottom: `1px solid ${colors.border}`, textAlign: 'left', background: '#1e293b' }}>
              <th style={{ padding: "15px" }}>ENROLL ID</th>
              <th style={{ padding: "15px" }}>NAME</th>
              <th style={{ padding: "15px", textAlign: 'center' }}>AVG SCORE</th>
              <th style={{ padding: "15px", textAlign: 'center' }}>COMPLETION</th>
              <th style={{ padding: "15px", textAlign: 'center' }}>ATTENDANCE</th>
              <th style={{ padding: "15px", textAlign: 'center' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s) => (
              <tr key={s.enrollmentId} className="table-row" style={{ borderBottom: `1px solid ${colors.border}`, transition: "0.2s" }}>
                <td style={{ padding: "15px", color: colors.dim }}>{s.enrollmentId}</td>
                <td style={{ padding: "15px", fontWeight: "600" }}>{s.studentName}</td>
                <td style={{ padding: "15px", textAlign: "center", color: colors.accent, fontWeight: "bold" }}>{s.avgScore?.toFixed(2)}</td>
                <td style={{ padding: "15px", textAlign: "center" }}>{s.completionPercentage}%</td>
                <td style={{ padding: "15px", textAlign: "center" }}>{s.attendancePercentage}%</td>
                <td style={{ padding: "15px", textAlign: "center" }}>
                   <button className="action-btn-edit" style={{ background: 'none', border: 'none', color: colors.accent, cursor: 'pointer', marginRight: '10px', transition: '0.2s' }}><FaEdit /></button>
                   <button className="action-btn-del" style={{ background: 'none', border: 'none', color: colors.danger, cursor: 'pointer', transition: '0.2s' }}><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .download-btn:hover { background: #2563eb !important; transform: scale(1.05); box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4); }
        .search-input:focus { border-color: ${colors.accent} !important; box-shadow: 0 0 10px rgba(59, 130, 246, 0.2); }
        .mini-stats-card:hover { transform: scale(1.05); background: #1e293b; border-color: ${colors.accent} !important; }
        .table-row:hover { background-color: #1e293b; padding-left: 10px; }
        .action-btn-edit:hover { transform: scale(1.3); color: white !important; }
        .action-btn-del:hover { transform: scale(1.3); color: white !important; }
      `}</style>
    </div>
  );
};

export default BatchDetails;



