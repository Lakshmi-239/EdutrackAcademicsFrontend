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

};




