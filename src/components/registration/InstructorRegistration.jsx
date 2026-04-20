import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  Calendar,
  Briefcase,
  Award,
  Upload,
  ArrowRight,
} from "lucide-react";
import { api } from "../../services/Api";
import toast from "react-hot-toast";

export const InstructorRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);

  const [formData, setFormData] = useState({
    InstructorName: "",
    InstructorEmail: "",
    InstructorPhone: "",
    InstructorQualification: "",
    InstructorSkills: "",
    InstructorExperience: 0,
    InstructorJoinDate: "",
    InstructorGender: "",
    InstructorPassword: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState({
    InstructorName: "",
    InstructorEmail: "",
    InstructorPhone: "",
    InstructorPassword: "",
    InstructorSkills: "",
    InstructorResume: "",
  });

  const qualifications = [
    // Core Academic Degrees
    "Associate Degree",
    "Bachelor's Degree",
    "Bachelor of Engineering (BE)",
    "Bachelor of Technology (BTech)",
    "Bachelor of Science (BSc)",
    "Bachelor of Arts (BA)",
    "Bachelor of Commerce (BCom)",
    "Bachelor of Computer Applications (BCA)",

    "Master's Degree",
    "Master of Science (MSc)",
    "Master of Arts (MA)",
    "Master of Commerce (MCom)",
    "Master of Engineering (ME)",
    "Master of Technology (MTech)",
    "Master of Computer Applications (MCA)",
    "Master of Business Administration (MBA)",

    "Doctor of Philosophy (PhD)",
    "Post‑Doctoral Research / Fellowship",

    // Education & Teaching
    "Bachelor of Education (B.Ed)",
    "Master of Education (M.Ed)",
    "Teaching Certification / Licensure",
    "Diploma in Education / Training",

    // Diplomas & Professional Certifications
    "Post Graduate Diploma",
    "Professional Certificate",
    "Advanced Diploma",
    "Higher National Diploma (HND)",

    // Technology & Engineering Certifications
    "Cloud Certification (AWS / Azure / GCP)",
    "Cyber Security Certification",
    "Data Science / AI Certification",
    "DevOps Certification",
    "Networking Certification (CCNA / CCNP)",
    "Software Testing Certification",
    "Embedded Systems Certification",

    // Management & Business Certifications
    "Project Management Professional (PMP)",
    "Agile / Scrum Certification",
    "Six Sigma (Green Belt / Black Belt)",
    "Chartered Financial Analyst (CFA)",
    "Certified Management Accountant (CMA)",
    "Human Resource Certification",

    // Healthcare & Life Sciences
    "Medical Degree (MBBS / MD)",
    "Nursing Degree / Certification",
    "Pharmacy Degree (BPharm / MPharm)",
    "Public Health Certification",
    "Biomedical Sciences Degree",

    // Law, Arts & Social Sciences
    "Law Degree (LLB / LLM)",
    "Fine Arts Degree",
    "Design Degree (UI/UX / Graphic / Fashion)",
    "Media & Journalism Degree",
    "Psychology Degree",

    // Research & Specialized
    "Research Fellowship",
    "Industrial Training / Apprenticeship",
    "Recognized Industry Expert",
  ];
  const genders = [
    "Male",
    "Female",
    "Non-Binary",
    "Other",
    "Prefer Not To Say",
  ];

  const validateField = (name, value) => {
    switch (name) {
      case "InstructorName":
        if (value.trim().length < 3)
          return "Name must be at least 3 characters";
        break;
      case "InstructorEmail":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Enter a valid email address";
        if (!value.toLowerCase().endsWith("@gmail.com"))
          return "Only @gmail.com addresses are allowed";
        break;

      case "InstructorPhone":
        if (!/^[0-9]{10}$/.test(value))
          return "Enter a valid 10-digit phone number";
        break;

      case "InstructorPassword":
        if (
          !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,64}$/.test(
            value,
          )
        )
          return "Password must include uppercase, lowercase, number & special character";
        break;

      default:
        return "";
    }
    return "";
  };
  const validateSkills = (value) => {
    if (!value.trim()) return "Skills are required";

    const skills = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (skills.length < 2) return "Enter at least 2 skills (comma separated)";

    if (skills.some((skill) => skill.length < 2))
      return "Each skill must be at least 2 characters";

    return "";
  };

  const validateResume = (file) => {
    if (!file) return "Resume is required";

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type))
      return "Only PDF, DOC, or DOCX files are allowed";

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) return "Resume must be less than 5MB";

    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const finalValue =
      name === "InstructorExperience" ? parseInt(value, 10) || 0 : value;
    setFormData((prev) => ({ ...prev, [name]: finalValue }));

    if (
      [
        "InstructorName",
        "InstructorEmail",
        "InstructorPhone",
        "InstructorPassword",
      ].includes(name)
    ) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }

    if (name === "InstructorSkills") {
      setFieldErrors((prev) => ({
        ...prev,
        InstructorSkills: validateSkills(value),
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    setResumeFile(file);

    setFieldErrors((prev) => ({
      ...prev,
      InstructorResume: validateResume(file),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (
      fieldErrors.InstructorName ||
      fieldErrors.InstructorEmail ||
      fieldErrors.InstructorPhone ||
      fieldErrors.InstructorPassword ||
      fieldErrors.InstructorSkills ||
      fieldErrors.InstructorResume
    ) {
      setError("Please fix the highlighted errors");
      return;
    }
    if (formData.InstructorPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    const resumeError = validateResume(resumeFile);
    if (resumeError) {
      setFieldErrors((prev) => ({
        ...prev,
        InstructorResume: resumeError,
      }));
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...submitData } = formData;
      const finalData = { ...submitData, InstructorResume: resumeFile };

      await api.registerInstructor(finalData);
      toast.success("Registration successful!");
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat()[0]
        : err.response?.data?.message || "Connection failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const FieldLabel = ({ children, required }) => (
    <label className="block text-sm font-semibold text-slate-300 mb-2 ml-1">
      {children}
      {required && <span className="text-teal-400 ml-1">*</span>}
    </label>
  );

  const inputClassName =
    "w-full bg-slate-950/50 border border-slate-700 rounded-xl pl-12 pr-4 focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-white placeholder:text-slate-600 h-[54px] flex items-center";
  const selectClassName =
    "w-full bg-slate-900 border border-slate-700 rounded-xl pl-12 pr-10 focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all cursor-pointer text-white appearance-none bg-no-repeat bg-[length:1.25rem] bg-[right_1rem_center] h-[54px]";

  const selectBackgroundStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E")`,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-teal-500/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-20">
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-500" />
              <div className="relative w-12 h-12 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-teal-400" />
              </div>
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-white italic">
              Edu<span className="text-teal-400 not-italic">Track</span>
            </span>
          </Link>
          <h4 className="text-4xl font-bold text-white mb-3">
            Instructor Onboarding
          </h4>
          <p className="text-slate-400">
            Join our elite faculty and shape the future of industry mastery
          </p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl">
          {error && (
            <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm flex items-center gap-3 animate-pulse">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <FieldLabel required>Full Name</FieldLabel>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-teal-400 transition-colors z-10" />
                  <input
                    name="InstructorName"
                    type="text"
                    value={formData.InstructorName}
                    onChange={handleChange}
                    required
                    className={inputClassName}
                    placeholder="Dr. Jane Smith"
                  />
                  {fieldErrors.InstructorName && (
                    <p className="text-rose-400 text-sm mt-1 ml-1">
                      {fieldErrors.InstructorName}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <FieldLabel required>Email Address</FieldLabel>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-teal-400 transition-colors z-10" />
                  <input
                    name="InstructorEmail"
                    type="email"
                    value={formData.InstructorEmail}
                    onChange={handleChange}
                    required
                    className={inputClassName}
                    placeholder="instructor@gmail.com"
                  />
                  {fieldErrors.InstructorEmail && (
                    <p className="text-rose-400 text-sm mt-1 ml-1">
                      {fieldErrors.InstructorEmail}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <FieldLabel required>Phone Number</FieldLabel>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-teal-400 transition-colors z-10" />
                  <input
                    name="InstructorPhone"
                    type="tel"
                    value={formData.InstructorPhone}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{10}"
                    className={inputClassName}
                    placeholder="10-digit number"
                  />
                  {fieldErrors.InstructorPhone && (
                    <p className="text-rose-400 text-sm mt-1 ml-1">
                      {fieldErrors.InstructorPhone}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <FieldLabel required>Gender</FieldLabel>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-teal-400 transition-colors z-10 pointer-events-none" />
                  <select
                    name="InstructorGender"
                    value={formData.InstructorGender}
                    onChange={handleChange}
                    required
                    className={selectClassName}
                    style={selectBackgroundStyle}
                  >
                    <option value="" className="bg-slate-900 text-slate-400">
                      Select Gender
                    </option>
                    {genders.map((g) => (
                      <option
                        key={g}
                        value={g}
                        className="bg-slate-900 text-white"
                      >
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-8 grid md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <FieldLabel required>Highest Qualification</FieldLabel>
                <div className="relative group">
                  <Award className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-teal-400 transition-colors z-10 pointer-events-none" />
                  <select
                    name="InstructorQualification"
                    value={formData.InstructorQualification}
                    onChange={handleChange}
                    required
                    className={selectClassName}
                    style={selectBackgroundStyle}
                  >
                    <option value="" className="bg-slate-900 text-slate-400">
                      Select Degree
                    </option>
                    {qualifications.map((q) => (
                      <option
                        key={q}
                        value={q}
                        className="bg-slate-900 text-white"
                      >
                        {q}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <FieldLabel required>Experience (Years)</FieldLabel>
                <div className="relative group">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-teal-400 transition-colors pointer-events-none z-10" />
                  <input
                    name="InstructorExperience"
                    type="number"
                    min="0"
                    value={formData.InstructorExperience}
                    onChange={handleChange}
                    className={`${inputClassName} [&::-webkit-inner-spin-button]:appearance-auto [&::-webkit-inner-spin-button]:opacity-100 [&::-webkit-outer-spin-button]:appearance-auto [&::-webkit-outer-spin-button]:opacity-100`}
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="space-y-1">
                <FieldLabel>Earliest Join Date</FieldLabel>
                <div className="relative group">
                  <Calendar className=" absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 group-focus-within:text-teal-400 transition-colors pointer-events-none z-10" />
                  <input
                    name="InstructorJoinDate"
                    type="date"
                    value={formData.InstructorJoinDate}
                    onChange={handleChange}
                    required
                    className="
                    w-full bg-slate-950/50 border border-slate-700 rounded-xl
                    pl-14 pr-12 py-3 h-[54px] text-white
                   focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10
                   outline-none transition-all
                  /* Native calendar icon styling */
                  [color-scheme:dark]
                  [&::-webkit-calendar-picker-indicator]:
                  [&::-webkit-calendar-picker-indicator]:opacity-90
                  [&::-webkit-calendar-picker-indicator]:cursor-pointer
                  "
                  />
                </div>
              </div>

              <div className="space-y-1">
                <FieldLabel required>Professional Resume</FieldLabel>
                <div className="relative group">
                  <input
                    id="resume-upload"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="relative flex items-center justify w-full h-[54px] pl-12 pr-4 border border-dashed border-slate-700 rounded-xl cursor-pointer hover:border-teal-500/40 hover:bg-teal-500/5 transition-all text-slate-400 group overflow-hidden"
                  >
                    <Upload className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-hover:text-teal-400 transition-colors shrink-0" />
                    <div className="flex flex-col items-start justify-start gap-0.5 pointer-events-none">
                      <span className="text-sm font-medium truncate max-w-[160px] text-slate-300 ">
                        {resumeFile ? resumeFile.name : "Upload PDF/Word"}
                      </span>
                      {!resumeFile && (
                        <span className="text-[10px] text-slate-600 uppercase tracking-tighter font-bold shrink-0 leading-none pt-0.5">
                          MAX 5MB
                        </span>
                      )}
                    </div>
                    {fieldErrors.InstructorResume && (
                      <p className="text-rose-400 text-sm mt-1 ml-1">
                        {fieldErrors.InstructorResume}
                      </p>
                    )}
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <FieldLabel required>Core Expertise & Skills</FieldLabel>
              <textarea
                name="InstructorSkills"
                value={formData.InstructorSkills}
                onChange={handleChange}
                required
                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-white placeholder:text-slate-600 min-h-[100px]"
                placeholder="e.g. React, Distributed Systems, Cloud Architecture..."
              />
              {fieldErrors.InstructorSkills && (
                <p className="text-rose-400 text-sm mt-1 ml-1">
                  {fieldErrors.InstructorSkills}
                </p>
              )}
            </div>

            <div className="border-t border-slate-800 pt-8 grid md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <FieldLabel required>Security Password</FieldLabel>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-teal-400 transition-colors z-10" />
                  <input
                    name="InstructorPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.InstructorPassword}
                    onChange={handleChange}
                    required
                    className={`${inputClassName} pr-14`}
                    placeholder="••••••••"
                  />
                  {fieldErrors.InstructorPassword && (
                    <p className="text-rose-400 text-sm mt-1 ml-1">
                      {fieldErrors.InstructorPassword}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-slate-500 hover:text-teal-400 transition-colors p-1"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <FieldLabel required>Confirm Password</FieldLabel>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-teal-400 transition-colors z-10" />
                  <input
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className={inputClassName}
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] disabled:opacity-50 overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {loading ? "Processing Application..." : "Apply as Instructor"}
                {!loading && (
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </form>

          <div className="mt-10 text-center border-t border-slate-800 pt-8">
            <p className="text-slate-400">
              Already part of the faculty?{" "}
              <Link
                to="/login"
                className="text-teal-400 font-bold hover:text-teal-300 transition-colors ml-1"
              >
                Instructor Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
