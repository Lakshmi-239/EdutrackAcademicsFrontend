import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Search, 
  BookOpen, 
  Clock, 
  Award, 
  PlayCircle, 
  FileText, 
  CheckCircle2, 
  Layers,
  X,
  ChevronRight,
  AlertCircle // Added for the warning icon
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
            // REQUIREMENT: Ensure your backend statusRes returns the batch's IsActive property
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
    // Prevent modal from opening if batch is inactive
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
    const isDoc = uri.toLowerCase().endsWith(".pdf") || uri.toLowerCase().endsWith(".ppt") || uri.toLowerCase().endsWith(".pptx");

    if (isDoc) {
      return (
        <div className="p-6 text-center bg-slate-900/50 border border-dashed border-slate-700 rounded-2xl mt-4">
          <FileText className="mx-auto mb-3 text-blue-400" size={40} />
          <h5 className="text-slate-200 mb-4 font-semibold">{content.title}</h5>
          <a href={uri} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full font-bold transition-all"
             onClick={() => setWatchedProgress(prev => ({ ...prev, [content.contentID]: 100 }))}>
            View Resources
          </a>
        </div>
      );
    }

    return (
      <div className="relative mt-4 rounded-xl overflow-hidden border border-slate-800">
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
    <div className="h-[calc(100vh-60px)] w-full overflow-y-auto bg-slate-950 text-slate-200 selection:bg-blue-500/30 custom-scrollbar">
      <div className="max-w-7xl mx-auto px-8 py-10">
        
        {/* Search Header */}
        <div className="flex flex-col items-center mb-12">
          <div className="relative w-full max-w-2xl group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={20} />
            <input
              type="text"
              className="w-full bg-slate-900/40 border border-slate-800/50 text-slate-100 pl-14 pr-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all placeholder:text-slate-600 shadow-2xl"
              placeholder={activeTab === "available" ? "Search for new skills..." : "Search your enrolled courses..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center gap-3 mb-10">
          {['available', 'enrolled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2 border ${
                activeTab === tab 
                ? "bg-white text-slate-950 border-white shadow-lg" 
                : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700"
              }`}
            >
              {tab === 'available' ? <Layers size={18}/> : <BookOpen size={18}/>}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
          {loading ? (
            <div className="col-span-full text-center py-20 flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="text-slate-500 font-medium tracking-widest uppercase text-xs">Loading Catalog</p>
            </div>
          ) : (
            courses.map((course) => {
              const isEnrolled = enrolledCourseIds.has(course.courseId);
              // Logic check for Batch status
              const canAccess = course.isBatchActive !== false;

              return (
                <div key={course.courseId} className={`group bg-slate-900/40 border p-8 rounded-[2rem] transition-all duration-300 ${!canAccess && activeTab === "enrolled" ? 'opacity-75 border-red-900/50' : 'hover:bg-slate-900/60 hover:border-blue-500/50 border-slate-800'}`}>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{course.courseName}</h3>
                      {activeTab === "enrolled" && (
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${
                          course.status === 'Completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>
                          {course.status}
                        </span>
                      )}
                    </div>
                    {activeTab === "enrolled" && canAccess && (
                      <div className="text-right">
                        <div className="text-[10px] font-black text-slate-500 mb-1 tracking-tighter">PROGRESS {course.progress}%</div>
                        <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 transition-all duration-700" style={{ width: `${course.progress}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-slate-400 leading-relaxed mb-4 line-clamp-3 text-sm">{course.learningObjective}</p>
                  
                  {/* REQUIREMENT: Show message if batch not started yet */}
                  {activeTab === "enrolled" && !canAccess && (
                    <div className="flex items-center gap-2 mb-6 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 text-xs font-bold">
                      <Clock size={14} />
                      Batch not started yet. Content will be available once the course starts.
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-6 border-t border-slate-800/50">
                    <div className="flex gap-6 text-white font-semibold">
                      <div className="flex flex-col"><span className="text-[10px] text-slate-500 uppercase font-bold">Weeks</span><span>{course.durationInWeeks}</span></div>
                      <div className="flex flex-col"><span className="text-[10px] text-slate-500 uppercase font-bold">Credits</span><span>{course.credits}</span></div>
                    </div>
                    
                    <button 
                      onClick={() => activeTab === "available" ? handleEnroll(course.courseId) : handleStartCourse(course)}
                      disabled={(isEnrolled && activeTab === "available") || (activeTab === "enrolled" && !canAccess)}
                      className={`px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${
                        ((isEnrolled && activeTab === "available") || (activeTab === "enrolled" && !canAccess))
                        ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                        : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20"
                      }`}
                    >
                      {activeTab === "available" ? (isEnrolled ? "Enrolled" : "Enroll Now") : (
                        !canAccess ? "Waiting" : (course.status === 'Completed' ? 'Review' : 'Continue')
                      )}
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal Section remains the same */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-5xl rounded-[2.5rem] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <h2 className="text-2xl font-bold text-white">{selectedCourse?.courseName}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-800 rounded-full text-slate-500 transition-all"><X/></button>
            </div>
            <div className="p-8 overflow-y-auto custom-scrollbar">
              {courseModules.map((module, mIdx) => (
                <div key={mIdx} className="mb-10">
                  <h4 className="text-xs font-black text-blue-500 uppercase tracking-widest mb-6">Section {mIdx + 1}: {module.moduleName}</h4>
                  <div className="space-y-4">
                    {module.contents?.map((content, cIdx) => {
                      const isDone = completedContentIds.has(content.contentID);
                      return (
                        <div key={cIdx} className="bg-slate-950/40 border border-slate-800/50 p-6 rounded-3xl">
                          <div className="flex justify-between items-center mb-4">
                            <h5 className="text-lg font-semibold text-slate-200 flex items-center gap-3">
                              {isDone ? <CheckCircle2 className="text-green-500" size={20}/> : <PlayCircle className="text-blue-400" size={20}/>}
                              {content.title}
                            </h5>
                            <input type="checkbox" className="w-6 h-6 rounded border-slate-700 bg-slate-800 text-blue-500 cursor-pointer"
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

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
      `}</style>
    </div>
  );
};

export default MyCourses;