import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Form, Button, Table, Row, Col } from "react-bootstrap";
import { FaPlus, FaTrashAlt } from "react-icons/fa";

const PostPrograms = ({ qualifications = [] }) => {
  const [programs, setPrograms] = useState([]);
  const [programName, setProgramName] = useState("");
  const [selectedQualName, setSelectedQualName] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. IMPROVED FETCHER: This handles the data after a refresh
  const fetchPrograms = async () => {
    try {
      const res = await axios.get("https://localhost:7157/api/admin/programs");
      
      // If the API returns a list, ensure we grab the name from the correct property
      const mappedPrograms = res.data.map(p => ({
        id: p.programId || p.ProgramId || p.id,
        name: p.programName || p.ProgramName,
        // Check every possible location for the qualification name
        qualName: p.qualificationName || 
                  p.QualificationName || 
                  p.qualification?.qualificationName || 
                  p.Qualification?.QualificationName || 
                  "N/A"
      }));
      
      setPrograms(mappedPrograms);
    } catch (err) {
      console.error("Error fetching programs:", err);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!programName.trim() || !selectedQualName) {
      return alert("Please fill in all fields");
    }

    setLoading(true);
    try {
      const payload = {
        programName: programName.trim(),
        qualificationName: selectedQualName
      };

      const res = await axios.post("https://localhost:7157/api/admin/program", payload);

      // 2. Add new program to state immediately
      const newProgram = {
        id: res.data.programId || res.data.id || Math.random(),
        name: programName.trim(),
        qualName: selectedQualName
      };

      setPrograms(prev => [...prev, newProgram]);
      setProgramName("");
      setSelectedQualName("");
      alert("✅ Program added successfully");
    } catch (err) {
      alert("Failed to add program");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this program?")) return;
    try {
      await axios.delete(`https://localhost:7157/api/admin/program/${id}`);
      setPrograms(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <Card className="p-4 shadow-sm mt-4 border-0">
      <h3 className="text-center mb-4">Add Program</h3>
      <Form onSubmit={handleAdd}>
        <Row className="g-3 align-items-end justify-content-center">
          <Col md={4}>
            <Form.Group>
              <Form.Label className="fw-bold">Program Name *</Form.Label>
              <Form.Control
                placeholder="Enter program name"
                value={programName}
                onChange={e => setProgramName(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label className="fw-bold">Qualification *</Form.Label>
              <Form.Select
                value={selectedQualName}
                onChange={e => setSelectedQualName(e.target.value)}
              >
                <option value="">Select Qualification...</option>
                {qualifications.map((q, i) => (
                  <option key={q.id || i} value={q.name}>{q.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={1}>
            <Button type="submit" disabled={loading} className="w-100 py-2">
               <FaPlus />
            </Button>
          </Col>
        </Row>
      </Form>

      <div className="mt-5">
        <h4 className="text-center mb-4">Existing Programs</h4>
        <Table hover responsive className="text-center">
          <thead>
            <tr>
              <th>#</th>
              <th>Program Name</th>
              <th>Qualification</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {programs.length > 0 ? (
              programs.map((p, i) => (
                <tr key={p.id || i}>
                  <td>{i + 1}</td>
                  <td>{p.name}</td>
                  <td className="text-primary fw-bold">
                    {p.qualName}
                  </td>
                  <td>
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      onClick={() => handleDelete(p.id)}
                      className="d-inline-flex align-items-center gap-1"
                    >
                      <FaTrashAlt /> Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-muted py-3">No programs found.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </Card>
  );
};

export default PostPrograms;

// import React, { useState, useEffect } from "react";
// import { Card, Form, Button, Table, Row, Col } from "react-bootstrap";
// import { FaPlus, FaTrashAlt, FaEdit, FaTimes, FaCheck } from "react-icons/fa";
// // import { api } from "../api"; // Adjust this path to your api.js location

// const PostPrograms = ({ qualifications = [] }) => {
//   const [programs, setPrograms] = useState([]);
//   const [programName, setProgramName] = useState("");
//   const [selectedQualName, setSelectedQualName] = useState("");
//   const [loading, setLoading] = useState(false);
  
//   // States for Editing
//   const [isEditing, setIsEditing] = useState(false);
//   const [editId, setEditId] = useState(null);

//   // 1. GET: Fetch programs using centralized API
//   const fetchPrograms = async () => {
//     try {
//       const data = await api.getPrograms();
//       const mappedPrograms = data.map(p => ({
//         id: p.programId || p.ProgramId || p.id,
//         name: p.programName || p.ProgramName,
//         qualName: p.qualificationName || 
//                   p.QualificationName || 
//                   p.qualification?.qualificationName || 
//                   "N/A"
//       }));
//       setPrograms(mappedPrograms);
//     } catch (err) {
//       console.error("Error fetching programs:", err);
//     }
//   };

//   useEffect(() => {
//     fetchPrograms();
//   }, []);

//   // 2. POST & PUT: Handle Add or Update
//   const handleSave = async (e) => {
//     e.preventDefault();
//     if (!programName.trim() || !selectedQualName) {
//       return alert("Please fill in all fields");
//     }

//     setLoading(true);
//     try {
//       const payload = {
//         programName: programName.trim(),
//         qualificationName: selectedQualName
//       };

//       if (isEditing) {
//         // CALL PUT API
//         await api.updateProgram(editId, payload);
//         alert("✅ Program updated successfully");
//       } else {
//         // CALL POST API
//         await api.postProgram(payload);
//         alert("✅ Program added successfully");
//       }

//       resetForm();
//       fetchPrograms(); // Refresh the list
//     } catch (err) {
//       alert(err.response?.data || "Operation failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 3. DELETE: Handle removal
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this program?")) return;
//     try {
//       await api.deleteProgram(id);
//       setPrograms(prev => prev.filter(p => p.id !== id));
//     } catch (err) {
//       alert("Delete failed");
//     }
//   };

//   // Helper: Prepare for Edit
//   const handleEdit = (p) => {
//     setIsEditing(true);
//     setEditId(p.id);
//     setProgramName(p.name);
//     setSelectedQualName(p.qualName);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const resetForm = () => {
//     setProgramName("");
//     setSelectedQualName("");
//     setIsEditing(false);
//     setEditId(null);
//   };

//   return (
//     <Card className="p-4 shadow-sm mt-4 border-0">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h3 className="mb-0">{isEditing ? 'Edit Program' : 'Add Program'}</h3>
//         {isEditing && (
//           <Button variant="outline-secondary" size="sm" onClick={resetForm}>
//             <FaTimes /> Cancel
//           </Button>
//         )}
//       </div>

//       <Form onSubmit={handleSave}>
//         <Row className="g-3 align-items-end justify-content-center">
//           <Col md={4}>
//             <Form.Group>
//               <Form.Label className="fw-bold">Program Name *</Form.Label>
//               <Form.Control
//                 placeholder="Enter program name"
//                 value={programName}
//                 onChange={e => setProgramName(e.target.value)}
//               />
//             </Form.Group>
//           </Col>
//           <Col md={4}>
//             <Form.Group>
//               <Form.Label className="fw-bold">Qualification *</Form.Label>
//               <Form.Select
//                 value={selectedQualName}
//                 onChange={e => setSelectedQualName(e.target.value)}
//               >
//                 <option value="">Select Qualification...</option>
//                 {qualifications.map((q, i) => (
//                   <option key={q.id || i} value={q.name}>{q.name}</option>
//                 ))}
//               </Form.Select>
//             </Form.Group>
//           </Col>
//           <Col md={2}>
//             <Button 
//               type="submit" 
//               variant={isEditing ? "success" : "primary"} 
//               disabled={loading} 
//               className="w-100 py-2 d-flex align-items-center justify-content-center gap-2"
//             >
//               {loading ? '...' : isEditing ? <><FaCheck /> Update</> : <><FaPlus /> Add</>}
//             </Button>
//           </Col>
//         </Row>
//       </Form>

//       <div className="mt-5">
//         <h4 className="text-center mb-4">Existing Programs</h4>
//         <Table hover responsive className="text-center">
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Program Name</th>
//               <th>Qualification</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {programs.length > 0 ? (
//               programs.map((p, i) => (
//                 <tr key={p.id || i}>
//                   <td>{i + 1}</td>
//                   <td>{p.name}</td>
//                   <td className="text-primary fw-bold">{p.qualName}</td>
//                   <td>
//                     <div className="d-flex justify-content-center gap-2">
//                       <Button 
//                         variant="outline-warning" 
//                         size="sm" 
//                         onClick={() => handleEdit(p)}
//                         className="d-inline-flex align-items-center gap-1"
//                       >
//                         <FaEdit /> Edit
//                       </Button>
//                       <Button 
//                         variant="outline-danger" 
//                         size="sm" 
//                         onClick={() => handleDelete(p.id)}
//                         className="d-inline-flex align-items-center gap-1"
//                       >
//                         <FaTrashAlt /> Delete
//                       </Button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="4" className="text-muted py-3">No programs found.</td>
//               </tr>
//             )}
//           </tbody>
//         </Table>
//       </div>
//     </Card>
//   );
// };

// export default PostPrograms;