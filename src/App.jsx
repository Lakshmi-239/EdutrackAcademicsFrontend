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
<<<<<<< HEAD
// import Dashboard from "./pages/Dashboard";
// import BatchDetails from './pages/BatchDetails';
// import AdminReport from './pages/AdminReport';
=======
//Coordinator 
import Sidebar from "./components/Coordinator/Sidebar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Programs from "./pages/Programs.jsx";
import CoursePage from "./pages/CoursePage.jsx";
import NotificationPanel from './components/Coordinator/NotificationPanel.jsx';

import Instructors from "./pages/Instructors.jsx";
import Students from "./pages/Students.jsx";
import Reports from "./pages/Reports.jsx";
import BatchPage from "./pages/BatchPage.jsx";

>>>>>>> dba063437442e1f7e3efd626a55a98502fd98adf

 function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="app-container">
        <Routes>
          {/* <Route path="/instructor-dashboard" element={<Dashboard/>}/> */}
         {/* <Route path="/batch/:id" element={<BatchDetails/>}/> */}
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
          {/* <Route path="/" element={<Navigate to="/studentdashboard" />} /> */}

          {/* Routes WITH Sidebar/Navbar */}
          <Route element={<Layout />}>
            <Route path="/studentdashboard" element={<StudentDashboard />} />
            <Route path="/courses" element={<MyCourses />} />
            <Route path="/assignments" element={<StudentAssessmentPage />} />
            <Route path="/attendance" element={<Attendance />} />

            {/* PERFORMANCE */}
            {/* <Route path="/batch/:batchId" element={<BatchDetails/>}/> */}
          </Route>
<<<<<<< HEAD
          {/* <Route path="/admin/report" element={<AdminReport />} /> */}
=======
          <Route path="/notifications" element={<Notifications />} />
             <Route
              path="/coordinator/*"
              element={
                <div className="d-flex">
                  <Sidebar />
                  <main className="flex-grow-1 p-4 bg-light">
                    <Routes>
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="programs" element={<Programs />} />
                      <Route path="courses" element={<CoursePage />} />
                    
                      <Route path="instructors" element={<Instructors />} />
                      <Route path="students" element={<Students />} />
                      <Route path="reports" element={<Reports />} />
                      <Route path="batch" element={<BatchPage />} />
                      <Route path="notifications" element={<NotificationPanel />} />
                    </Routes>
                  </main>
                </div>
              }
            />

>>>>>>> dba063437442e1f7e3efd626a55a98502fd98adf

          {/* Route WITHOUT Sidebar/Navbar */}
          
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;