



// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { getInstructorBatches } from "../services/Api";

// const Dashboard = () => {
//   const [selectedBatch, setSelectedBatch] = React.useState(null);
//   const navigate = useNavigate();

//   const [inputId, setInputId] = useState("");
//   const [searchBatchId, setSearchBatchId] = useState("");
//   const [batches, setBatches] = useState([]);

//   const [instructorDetails, setInstructor] = useState({
//     name: "N/A",
//     email: "N/A",
//     phone: "N/A",
//   });

//   const [stats, setStats] = useState({
//     totalBatches: 0,
//     totalStudents: 0,
//     completionRate: 0,
//     ongoingBatches: 0,
//   });

//   const loadDashboard = async (idToLoad) => {
//     const id = idToLoad || inputId;
//     if (!id) {
//       alert("Please enter an Instructor ID");
//       return;
//     }

//     try {
//       const data = await getInstructorBatches(id);
//       const allBatches = Array.isArray(data) ? data : [];
//       setBatches(allBatches);

//       if (allBatches.length > 0) {
//         setInstructor({
//           name: allBatches[0].instructorName,
//           email: allBatches[0].instructorEmail,
//           phone: allBatches[0].instructorPhone,
//         });
//         // Save ID and a flag so it persists only during active navigation
//         localStorage.setItem("instructorId", id);
//         sessionStorage.setItem("hasSearched", "true");
//       }

//       const totalBatches = allBatches.length;
//       const totalStudents = allBatches.reduce((sum, b) => sum + (b.studentCount || 0), 0);
//       const ongoingBatches = allBatches.filter((b) => b.isActive).length;

//       setStats({
//         totalBatches,
//         totalStudents,
//         completionRate: totalBatches > 0 ? 100 : 0,
//         ongoingBatches,
//       });
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // ✅ Fixed: Only loads if a search was actually performed in this session
//   useEffect(() => {
//     const savedId = localStorage.getItem("instructorId");
//     const hasSearched = sessionStorage.getItem("hasSearched");
    
//     if (savedId && hasSearched) {
//       setInputId(savedId);
//       loadDashboard(savedId);
//     }
//   }, []);

//   return (
//     <div style={{ padding: "20px", fontFamily: "Segoe UI", background: "#f5f7fb", minHeight: "100vh" }}>
//       {/* HEADER */}
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#3c7197ff", padding: "20px", borderRadius: "12px", color: "#fff" }}>
//         <div>
//           <h2 style={{ margin: 0, fontSize: "24px" }}>🎓 EduTrack</h2>
//           <p style={{ margin: 0, fontSize: "13px", opacity: 0.8 }}>An Online Education Platform</p>
//         </div>

//         {/* PROFILE SECTION */}
//         <div style={{ background: "rgba(255,255,255,0.1)", padding: "10px", borderRadius: "12px", minWidth: "180px" }}>
//           <div style={{ textAlign: "center", marginBottom: "6px" }}>
//             <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#fff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", fontWeight: "bold" }}>
//               {instructorDetails.name.charAt(0)}
//             </div>
//             <h3 style={{ margin: "4px 0", fontSize: "14px" }}>{instructorDetails.name}</h3>
//           </div>
//           <div style={{ textAlign: "left", fontSize: "12px" }}>
//             <p style={{ margin: "2px 0" }}><strong>ID:</strong> {inputId || "N/A"}</p>
//             <p style={{ margin: "2px 0" }}>📧 {instructorDetails.email}</p>
//             <p style={{ margin: "2px 0" }}>📞 {instructorDetails.phone}</p>
//           </div>
//         </div>
//       </div>

//       {/* SEARCH BAR (MOVED BACK TO LEFT/TOP AREA) */}
//       <div style={{ marginTop: "20px", display: "flex", gap: "10px", alignItems: "center" }}>
//         <input
//           value={inputId}
//           onChange={(e) => setInputId(e.target.value)}
//           placeholder="Enter Instructor ID"
//           style={{ padding: "10px 15px", borderRadius: "20px", border: "1px solid #ccc", width: "150px" }}
//         />
//         <button
//           onClick={() => loadDashboard()}
//           style={{ padding: "8px 20px", borderRadius: "20px", border: "none", background: "linear-gradient(135deg, #3d68c5ff, #3b82f6)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}
//         >
//           🔍 search
//         </button>

//         {/* Filter input for specific batches */}
//         <input
//           placeholder="Search Batch ID..."
//           value={searchBatchId}
//           onChange={(e) => setSearchBatchId(e.target.value)}
//           style={{ padding: "10px 15px", borderRadius: "20px", border: "1px solid #ccc", width: "200px", marginLeft: "20px" }}
//         />
//       </div>

//       {/* MAIN CONTENT - Only shows after a successful search */}
//       {batches.length > 0 ? (
//         <>
//           <p style={{ marginTop: "25px", textAlign: "center", fontSize: "18px", fontWeight: "600" }}>
//             Welcome back, {instructorDetails.name}!
//           </p>
          
//           <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
//             {[
//               ["📚", "Total Batches", stats.totalBatches],
//               ["🎓", "Total Students", stats.totalStudents],
//               ["📈", "Completion %", stats.completionRate + "%"],
//               ["🚀", "Ongoing", stats.ongoingBatches],
//             ].map(([icon, title, value], i) => (
//               <div key={i} style={{ flex: 1, background: "linear-gradient(135deg, #2563eb, #3b82f6)", color: "#fff", padding: "20px", borderRadius: "16px", textAlign: "center", boxShadow: "0 6px 15px rgba(0,0,0,0.1)" }}>
//                 <div style={{ fontSize: "22px" }}>{icon}</div>
//                 <h3 style={{ fontSize: "14px", opacity: 0.9 }}>{title}</h3>
//                 <h2 style={{ fontSize: "24px", marginTop: "5px" }}>{value}</h2>
//               </div>
//             ))}
//           </div>

//           <h3 style={{ marginTop: "30px", textAlign: "center" }}>Your Batches</h3>
//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginTop: "20px" }}>
//             {batches
//               .filter((b) => b.batchId.toLowerCase().includes(searchBatchId.toLowerCase()))
//               .map((b) => (
//                 <div key={b.batchId} style={{ background: "#fff", borderRadius: "16px", padding: "20px", border: "1px solid #e5e7eb", boxShadow: "0 4px 10px rgba(0,0,0,0.05)" }}>
//                   <h2 style={{ fontSize: "22px", textAlign: "center", marginBottom: "5px" }}>{b.courseName}</h2>
//                   <p style={{ textAlign: "center", fontSize: "12px", color: "#6b7280" }}>Batch ID: {b.batchId}</p>
//                   <button
//                     onClick={() => navigate(`/batch/${b.batchId}`)}
//                     style={{ marginTop: "15px", width: "100%", padding: "10px", borderRadius: "8px", background: "#2563eb", color: "#fff", border: "none", cursor: "pointer" }}
//                   >
//                     View Details →
//                   </button>
//                 </div>
//               ))}
//           </div>
//         </>
//       ) : (
//         <div style={{ textAlign: "center", marginTop: "100px", color: "#9ca3af" }}>
//           <p>Please enter an Instructor ID to view your dashboard.</p>
//         </div>
//       )}

//       <footer style={{ marginTop: "50px", textAlign: "center", fontSize: "12px", color: "#9ca3af" }}>
//         EduTrack © 2026
//       </footer>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getInstructorBatches } from "../services/Api";

const Dashboard = () => {
  const navigate = useNavigate();

  const [inputId, setInputId] = useState("");
  const [searchBatchId, setSearchBatchId] = useState("");
  const [batches, setBatches] = useState([]);
  const [hasSearchedOnce, setHasSearchedOnce] = useState(false);

  const [instructorDetails, setInstructor] = useState({
    name: "N/A",
    email: "N/A",
    phone: "N/A",
  });

  const [stats, setStats] = useState({
    totalBatches: 0,
    totalStudents: 0,
    completionRate: 0,
    ongoingBatches: 0,
  });

  const loadDashboard = async (idToLoad) => {
    try {
      const id = idToLoad || inputId;
      if (!id) {
        alert("Enter Instructor ID");
        return;
      }

      const data = await getInstructorBatches(id);
      const allBatches = Array.isArray(data) ? data : [];
      
      setHasSearchedOnce(true);
      setBatches(allBatches);

      if (allBatches.length > 0) {
        localStorage.setItem("instructorId", id);
        sessionStorage.setItem("hasSearched", "true");

        setInstructor({
          name: allBatches[0].instructorName,
          email: allBatches[0].instructorEmail,
          phone: allBatches[0].instructorPhone,
        });

        const totalBatches = allBatches.length;
        const totalStudents = allBatches.reduce((sum, b) => sum + (b.studentCount || 0), 0);
        const ongoingBatches = allBatches.filter((b) => b.isActive).length;

        setStats({
          totalBatches,
          totalStudents,
          completionRate: totalBatches > 0 ? 100 : 0,
          ongoingBatches,
        });
      } else {
        setInstructor({ name: "Not Found", email: "N/A", phone: "N/A" });
        setStats({ totalBatches: 0, totalStudents: 0, completionRate: 0, ongoingBatches: 0 });
      }
    } catch (err) {
      console.error(err);
      setHasSearchedOnce(true);
    }
  };

  useEffect(() => {
    const savedId = localStorage.getItem("instructorId");
    const sessionActive = sessionStorage.getItem("hasSearched");
    if (savedId && sessionActive) {
      setInputId(savedId);
      loadDashboard(savedId);
    }
  }, []);

  // ✅ PRE-FILTER LOGIC for the message check
  const filteredBatches = batches.filter((b) =>
    b.batchId.toLowerCase().includes(searchBatchId.toLowerCase())
  );

  return (
    <div style={{ padding: "20px", fontFamily: "Segoe UI", background: "#f5f7fb", minHeight: "100vh" }}>
      {/* HEADER SECTION - Matches Image */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#3c7197ff", padding: "20px", borderRadius: "12px", color: "#fff" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "24px" }}>🎓 EduTrack</h2>
          <p style={{ margin: 0, fontSize: "13px", opacity: 0.8 }}>An Online Education Platform</p>
        </div>

        <div style={{ background: "rgba(51, 109, 175, 1)", padding: "10px", borderRadius: "12px", minWidth: "180px" }}>
          <div style={{ textAlign: "center", marginBottom: "6px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#fff", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", fontWeight: "bold" }}>
              {instructorDetails.name.charAt(0)}
            </div>
            <h3 style={{ margin: "4px 0", fontSize: "14px" }}>{instructorDetails.name}</h3>
          </div>
          <div style={{ textAlign: "left", fontSize: "12px" }}>
            <p style={{ margin: "2px 0" }}><strong>ID:</strong> {inputId || "N/A"}</p>
            <p style={{ margin: "2px 0" }}>📧 {instructorDetails.email}</p>
            <p style={{ margin: "2px 0" }}>📞 {instructorDetails.phone}</p>
          </div>
        </div>
      </div>

      {/* SEARCH AREA - Matches Image */}
      <div style={{ marginTop: "20px", display: "flex", gap: "10px", alignItems: "center", justifyContent: 'center' }}>
        <input
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
          placeholder="Enter Instructor ID"
          style={{ padding: "10px 15px", borderRadius: "20px", border: "1px solid #ccc", width: "150px" }}
        />
        <button
          onClick={() => loadDashboard()}
          style={{ padding: "8px 20px", borderRadius: "20px", border: "none", background: "linear-gradient(135deg, #3d68c5ff, #3b82f6)", color: "#fff", cursor: "pointer" }}
        >
          🔍 search
        </button>

        <div style={{ position: "relative", marginLeft: "20px" }}>
            <input
                placeholder="Search Batch ID..."
                value={searchBatchId}
                onChange={(e) => setSearchBatchId(e.target.value)}
                style={{ padding: "10px 40px 10px 15px", width: "200px", borderRadius: "25px", border: "1px solid #ccc", outline: "none", fontSize: "13px" }}
            />
            <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)" }}>🔍</span>
        </div>
      </div>

      {!hasSearchedOnce ? (
        <div style={{ textAlign: "center", marginTop: "100px", color: "#9ca3af" }}>
          <p>Please enter an Instructor ID to view your dashboard.</p>
        </div>
      ) : batches.length > 0 ? (
        <>
          <p style={{ marginTop: "25px", textAlign: "center", fontSize: "16px", fontWeight: "600" }}>
            Welcome back, {instructorDetails.name}!
          </p>
          
          <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
          {[
  ["📚", "Total Batches", stats.totalBatches],
  ["🎓", "Total Students", stats.totalStudents],
  ["📈", "Completion %", stats.completionRate + "%"],
  ["🚀", "Ongoing", stats.ongoingBatches],
].map(([icon, title, value], i) => (
  <div
    key={i}
    className="stat-card" // Use a class for easier hover management if using a CSS file
    style={{
      flex: 1,
      background: "linear-gradient(135deg, #2563eb, #3b82f6)",
      color: "#fff",
      padding: "20px",
      borderRadius: "16px",
      textAlign: "center",
      boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
     // border: "2px solid #000", // ✅ Added Black Margin/Border
      transition: "transform 0.3s ease, box-shadow 0.3s ease", // ✅ Added Animation
      cursor: "pointer"
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-10px)";
    //  e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.2)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
    //  e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.1)";
    }}
  >
    <div style={{ fontSize: "22px" }}>{icon}</div>
    <h3 style={{ fontSize: "14px", opacity: 0.9 }}>{title}</h3>
    <h2 style={{ fontSize: "24px", marginTop: "5px" }}>{value}</h2>
  </div>
))}
          </div>

          <h1 style={{ marginTop: "30px", textAlign: "center", fontSize: "32px", fontWeight: "600" }}>Your Batches</h1>

          {/* ✅ UPDATED SECTION: Handles unassigned/incorrect batch search */}
          {filteredBatches.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginTop: "20px" }}>
            {filteredBatches.map((b) => (
  <div
    key={b.batchId}
    style={{
      background: "#fff",
      borderRadius: "16px",
      padding: "20px",
    //  border: "2px solid #000", 
      boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
      transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)", 
      cursor: "pointer"
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "scale(1.05)"; 
      e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.15)";
      e.currentTarget.style.borderColor = "#2563eb"; 
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "scale(1)";
      e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.05)";
      //e.currentTarget.style.borderColor = "#000";
    }}
  >
    <h2 style={{ fontSize: "28px", textAlign: "center", marginBottom: "5px" }}>{b.courseName}</h2>
    <p style={{ textAlign: "center", fontSize: "12px", color: "#6b7280" }}>Batch ID: {b.batchId}</p>
    
    <button
      onClick={() => navigate(`/batch/${b.batchId}`)}
      style={{
        marginTop: "15px",
        width: "100%",
        padding: "10px",
        borderRadius: "8px",
        background: "#2563eb", // Original Blue
        color: "#fff",
        border: "none",
        cursor: "pointer",
        fontWeight: "bold",
        transition: "background 0.3s ease" // Smooth color transition
      }}
      // ✅ Updated: Changes to black on hover
      onMouseEnter={(e) => e.target.style.background = "#000"} 
      // ✅ Updated: Returns to original blue when mouse leaves
      onMouseLeave={(e) => e.target.style.background = "#2563eb"}
    >
      View Details →
    </button>
  </div>
))}
            </div>
          ) : (
            <div style={{ textAlign: "center", marginTop: "40px", padding: "30px", background: "#fff", borderRadius: "16px", border: "1px dashed #ccc" }}>
              <div style={{ fontSize: "40px", marginBottom: "10px" }}>🔍</div>
              <h3 style={{ color: "#374151" }}>No Matching Batch Found</h3>
              <p style={{ color: "#6b7280" }}>The batch "<strong>{searchBatchId}</strong>" is not assigned to you.</p>
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
          <h3 style={{ color: "#374151" }}>Instructor Not Found</h3>
          <p style={{ color: "#6b7280" }}>We couldn't find any data for ID: {inputId}</p>
        </div>
      )}

      <footer style={{ marginTop: "50px", textAlign: "center", fontSize: "12px", color: "#9ca3af" }}>
        EduTrack © 2026
      </footer>
    </div>
  );
};

export default Dashboard;