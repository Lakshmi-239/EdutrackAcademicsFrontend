import axios from 'axios';

// Set the base URL of your .NET backend (check your Properties/launchSettings.json)
const BASE_URL = 'https://localhost:7157/api'; 

export const api = {
  getPrograms: async () => {
    try {
      // Note: The string must match your [HttpGet("GetAllqualification")]
      const response = await axios.get(`${BASE_URL}/admin/GetAllQualification`);
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

getStudentsInBatch: (batchId) => 
    axios.get(`${BASE_URL}/coordinator/batch/${batchId}/students`),


  // Module Actions
    getModulesByCourse: (courseId) => axios.get(`${BASE_URL}/modules/${courseId}`),
    createModule: (data) => axios.post(`${BASE_URL}/module`, data),
    deleteModule: (moduleId) => axios.delete(`${BASE_URL}/module/${moduleId}`),

  // getModules: (courseId) => axios.get(`${BASE_URL}/instructorModuleContent/modules/${courseId}`),
  // createModule: (data) => axios.post(`${BASE_URL}/instructorModuleContent/module`, data),
  // updateModule: (id, data) => axios.put(`${BASE_URL}/instructorModuleContent/module/${id}`, data),
  // deleteModule: (id) => axios.delete(`${BASE_URL}/instructorModuleContent/module/${id}`),

  // // Content Actions
  // getContent: (moduleId) => axios.get(`${BASE_URL}/instructorModuleContent/content/module/${moduleId}`),
  // createContent: (data) => axios.post(`${BASE_URL}/instructorModuleContent/content`, data),
  // publishContent: (id) => axios.put(`${BASE_URL}/instructorModuleContent/content/publish/${id}`),
  // deleteContent: (id) => axios.delete(`${BASE_URL}/instructorModuleContent/content/${id}`),

  // attendance
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
getSubmissionsByAssessment: async (assessmentId) => {
    try {
      const response = await axios.get(`${BASE_URL}/Submission/assessment/${assessmentId}`);
      return response.data; // This returns { status: 200, data: [...] }
    } catch (error) {
      console.error("Error fetching submissions:", error);
      throw error;
    }
  },


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
  }

};




