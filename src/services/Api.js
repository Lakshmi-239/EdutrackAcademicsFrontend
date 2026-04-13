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
  }

};
// //  ADDEDD BY PERFORMANCE
// export const getInstructorBatches = async (id) => {
//   const res = await axios.get(`${BASE_URL}/Performance/instructor-batches/${id}`);
//   return res.data;
// };

// export const getBatchDetails = async (batchId) => {
//     const res = await axios.get(`${BASE_URL}/Performance/batch/${batchId}`);
//     return res.data;
// };
// export const getCompletionRate = async (id) => {
//   const res = await axios.get(`${BASE_URL}/Performance/completion-rate/${id}`);
//   return res.data;
// };
// export const getOngoingBatchesCount = async (id) => {
//   const res = await axios.get(`${BASE_URL}/Performance/ongoing-batches/${id}`);
//   return res.data;
// };
// //  ADDEDD BY PERFORMANCE
 
// // Addedd by performance


// export const getFullReport = async () => {
//   try {
//     // Note: Swagger shows the endpoint as /AcademicReport/full-report
//     const response = await axios.get(`${BASE_URL}/AcademicReport/full-report`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching full report:", error);
//     throw error;
//   }
// };


// // services/Api.js
// // services/Api.js
// export const getBatchClassCount = async (instructorId) => {
//   try {
//     // REMOVED the extra "/api" from the string below
//     const response = await axios.get(`${BASE_URL}/Performance/batch-class-count/${instructorId}`);
//     return response.data; 
//   } catch (error) {
//     console.error("API Error:", error);
//     return []; 
//   }
// };
// export const getBatchStartDates = async () => {
//   const res = await axios.get(`${BASE_URL}/Performance/batch-start-dates`);
//   return res.data; 
// };


// // Matches your [HttpDelete("student/{enrollmentId}")]
// export const deleteStudent = (enrollmentId) => 
//   axios.delete(`${BASE_URL}/Performance/student/${enrollmentId}`);

// // Matches your [HttpPut("student")]
// export const updateStudent = (studentData) => 
//   axios.put(`${BASE_URL}/Performance/student`, studentData);


