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

 function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="app-container">
        <Routes>
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
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;