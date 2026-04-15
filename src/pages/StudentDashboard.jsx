import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BookOpen, 
  Calendar, 
  Award, 
  Video, 
  ArrowRight,
  Clock
} from 'lucide-react';

const StudentDashboard = () => {
  const [stats, setStats] = useState({
    enrolledCount: 0,
    assignmentsDue: 0,
    creditPoints: 0
  });
  const [assignments, setAssignments] = useState([]);
  const [liveSessions, setLiveSessions] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [loading, setLoading] = useState(true);

  const studentId = "S001"; 
  const PROFILE_API = "https://localhost:7157/api/profile";
  const ENROLLMENT_API = "https://localhost:7157/api/Enrollment"; 

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Fetch student profile (name + credits)
        const profileRes = await axios.get(`${PROFILE_API}/Credit-points/${studentId}`);
        setStudentName(profileRes.data.studentName || "Student"); 
        const credits = profileRes.data.totalCredits || 0;

        // 2. Fetch enrolled courses
        const coursesRes = await axios.get(`${ENROLLMENT_API}/my-courses/${studentId}`);
        const enrolledCourses = coursesRes.data.data || [];
        const enrolledCount = enrolledCourses.length;

        // 3. Fetch assignments due
        const assignmentRes = await axios.get(`${PROFILE_API}/Assignment-Due`, {
          params: { studentId: studentId, courseId: "C001" } 
        });

        const assignmentData = assignmentRes.data;
        const assignmentsList = [
          {
            course: assignmentData.coureName,
            dueDate: assignmentData.assignmentDue,
            status: "Pending"
          }
        ];

        setStats({
          enrolledCount,
          assignmentsDue: assignmentsList.length,
          creditPoints: credits,
        });

        setAssignments(assignmentsList);

      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [studentId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-slate-200 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-10">
          <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
            Hello, {studentName} 👋
          </h2>
          <p className="text-slate-400 text-sm font-medium tracking-wide">
            Stay on top of your studies and upcoming sessions.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Enrolled Courses', val: stats.enrolledCount, icon: <BookOpen className="text-emerald-400" /> },
            { label: 'Assignments Due', val: stats.assignmentsDue, icon: <Clock className="text-amber-400" /> },
            { label: 'Credit Points', val: stats.creditPoints, icon: <Award className="text-cyan-400" /> }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl backdrop-blur-md">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-2xl bg-slate-800/50">
                  {item.icon}
                </div>
              </div>
              <h3 className="text-4xl font-black text-white mb-1 tracking-tighter">
                {loading ? '...' : item.val}
              </h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.label}</p>
            </div>
          ))}
        </div>

       {/* Live Sessions */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
                Live Workshops
              </h3>
            </div>

            {/* Medium-sized Join Button */}
            <a
            href="https://teams.microsoft.com/l/meetup-join/19%3ameeting_default_link"
            target="_blank"
            rel="noreferrer"
            className="bg-gradient-to-r from-indigo-600 to-violet-600 
                 hover:from-indigo-500 hover:to-violet-500 
                 text-white px-5 py-2 rounded-lg 
                 text-xs font-bold uppercase tracking-widest 
                 shadow-md shadow-indigo-500/30 transition-all duration-200"
              >
                Join Session
            </a>
          </div>

          {/* Show list of sessions */}
          <div className="space-y-4">
            {liveSessions.map((session, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <Video className="text-indigo-400" size={20} />
              <div>
                <h4 className="text-white font-bold">{session.title}</h4>
                <p className="text-slate-500 text-xs">{session.instructor}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
                {/* Assignments Table */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-md">
          <div className="p-8 border-b border-slate-800">
            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">
              Assignment Deadlines
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/20">
                  <th className="p-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">Course</th>
                  <th className="p-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">Due Date</th>
                  <th className="p-6 text-[10px] font-black text-slate-600 uppercase tracking-widest text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((item, idx) => (
                  <tr key={idx} className="border-t border-slate-800/30">
                    <td className="p-6">
                      <span className="text-sm font-bold text-slate-200">{item.course}</span>
                    </td>
                    <td className="p-6 text-sm font-medium text-slate-500">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {item.dueDate}
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <span
                        className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest border ${
                          item.status === 'Completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                      >
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;