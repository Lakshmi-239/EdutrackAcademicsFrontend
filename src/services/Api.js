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
  getQualifications: async () => {
    const res = await axios.get(`${BASE_URL}/admin/qualifications`);
    return res.data;
  },
  postQualification: async (payload) => {
    const res = await axios.post(`${BASE_URL}/admin/qualification`, payload);
    return res.data;
  },
  // Added Put & Delete for Qualifications
  updateQualification: async (id, payload) => {
    const res = await axios.put(`${BASE_URL}/admin/qualification/${id}`, payload);
    return res.data;
  },
  deleteQualification: async (id) => {
    return await axios.delete(`${BASE_URL}/admin/qualification/${id}`);
  },

  // --- PROGRAMS ---
  getPrograms: async () => {
    const res = await axios.get(`${BASE_URL}/admin/programs`);
    return res.data;
  },
  postProgram: async (payload) => {
    const res = await axios.post(`${BASE_URL}/admin/program`, payload);
    return res.data;
  },
  // Added Put for Programs
  updateProgram: async (id, payload) => {
    const res = await axios.put(`${BASE_URL}/admin/program/${id}`, payload);
    return res.data;
  },
  deleteProgram: async (id) => {
    return await axios.delete(`${BASE_URL}/admin/program/${id}`);
  },

  // --- ACADEMIC YEARS (Mapping) ---
  // Added 4 methods for Academic Year
  getAcademicYears: async () => {
    const res = await axios.get(`${BASE_URL}/admin/academicyears`);
    return res.data;
  },
  postAcademicYear: async (payload) => {
    const res = await axios.post(`${BASE_URL}/admin/academicyear`, payload);
    return res.data;
  },
  updateAcademicYear: async (id, payload) => {
    const res = await axios.put(`${BASE_URL}/admin/academicyear/${id}`, payload);
    return res.data;
  },
  deleteAcademicYear: async (id) => {
    return await axios.delete(`${BASE_URL}/admin/academicyear/${id}`);
  },

  // --- ACADEMIC RULES ---
  getRules: async () => {
    const res = await axios.get(`${BASE_URL}/admin/rules`);
    return res.data;
  },
  postRule: async (payload) => {
    const res = await axios.post(`${BASE_URL}/admin/rules`, payload);
    return res.data;
  },
  updateRule: async (name, payload) => {
    const res = await axios.put(`${BASE_URL}/admin/rule/${name}`, payload);
    return res.data;
  },
  deleteRule: async (name) => {
    return await axios.delete(`${BASE_URL}/admin/rule/${name}`);
  },

};
// At the bottom of src/services/api.js

export default api;