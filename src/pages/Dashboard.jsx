


// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { 
//   getInstructorBatches, 
//   getBatchClassCount, 
//   getBatchStartDates 
// } from "../services/Api";
// import { FaSearch } from "react-icons/fa";
// import axios from "axios";

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const [inputId, setInputId] = useState("");
//   const [batchSearchTerm, setBatchSearchTerm] = useState(""); 
//   const [batches, setBatches] = useState([]);
//   const [hasSearchedOnce, setHasSearchedOnce] = useState(false);

//   const [instructorDetails, setInstructor] = useState({ name: "N/A", email: "N/A", phone: "N/A" });
//   const [stats, setStats] = useState({ totalBatches: 0, totalStudents: 0, totalClasses: 0, ongoingBatches: 0 });

//   const colors = {
//     background: "#020617", 
//     cardBg: "#0f172a",      
//     accent: "#3b82f6",      
//     textMain: "#f8fafc",   
//     textDim: "#94a3b8",     
//     border: "#1e293b"       
//   };

//   const loadDashboard = async (idToLoad) => {
//     try {
//       const id = idToLoad || inputId;
//       if (!id) return;

//       const [batchData, classCountData, dateData] = await Promise.all([
//         getInstructorBatches(id),
//         getBatchClassCount(id),
//         getBatchStartDates()
//       ]);

//       const completionRes = await axios.get(`https://localhost:7157/api/Performance/completion-rate/${id}`);
//       const completionList = Array.isArray(completionRes.data) ? completionRes.data : [];

//       let allBatches = Array.isArray(batchData) ? batchData : [];
//       const allDates = Array.isArray(dateData) ? dateData : [];
      
//       const mappedBatches = allBatches.map(batch => {
//         const dateRecord = allDates.find(d => d.batchId === batch.batchId);
//         const performanceRecord = completionList.find(c => c.batchId === batch.batchId);
        
//         return {
//           ...batch,
//           startDate: dateRecord ? dateRecord.startDate : null,
//           displayProgress: performanceRecord ? performanceRecord.completion : 0 
//         };
//       });

//       // --- SORTING LOGIC START ---
//       // Sorts by date: Upcoming/Today's batches at the top, older ones at the bottom
//       const sortedBatches = mappedBatches.sort((a, b) => {
//         const dateA = new Date(a.startDate || 0);
//         const dateB = new Date(b.startDate || 0);
//         return dateB - dateA; // Descending order: Newest/Today first
//       });
//       // --- SORTING LOGIC END ---

//       setBatches(sortedBatches);
//       setHasSearchedOnce(true);

//       if (sortedBatches.length > 0) {
//         localStorage.setItem("instructorId", id);
//         sessionStorage.setItem("hasSearched", "true");
//         setInstructor({
//           name: sortedBatches[0].instructorName,
//           email: sortedBatches[0].instructorEmail,
//           phone: sortedBatches[0].instructorPhone,
//         });
//         setStats({
//           totalBatches: sortedBatches.length,
//           totalStudents: sortedBatches.reduce((sum, b) => sum + (b.studentCount || 0), 0),
//           totalClasses: Array.isArray(classCountData) ? classCountData.reduce((sum, item) => sum + (item.totalClasses || 0), 0) : 0,
//           ongoingBatches: sortedBatches.filter((b) => b.isActive).length,
//         });
//       }
//     } catch (err) {
//       console.error("Load Error:", err);
//     }
//   };

//   useEffect(() => {
//     const savedId = localStorage.getItem("instructorId");
//     if (savedId) {
//       setInputId(savedId);
//       loadDashboard(savedId);
//     }
//   }, []);

//   const filteredBatches = batches.filter((b) =>
//     (b.courseName || "").toLowerCase().includes(batchSearchTerm.toLowerCase()) ||
//     (b.batchId || "").toLowerCase().includes(batchSearchTerm.toLowerCase())
//   );

//   return (
//     <div style={{ padding: "20px", background: colors.background, minHeight: "100vh", color: colors.textMain, fontFamily: 'sans-serif' }}>
      
//       <div style={{ display: "flex", gap: "10px", justifyContent: 'center', marginBottom: "30px" }}>
//         <input
//           value={inputId}
//           onChange={(e) => setInputId(e.target.value)}
//           placeholder="Instructor ID"
//           style={{ padding: "12px", borderRadius: "25px", border: `1px solid ${colors.border}`, background: colors.cardBg, color: "#fff", outline: 'none' }}
//         />
//         <button onClick={() => loadDashboard()} className="search-btn" style={{ padding: "10px 25px", borderRadius: "25px", background: colors.accent, color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}>
//           Search
//         </button>
//       </div>

//       {hasSearchedOnce && (
//         <div className="fade-in">
//           <div style={{ display: "flex", gap: "15px", marginBottom: "40px" }}>
//             {[["📚", "Batches", stats.totalBatches], ["🎓", "Students", stats.totalStudents], ["⏰", "Classes", stats.totalClasses], ["🚀", "Ongoing", stats.ongoingBatches]].map(([icon, title, val], i) => (
//               <div key={i} className="stat-card" style={{ flex: 1, background: colors.cardBg, padding: "20px", borderRadius: "15px", border: `1px solid ${colors.border}`, textAlign: "center", transition: '0.3s' }}>
//                 <div style={{ fontSize: "20px" }}>{icon}</div>
//                 <div style={{ fontSize: "10px", color: colors.textDim }}>{title}</div>
//                 <div style={{ fontSize: "24px", color: colors.accent, fontWeight: 'bold' }}>{val}</div>
//               </div>
//             ))}
//           </div>

//           <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Your Batches</h2>

//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
//             {filteredBatches.map((b) => (
//               <div key={b.batchId} className="batch-card" style={{ background: colors.cardBg, padding: "25px", borderRadius: "20px", border: `1px solid ${colors.border}`, transition: '0.4s' }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                   <h3>{b.courseName}</h3>
//                   <span style={{ fontSize: '11px', color: colors.accent, fontWeight: 'bold' }}>
//                     {b.startDate ? new Date(b.startDate).toLocaleDateString() : 'Not Yet Started'}
//                   </span>
//                 </div>
//                 <p style={{ color: colors.textDim, fontSize: '12px' }}>ID: {b.batchId}</p>
                
//                 <div style={{ margin: "20px 0" }}>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px' }}>
//                     <span>Syllabus Completion</span>
//                     <span style={{ color: colors.accent, fontWeight: 'bold' }}>{b.displayProgress}%</span>
//                   </div>
//                   <div style={{ width: "100%", background: "#1e293b", height: "10px", borderRadius: "5px", overflow: "hidden" }}>
//                     <div className="progress-fill" style={{ 
//                       width: `${b.displayProgress}%`, 
//                       background: `linear-gradient(90deg, ${colors.accent}, #60a5fa)`, 
//                       height: "100%", 
//                       transition: "width 2s ease-in-out" 
//                     }} />
//                   </div>
//                 </div>

//                 <button className="view-btn" onClick={() => navigate(`/batch/${b.batchId}`)} style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "transparent", color: colors.accent, border: `1px solid ${colors.accent}`, fontWeight: "bold", cursor: "pointer", transition: '0.3s' }}>
//                   View Full Details
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       <style>{`
//         @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
//         .fade-in { animation: fadeIn 0.5s ease-out; }
//         .stat-card:hover { transform: translateY(-5px); border-color: ${colors.accent} !important; background: #1e293b !important; }
//         .batch-card:hover { transform: translateY(-8px); border-color: ${colors.accent} !important; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
//         .view-btn:hover { background: ${colors.accent} !important; color: white !important; }
//         .search-btn:hover { filter: brightness(1.2); box-shadow: 0 0 15px ${colors.accent}44; }
//         .progress-fill { position: relative; box-shadow: 0 0 8px ${colors.accent}88; }
//       `}</style>
//     </div>
//   );
// };

// export default Dashboard;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  getInstructorBatches, 
  getBatchClassCount, 
  getBatchStartDates 
} from "../services/Api";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
// IMPORTING NAVBAR AND FOOTER
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const Dashboard = () => {
  const navigate = useNavigate();
  const [inputId, setInputId] = useState("");
  const [batchSearchTerm, setBatchSearchTerm] = useState(""); 
  const [batches, setBatches] = useState([]);
  const [hasSearchedOnce, setHasSearchedOnce] = useState(false);

  const [instructorDetails, setInstructor] = useState({ name: "N/A", email: "N/A", phone: "N/A" });
  const [stats, setStats] = useState({ totalBatches: 0, totalStudents: 0, totalClasses: 0, ongoingBatches: 0 });

  const colors = {
    background: "#020617", 
    cardBg: "#0f172a",      
    accent: "#3b82f6",      
    textMain: "#f8fafc",   
    textDim: "#94a3b8",     
    border: "#1e293b"       
  };

  const loadDashboard = async (idToLoad) => {
    try {
      const id = idToLoad || inputId;
      if (!id) return;

      const [batchData, classCountData, dateData] = await Promise.all([
        getInstructorBatches(id),
        getBatchClassCount(id),
        getBatchStartDates()
      ]);

      const completionRes = await axios.get(`https://localhost:7157/api/Performance/completion-rate/${id}`);
      const completionList = Array.isArray(completionRes.data) ? completionRes.data : [];

      let allBatches = Array.isArray(batchData) ? batchData : [];
      const allDates = Array.isArray(dateData) ? dateData : [];
      
      const mappedBatches = allBatches.map(batch => {
        const dateRecord = allDates.find(d => d.batchId === batch.batchId);
        const performanceRecord = completionList.find(c => c.batchId === batch.batchId);
        
        return {
          ...batch,
          startDate: dateRecord ? dateRecord.startDate : null,
          displayProgress: performanceRecord ? performanceRecord.completion : 0 
        };
      });

      const sortedBatches = mappedBatches.sort((a, b) => {
        const dateA = new Date(a.startDate || 0);
        const dateB = new Date(b.startDate || 0);
        return dateB - dateA;
      });

      setBatches(sortedBatches);
      setHasSearchedOnce(true);

      if (sortedBatches.length > 0) {
        localStorage.setItem("instructorId", id);
        sessionStorage.setItem("hasSearched", "true");
        setInstructor({
          name: sortedBatches[0].instructorName,
          email: sortedBatches[0].instructorEmail,
          phone: sortedBatches[0].instructorPhone,
        });
        setStats({
          totalBatches: sortedBatches.length,
          totalStudents: sortedBatches.reduce((sum, b) => sum + (b.studentCount || 0), 0),
          totalClasses: Array.isArray(classCountData) ? classCountData.reduce((sum, item) => sum + (item.totalClasses || 0), 0) : 0,
          ongoingBatches: sortedBatches.filter((b) => b.isActive).length,
        });
      }
    } catch (err) {
      console.error("Load Error:", err);
    }
  };

  useEffect(() => {
    const savedId = localStorage.getItem("instructorId");
    if (savedId) {
      setInputId(savedId);
      loadDashboard(savedId);
    }
  }, []);

  const filteredBatches = batches.filter((b) =>
    (b.courseName || "").toLowerCase().includes(batchSearchTerm.toLowerCase()) ||
    (b.batchId || "").toLowerCase().includes(batchSearchTerm.toLowerCase())
  );

  return (
    <div style={{ background: colors.background, minHeight: "100vh", color: colors.textMain, fontFamily: 'sans-serif' }}>
      {/* NAVBAR ADDED HERE */}
      <Navbar />

      <div style={{ padding: "100px 20px 40px 20px", maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Instructor ID Search */}
        <div style={{ display: "flex", gap: "10px", justifyContent: 'center', marginBottom: "30px" }}>
          <input
            value={inputId}
            onChange={(e) => setInputId(e.target.value)}
            placeholder="Instructor ID"
            style={{ padding: "12px", borderRadius: "25px", border: `1px solid ${colors.border}`, background: colors.cardBg, color: "#fff", outline: 'none' }}
          />
          <button onClick={() => loadDashboard()} className="search-btn" style={{ padding: "10px 25px", borderRadius: "25px", background: colors.accent, color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" }}>
            Search
          </button>
        </div>

        {hasSearchedOnce && (
          <div className="fade-in">
            {/* KPI Cards */}
            <div style={{ display: "flex", gap: "15px", marginBottom: "40px", flexWrap: 'wrap' }}>
              {[["📚", "Batches", stats.totalBatches], ["🎓", "Students", stats.totalStudents], ["⏰", "Classes", stats.totalClasses], ["🚀", "Ongoing", stats.ongoingBatches]].map(([icon, title, val], i) => (
                <div key={i} className="stat-card" style={{ flex: "1 1 200px", background: colors.cardBg, padding: "20px", borderRadius: "15px", border: `1px solid ${colors.border}`, textAlign: "center", transition: '0.3s' }}>
                  <div style={{ fontSize: "20px" }}>{icon}</div>
                  <div style={{ fontSize: "10px", color: colors.textDim }}>{title}</div>
                  <div style={{ fontSize: "24px", color: colors.accent, fontWeight: 'bold' }}>{val}</div>
                </div>
              ))}
            </div>

            <h2 style={{ textAlign: 'center', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '2px' }}>Your Batches</h2>

            {/* Batch Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
              {filteredBatches.map((b) => (
                <div key={b.batchId} className="batch-card" style={{ background: colors.cardBg, padding: "25px", borderRadius: "20px", border: `1px solid ${colors.border}`, transition: '0.4s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3 style={{ margin: 0 }}>{b.courseName}</h3>
                    <span style={{ fontSize: '11px', color: colors.accent, fontWeight: 'bold' }}>
                      {b.startDate ? new Date(b.startDate).toLocaleDateString() : 'Not Yet Started'}
                    </span>
                  </div>
                  <p style={{ color: colors.textDim, fontSize: '12px' }}>ID: {b.batchId}</p>
                  
                  <div style={{ margin: "20px 0" }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px' }}>
                      <span>Syllabus Completion</span>
                      <span style={{ color: colors.accent, fontWeight: 'bold' }}>{b.displayProgress}%</span>
                    </div>
                    <div style={{ width: "100%", background: "#1e293b", height: "10px", borderRadius: "5px", overflow: "hidden" }}>
                      <div className="progress-fill" style={{ 
                        width: `${b.displayProgress}%`, 
                        background: `linear-gradient(90deg, ${colors.accent}, #60a5fa)`, 
                        height: "100%", 
                        transition: "width 2s ease-in-out" 
                      }} />
                    </div>
                  </div>

                  <button className="view-btn" onClick={() => navigate(`/batch/${b.batchId}`)} style={{ width: "100%", padding: "12px", borderRadius: "10px", background: "transparent", color: colors.accent, border: `1px solid ${colors.accent}`, fontWeight: "bold", cursor: "pointer", transition: '0.3s' }}>
                    View Full Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER ADDED HERE */}
      <Footer />

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.5s ease-out; }
        .stat-card:hover { transform: translateY(-5px); border-color: ${colors.accent} !important; background: #1e293b !important; }
        .batch-card:hover { transform: translateY(-8px); border-color: ${colors.accent} !important; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .view-btn:hover { background: ${colors.accent} !important; color: white !important; }
        .search-btn:hover { filter: brightness(1.2); box-shadow: 0 0 15px ${colors.accent}44; }
        .progress-fill { position: relative; box-shadow: 0 0 8px ${colors.accent}88; }
      `}</style>
    </div>
  );
};

export default Dashboard;