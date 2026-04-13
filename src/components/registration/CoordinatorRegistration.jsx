import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ShieldCheck,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  Briefcase,
  Award,
  Upload,
  ArrowRight,
} 
from "lucide-react";
import { api } from "../../services/api";
import toast from "react-hot-toast";

export const CoordinatorRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);

  const [formData, setFormData] = useState({
    CoordinatorName: "",
    CoordinatorEmail: "",
    CoordinatorPhone: "",
    CoordinatorQualification: "",
    CoordinatorExperience: 0,
    CoordinatorGender: "",
    CoordinatorPassword: "",
    confirmPassword: "",
  });

  const qualifications = [
    "Bachelor's Degree",
    "Master's Degree",
    "PhD",
    "MBA",
    "Education Management",
  ];

  const genders = [
    "Male",
    "Female",
    "Non-Binary",
    "Other",
    "Prefer Not To Say",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    const finalValue =
      name === "CoordinatorExperience" ? parseInt(value, 10) || 0 : value;
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.CoordinatorPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!resumeFile) {
      setError("Resume is required");
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...submitData } = formData;
      await api.registerCoordinator({
        ...submitData,
        Resumepath: resumeFile,
      });

      toast.success("Coordinator registered successfully!");
      navigate("/login");
    } catch (err) {
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  /* ===== Shared Styles (Same as Instructor) ===== */
  const inputClassName =
    "w-full bg-slate-950/50 border border-slate-700 rounded-xl pl-12 pr-4 h-[54px] " +
    "text-white placeholder:text-slate-600 outline-none transition-all " +
    "focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10";

  const selectClassName =
    "w-full bg-slate-950/50 border border-slate-700 rounded-xl pl-12 pr-10 h-[54px] " +
    "text-white appearance-none outline-none transition-all cursor-pointer " +
    "focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 bg-no-repeat bg-[length:1.25rem] bg-[right_1rem_center]";

  const selectArrow = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E")`,
  };

  const FieldLabel = ({ children }) => (
    <label className="block text-sm font-semibold text-slate-300 mb-2 ml-1">
      {children}
      <span className="text-teal-400 ml-1">*</span>
    </label>
  );

  const Icon = ({ icon: IconCmp }) => (
    <IconCmp className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-teal-400 transition-colors z-10 pointer-events-none" />
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 px-6 py-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <ShieldCheck className="w-10 h-10 text-teal-400 mx-auto mb-3" />
          <h2 className="text-4xl font-bold text-white">
            Coordinator Registration
          </h2>
          <p className="text-slate-400 mt-2">
            Administrative account onboarding
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl space-y-8"
        >
          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400">
              {error}
            </div>
          )}

          {/* Name & Email */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <FieldLabel>Full Name</FieldLabel>
              <div className="relative group">
                <Icon icon={User} />
                <input
                  name="CoordinatorName"
                  value={formData.CoordinatorName}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>
            </div>

            <div>
              <FieldLabel>Email</FieldLabel>
              <div className="relative group">
                <Icon icon={Mail} />
                <input
                  name="CoordinatorEmail"
                  value={formData.CoordinatorEmail}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>
            </div>
          </div>

          {/* Phone, Gender, Experience */}
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <FieldLabel>Phone</FieldLabel>
              <div className="relative group">
                <Icon icon={Phone} />
                <input
                  name="CoordinatorPhone"
                  value={formData.CoordinatorPhone}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>
            </div>

            <div>
              <FieldLabel>Gender</FieldLabel>
              <div className="relative group">
                <Icon icon={User} />
                <select
                  name="CoordinatorGender"
                  value={formData.CoordinatorGender}
                  onChange={handleChange}
                  className={selectClassName}
                  style={selectArrow}
                >
                  <option value="">Select Gender</option>
                  {genders.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <FieldLabel>Experience</FieldLabel>
              <div className="relative group">
                <Icon icon={Briefcase} />
                <input
                  type="number"
                  name="CoordinatorExperience"
                  value={formData.CoordinatorExperience}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>
            </div>
          </div>

          {/* Qualification & Resume */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <FieldLabel>Qualification</FieldLabel>
              <div className="relative group">
                <Icon icon={Award} />
                <select
                  name="CoordinatorQualification"
                  value={formData.CoordinatorQualification}
                  onChange={handleChange}
                  className={selectClassName}
                  style={selectArrow}
                >
                  <option value="">Select Qualification</option>
                  {qualifications.map((q) => (
                    <option key={q}>{q}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <FieldLabel>Resume</FieldLabel>
              <div className="relative">
                <Upload className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="file"
                  id="resume"
                  hidden
                  onChange={(e) => setResumeFile(e.target.files[0])}
                />
                <label
                  htmlFor="resume"
                  className="flex flex-col justify-center h-[54px] pl-12 pr-4 border-2 border-dashed
                             border-slate-700 rounded-xl cursor-pointer text-slate-400
                             hover:border-teal-500/40 hover:bg-teal-500/5 transition-all"
                >
                  <span className="text-sm text-slate-300 truncate">
                    {resumeFile ? resumeFile.name : "Upload PDF / Word"}
                  </span>
                  {!resumeFile && (
                    <span className="text-[10px] uppercase text-slate-600">
                      MAX 5MB
                    </span>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Passwords */}
          <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-slate-800">
            <div>
              <FieldLabel>Password</FieldLabel>
              <div className="relative group">
                <Icon icon={Lock} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="CoordinatorPassword"
                  value={formData.CoordinatorPassword}
                  onChange={handleChange}
                  className={`${inputClassName} pr-14`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-teal-400"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <div>
              <FieldLabel>Confirm Password</FieldLabel>
              <div className="relative group">
                <Icon icon={Lock} />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600
                       text-white rounded-xl font-bold text-lg flex items-center
                       justify-center gap-2 transition-all"
          >
            Register Coordinator <ArrowRight />
          </button>
        </form>
      </div>
    </div>
  );
};