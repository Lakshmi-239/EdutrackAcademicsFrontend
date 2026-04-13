import React, { useState, useEffect } from 'react';
import { instructorApi } from '../api'; // Ikkada manam create chesina api.js ni import chesam
import { BookOpen, Users, Presentation, Activity } from 'lucide-react';

const InstructorReportPage = () => {
  const [batches, setBatches] = useState([]);
  const [classCount, setClassCount] = useState(0);
  const [ongoingCount, setOngoingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Instructor ID - Login nundi vachedi (Static ga "I001" test cheyadaniki)
  const instructorId = "I001"; 

  useEffect(() => {
    const getAllData = async () => {
      try {
        // Ikkada backend nundi calls start avthayi
        const [batchRes, classRes, ongoingRes] = await Promise.all([
          instructorApi.getBatches(instructorId),
          instructorApi.getClassCounts(instructorId),
          instructorApi.getOngoingBatches(instructorId)
        ]);

        // Backend nundi vacchina data ni state lo save chesthunnam
        setBatches(batchRes.data);
        
        // Total classes array lo untundhi kabatti sum chesthunnam
        const total = classRes.data.reduce((sum, item) => sum + item.totalClasses, 0);
        setClassCount(total);
        
        // Ongoing batches count
        setOngoingCount(ongoingRes.data.count);

      } catch (error) {
        console.error("Backend connection failed!", error);
      } finally {
        setLoading(false);
      }
    };

    getAllData();
  }, [instructorId]);

  if (loading) return <div className="text-teal-400 p-10">Fetching Backend Data...</div>;

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Card 1: Total Batches */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <BookOpen className="text-teal-400 mb-2" />
          <p className="text-slate-400 text-xs">TOTAL BATCHES</p>
          <h2 className="text-2xl font-bold">{batches.length}</h2>
        </div>

        {/* Card 2: Total Students (Batch array lo studentCount ni sum chesthunnam) */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <Users className="text-emerald-400 mb-2" />
          <p className="text-slate-400 text-xs">TOTAL STUDENTS</p>
          <h2 className="text-2xl font-bold">
            {batches.reduce((sum, b) => sum + b.studentCount, 0)}
          </h2>
        </div>

        {/* Card 3: Total Classes */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <Presentation className="text-blue-400 mb-2" />
          <p className="text-slate-400 text-xs">TOTAL CLASSES</p>
          <h2 className="text-2xl font-bold">{classCount}</h2>
        </div>

        {/* Card 4: Ongoing Batches */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <Activity className="text-rose-400 mb-2" />
          <p className="text-slate-400 text-xs">ONGOING BATCHES</p>
          <h2 className="text-2xl font-bold">{ongoingCount}</h2>
        </div>

      </div>
      
      {/* Ekkada batches display chestharu... */}
    </div>
  );
};

export default InstructorReportPage;