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
import Dashboard from "./pages/Dashboard";
import BatchDetails from './pages/BatchDetails';
import AdminReport from './pages/AdminReport';

 function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="app-container">
        <Routes>
          <Route path="/instructor-dashboard" element={<Dashboard/>}/>
         <Route path="/batch/:id" element={<BatchDetails/>}/>
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

            {/* PERFORMANCE */}
            <Route path="/batch/:batchId" element={<BatchDetails/>}/>
          </Route>
          <Route path="/admin/report" element={<AdminReport />} />

          {/* Route WITHOUT Sidebar/Navbar */}
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;