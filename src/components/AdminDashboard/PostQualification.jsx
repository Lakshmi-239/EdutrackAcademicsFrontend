import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Form, Button, ListGroup } from 'react-bootstrap';

const PostQualification = ({ qualifications = [], setQualifications }) => {
  const [qualificationName, setQualificationName] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch existing qualifications on mount
  useEffect(() => {
    const fetchQualifications = async () => {
      try {
        const res = await axios.get('https://localhost:7157/api/admin/qualifications');
        
        // Use flexible mapping to catch both QualificationName and qualificationName
        const normalized = res.data.map(q => ({
          id:  q.QualificationId || q.qualificationId || q.id,
          name: q.qualificationName || q.QualificationName || q.name
        }));
        
        setQualifications(normalized);
      } catch (err) {
        console.error('Error fetching qualifications:', err);
      }
    };
    fetchQualifications();
  }, [setQualifications]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!qualificationName.trim()) return alert('Enter a qualification name');

    setLoading(true);
    try {
      const payload = { qualificationName: qualificationName.trim() };
      const res = await axios.post('https://localhost:7157/api/admin/qualification', payload);

      // Normalize the response from the POST request as well
      const newQual = {
        id: res.data.qualificationId || res.data.QualificationId || res.data.id,
        name: res.data.qualificationName || res.data.QualificationName || res.data.name
      };

      setQualifications(prev => [...prev, newQual]);
      setQualificationName('');
      alert('✅ Qualification added successfully');
    } catch (err) {
      console.error(err);
      alert(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 mb-4 shadow-sm">
      <h4 className="text-center mb-4">Add Qualification</h4>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">Qualification Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter qualification"
            value={qualificationName}
            onChange={e => setQualificationName(e.target.value)}
          />
        </Form.Group>
        <Button 
          type="submit" 
          variant="primary" 
          disabled={loading} 
          className="w-100 mb-3"
        >
          {loading ? 'Adding...' : 'Add Qualification'}
        </Button>
      </Form>

      <div className="mt-4">
        <h5 className="text-center">Existing Qualifications</h5>
        <hr />
        {qualifications.length === 0 ? (
          <p className="text-muted text-center">No qualifications found</p>
        ) : (
          <ListGroup variant="flush">
            {qualifications.map((q, index) => (
              <ListGroup.Item key={q.id || index} className="text-center">
                {q.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>
    </Card>
  );
};

export default PostQualification;
// import React, { useState, useEffect } from 'react';
// import { Card, Form, Button, ListGroup, Row, Col, InputGroup } from 'react-bootstrap';
// import { FaTrashAlt, FaEdit, FaTimes, FaCheck } from 'react-icons/fa';
// // import { api } from '../api'; // Adjust this path based on your folder structure

// const PostQualification = ({ qualifications = [], setQualifications }) => {
//   const [qualificationName, setQualificationName] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editId, setEditId] = useState(null);

//   // 1. GET: Fetch existing qualifications on mount
//   const fetchData = async () => {
//     try {
//       const data = await api.getQualifications();
//       // Use flexible mapping to handle backend naming variations
//       const normalized = data.map(q => ({
//         id: q.QualificationId || q.qualificationId || q.id,
//         name: q.qualificationName || q.QualificationName || q.name
//       }));
//       setQualifications(normalized);
//     } catch (err) {
//       console.error('Error fetching qualifications:', err);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [setQualifications]);

//   // 2. POST & PUT: Handle Save (Add or Update)
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!qualificationName.trim()) return alert('Enter a qualification name');

//     setLoading(true);
//     try {
//       const payload = { qualificationName: qualificationName.trim() };

//       if (isEditing) {
//         // CALL PUT API
//         await api.updateQualification(editId, payload);
//         alert('✅ Qualification updated successfully');
//       } else {
//         // CALL POST API
//         const resData = await api.postQualification(payload);
//         // Add to local state immediately for better UX
//         const newQual = {
//           id: resData.qualificationId || resData.id,
//           name: qualificationName.trim()
//         };
//         setQualifications(prev => [...prev, newQual]);
//         alert('✅ Qualification added successfully');
//       }

//       resetForm();
//       fetchData(); // Refresh list to ensure data consistency
//     } catch (err) {
//       alert(err.response?.data || "Operation failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 3. DELETE: Handle removal
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this qualification?")) return;
    
//     try {
//       await api.deleteQualification(id);
//       setQualifications(prev => prev.filter(q => q.id !== id));
//     } catch (err) {
//       alert("Delete failed");
//     }
//   };

//   // Helper: Prepare for Edit
//   const handleEdit = (q) => {
//     setIsEditing(true);
//     setEditId(q.id);
//     setQualificationName(q.name);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const resetForm = () => {
//     setQualificationName('');
//     setIsEditing(false);
//     setEditId(null);
//   };

//   return (
//     <Card className="p-4 mb-4 shadow-sm border-0">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h4 className="mb-0">{isEditing ? 'Edit Qualification' : 'Add Qualification'}</h4>
//         {isEditing && (
//           <Button variant="outline-secondary" size="sm" onClick={resetForm}>
//             <FaTimes /> Cancel
//           </Button>
//         )}
//       </div>

//       <Form onSubmit={handleSubmit}>
//         <Form.Group className="mb-3">
//           <Form.Label className="fw-bold small text-muted text-uppercase">Qualification Name</Form.Label>
//           <InputGroup>
//             <Form.Control
//               type="text"
//               placeholder="e.g. Bachelor of Technology"
//               value={qualificationName}
//               onChange={e => setQualificationName(e.target.value)}
//               className="bg-light border-0 p-2"
//             />
//             <Button 
//               type="submit" 
//               variant={isEditing ? "success" : "primary"} 
//               disabled={loading}
//               className="px-4"
//             >
//               {loading ? '...' : isEditing ? <FaCheck /> : 'Add'}
//             </Button>
//           </InputGroup>
//         </Form.Group>
//       </Form>

//       <div className="mt-4">
//         <h5 className="text-muted small fw-bold text-uppercase mb-3">Existing Qualifications</h5>
//         {qualifications.length === 0 ? (
//           <p className="text-muted text-center py-3 bg-light rounded">No records found</p>
//         ) : (
//           <ListGroup variant="flush">
//             {qualifications.map((q) => (
//               <ListGroup.Item 
//                 key={q.id} 
//                 className="d-flex justify-content-between align-items-center border-bottom-0 mb-2 bg-light rounded"
//               >
//                 <span className="fw-medium">{q.name}</span>
//                 <div className="d-flex gap-2">
//                   <Button 
//                     variant="link" 
//                     className="text-warning p-0" 
//                     onClick={() => handleEdit(q)}
//                   >
//                     <FaEdit size={18} />
//                   </Button>
//                   <Button 
//                     variant="link" 
//                     className="text-danger p-0" 
//                     onClick={() => handleDelete(q.id)}
//                   >
//                     <FaTrashAlt size={18} />
//                   </Button>
//                 </div>
//               </ListGroup.Item>
//             ))}
//           </ListGroup>
//         )}
//       </div>
//     </Card>
//   );
// };

// export default PostQualification;
