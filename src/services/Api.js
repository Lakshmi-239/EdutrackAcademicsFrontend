import axios from 'axios';

// Set the base URL of your .NET backend (check your Properties/launchSettings.json)
const BASE_URL = 'https://localhost:7157/api'; 

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

  
