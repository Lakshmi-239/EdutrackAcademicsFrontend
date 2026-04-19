import axios from 'axios';
 
// Backend run ayyetappudu vachina URL ni ikkada replace cheyi (Check your Swagger)
const API = axios.create({
    baseURL: "https://localhost:7157/api/admin",
});
 
export const adminService = {
    // Qualifications
    getQualifications: () => API.get('/qualifications'),
    addQualification: (dto) => API.post('/qualification', dto),
    editQualification: (name, dto) => API.put(`/qualification/${name}`, dto),
    deleteQualification: (name) => API.delete(`/qualification/${name}`),
 
    // Programs
    getPrograms: () => API.get('/programs'),
    addProgram: (dto) => API.post('/program', dto),
    editProgram: (name, dto) => API.put(`/program/${name}`, dto),
    deleteProgram: (name) => API.delete(`/program/${name}`),
 
    // Academic Years
    getAcademicYears: () => API.get('/academic-years'),
    addAcademicYear: (dto) => API.post('/academic-year', dto),
    editAcademicYear: (name, dto) => API.put(`/academic-year/${name}`, dto),
    deleteAcademicYear: (name) => API.delete(`/academic-year/${name}`),
 
    // Rules
    getRules: () => API.get('/rules'),
    addRule: (dto) => API.post('/rules', dto),
    editRule: (name, dto) => API.put(`/rule/${name}`, dto),
    deleteRule: (name) => API.delete(`/rule/${name}`)
};