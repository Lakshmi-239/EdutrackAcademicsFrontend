import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 
import { Toaster } from "react-hot-toast";

// Page Imports
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { VerifyOtp } from './pages/VerifyOtp';
import { RoleSelection } from './pages/RoleSelection';
import { Unauthorized } from './components/Unauthorized';

// Registration Imports
import { StudentRegistration } from './components/registration/StudentRegistration';
import { InstructorRegistration } from './components/registration/InstructorRegistration';
import { CoordinatorRegistration } from './components/registration/CoordinatorRegistration';

// Admin Imports
import AdminSidebar from "./components/Admin/AdminSidebar.jsx";
import QualificationManager from "./components/Admin/QualificationManager.jsx";
import ProgramManager from "./components/Admin/ProgramManager.jsx";
import AcademicYearManager from "./components/Admin/AcademicYearManager.jsx";
import AcademicRulesManager from './components/Admin/AcademicRulesManager.jsx';

// Student Imports
import Layout from "./components/Student/Layout";
import StudentDashboard from "./pages/StudentDashboard";
import Notifications from "./pages/Notifications";
import MyCourses from "./pages/MyCourses";
import StudentAssessmentPage from "./pages/Assessment";
import Attendance from "./pages/Attendance";

import 'bootstrap/dist/css/bootstrap.min.css';

// Separate Admin Panel Component to keep App.js clean
const AdminPanel = () => {
  const [view, setView] = useState('qualifications');

  return (
    <div className="App" style={{ display: 'flex' }}>
      <AdminSidebar onSelect={setView} activeView={view} />
      <div style={{ flex: 1, padding: '20px' }}>
        {view === 'qualifications' && <QualificationManager />}
        {view === 'programs' && <ProgramManager />}
        {view === 'academicYears' && <AcademicYearManager />}
        {view === 'academicRules' && <AcademicRulesManager />}
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="app-container">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Registration Routes */}
          <Route path="/register" element={<RoleSelection />} />
          <Route path="/register/student" element={<StudentRegistration />} />
          <Route path="/register/instructor" element={<InstructorRegistration />} />
          <Route path="/admin/register-coordinator" element={<CoordinatorRegistration />} />

          {/* Admin Dashboard (Internal state handling) */}
          <Route path="/admin/*" element={<AdminPanel />} />

          {/* Student Routes (With Sidebar/Layout) */}
          <Route element={<Layout />}>
            <Route path="/studentdashboard" element={<StudentDashboard />} />
            <Route path="/courses" element={<MyCourses />} />
            <Route path="/assignments" element={<StudentAssessmentPage />} />
            <Route path="/attendance" element={<Attendance />} />
          </Route>

          {/* Notifications (No Sidebar) */}
          <Route path="/notifications" element={<Notifications />} />

          {/* Fallback 404 */}
          <Route path="*" element={<div className="p-20 text-center">404 - Not Found</div>} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;