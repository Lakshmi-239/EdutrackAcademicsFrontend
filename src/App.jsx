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
import {StudentProfile} from "./pages/StudentProfile";
import Notifications from "./pages/Notifications";
import MyCourses from "./pages/MyCourses";
import StudentAssessmentPage from "./pages/Assessment";
import Attendance from "./pages/Attendance";
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
import { AuthGuard } from './guards/AuthGuard';
//instrcutorreport
import InstructorReportPage from './pages/InstructorReportPage';
import AdminReportPage from "./pages/AdminReportPage";

import 'bootstrap-icons/font/bootstrap-icons.css';
import InstructorDashboard from './pages/InstructorDashboard';
import LayOut from './components/Instructor/Lay_Out';
import InstructorCoursePage from './pages/InstructorCoursePage';
import InstructorAttendancePage from './pages/InstructorAttendancePage';
import InstructorAssessmentPage from './pages/InstructorAssessmentPage';
import InstructorModulePage from './pages/InstructorModulePage';
import ManageQuestionsPage from './components/InstructorAssessment/ManageAssessmentPage';
import SubmissionsPage from './components/InstructorAssessment/SubmissionPage';
import EditQuestionPage from './components/InstructorAssessment/EditQuestionPage';
import AddQuestionPage from './components/InstructorAssessment/AddQuestionPage';
import BatchStudentsPage from './components/InstructorCourse/BatchStudentsPage';

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
          {/* <Route path="/instructor-dashboard" element={<Dashboard/>}/> */}
         {/* <Route path="/batch/:id" element={<BatchDetails/>}/> */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          {/* <Route path="/admin/performance" element={<AdminReportPage />} /> */}
          <Route path="*" element={<div className="p-20 text-center">404 - Not Found</div>} />

          {/* Redirect base URL to the dashboard */}
          {/* <Route path="/" element={<Navigate to="/studentdashboard" />} /> */}

          {/* Admin Dashboard (Internal state handling) */}
          <Route path="/admin/*" element={<AdminPanel />} />

          {/* Student Routes (With Sidebar/Layout) */}
          <Route element={<Layout />}>
            <Route path="/studentdashboard" element={<StudentDashboard />} />
            <Route path="/admin/performance" element={<AdminReportPage />} />
            <Route path="/student-profile" element={<StudentProfile />} />
            <Route path="/courses" element={<MyCourses />} />
            <Route path="/assignments" element={<StudentAssessmentPage />} />
            <Route path="/attendance" element={<Attendance />} />

            <Route path="/instructor-performance" element={<InstructorReportPage />} />

            {/* PERFORMANCE */}
            {/* <Route path="/batch/:batchId" element={<BatchDetails/>}/> */}
          </Route>
          <Route path="/notifications" element={<Notifications />} />
             <Route
              path="/coordinator/*"
              element={
               <AuthGuard>
                <div className="d-flex">
                  <Sidebar />
                  <main className="flex-grow-1 p-4 bg-light">
                    <Routes>
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="programs" element={<Programs />} />
                      <Route path="courses" element={<CoursePage />} />
                      <Route path="instructors" element={<Instructors />} />
                      <Route path="students" element={<Students />} />
                      <Route path="batch" element={<BatchPage />} />
                        <Route path="reports" element={<Reports />} />
                      <Route path="notifications" element={<NotificationPanel />} />
                    </Routes>
                  </main>
                </div>
              </AuthGuard>
              }
            />


          <Route path="/" element={<Navigate to="/instructordashboard" />} />
          <Route element={<LayOut />}>
            <Route path="/instructordashboard" element={<InstructorDashboard />} />
            <Route path="/Icourses" element={<InstructorCoursePage />} />
            <Route path="/Imodules" element={<InstructorModulePage />} />
            <Route path="/Iassessments" element={<InstructorAssessmentPage />} />
            <Route path="/Iattendances" element={<InstructorAttendancePage />} />
            <Route path="/manage-questions/:id" element={<ManageQuestionsPage />} />
            <Route path="/submissions/:id" element={<SubmissionsPage />} />
            <Route path="/edit-question/:questionId" element={<EditQuestionPage />} />
            <Route path="/assessment/:id/add-question" element={<AddQuestionPage />} />
            <Route path="/view-batch-students/:id" element={<BatchStudentsPage />} />
          </Route>

          {/* Route WITHOUT Sidebar/Navbar */}
          
        </Routes>
      </div>
    </AuthProvider>
  );
}
export default App;