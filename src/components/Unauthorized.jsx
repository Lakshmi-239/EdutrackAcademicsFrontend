import React from "react";
import { useNavigate } from "react-router-dom";

export function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-dark bg-opacity-70 z-50">
      <div className="bg-white rounded-lg shadow-2xl p-10 max-w-lg text-center">
        {/* EduTrack Logo */}
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-primary">EduTrack</h1>
        </div>

        {/* Access Denied Message */}
        <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
        <p className="text-gray-700 mb-6">
          You do not have permission to view this page.  
          Please contact your administrator if you believe this is an error.
        </p>

        {/* Action Button */}
        <button
          onClick={() => navigate("/")}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-accent transition"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}
