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
  ArrowRight,
} from "lucide-react";
import { api } from "../../services/Api";
import toast from "react-hot-toast";

export const StudentRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    StudentName: "",
    StudentEmail: "",
    StudentPhone: "",
    StudentPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    StudentName: "",
    StudentEmail: "",
    StudentPhone: "",
    StudentQualification: "",
    StudentProgram: "",
    StudentAcademicYear: "",
    Year: 1,
    StudentGender: "",
    StudentPassword: "",
    confirmPassword: "",
  });

  const qualifications = [
    "High School / Secondary School",
    "Higher Secondary (12th Grade)",
    "ITI (Industrial Training Institute)",
    "Diploma / Polytechnic",
    "Associate Degree",
    "Bachelor's Degree (UG)",
    "Bachelor of Engineering (BE)",
    "Bachelor of Technology (BTech)",
    "Bachelor of Science (BSc)",
    "Bachelor of Arts (BA)",
    "Bachelor of Commerce (BCom)",
    "Bachelor of Computer Applications (BCA)",
    "Post Graduate Diploma",
    "Master's Degree (PG)",
    "Master of Science (MSc)",
    "Master of Arts (MA)",
    "Master of Commerce (MCom)",
    "Master of Computer Applications (MCA)",
    "Master of Business Administration (MBA)",
    "Doctorate / PhD",
    "Post Doctoral Fellowship",
  ];

  const programs = [
    "Computer Science & Engineering",
    "Information Technology",
    "Artificial Intelligence & Machine Learning",
    "Data Science",
    "Cyber Security",
    "Software Engineering",
    "Cloud Computing",
    "Blockchain Technology",
    "Internet of Things (IoT)",
    "Business Administration (MBA/BBA)",
    "Finance & Accounting",
    "Human Resource Management",
    "Marketing & Sales",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical & Electronics Engineering",
    "Electronics & Communication Engineering",
    "Mechatronics Engineering",
    "Biomedical Engineering",
    "Medical & Health Sciences",
    "Pharmacy",
    "Nursing",
    "Psychology",
    "Law (LLB / LLM)",
    "Political Science",
    "Economics",
    "Media & Journalism",
    "Design (UI/UX, Graphic, Fashion)",
    "Architecture",
    "Hotel Management & Catering",
    "Big Data Analytics",
    "Artificial Intelligence & Robotics",
    "Embedded Systems",
    "VLSI Design",
    "Quantum Computing",
    "Digital Marketing",
    "Business Analytics",
    "Supply Chain Management",
    "Operations Management",
    "Financial Technology (FinTech)",
    "Banking & Insurance",
    "Public Administration",
    "International Relations",
    "Environmental Science",
    "Sustainable Development",
    "Renewable Energy Engineering",
    "Aerospace Engineering",
    "Automobile Engineering",
    "Biotechnology",
    "Genetics",
    "Food Technology",
    "Agricultural Engineering",
    "Forensic Science",
    "Criminal Justice",
    "Ethical Hacking & Penetration Testing",
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
      case "StudentName":
        if (value.trim().length < 5)
          return "Name must be at least 5 characters";
        break;

      case "StudentEmail":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Enter a valid email address";
        break;

      case "StudentPhone":
        if (!/^[0-9]{10}$/.test(value))
          return "Enter a valid 10-digit phone number";
        break;
      case "StudentPassword":
        if (
          !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,64}$/.test(
            value,
          )
        )
          return "Password must contain uppercase, lowercase, number & special character";
        break;

      default:
        return "";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const finalValue = name === "Year" ? parseInt(value, 10) || "" : value;
    setFormData((prev) => ({ ...prev, [name]: finalValue }));

    if (
      [
        "StudentName",
        "StudentEmail",
        "StudentPhone",
        "StudentPassword",
      ].includes(name)
    ) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.StudentPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...submitData } = formData;
      await api.registerStudent(submitData);

      await api.generateOtp({ email: formData.StudentEmail });

      toast.success("Registration successful! Please verify your email");

      setTimeout(() => {
        navigate("/verify-email", {
          state: { email: formData.StudentEmail },
        });
      }, 1500); // 1.5 seconds delay
    } catch (err) {
      const message =
        err.response?.data?.message || err.response?.data?.Message || "";

      if (message === "The Email already registered.") {
        setFieldErrors((prev) => ({
          ...prev,
          StudentEmail: "Email already exists",
        }));
        return;
      }
      //FALLBACK (global error banner)
      setError(message || "Connection failed.");
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

  // --- Styles ---

  const inputClassName =
    "w-full bg-slate-950/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-white";

  // Custom Professional Select Style
  const selectClassName =
    "w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all cursor-pointer text-slate-300 appearance-none bg-no-repeat bg-[length:1.25rem] bg-[right_1rem_center]";

  // Custom Chevron SVG for select background
  const selectBackgroundStyle = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='m19.5 8.25-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E")`,
  };

  const calendarInputClass =
    "w-full bg-slate-950/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-white [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:invert-[0.8]";

  const numberInputClass =
    "w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-white [&::-webkit-inner-spin-button]:opacity-100 [&::-webkit-inner-spin-button]:appearance-auto";

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
            Student Enrollment
          </h4>
          <p className="text-slate-400">
            Empowering academic excellence through a connected global network
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
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
                  <input
                    name="StudentName"
                    type="text"
                    value={formData.StudentName}
                    onChange={handleChange}
                    required
                    className={inputClassName}
                    placeholder="Enter full name"
                  />
                </div>
                {fieldErrors.StudentName && (
                  <p className="text-rose-400 text-sm mt-1 ml-1">
                    {fieldErrors.StudentName}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <FieldLabel required>Email Address</FieldLabel>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
                  <input
                    name="StudentEmail"
                    type="email"
                    value={formData.StudentEmail}
                    onChange={handleChange}
                    required
                    className={inputClassName}
                    placeholder="name@university.com"
                  />
                </div>
                {fieldErrors.StudentEmail && (
                  <p className="text-rose-400 text-sm mt-1 ml-1">
                    {fieldErrors.StudentEmail}
                  </p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <FieldLabel required>Phone Number</FieldLabel>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
                  <input
                    name="StudentPhone"
                    type="tel"
                    value={formData.StudentPhone}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{10}"
                    className={inputClassName}
                    placeholder="10-digit number"
                  />
                </div>
                {fieldErrors.StudentPhone && (
                  <p className="text-rose-400 text-sm mt-1 ml-1">
                    {fieldErrors.StudentPhone}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <FieldLabel required>Gender</FieldLabel>
                <select
                  name="StudentGender"
                  value={formData.StudentGender}
                  onChange={handleChange}
                  required
                  className={selectClassName}
                  style={selectBackgroundStyle}
                >
                  <option value="" className="bg-slate-900">
                    Select Gender
                  </option>
                  {genders.map((g) => (
                    <option key={g} value={g} className="bg-slate-900">
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-8 grid md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <FieldLabel>Qualification</FieldLabel>
                <select
                  name="StudentQualification"
                  value={formData.StudentQualification}
                  onChange={handleChange}
                  className={selectClassName}
                  style={selectBackgroundStyle}
                >
                  <option value="" className="bg-slate-900">
                    Select Qualification
                  </option>
                  {qualifications.map((q) => (
                    <option key={q} value={q} className="bg-slate-900">
                      {q}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <FieldLabel>Academic Program</FieldLabel>
                <select
                  name="StudentProgram"
                  value={formData.StudentProgram}
                  onChange={handleChange}
                  className={selectClassName}
                  style={selectBackgroundStyle}
                >
                  <option value="" className="bg-slate-900">
                    Select Program
                  </option>
                  {programs.map((p) => (
                    <option key={p} value={p} className="bg-slate-900">
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <FieldLabel>Academic Start Date</FieldLabel>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-teal-400 transition-colors pointer-events-none" />
                  <input
                    name="StudentAcademicYear"
                    type="date"
                    value={formData.StudentAcademicYear}
                    onChange={handleChange}
                    className={calendarInputClass}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <FieldLabel required>Current Year (1-4)</FieldLabel>
                <input
                  name="Year"
                  type="number"
                  min="1"
                  max="4"
                  value={formData.Year}
                  onChange={handleChange}
                  required
                  className={numberInputClass}
                />
              </div>
            </div>

            <div className="border-t border-slate-800 pt-8 grid md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <FieldLabel required>Password</FieldLabel>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
                  <input
                    name="StudentPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.StudentPassword}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-xl pl-12 pr-14 py-3 focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-white"
                    placeholder="••••••••"
                  />
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
                {fieldErrors.StudentPassword && (
                  <p className="text-rose-400 text-sm mt-1 ml-1">
                    {fieldErrors.StudentPassword}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <FieldLabel required>Confirm Password</FieldLabel>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
                  <input
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all text-white"
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
                {loading ? "Registering..." : "Complete Registration"}
                {!loading && (
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </form>

          <div className="mt-10 text-center border-t border-slate-800 pt-8">
            <p className="text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-teal-400 font-bold hover:text-teal-300 transition-colors ml-1"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
