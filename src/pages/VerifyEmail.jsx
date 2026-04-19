import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  ShieldCheck,
  RefreshCw,
  Lock,
  ArrowLeft,
  GraduationCap,
} from "lucide-react";
import Swal from "sweetalert2";
import { api } from "../services/Api";

export const VerifyEmail = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(600);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const otpRequestedRef = useRef(false);

  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) navigate("/register");
  }, [email, navigate]);

  useEffect(() => {
    if (!email) return;

    // ✅ Prevent duplicate OTP in React 18 StrictMode
    if (otpRequestedRef.current) return;
    otpRequestedRef.current = true;

    api.generateOtp({ email }).catch(() => {
      Swal.fire({
        icon: "error",
        title: "OTP Error",
        text: "Unable to send verification code.",
        background: "#020617",
        color: "#f8fafc",
      });
    });
  }, [email]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const updated = [...otp];
    updated[index] = value.slice(-1);
    setOtp(updated);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const value = otp.join("");
    if (value.length < 6) return;

    setLoading(true);
    try {
      await api.verifyEmail({ email, otp: value });

      await Swal.fire({
        icon: "success",
        title: "Verification Successful",
        text: "Your identity has been confirmed.",
        confirmButtonColor: "#10b981",
        background: "#020617",
        color: "#f8fafc",
      });

      navigate("/login");
    } catch (err) {
      // ✅ trigger shake
      setShake(true);
      setTimeout(() => setShake(false), 450);

      Swal.fire({
        icon: "error",
        title: "Verification Failed",
        text: err.response?.data?.Message || "Invalid verification code.",
        confirmButtonColor: "#ef4444",
        background: "#020617",
        color: "#f8fafc",
      });
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      await api.generateOtp({ email });
      setOtp(["", "", "", "", "", ""]);
      setTimer(600);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "New code sent",
        showConfirmButton: false,
        timer: 3000,
        background: "#020617",
        color: "#f8fafc",
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to resend code.",
        background: "#020617",
        color: "#f8fafc",
      });
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="min-h-screen w-screen overflow-hidden bg-slate-950 flex items-center justify-center relative font-sans py-10">
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.45s ease-in-out;
        }
      `}</style>

      {/* Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/10 blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-emerald-500/10 blur-[140px]" />
      </div>

      <div className="relative w-full max-w-[500px] px-6">
        {/* Logo */}

        {/* Card */}
        <div className="bg-slate-900/85 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-8 sm:p-12 shadow-2xl">
          <Link
            to="/"
            className="flex items-center justify-center gap-3 mb-8 group cursor-pointer"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-lg blur opacity-25 group-hover:opacity-40 transition" />
              <div className="relative w-11 h-11 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-teal-400" />
              </div>
            </div>

            <span className="text-2xl font-extrabold text-white italic">
              Edu<span className="text-teal-400 not-italic">Track</span>
            </span>
          </Link>
          <h2 className="text-center text-xl font-extrabold text-white uppercase tracking-wider">
            Verify Identity
          </h2>

          <p className="text-center text-sm text-slate-400 mt-2">
            Enter the verification code sent to
          </p>

          <p className="text-center text-sm font-mono text-teal-400 mt-1">
            {email}
          </p>

          {/* OTP Section with SHAKE */}
          <form onSubmit={handleVerify} className="mt-10">
            <div
              className={`flex justify-between gap-3 mb-10 ${shake ? "animate-shake" : ""}`}
            >
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  value={digit}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-full aspect-square max-w-[4.5rem] rounded-xll bg-black/40 border-2 border-white/10 text-white text-2xl font-bold text-center focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 outline-none"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || otp.join("").length < 6}
              className="w-full h-14 rounded-xl bg-emerald-500 text-slate-950 text-[13px] font-black uppercase tracking-[0.25em] hover:bg-emerald-600 transition disabled:opacity-30 flex items-center justify-center gap-2"
            >
              {loading ? (
                <RefreshCw size={20} className="animate-spin" />
              ) : (
                <>
                  <Lock size={18} /> Verify Code
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-10 text-center space-y-4">
            <p className="text-sm font-mono text-slate-500">
              Expires in{" "}
              <span className="text-teal-400">{formatTime(timer)}</span>
            </p>

            <button
              onClick={resendOtp}
              disabled={timer > 540}
              className="block mx-auto text-xs font-black uppercase tracking-widest text-slate-500 hover:text-teal-400 disabled:text-slate-700"
            >
              Resend Code
            </button>

            <button
              onClick={() => navigate("/register/student")}
              className="flex items-center justify-center mx-auto text-xs font-black uppercase tracking-widest text-slate-600 hover:text-white"
            >
              <ArrowLeft size={12} className="mr-2" /> Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
