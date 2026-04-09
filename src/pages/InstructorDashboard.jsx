import React, { useState, useEffect } from 'react';
import { api } from '../services/Api';

const InstructorDashboard = ({ instructorId: propId }) => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use the ID from props OR from localStorage as a fallback
  const instructorId = propId || localStorage.getItem("userId");

  useEffect(() => {
    const loadDashboardData = async () => {
      // 1. Log for debugging
      console.log("Dashboard attempting sync for ID:", instructorId);

      if (!instructorId) {
        setLoading(false);
        return; // This triggers the "Waiting..." UI
      }

      try {
        setLoading(true);
        setError(null);

        // 2. Fetch Batches
        const response = await api.getInstructorBatches(instructorId);
        console.log("API Response Success:", response.data);

        // Handle both direct array and { data: [] } formats
        const batchList = Array.isArray(response.data) ? response.data : response.data.data;
        
        if (!batchList || batchList.length === 0) {
          setError("No batches found for this account.");
        } else {
          setBatches(batchList);
        }
      } catch (err) {
        console.error("Syncing Error:", err);
        setError("Unable to connect to EduTrack. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [instructorId]); // Re-run if instructorId changes

  const handleSelectBatch = async (batch) => {
    setSelectedBatch(batch);
    setStudents([]); 
    try {
      // Handles both batchId and BatchId depending on C# serialization
      const id = batch.batchId || batch.BatchId;
      const response = await api.getStudentsInBatch(id);
      
      const studentData = Array.isArray(response.data) ? response.data : response.data.data;
      setStudents(studentData || []);
    } catch (err) {
      console.error("Roster Sync Error:", err);
    }
  };

  // UI STATE 1: Still Loading
  if (loading) return (
    <div className="flex items-center justify-center h-screen flex-col gap-4 bg-gray-50">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-indigo-600 font-bold animate-pulse">Syncing with EduTrack...</p>
    </div>
  );

  // UI STATE 2: No Credentials Found (The part you were stuck on)
  if (!instructorId) return (
    <div className="flex items-center justify-center h-screen text-gray-400 bg-gray-50 flex-col gap-2">
      <svg className="w-12 h-12 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
      <p className="font-medium text-lg">Waiting for Instructor credentials...</p>
      <p className="text-sm">Please log in to view your dashboard.</p>
      <a href="/login" className="mt-4 text-indigo-600 font-bold hover:underline">Go to Login</a>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">My Batches</h2>
          <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Instructor: {instructorId}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium">{error}</div>}
          
          {batches.map(batch => (
            <div 
              key={batch.batchId || batch.BatchId}
              onClick={() => handleSelectBatch(batch)}
              className={`p-4 rounded-xl cursor-pointer border transition-all ${
                (selectedBatch?.batchId === batch.batchId || selectedBatch?.BatchId === batch.BatchId)
                ? 'bg-indigo-600 text-white shadow-md border-indigo-600' 
                : 'bg-white hover:bg-indigo-50 border-gray-100'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-mono opacity-60 uppercase">{batch.batchId || batch.BatchId}</span>
                {(batch.isActive || batch.IsActive) && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>}
              </div>
              <p className="font-bold text-sm leading-tight">{batch.courseName || batch.CourseName}</p>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {selectedBatch ? (
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
              <h1 className="text-3xl font-extrabold text-gray-900">{selectedBatch.courseName || selectedBatch.CourseName}</h1>
              <p className="text-gray-500">Student Roster • Batch {selectedBatch.batchId || selectedBatch.BatchId}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                    <th className="px-6 py-4">Student Name</th>
                    <th className="px-6 py-4">Student ID</th>
                    <th className="px-6 py-4">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map(s => (
                    <tr key={s.studentId || s.StudentId} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-bold text-gray-700">{s.studentName || s.StudentName}</td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-500">{s.studentId || s.StudentId}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{s.studentEmail || s.StudentEmail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {students.length === 0 && (
                <div className="py-20 text-center text-gray-400 italic">No students found in this batch.</div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-300">
             <p className="text-xl font-medium">Select a batch to begin</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default InstructorDashboard;