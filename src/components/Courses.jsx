import React, { useState, useEffect } from "react";
import {
  Star,
  Clock,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/Api";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export const courseImages = [
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600",
  "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=600",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600",
];

export const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await api.getCourses();
        const mappedData = data.map((course, index) => ({
          id: course.courseId || course.CourseId,
          name: course.courseName || course.CourseName,
          duration: `${course.durationInWeeks || course.DurationInWeeks} Weeks`,
          credits: `${course.credits || course.Credits} CREDITS`,
          level: index % 2 === 0 ? "BEGINNER" : "INTERMEDIATE",
          rating: (4.5 + (index % 5) * 0.1).toFixed(1),
          thumbnail: courseImages[index % courseImages.length],
        }));
        setCourses(mappedData);
      } catch (error) {
        console.error("Error fetching programs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const displayedCourses = showAll ? courses : courses.slice(0, 6);

  if (loading) return null;

  return (
    <section id="courses" className="py-16 bg-slate-950">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-2">
            <Sparkles className="w-3 h-3" /> Professional Training
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Popular <span className="text-emerald-400">Courses</span>
          </h2>
          <div className="w-16 h-1 bg-emerald-500 mt-3 rounded-full"></div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCourses.map((course) => (
            <div
              key={course.id}
              className="group flex flex-col bg-[#0B1120] border border-slate-800/60 rounded-xl overflow-hidden transition-all duration-300 hover:border-emerald-500/40 shadow-xl"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <ImageWithFallback
                  src={course.thumbnail}
                  alt={course.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3">
                  <span className="bg-black/70 backdrop-blur-md text-emerald-400 text-[8px] font-bold px-2 py-0.5 rounded border border-emerald-500/20">
                    {course.level}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                {/* Fixed the 'collapsed' name by removing fixed height and adding min-height */}
                <h3 className="text-lg font-bold text-white leading-tight mb-4 min-h-[4rem] flex items-start group-hover:text-emerald-400 transition-colors">
                  {course.name}
                </h3>

                <div className="flex items-center justify-between w-full text-[10px] font-bold mb-6 pt-4 border-t border-slate-800/40">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Star className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/20" />
                    <span>{course.rating}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="text-emerald-500 uppercase tracking-tighter">
                    {course.credits}
                  </div>
                </div>

                {/* mt-auto pushes the button to the absolute bottom of the container */}
                <div className="mt-auto">
                  <button
                    onClick={() => navigate("/register")}
                    className="w-full py-2.5 bg-slate-800 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 border border-slate-700/50 hover:border-emerald-400"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {courses.length > 6 && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-8 py-2.5 bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-bold rounded-full hover:border-emerald-500/50 hover:text-emerald-400 transition-all shadow-lg uppercase tracking-widest"
            >
              {showAll ? (
                <>
                  View Less <ChevronUp className="w-3 h-3" />
                </>
              ) : (
                <>
                  View All Courses <ChevronDown className="w-3 h-3" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
