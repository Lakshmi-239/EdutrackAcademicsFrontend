// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaBell, FaMoon, FaSun } from "react-icons/fa";

// function Topbar() {
//   const navigate = useNavigate();
//   const [dark, setDark] = useState(false);
//   //const [open, setOpen] = useState(false);
 
//   // Toggle Dark Mode
//   const toggleDark = () => {
//     setDark(!dark);
//     document.body.setAttribute("data-bs-theme", dark ? "light" : "dark");
//   };
 
  

//   return (
//     <div className="d-flex justify-content-between align-items-center bg-white shadow-sm px-4"
//          style={{ height: "60px" }}>

//       {/* Title */}
//       <h5 className="mb-0 fw-bold">EduTrack</h5>

//       {/* Right Section */}
//       <div className="d-flex align-items-center gap-3">

//         {/* Dark Mode */}
//         <span style={{ cursor: "pointer" }} onClick={toggleDark}>
//           {dark ? <FaSun /> : <FaMoon />}
//         </span>

//         {/* Notification */}
//         <button className="btn btn-light">
//           <FaBell  />   {/*size={20} style={{cursor:"pointer"}} onClick={()=>navigate("/notifications")}*/}
//         </button>

//         {/* Profile */}
//         {/* <div className="d-flex align-items-center">
//           <div className="bg-primary text-white rounded-circle px-2 py-1 me-2">
//             ST
//           </div>
//         </div> */}

//         {/* Profile Dropdown using Bootstrap classes */}
//           <div className="dropdown">
//             <div 
//               className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
//               style={{ width: '35px', height: '35px', cursor: 'pointer' }}
//               onClick={() => setShowProfile(!showProfile)}
//             >
//               JS
//             </div>

//             {showProfile && (
//               <div className="dropdown-menu show position-absolute end-0 mt-2 shadow border-0 p-2" style={{ width: '200px' }}>
//                 <h6 className="dropdown-header">My Account</h6>
//                 <div className="dropdown-divider"></div>
//                 <button className="dropdown-item d-flex align-items-center gap-2" onClick={() => navigate("/profile")}>
//                   <FaUser /> Profile
//                 </button>
//                 <div className="dropdown-divider"></div>
//                 <button className="dropdown-item text-danger d-flex align-items-center gap-2" onClick={() => { localStorage.clear(); navigate("/login"); }}>
//                   <FaSignOutAlt /> Logout
//                 </button>
//               </div>
//             )}
//           </div>

//       </div>
//     </div>
//   );
// }



// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaBell, FaMoon, FaSun, FaUser, FaSignOutAlt } from "react-icons/fa"; // Added missing icons

// function Topbar() {
//   const navigate = useNavigate();
//   const [dark, setDark] = useState(false);
//   const [showProfile, setShowProfile] = useState(false); // Add this state back

//   const toggleDark = () => {
//     setDark(!dark);
//     document.body.setAttribute("data-bs-theme", dark ? "light" : "dark");
//   };

//   return (

//     <div className="d-flex justify-content-between align-items-center bg-white shadow-sm px-4"
//          style={{ height: "60px" }}>

//       {/* Title */}
//       <h5 className="mb-0 fw-bold">EduTrack</h5>

//       {/* Right Section */}
//       <div className="d-flex align-items-center gap-3">

//         {/* Dark Mode */}
//         <span style={{ cursor: "pointer" }} onClick={toggleDark}>
//           {dark ? <FaSun /> : <FaMoon />}
//         </span>

//         {/* Notification */}
//         <button className="btn btn-light">
//           <FaBell  size={20} style={{cursor:"pointer"}} onClick={()=>navigate("/notifications")}/>   {/*size={20} style={{cursor:"pointer"}} onClick={()=>navigate("/notifications")}*/}
//         </button>
    
//     <div className="dropdown">
//        <div 
//          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
//          style={{ width: '35px', height: '35px', cursor: 'pointer' }}
//          onClick={() => setShowProfile(!showProfile)} // This was crashing the app
//        >
//          JS
//        </div>
//        {showProfile && (
//               <div className="dropdown-menu show position-absolute end-0 mt-2 shadow border-0 p-2" style={{ width: '200px' }}>
//                 <h6 className="dropdown-header">My Account</h6>
//                 <div className="dropdown-divider"></div>
//                 <button className="dropdown-item d-flex align-items-center gap-2" onClick={() => navigate("/profile")}>
//                   <FaUser /> Profile
//                 </button>
//                 <div className="dropdown-divider"></div>
//                 <button className="dropdown-item text-danger d-flex align-items-center gap-2" onClick={() => { localStorage.clear(); navigate("/login"); }}>
//                   <FaSignOutAlt /> Logout
//                 </button>
//               </div>
//             )}
//        {/* ... rest of dropdown code */}
//     </div>
//     </div>
//     </div>

//   );
// }
// export default Topbar;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaMoon, FaSun, FaUser, FaSignOutAlt } from "react-icons/fa";

function Topbar() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const toggleDark = () => {
    const newDark = !dark;
    setDark(newDark);
    // This is the magic line that flips the Bootstrap variables
    document.body.setAttribute("data-bs-theme", newDark ? "dark" : "light");
  };

  return (
    <div className="d-flex justify-content-between align-items-center bg-body border-bottom px-4 shadow-sm" style={{ height: "60px" }}>
      <h5 className="mb-0 fw-bold text-body">EduTrack</h5>

      <div className="d-flex align-items-center gap-3">
        {/* Dark Mode Toggle */}
        <span className="text-body" style={{ cursor: "pointer" }} onClick={toggleDark}>
          {dark ? <FaSun size={18} /> : <FaMoon size={18} />}
        </span>

        {/* Notifications */}
        <button className="btn btn-link text-body p-0 position-relative" onClick={() => navigate("/notifications")}>
          <FaBell size={20} />
          <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="dropdown position-relative">
          <div 
            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
            style={{ width: '35px', height: '35px', cursor: 'pointer' }}
            onClick={() => setShowProfile(!showProfile)}
          >
            JS
          </div>

          {showProfile && (
            <div className="dropdown-menu show position-absolute end-0 mt-2 shadow border bg-body p-2" style={{ width: '200px', zIndex: 1000 }}>
              <h6 className="dropdown-header">My Account</h6>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item d-flex align-items-center gap-2 text-body" onClick={() => navigate("/profile")}>
                <FaUser /> Profile
              </button>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item text-danger d-flex align-items-center gap-2" onClick={() => { localStorage.clear(); navigate("/login"); }}>
                <FaSignOutAlt /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Topbar;