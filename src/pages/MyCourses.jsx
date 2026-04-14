import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Search, 
  BookOpen, 
  Clock, 
  PlayCircle, 
  FileText, 
  CheckCircle2, 
  Layers,
  X,
  ChevronRight,
  AlertCircle 
} from 'lucide-react';

const MyCourses = () => {
  const [activeTab, setActiveTab] = useState("available");
  const [courses, setCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseModules, setCourseModules] = useState([]);

  const [watchedProgress, setWatchedProgress] = useState({}); 
  const [completedContentIds, setCompletedContentIds] = useState(new Set());

  const studentId = "S001";
  const BASE_URL = "https://localhost:7157/api/Enrollment";

  // --- LOGIC: REMAINS EXACTLY AS PROVIDED ---
  useEffect(() => {
    const loadPageData = async () => {
      setLoading(true);
      try {
        await axios.patch(`${BASE_URL}/sync-status`, null, { 
          params: { studentId: studentId } 
        });
      } catch (err) {
        console.error("Sync failed:", err);
      }
      await fetchEnrolledIds();
      await fetchData();
      setLoading(false);
    };
    loadPageData();
  }, [activeTab]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      fetchData();
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      handleSearch();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, activeTab]);

  const fetchData = async () => {
    try {
      const endpoint = activeTab === "available"
        ? `${BASE_URL}/available-courses/${studentId}`
        : `${BASE_URL}/my-courses/${studentId}`;

      const response = await axios.get(endpoint);
      let fetchedCourses = response.data.data || [];

      if (activeTab === "enrolled" && fetchedCourses.length > 0) {
        fetchedCourses = await enrichCourseData(fetchedCourses);
      }
      setCourses(fetchedCourses);
    } catch (err) {
      setCourses([]);
    }
  };

  const enrichCourseData = async (courseList) => {
    return await Promise.all(
      courseList.map(async (course) => {
        try {
          const progRes = await axios.get(`${BASE_URL}/progress`, {
            params: { StudentId: studentId, CourseId: course.courseId }
          });
          const statusRes = await axios.get(`${BASE_URL}/status`, {
            params: { StudentId: studentId, CourseId: course.courseId }
          });
          
          return { 
            ...course, 
            progress: progRes.data.progress, 
            status: statusRes.data.currentStatus,
            isBatchActive: statusRes.data.isActive ?? true 
          };
        } catch (err) {
          return { ...course, progress: 0, status: "Active", isBatchActive: true };
        }
      })
    );
  };

  const fetchEnrolledIds = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/my-courses/${studentId}`);
      const ids = new Set((response.data.data || []).map((c) => c.courseId));
      setEnrolledCourseIds(ids);
    } catch (err) {
      console.error("Error fetching enrolled IDs:", err);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === "available" 
        ? `${BASE_URL}/search-by-name` 
        : `${BASE_URL}/search-my-courses`;

      const response = await axios.get(endpoint, {
        params: { studentId: studentId, courseName: searchTerm }
      });
      
      let results = response.data.data || [];

      if (activeTab === "enrolled" && results.length > 0) {
        results = await enrichCourseData(results);
      }
      setCourses(results);
    } catch (err) {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStartCourse = async (course) => {
    if (!course.isBatchActive) return;

    try {
      const response = await axios.get(`${BASE_URL}/content`, {
        params: { StudentId: studentId, CourseId: course.courseId }
      });
      if (response.data.status === 200) {
        setCourseModules(response.data.data);
        setSelectedCourse(course);
        
        const storageKey = `completed_${studentId}_${course.courseId}`;
        const saved = localStorage.getItem(storageKey);
        let localSet = saved ? new Set(JSON.parse(saved)) : new Set();

        if (course.status === "Completed") {
            response.data.data.forEach(m => m.contents.forEach(c => localSet.add(c.contentID)));
        }
        
        setCompletedContentIds(localSet);
        setShowModal(true);
      }
    } catch (err) {
      alert("Error loading content.");
    }
  };

  const handleMarkAsRead = async (contentId) => {
    try {
      const response = await axios.post(`${BASE_URL}/mark-completed`, {
        StudentId: studentId,
        CourseId: selectedCourse.courseId,
        ContentId: contentId
      });

      if (response.data.status === 200) {
        const updatedSet = new Set(completedContentIds).add(contentId);
        setCompletedContentIds(updatedSet);
        localStorage.setItem(`completed_${studentId}_${selectedCourse.courseId}`, JSON.stringify(Array.from(updatedSet)));
        
        const statusRes = await axios.get(`${BASE_URL}/status`, {
          params: { StudentId: studentId, CourseId: selectedCourse.courseId }
        });

        const newStatus = statusRes.data.currentStatus;
        const newProgress = response.data.progress;

        setCourses(prev => prev.map(c => 
          c.courseId === selectedCourse.courseId 
            ? { ...c, progress: newProgress, status: newStatus }
            : c
        ));
        setSelectedCourse(prev => ({ ...prev, progress: newProgress, status: newStatus }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      const add_enroll="https://localhost:7157/api/coordinator/add-enrollment";
      const response = await axios.post(add_enroll, { studentId, courseId: String(courseId) });
      if (response.status === 200) {
        await fetchEnrolledIds();
        await fetchData();
      }
    } catch (err) {
      alert("Enrollment failed.");
    }
  };

  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const renderContentItem = (content) => {
    const uri = content.contentURI || "";
    const youtubeId = getYouTubeId(uri);
    const isDoc = /\.(pdf|ppt|pptx)$/i.test(uri);

    if (isDoc) {
      return (
        <div className="mt-4 flex flex-col gap-4">
          <div className="p-4 bg-emerald-500/5 border border-emerald-900/30 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="text-emerald-400" size={24} />
              <span className="text-sm text-slate-300">{content.title}</span>
            </div>
            <a href={uri} target="_blank" rel="noreferrer" className="text-xs bg-emerald-500 text-slate-950 px-4 py-2 rounded-lg font-bold no-underline">
              Download
            </a>
          </div>
          <div className="w-full h-[600px] rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
            <iframe 
              src={`https://docs.google.com/gview?url=${encodeURIComponent(uri)}&embedded=true`}
              className="w-full h-full"
              frameBorder="0"
            ></iframe>
          </div>
        </div>
      );
    }

    return (
      <div className="relative mt-4 rounded-xl overflow-hidden border border-slate-800/60 shadow-2xl">
        {youtubeId ? (
          <div className="aspect-video">
            <iframe src={`https://www.youtube.com/embed/${youtubeId}?rel=0`} title="Youtube player" className="w-full h-full" allowFullScreen></iframe>
          </div>
        ) : (
          <video controls className="w-full bg-black">
            <source src={uri} type="video/mp4" />
          </video>
        )}
      </div>
    );
  };

  return (
    <div className="relative h-full w-full bg-transparent text-slate-200">
      {/* --- Main Page Content --- */}
      <div className={`max-w-7xl mx-auto px-6 py-10 transition-opacity duration-300 ${showModal ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
        
        {/* Search Header */}
        <div className="flex flex-col items-center mb-12">
          <div className="relative w-full max-w-2xl group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={20} />
            <input
              type="text"
              className="w-full bg-[#020617]/60 border border-slate-800/50 text-slate-100 pl-16 pr-8 py-4 rounded-2xl focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600 backdrop-blur-md"
              placeholder={activeTab === "available" ? "Search for new skills..." : "Search your learning path..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-16">
          <div className="bg-[#020617]/80 p-1.5 rounded-2xl border border-slate-800/50 flex gap-2 backdrop-blur-sm shadow-xl">
            {['available', 'enrolled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-10 py-3 rounded-xl font-bold transition-all flex items-center gap-3 text-sm tracking-wide ${
                  activeTab === tab 
                  ? "bg-white text-slate-950 shadow-[0_0_25px_rgba(255,255,255,0.1)]" 
                  : "text-slate-400 hover:text-white"
                }`}
              >
                {tab === 'available' ? <Layers size={16}/> : <BookOpen size={16}/>}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
          {loading ? (
            <div className="col-span-full text-center py-24 flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-2 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
              <p className="text-slate-500 font-bold tracking-[0.2em] uppercase text-[10px]">Syncing Knowledge</p>
            </div>
          ) : (
            courses.map((course) => {
              const isEnrolled = enrolledCourseIds.has(course.courseId);
              const canAccess = course.isBatchActive !== false;

              return (
                <div key={course.courseId} className={`group relative bg-[#020617]/40 border rounded-[2.5rem] p-8 transition-all duration-500 ${!canAccess && activeTab === "enrolled" ? 'opacity-50 border-slate-800' : 'hover:border-emerald-500/30 border-slate-800/50 hover:bg-[#020617]/60'}`}>
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-emerald-400 transition-colors uppercase">{course.courseName}</h3>
                      {activeTab === "enrolled" && (
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest border ${
                          course.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                        }`}>
                          {course.status}
                        </span>
                      )}
                    </div>
                    {activeTab === "enrolled" && canAccess && (
                      <div className="text-right">
                        <div className="text-[10px] font-black text-slate-500 mb-2 tracking-tighter">PROGRESS {course.progress}%</div>
                        <div className="w-24 h-1 bg-slate-800/50 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-1000" style={{ width: `${course.progress}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-slate-400 leading-relaxed mb-10 line-clamp-2 text-sm">{course.learningObjective}</p>
                  <div className="flex items-center justify-between pt-6 border-t border-slate-800/40">
                    <div className="flex gap-8 text-slate-200 font-bold">
                      <div className="flex flex-col"><span className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Duration</span><span className="text-sm">{course.durationInWeeks}W</span></div>
                      <div className="flex flex-col"><span className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Credits</span><span className="text-sm">{course.credits}</span></div>
                    </div>
                    <button 
                      onClick={() => activeTab === "available" ? handleEnroll(course.courseId) : handleStartCourse(course)}
                      disabled={(isEnrolled && activeTab === "available") || (activeTab === "enrolled" && !canAccess)}
                      className={`px-8 py-3 rounded-2xl font-black transition-all flex items-center gap-2 text-xs uppercase tracking-widest border-0 ${
                        ((isEnrolled && activeTab === "available") || (activeTab === "enrolled" && !canAccess))
                        ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                        : "bg-gradient-to-r from-[#10b981] to-[#06b6d4] text-slate-950"
                      }`}
                    >
                      {activeTab === "available" ? (isEnrolled ? "Enrolled" : "Enroll Now") : (course.status === 'Completed' ? 'Review' : 'Continue')}
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* --- CONTENT WINDOW: NO OVERLAP WITH SIDEBAR/TOPBAR --- */}
      {showModal && (
        <div className="w-full animate-in fade-in zoom-in duration-300">
           <div className="bg-[#0f172a] border border-slate-800 w-full min-h-screen rounded-t-[3rem] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-8 border-b border-slate-800/50 flex justify-between items-center sticky top-0 bg-[#0f172a] z-10">
              <div>
                <h2 className="text-2xl font-black text-white mb-1 uppercase tracking-tighter">{selectedCourse?.courseName}</h2>
                <span className="text-[10px] text-emerald-400 font-bold tracking-[0.3em] uppercase">Module Contents</span>
              </div>
              <button onClick={() => setShowModal(false)} className="p-3 hover:bg-slate-800 rounded-2xl text-slate-500 border-0 bg-transparent">
                <X size={28}/>
              </button>
            </div>
            
            {/* Scrollable Content Area */}
            <div className="p-6 md:p-10 max-w-5xl mx-auto w-full">
              {courseModules.map((module, mIdx) => (
                <div key={mIdx} className="mb-14">
                  <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8">
                    <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-md mr-3">Module {mIdx + 1}</span> 
                    {module.moduleName}
                  </h4>
                  <div className="grid gap-6">
                    {module.contents?.map((content, cIdx) => {
                      const isDone = completedContentIds.has(content.contentID);
                      return (
                        <div key={cIdx} className={`border rounded-[2rem] p-8 ${isDone ? 'bg-[#0f172a]/40 border-emerald-900/20' : 'bg-[#020617]/30 border-slate-800/50'}`}>
                          <div className="flex justify-between items-center mb-6">
                            <h5 className="text-lg font-bold text-slate-200 flex items-center gap-4">
                              {isDone ? <CheckCircle2 className="text-emerald-500" size={24}/> : <PlayCircle className="text-cyan-400" size={24}/>}
                              {content.title}
                            </h5>
                            <input type="checkbox" className="w-5 h-5 rounded border-slate-700 bg-slate-800 text-emerald-500"
                                   checked={isDone} onChange={() => handleMarkAsRead(content.contentID)} />
                          </div>
                          {renderContentItem(content)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCourses;