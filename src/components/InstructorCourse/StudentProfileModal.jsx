import React, { useState, useEffect } from 'react';
import { api } from '../../services/Api';
import { 
  X, Mail, Phone, User, GraduationCap, 
  BookOpen, Calendar, ShieldCheck, Loader2 
} from 'lucide-react';

const StudentProfileModal = ({ studentId, isOpen, onClose }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFullProfile = async () => {
      if (!studentId || !isOpen) return;
      try {
        setLoading(true);
        const [personalRes, programRes] = await Promise.all([
          api.getStudentPersonalInfo(studentId),
          api.getStudentProgramDetails(studentId)
        ]);

        const personal = personalRes.data || {};
        const program = programRes.data || {};

        setProfile({
          studentName: personal.studentName || program.studentName,
          studentEmail: personal.studentEmail || program.studentEmail,
          studentPhone: (personal.studentPhone && personal.studentPhone !== 0) ? personal.studentPhone : program.studentPhone,
          studentGender: personal.studentGender || program.studentGender,
          studentQualification: program.studentQualification || personal.studentQualification,
          studentProgram: program.studentProgram || personal.studentProgram,
          studentAcademicYear: program.studentAcademicYear || personal.studentAcademicYear,
        });
      } catch (err) {
        console.error("Error fetching student details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFullProfile();
  }, [studentId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          
          {/* Header Section */}
          <div className="p-4 text-white position-relative" style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #004dc7 100%)' }}>
            {/* CLOSE OPTION */}
            <button 
              onClick={onClose}
              className="btn border-0 text-white position-absolute end-0 top-0 m-3 opacity-75 hover-opacity-100"
              style={{ background: 'transparent' }}
            >
              <X size={24} />
            </button>
            
            <div className="d-flex align-items-center gap-4">
              <div className="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" 
                   style={{ width: '70px', height: '70px', fontSize: '1.8rem' }}>
                {profile?.studentName?.charAt(0) || <User size={35} />}
              </div>
              <div>
                <h3 className="mb-1 fw-bold text-capitalize">{profile?.studentName || "Student Profile"}</h3>
                {/* HIGH VISIBILITY STUDENT ID */}
                <div className="badge bg-dark bg-opacity-50 border border-white border-opacity-25 rounded-pill px-3 py-2 text-white">
                  STUDENT ID: {studentId}
                </div>
              </div>
            </div>
          </div>

          <div className="modal-body p-0 bg-white">
            {loading ? (
              <div className="text-center py-5"><Loader2 className="animate-spin text-primary" size={40} /></div>
            ) : (
              <div className="row g-0">
                {/* Personal Info - Left Aligned */}
                <div className="col-md-6 p-4 border-end border-light">
                  <h6 className="text-primary fw-bold mb-4 d-flex align-items-center gap-2" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>
                    <ShieldCheck size={18} /> PERSONAL INFORMATION
                  </h6>
                  <div className="d-flex flex-column gap-3">
                    <InfoRow icon={<Mail size={18}/>} label="Email" value={profile?.studentEmail} />
                    <InfoRow icon={<Phone size={18}/>} label="Phone" value={profile?.studentPhone} />
                    <InfoRow icon={<User size={18}/>} label="Gender" value={profile?.studentGender} />
                  </div>
                </div>

                {/* Academic Details - Left Aligned */}
                <div className="col-md-6 p-4 bg-light bg-opacity-25">
                  <h6 className="text-primary fw-bold mb-4 d-flex align-items-center gap-2" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>
                    <GraduationCap size={18} /> ACADEMIC DETAILS
                  </h6>
                  <div className="d-flex flex-column gap-3">
                    <InfoRow icon={<BookOpen size={18}/>} label="Qualification" value={profile?.studentQualification} />
                    <InfoRow icon={<GraduationCap size={18}/>} label="Program" value={profile?.studentProgram} />
                    <InfoRow icon={<Calendar size={18}/>} label="Joined Date" value={formatDate(profile?.studentAcademicYear)} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Information Row component for consistent left alignment
const InfoRow = ({ icon, label, value }) => {
  const isInvalid = !value || value === "null" || value === 0 || value === "0";
  return (
    <div className="d-flex align-items-center gap-3">
      <div className="text-primary bg-primary bg-opacity-10 p-2 rounded-3">
        {icon}
      </div>
      <div className="flex-grow-1 text-start">
        <label className="d-block text-muted fw-bold mb-0" style={{ fontSize: '0.7rem' }}>
          {label.toUpperCase()}
        </label>
        <span className={`fw-bold ${isInvalid ? 'text-muted opacity-50' : 'text-dark'}`} style={{ fontSize: '0.95rem' }}>
          {isInvalid ? 'Not Provided' : value}
        </span>
      </div>
    </div>
  );
};

const formatDate = (dateString) => {
  if (!dateString || dateString.startsWith("0001")) return null;
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
};

export default StudentProfileModal;