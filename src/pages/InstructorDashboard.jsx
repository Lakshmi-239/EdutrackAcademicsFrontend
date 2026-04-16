import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { api } from '../services/Api'; 
import { GraduationCap, Video, Calendar as CalendarIcon, FileText, CheckCircle, Users, Layout } from 'lucide-react';

const InstructorDashboard = () => {
  const navigate = useNavigate(); 
  const [curriculumData, setCurriculumData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [todaysDeadlines, setTodaysDeadlines] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date()); 
  
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeCourses: 0,
    activeAssessments: 0,
    totalModules: 0
  });

  const instructorId = "I003";
  const today = new Date();
  const currentMonth = today.toLocaleString('default', { month: 'long' });
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, today.getMonth() + 1, 0).getDate();
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const fetchDeadlinesByDate = async (date) => {
    try {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;
      
      const response = await api.getAssessmentsByDate(dateStr); 
      const data = response.data || response;
      setTodaysDeadlines(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching date-specific assessments:", err);
      setTodaysDeadlines([]);
    }
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await api.getInstructorCurriculumData(instructorId);
        const safeData = Array.isArray(data) ? data : [];
        setCurriculumData(safeData);

        await fetchDeadlinesByDate(new Date());

        const totals = safeData.reduce((acc, curr) => {
          acc.totalStudents += curr.currentStudents || 0;
          acc.activeAssessments += curr.totalAssessments || 0;
          acc.totalModules += curr.totalModules || 0;
          return acc;
        }, { totalStudents: 0, activeAssessments: 0, totalModules: 0 });

        setStats({
          totalStudents: totals.totalStudents,
          activeCourses: safeData.length,
          activeAssessments: totals.activeAssessments,
          totalModules: totals.totalModules
        });
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [instructorId]);

  const handleDateClick = (dayNumber) => {
    const newDate = new Date(currentYear, today.getMonth(), dayNumber);
    setSelectedDate(newDate);
    fetchDeadlinesByDate(newDate);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-slate-950">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-400"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#060b13] text-white pt-8 pb-12 px-6 lg:px-10">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight">
          Hi <span className="text-teal-400">Jyothirmyee,</span>
        </h2>
      </div>

      {/* CURRICULUM OVERVIEW CARD */}
      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-[1.5rem] p-6 mb-10 shadow-2xl">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-teal-500/10 rounded-xl flex items-center justify-center border border-teal-500/20">
              <GraduationCap className="text-teal-400 w-6 h-6" />
            </div>
            <h5 className="text-xl font-bold tracking-tight text-slate-100">Curriculum Overview</h5>
          </div>
          
          <button 
            className="group flex items-center round-pill gap-2.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-pill transition-all duration-300 shadow-lg shadow-indigo-600/20 active:scale-95"
            onClick={() => window.open('https://teams.microsoft.com/l/meetup-join/YOUR_TEAMS_LINK', '_blank')}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-400"></span>
            </span>
            Go Live Session
            <Video className="w-4 h-4 ml-0.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-2 table-fixed">
            <thead>
              <tr className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black">
                <th className="px-4 pb-2 text-left w-1/4">Course Name</th>
                <th className="px-4 pb-2 text-center w-1/6">Batch</th>
                <th className="px-4 pb-2 text-center w-1/6">Modules</th>
                <th className="px-4 pb-2 text-center w-1/6">Assessments</th>
                <th className="px-4 pb-2 text-center w-1/6">Students</th>
              </tr>
            </thead>
            <tbody className="text-slate-200 font-semibold text-sm">
              {curriculumData.map((item, index) => (
                <tr key={index} className="group">
                  <td className="bg-slate-800/40 border-y border-l border-slate-800/50 py-4 px-6 rounded-l-xl">
                    {item.courseName}
                  </td>
                  <td className="bg-slate-800/40 border-y border-slate-800/50 py-4 px-4 text-center">
                    <span className="px-3 py-1 bg-slate-900 border border-slate-700 text-slate-400 rounded-full text-[10px] font-bold">
                      {item.batchId}
                    </span>
                  </td>
                  <td className="bg-slate-800/40 border-y border-slate-800/50 py-4 px-4 text-center text-slate-300">
                    {item.totalModules} Units
                  </td>
                  <td className="bg-slate-800/40 border-y border-slate-800/50 py-4 px-4 text-center">
                    <span className="text-teal-400 inline-flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf]"></span>
                      {item.totalAssessments} Active
                    </span>
                  </td>
                  <td className="bg-slate-800/40 border-y border-r border-slate-800/50 py-4 px-6 rounded-r-xl text-center">
                    <span className="text-slate-100">{item.currentStudents}</span>
                    <span className="text-slate-500 mx-1">/</span>
                    <span className="text-slate-500">{item.batchSize}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* CALENDAR SECTION */}
        <div className="lg:col-span-4">
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-[1.5rem] p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h6 className="text-lg font-bold text-slate-100 tracking-tight">{currentMonth} {currentYear}</h6>
              <CalendarIcon className="w-5 h-5 text-teal-400" />
            </div>
            
            <div className="grid grid-cols-7 text-center mb-4 text-slate-500 font-black text-[0.6rem] uppercase tracking-widest">
              {['S','M','T','W','T','F','S'].map(d => <div key={d}>{d}</div>)}
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {calendarDays.map(day => {
                const isSelected = day === selectedDate.getDate();
                const isToday = day === today.getDate() && selectedDate.getMonth() === today.getMonth();
                
                return (
                  <button 
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`aspect-square flex items-center justify-center rounded-pill text-xs font-bold transition-all duration-300
                      ${isSelected 
                        ? 'bg-teal-500 text-slate-950 shadow-md scale-105' 
                        : isToday 
                          ? 'border border-teal-500/50 text-teal-400 bg-teal-500/5' 
                          : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* DEADLINES LIST SECTION */}
        <div className="lg:col-span-8">
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-[1.5rem] p-6 min-h-[300px] shadow-xl">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <Layout className="w-5 h-5 text-indigo-400" />
                <h5 className="text-lg font-bold text-slate-100 tracking-tight">Assessments Ending</h5>
              </div>
              <div className="px-3 py-1 bg-slate-800 border border-slate-700 text-teal-400 text-[9px] font-black uppercase tracking-widest rounded-full">
                {selectedDate.getDate()} {currentMonth}
              </div>
            </div>

            {todaysDeadlines.length > 0 ? (
              <div className="space-y-3">
                {todaysDeadlines.map((item, idx) => (
                  <div key={idx} className="group flex flex-wrap items-center p-4 bg-slate-800/20 border border-slate-800/50 rounded-xl hover:border-teal-500/40 transition-all duration-300">
                    <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center mr-4 group-hover:scale-105 transition-all">
                      <FileText className="text-teal-400 w-5 h-5" />
                    </div>
                    
                    <div className="flex-grow min-w-[150px]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-black tracking-widest uppercase px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 rounded border border-indigo-500/20">
                          {item.assessmentID}
                        </span>
                        <span className="text-slate-500 text-[10px] font-bold">CID: {item.courseId}</span>
                      </div>
                      
                      <h6 className="text-sm font-bold text-slate-100 mb-0.5">
                        {item.courseName} <span className="text-slate-600 font-normal mx-1.5">|</span> <span className="text-slate-400 font-medium">{item.type}</span>
                      </h6>
                      
                      <div className="flex items-center text-slate-500 text-[10px] gap-3">
                         <span className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-emerald-500" />
                            Score: <strong className="text-slate-300">{item.maxMarks}</strong>
                         </span>
                      </div>
                    </div>

                    <div className="mt-3 sm:mt-0 w-full sm:w-auto">
                      <button 
                        onClick={() => navigate(`/submissions/${item.assessmentID}`)}
                        className="w-full sm:w-auto px-5 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black rounded-pill transition-all active:scale-95"
                      >
                        Submissions
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-slate-600">
                <CalendarIcon className="w-8 h-8 opacity-20 mb-3" />
                <p className="text-sm font-bold tracking-tight">No deadlines for this date.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;