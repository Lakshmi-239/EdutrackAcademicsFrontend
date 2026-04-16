import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/Api';
import StudentProfileModal from './StudentProfileModal';
import { 
  User,
  ChevronLeft, 
  Users, 
  Mail, 
  Calendar, 
  Search,
  Loader2,
  ExternalLink,
  UserCheck
} from 'lucide-react';

const BatchStudentsPage = () => {
  const { id: batchId } = useParams();
  const navigate = useNavigate();
  
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await api.getStudentsByBatchId(batchId); 
        setStudents(response.data || []);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      } finally {
        setLoading(false);
      }
    };
    if (batchId) fetchStudents();
  }, [batchId]);

  const handleOpenProfile = (id) => {
    setSelectedStudentId(id);
    setIsModalOpen(true);
  };

  const filteredStudents = students.filter(s => 
    s.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.studentId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 1. THEMED LOADING STATE
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-vh-100 bg-slate-950 text-slate-200">
        <Loader2 className="text-teal-400 animate-spin mb-3" size={48} />
        <p className="text-slate-400 font-medium tracking-widest uppercase text-sm">Loading Enrollment List...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-6 px-4">
      <div className="max-w-[1400px] mx-auto">
        
        {/* 2. THEMED HEADER (Glassmorphism) */}
        <div className="flex flex-wrap items-center justify-between mb-8 bg-slate-900/50 backdrop-blur-md px-5 py-4 rounded-2xl border border-slate-800 shadow-xl gap-4">
          <div className="flex items-center gap-4">
            <button 
              className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-teal-400 hover:border-teal-400 transition-all shadow-lg" 
              onClick={() => navigate(-1)} 
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex flex-col">
              <h1 className="text-2xl font-extrabold text-white tracking-tight">Batch <span className="text-teal-400">Students</span></h1>
              <span className="text-slate-500 font-mono text-xs uppercase tracking-tighter">
                ID: <span className="text-slate-300">{batchId}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-grow md:flex-grow-0">
            {/* Themed Search Input */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                className="w-full bg-slate-800/50 border border-slate-700 text-slate-200 ps-11 pe-4 py-2.5 rounded-xl focus:border-teal-400 focus:ring-1 focus:ring-teal-400 outline-none transition-all placeholder:text-slate-600 shadow-inner" 
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="hidden sm:flex items-center gap-2 bg-teal-500/10 text-teal-400 px-4 py-2 rounded-xl border border-teal-500/20 font-bold text-sm shadow-[0_0_15px_rgba(20,184,166,0.1)]">
              <Users size={16} />
              <span>{filteredStudents.length}</span>
            </div>
          </div>
        </div>

        {/* 3. THEMED STUDENTS LIST */}
        <div className="grid gap-4">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student, idx) => (
              <div key={student.studentId || idx} className="group transition-all duration-300 hover:-translate-y-1">
                <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 hover:shadow-2xl transition-all">
                  <div className="flex flex-col md:flex-row items-center">
                    
                    {/* Identity Section */}
                    <div className="w-full md:w-1/3 p-5 flex items-center gap-4 border-b md:border-b-0 md:border-e border-slate-800 bg-slate-900/20">
                      <div className="w-14 h-14 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center text-teal-400 font-black text-xl shadow-lg border border-slate-600 group-hover:border-teal-500/50 transition-colors">
                        {student.studentName?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-teal-400 transition-colors">{student.studentName}</h3>
                        <div className="inline-block bg-slate-800 text-slate-400 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700 mt-1 uppercase">
                          UID: {student.studentId}
                        </div>
                      </div>
                    </div>

                    {/* Details Section */}
                    <div className="w-full md:w-1/3 p-5 space-y-2">
                       <div className="flex items-center gap-3 text-slate-400">
                          <div className="p-1.5 bg-slate-800 rounded-lg"><Mail size={14} className="text-teal-500" /></div>
                          <span className="text-sm truncate font-medium">{student.studentEmail}</span>
                       </div>
                       <div className="flex items-center gap-3 text-slate-400">
                          <div className="p-1.5 bg-slate-800 rounded-lg"><Calendar size={14} className="text-teal-500" /></div>
                          <span className="text-sm font-medium">Status: <span className="text-emerald-400 font-bold uppercase text-[10px] tracking-widest ml-1">Enrolled</span></span>
                       </div>
                    </div>

                    {/* Action Section */}
                    <div className="w-full md:w-1/3 p-5 flex items-center justify-center md:justify-end bg-slate-800/10">
                      <button 
                        className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 hover:bg-teal-500 text-slate-300 hover:text-white font-bold rounded-xl border border-slate-700 hover:border-teal-400 transition-all shadow-md group/btn"
                        onClick={() => handleOpenProfile(student.studentId)}
                      >
                        <ExternalLink size={16} className="group-hover/btn:scale-110 transition-transform" /> 
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center text-center">
              <div className="p-6 bg-slate-800/50 rounded-full mb-4">
                <UserCheck size={64} className="text-slate-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-400">No students found</h3>
              <p className="text-slate-600 mt-1">Try adjusting your search or check back later.</p>
            </div>
          )}
        </div>
      </div>

      <StudentProfileModal 
        studentId={selectedStudentId} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default BatchStudentsPage;