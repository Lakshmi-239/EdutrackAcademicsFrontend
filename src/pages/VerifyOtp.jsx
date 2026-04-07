import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../services/Api';

export const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const { state } = useLocation(); // Get email from registration/login redirect
  const navigate = useNavigate();

  const handleVerify = async () => {
    try {
      await api.verifyEmail(state.email, otp);
      alert('Email Verified! You can now login.');
      navigate('/login');
    } catch (err) {
      alert('Invalid OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Verify Your Email</h2>
        <p className="text-sm text-gray-500 mb-6">Enter the OTP sent to {state?.email}</p>
        <input 
          type="text" 
          maxLength="6" 
          className="w-full text-center text-2xl tracking-widest border-2 py-2 rounded-md mb-6 focus:border-violet-600 outline-none"
          onChange={(e) => setOtp(e.target.value)}
        />
        <button onClick={handleVerify} className="w-full bg-violet-600 text-white py-2 rounded-lg">
          Verify OTP
        </button>
      </div>
    </div>
  );
};