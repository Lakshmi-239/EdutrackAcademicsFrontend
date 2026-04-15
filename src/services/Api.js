import axios from 'axios';

// Set the base URL of your .NET backend (check your Properties/launchSettings.json)
const BASE_URL = 'https://localhost:7157/api'; 

axios.interceptors.request.use((config) => {
  // CHANGED: Match the key 'authToken' used in your AuthProvider
  const token = localStorage.getItem('authToken'); 
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export const api = {
  getPrograms: async () => {
    try {
      // Note: The string must match your [HttpGet("GetAllqualification")]
      const response = await axios.get(`${BASE_URL}/admin/qualifications`);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },
  getCourses: async () => {
    try {
      // Ensure this matches your [HttpGet] route in C#
      const response = await axios.get(`${BASE_URL}/coordinator/COURSES`);
      return response.data;
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }
  },

  // Add these to your export const api = { ... }
getAssignedBatches: (instructorId) => 
    axios.get(`${BASE_URL}/coordinator/instructor/${instructorId}/batches`),

getInstructorDashboard: (instructorId) => 
    axios.get(`${BASE_URL}/coordinator/instructor/${instructorId}/dashboard`),

getInstructorBatches: (instructorId) => 
    axios.get(`${BASE_URL}/coordinator/instructor/${instructorId}/batches`),

getStudentsByBatchId : (batchId) =>    // **
    axios.get(`${BASE_URL}/coordinator/batch/${batchId}/students`),
getStudentPersonalInfo: (id) => axios.get(`${BASE_URL}/profile/personal-info/${id}`),   // **
getStudentProgramDetails: (id) => axios.get(`${BASE_URL}/profile/program-details/${id}`),  // **

  // Module Actions
    // getModulesByCourse: (courseId) => axios.get(`${BASE_URL}/modules/${courseId}`),
    // createModule: (data) => axios.post(`${BASE_URL}/module`, data),
    // deleteModule: (moduleId) => axios.delete(`${BASE_URL}/module/${moduleId}`),

    // getModulesByCourseId: (courseId) => 
    // axios.get(`${BASE_URL}/instructorModuleContent/modules/${courseId}`),

  // UNCOMMENT THESE to make the buttons in your Card work:
  deleteModule: (id) => 
    axios.delete(`${BASE_URL}/instructorModuleContent/module/${id}`),

  getContentByModule: (moduleId) => 
    axios.get(`${BASE_URL}/instructorModuleContent/content/module/${moduleId}`),

  createContent: (data) => 
    axios.post(`${BASE_URL}/instructorModuleContent/content`, data),
  
  updateContent: (id, data) => 
    axios.put(`${BASE_URL}/instructorModuleContent/content/${id}`, data),
  
  publishContent: (id) => 
    axios.put(`${BASE_URL}/instructorModuleContent/content/publish/${id}`),  // **

  createModule: async (dto) => {             // **
    try {
        const response = await axios.post(`${BASE_URL}/instructorModuleContent/module`, dto);
        return response.data;
    } catch (error) {
        // Log the exact error from the server to the console
        console.error("Module Creation Error:", error.response?.data);
        throw error;
    }
},
  
  deleteContent: (id) => 
    axios.delete(`${BASE_URL}/instructorModuleContent/content/${id}`),

  // attendance actions       // **
  getBatches: () => 
        axios.get(`${BASE_URL}/coordinator/batches`),
getAttendanceSummary: () => 
    axios.get(`${BASE_URL}/instructorAttendance/attendanceSummary`),
getAttendanceDetails: (batchId, date) => 
    axios.get(`${BASE_URL}/instructorAttendance/attendance/${batchId}/${date}`),
getBatches: () => 
    axios.get(`${BASE_URL}/instructorAttendance/batches`),
getStudentsForAttendance: (batchId) => 
    axios.get(`${BASE_URL}/instructorAttendance/attendance/students/${batchId}`),
markBatchAttendance: (data) => 
    axios.post(`${BASE_URL}/instructorAttendance/batchAttendance`, data),
getDeletedAttendanceSummary: () => axios.get(`${BASE_URL}/instructorAttendance/attendance/deleted`),
deleteBatchAttendance: (batchId, date, reason) => 
    axios.delete(`${BASE_URL}/instructorAttendance/attendance/batch/${batchId}/${date}`, {
      params: { reason } 
    }),
restoreBatchAttendance: (batchId, date) => 
    axios.put(`${BASE_URL}/instructorAttendance/attendance/restore/${batchId}/${date}`),
getInstructorBatches: (instructorId) => 
    axios.get(`${BASE_URL}/coordinator/instructor/${instructorId}/batches`),
updateStudentStatus: (attendanceId, status) => 
  axios.patch(`${BASE_URL}/instructorAttendance/status/${attendanceId}`, { 
    status: status 
  }),
getInstructorCourses : async (instructorId) => {
    try {
        const response = await axios.get(`${BASE_URL}/instructorAttendance/instructor/${instructorId}/courses`);
        return response.data; 
    } catch (error) {
        console.error("Error fetching instructor courses:", error);
        throw error;
    }
},
getBatchByCourse: async (courseId, courseName) => {
    return await axios.get(`${BASE_URL}/instructorAttendance/get-batch`, {
        params: { courseId, courseName }
    });
},
getCoursesByInstructor: async (instructorId) => {
    const response = await fetch(`${BASE_URL}/instructorAssessmentQuestion/instructor/${instructorId}/courses`);
    return await response.json();
},
createAssessment: async (assessmentData) => {
    // FIX: Changed single quotes to backticks below
    const response = await fetch(`${BASE_URL}/instructorAssessmentQuestion/assessment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assessmentData),
    });
    
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
    }
    return await response.json();
},
getAssessmentStatusCount: async (assessmentId) => {
    const response = await fetch(`${BASE_URL}/instructorAssessmentQuestion/assessment/${assessmentId}/status`);
    if (!response.ok) throw new Error("Failed to fetch status");
    return await response.json();
},
getSubmissionsByAssessment: async (assessmentId) => {
    const response = await fetch(`${BASE_URL}/instructorAssessmentQuestion/assessment/${assessmentId}/details`);
    if (!response.ok) throw new Error("Failed to fetch submission details");
    return await response.json(); 
},
getInstructorCurriculumData: async (instructorId) => {
    try {
        const response = await axios.get(`${BASE_URL}/instructorModuleContent/dashboard/${instructorId}/dashboardCurriculum`);
        return response.data;
    } catch (error) {
        console.error("API Error fetching curriculum:", error);
        throw error;
    }
},
getAssessmentsByDate: (date) => axios.get(`${BASE_URL}/instructorAssessmentQuestion/assessments/date/${date}`),
getAllModules: async () => {
    // This matches the URL in your Swagger screenshot
    return await axios.get(`${BASE_URL}/instructorModuleContent/modules`);
  },







  updateContent: (id, data) => axios.put(`${BASE_URL}/instructorModuleContent/content/${id}`, data),  //** 
  //  getModulesByCourseId: (courseId) => axios.get(`${BASE_URL}/instructorModuleContent/modules/${courseId}`),   // **
   updateModule: (moduleId, dto) => axios.put(`${BASE_URL}/instructorModuleContent/module/${moduleId}`, dto),  //** 
 
  getBatches: () => axios.get(`${BASE_URL}/batches`),
    
    getEnrollmentsByBatch: (batchId) => 
        axios.get(`${BASE_URL}/batch/${batchId}/enrollments`),
    
    markBatchAttendance: (data) => 
        axios.post(`${BASE_URL}/instructorAttendance/batchAttendance`, data),
    
    getAttendanceHistory: () => 
        axios.get(`${BASE_URL}/instructorAttendance/attendance`),
    
    patchStatus: (attendanceId, enrollmentId, status) => 
        axios.patch(`${BASE_URL}/instructorAttendance/attendance/${attendanceId}`, { enrollmentId, status }),
    
    deleteAttendance: (id, reason) => 
        axios.delete(`${BASE_URL}/instructorAttendance/attendance/${id}?reason=${reason}`),

  // Instructor Assessment

  createAssessment: async (assessmentData) => {
    const response = await axios.post(`${BASE_URL}/instructorAssessmentQuestion/assessment`, assessmentData);
    return response.data;
  },
getAllAssessments: async () => {
    // Matches your [HttpGet("assessments")] in InstructorAssessmentController
    const response = await axios.get(`${BASE_URL}/instructorAssessmentQuestion/assessments`);
    return response.data;
},
deleteAssessment: async (id) => {
    const response = await axios.delete(`${BASE_URL}/instructorAssessmentQuestion/assessment/${id}`);
    return response.data;
  },
getQuestionsByAssessment: async (assessmentId) => {
    const response = await axios.get(`${BASE_URL}/instructorAssessmentQuestion/questions/assessment/${assessmentId}`);
    return response.data;
  },
addQuestion: async (dto) => {
    const response = await axios.post(`${BASE_URL}/instructorAssessmentQuestion/question`, dto);
    return response.data;
},
updateQuestion: async (questionId, data) => {
    const response = await axios.put(
      `${BASE_URL}/instructorAssessmentQuestion/question/${questionId}`, 
      data
    );
    return response.data;
  },
deleteQuestion: async (questionId) => {
    return await axios.delete(`${BASE_URL}/instructorAssessmentQuestion/question/${questionId}`); 
},
  getQuestionById: async (questionId) => {
    const response = await axios.get(`${BASE_URL}/instructorAssessmentQuestion/question/${questionId}`);
    return response.data;
  },
// getSubmissionsByAssessment: async (assessmentId) => {
//     try {
//       const response = await axios.get(`${BASE_URL}/Submission/assessment/${assessmentId}`);
//       return response.data; // This returns { status: 200, data: [...] }
//     } catch (error) {
//       console.error("Error fetching submissions:", error);
//       throw error;
//     }
//   },


  registerStudent: async (studentData) => {
  try {
    const formData = new FormData();

    Object.keys(studentData).forEach((key) => {
      // Ensure we don't send "null" as a string literal
      if (studentData[key] !== null && studentData[key] !== undefined) {
        // If it's the date, ensure it's a string .NET understands
        formData.append(key, studentData[key]);
      }
    });

    // LOG THIS to your console to see what is actually being sent
    for (var pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    const response = await axios.post(`${BASE_URL}/Registration/Student`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Explicitly set this for [FromForm]
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
   },
  registerInstructor: async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      // If it's the file, it appends as a blob; if it's the date/text, it appends as string
      formData.append(key, data[key]);
    });
    return axios.post(`${BASE_URL}/Registration/Instructor`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  login: async (email, password) => {
    const response = await axios.post(`${BASE_URL}/Authentication/Login`, { email, password });
    return response.data;
  },
  registerCoordinator: (data) => {
    const fd = new FormData();
    Object.keys(data).forEach(key => fd.append(key, data[key]));
    return axios.post(`${BASE_URL}/Registration/Coordinator`, fd);
  },
  generateOtp: async (email) => {
    const response = await axios.post(`${BASE_URL}/Authentication/generate-OTP`, { email });
    return response.data;
  },
  verifyEmail: async (email, otp) => {
    const response = await axios.post(`${BASE_URL}/Authentication/verify-Email`, { email, otp });
    return response.data;
  },
  forgotPassword: async (email) => {
    const response = await axios.post(`${BASE_URL}/Authentication/Forgot-Password`, { email });
    return response.data;
  },
  resetPassword: async (data) => {
    const response = await axios.post(`${BASE_URL}/Authentication/Reset-Password`, data);
    return response.data;
  },
  // 1. Get Personal Info
  getPersonalInfo: async (studentId) => {
    try {
      // Use the passed ID, or fallback to localStorage
      const id = studentId || localStorage.getItem("studentId");
      
      // CRITICAL FIX: Use 'id' in the template literal, not 'studentId'
      const response = await axios.get(`${BASE_URL}/profile/Personal-Information/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error in getPersonalInfo:", error);
      throw error;
    }
  },

  // 2. Get Program Details
  getProgramDetails: async (studentId) => {
    try {
      const id = studentId || localStorage.getItem("studentId");
      
      // CRITICAL FIX: Use 'id' in the template literal, not 'studentId'
      const response = await axios.get(`${BASE_URL}/profile/Program-Details/${id}`);
      return response.data?.details || response.data;
    } catch (error) {
      console.error("Error in getProgramDetails:", error);
      throw error;
    }
  },

  // 3. Update Additional Info
  updateAdditionalInfo: async (studentId, data) => {
    try {
      const id = studentId || localStorage.getItem("studentId");
      
      const response = await axios.put(
        `${BASE_URL}/profile/Additional-Information/${id}`,
        data,
        { headers: { 'Content-Type': 'application/json' } }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating additional info:", error);
      throw error;
    }
  },

  // Ensure you still have this for the Personal Info section
  updatePersonalInfo: async (studentId, data) => {
    const id = studentId || localStorage.getItem("studentId");
    const response = await axios.put(`${BASE_URL}/profile/Personal-Information/${id}`, data);
    return response.data;
  },
  changePassword: async (passwordData) => {
    // passwordData will look like: { email: "...", newPassword: "..." }
    const response = await axios.post(`${BASE_URL}/Authentication/Change-Password`, passwordData);
    return response.data;
   },


  getInstructorBatches: async (id) => {
    const response = await axios.get(`${BASE_URL}/Performance/instructor-batches/${id}`);
    return response.data;
  },
  getClassCounts: async (id) => {
    const response = await axios.get(`${BASE_URL}/Performance/class-counts/${id}`);
    return response.data;
  },

  // Dashboard Card 4 kosam
  getOngoingBatches: async (id) => {
    const response = await axios.get(`${BASE_URL}/Performance/ongoing-batches/${id}`);
    return response.data;
  },

 getBatchCompletionRate: async (id) => {
    const response = await axios.get(`${BASE_URL}/Performance/instructor-completion/${id}`);
    return response.data;
  },

  // Ensure you also have the Batch Report function for the detailed view
  getBatchReport: async (batchId) => {
    const res = await axios.get(`${BASE_URL}/Performance/batch-report/${batchId}`);
    return res.data;
  },
  getOngoingBatches: async (id) => {
    const response = await axios.get(`${BASE_URL}/Performance/ongoing-batches/${id}`);
    return response.data;
  },
getStudentAssessmentStats: (studentId, courseId) => {
  // We move studentId into the URL path as required by your backend
  return axios.get(`${BASE_URL}/Performance/student-assessment-stats/${studentId}`, {
    params: { courseId } // courseId remains a query parameter
  }).then(res => res.data);
},
getCourseDropout: async (courseId) => {
  try {
    const response = await axios.get(`${BASE_URL}/Performance/course-dropout/${courseId}`);
    
    // Axios lo response data 'response.data' lo untundi.
    // Backend {"dropoutRate": 0} pampisthe, manam direct ga aa object ne return chesthunnam.
    return response.data; 
  } catch (error) {
    console.error("Dropout API Error:", error);
    // Error vachina sare 0 return chesthe UI break avvadhu
    return { dropoutRate: 0 };
  }
},
getInstructorBatches: async (id) => {
    const response = await fetch(`https://localhost:7157/api/Performance/instructor-batches/${id}`);
    return await response.json();
  },

  // 2. Get specific batch report (Matches your Swagger screenshot for /batch-report/B001)
  getBatchReport: async (batchId) => {
    const response = await fetch(`https://localhost:7157/api/Performance/batch-report/${batchId}`);
    return await response.json();
  },

  // 3. Get assessment stats (Matches your Swagger screenshot for /student-assessment-stats/S001)
  getStudentAssessmentStats: async (studentId) => {
    const response = await fetch(`https://localhost:7157/api/Performance/student-assessment-stats/${studentId}`);
    return await response.json();
  },
getAdminFullReport: async () => {
    // Corrected path: ${BASE_URL} already includes /api
    const response = await axios.get(`${BASE_URL}/AcademicReport/full-report`);
    return response.data; // This returns the { "batches": [...] } object
  },
getBatchStartDates: async () => {
    try {
      // Corrected: Matches https://localhost:7157/api/Performance/batch-start-dates
      const response = await axios.get(`${BASE_URL}/Performance/batch-start-dates`);
      return response.data;
    } catch (error) {
      console.error("Batch Dates API Error:", error);
      throw error;
    }
  },
};

  
