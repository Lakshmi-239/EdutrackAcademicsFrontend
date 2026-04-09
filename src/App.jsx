import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { VerifyOtp } from './pages/VerifyOtp';
import { RoleSelection } from './pages/RoleSelection';
import { StudentRegistration } from './components/registration/StudentRegistration';
import {InstructorRegistration} from './components/registration/InstructorRegistration';
import {CoordinatorRegistration} from './components/registration/CoordinatorRegistration';
import { Unauthorized } from './components/Unauthorized';
import { Toaster } from "react-hot-toast";

//import CoordinatorDashboard from './pages/CoordinatorDashboard';
import Layout from "./components/Student/Layout";
import StudentDashboard from "./pages/StudentDashboard";
import Notifications from "./pages/Notifications";
import MyCourses from "./pages/MyCourses";
import StudentAssessmentPage from "./pages/Assessment";
import Attendance from "./pages/Attendance";

//importing Admin Dashboard and its subcomponents
import AdminDashboardPage from './pages/AdminDashboardPage';
import PostQualification from './components/AdminDashBoard/PostQualification';
import PostPrograms from './components/AdminDashBoard/PostPrograms';
import PostAcademicYear from './components/AdminDashBoard/PostAcademicYear';
import PostRules from './components/AdminDashBoard/PostRules';

 function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="app-container">
        <Routes>
          {/* admin routes */}
          <Route path="/admin" element={<AdminDashboardPage />}>
            {/* Index is the default 'dashboard' view */}
          
            <Route path="qualifications" element={<PostQualification />} />
            <Route path="programs" element={<PostPrograms />} />
            <Route path="academic-years" element={<PostAcademicYear />} />
            <Route path="academic-rules" element={<PostRules />} />
          </Route>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RoleSelection />} />
          <Route path="/register/student" element={<StudentRegistration />} />
          <Route path="/register/instructor" element={<InstructorRegistration />} />
          <Route path="/admin/register-coordinator" element={<CoordinatorRegistration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<div className="p-20 text-center">404 - Not Found</div>} />

          {/* Redirect base URL to the dashboard */}
          <Route path="/" element={<Navigate to="/studentdashboard" />} />

          {/* Routes WITH Sidebar/Navbar */}
          <Route element={<Layout />}>
            <Route path="/studentdashboard" element={<StudentDashboard />} />
            <Route path="/courses" element={<MyCourses />} />
            <Route path="/assignments" element={<StudentAssessmentPage />} />
            <Route path="/attendance" element={<Attendance />} />
          </Route>

          {/* Route WITHOUT Sidebar/Navbar */}
          <Route path="/notifications" element={<Notifications />} />


          
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;

// import React, { useState } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import axios from "axios";
// import AdminDashboardPage from "./pages/AdminDashboardPage";
// import 'bootstrap/dist/css/bootstrap.min.css';

// //Centralized API configuration
// export const api = axios.create({
//   baseURL: 'https://localhost:7157/api', 
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json'
//   }
// });
// // export const api = axios.create({
// //   baseURL: 'https://localhost:7157/api', // No trailing slash here
// //   headers: {
// //     'Content-Type': 'application/json',
// //   }
// // });

// function App() {
//   // Global States to share data between components
//   const [qualifications, setQualifications] = useState([]);
//   const [programs, setPrograms] = useState([]);
//   const [academicYearsList, setAcademicYearsList] = useState([]);
  
//   // --- ADDED RULES STATE HERE ---
//   const [rules, setRules] = useState([]);

//   return (
//     <Router>
//       <Routes>
//         <Route 
//           path="/" 
//           element={
//             <AdminDashboardPage 
//               // Passing Qualifications
//               qualifications={qualifications} 
//               setQualifications={setQualifications}
              
//               // Passing Programs
//               programs={programs} 
//               setPrograms={setPrograms}
              
//               // Passing Academic Years
//               academicYearsList={academicYearsList} 
//               setAcademicYearsList={setAcademicYearsList}
              
//               // --- PASSING RULES PROPS HERE ---
//               rules={rules} 
//               setRules={setRules}
//             />
//           } 
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;