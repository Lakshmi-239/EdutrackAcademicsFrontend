import React, { useState } from 'react';
import { Card, Form, Button, Table, Badge, Row, Col } from 'react-bootstrap';
import { FaCalendarAlt, FaPlus, FaTrashAlt, FaLink } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const PostAcademicYear = ({ qualifications, programs, academicYearsList, setAcademicYearsList }) => {
    const [selectedQual, setSelectedQual] = useState('');
    const [selectedProgram, setSelectedProgram] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const years = ['1', '2', '3', '4'];

    const handleAdd = (e) => {
        e.preventDefault();
        if (!selectedQual || !selectedProgram || !selectedYear) return;

        const newEntry = {
            id: Date.now(),
            qualification: selectedQual,
            program: selectedProgram,
            year: selectedYear
        };

        setAcademicYearsList([...academicYearsList, newEntry]);
        setSelectedQual(''); setSelectedProgram(''); setSelectedYear('');
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to remove this mapping?")) {
            setAcademicYearsList(academicYearsList.filter(item => item.id !== id));
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Header Card */}
            <Card className="border-0 shadow-sm mb-4 text-white" style={{ background: 'linear-gradient(90deg, #6610f2 0%, #a020f0 100%)' }}>
                <Card.Body className="p-4 d-flex justify-content-between align-items-center">
                    <div>
                        <h4 className="fw-bold mb-1"><FaCalendarAlt className="me-2"/> Academic Year Mapping</h4>
                        <p className="mb-0 opacity-75">Link qualifications and programs to specific academic years</p>
                    </div>
                    <div className="text-center bg-white bg-opacity-25 p-2 rounded" style={{ minWidth: '80px' }}>
                        <h3 className="mb-0 fw-bold">{academicYearsList.length}</h3>
                        <small className="text-uppercase" style={{ fontSize: '10px' }}>Mappings</small>
                    </div>
                </Card.Body>
            </Card>

            {/* Selection Form */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="p-4">
                    <Form onSubmit={handleAdd}>
                        <Row className="g-3 align-items-end">
                            <Col md={3}>
                                <Form.Label className="small fw-bold text-muted">Qualification</Form.Label>
                                <Form.Select value={selectedQual} onChange={(e) => setSelectedQual(e.target.value)} required>
                                    <option value="">Select...</option>
                                    {qualifications.map(q => <option key={q.id} value={q.name}>{q.name}</option>)}
                                </Form.Select>
                            </Col>
                            <Col md={3}>
                                <Form.Label className="small fw-bold text-muted">Program</Form.Label>
                                <Form.Select value={selectedProgram} onChange={(e) => setSelectedProgram(e.target.value)} required>
                                    <option value="">Select...</option>
                                    {programs.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                                </Form.Select>
                            </Col>
                            <Col md={3}>
                                <Form.Label className="small fw-bold text-muted">Year</Form.Label>
                                <Form.Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} required>
                                    <option value="">Select Year...</option>
                                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                                </Form.Select>
                            </Col>
                            <Col md={3}>
                                <Button type="submit" className="w-100 shadow-sm fw-bold" style={{ background: 'linear-gradient(45deg, #6610f2 0%, #a020f0 100%)', border: 'none' }}>
                                    <FaPlus className="me-2"/> MAP YEAR
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            {/* Display Table */}
            <Card className="border-0 shadow-sm">
                <Table hover responsive className="align-middle mb-0">
                    <thead className="bg-light">
                        <tr className="text-muted small">
                            <th className="ps-4">#</th>
                            <th>QUALIFICATION</th>
                            <th>PROGRAM</th>
                            <th>ACADEMIC YEAR</th>
                            <th className="text-center">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {academicYearsList.length > 0 ? (
                                academicYearsList.map((item, index) => (
                                    <motion.tr 
                                        key={item.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                    >
                                        <td className="ps-4 text-muted">{index + 1}</td>
                                        <td className="fw-bold">{item.qualification}</td>
                                        <td>{item.program}</td>
                                        <td>
                                            <Badge bg="primary" className="px-3 py-2" style={{ borderRadius: '8px', background: '#6610f2' }}>
                                                Year {item.year}
                                            </Badge>
                                        </td>
                                        <td className="text-center">
                                            <Button 
                                                variant="outline-danger" 
                                                size="sm" 
                                                className="border-0"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <FaTrashAlt />
                                            </Button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-muted">
                                        <div className="opacity-25 mb-2" style={{ fontSize: '2rem' }}><FaLink /></div>
                                        No academic year mappings created yet.
                                    </td>
                                </tr>
                            )}
                        </AnimatePresence>
                    </tbody>
                </Table>
            </Card>
        </motion.div>
    );
};

export default PostAcademicYear;

// import React, { useState, useEffect } from 'react';
// import { Card, Form, Button, Table, Badge, Row, Col } from 'react-bootstrap';
// import { FaCalendarAlt, FaPlus, FaTrashAlt, FaLink, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
// import { motion, AnimatePresence } from 'framer-motion';
// // import { api } from '../api'; // Adjust the path to your api.js

// const PostAcademicYear = ({ qualifications, programs, academicYearsList, setAcademicYearsList }) => {
//     const [selectedQual, setSelectedQual] = useState('');
//     const [selectedProgram, setSelectedProgram] = useState('');
//     const [selectedYear, setSelectedYear] = useState('');
//     const [loading, setLoading] = useState(false);
    
//     // States for Editing
//     const [isEditing, setIsEditing] = useState(false);
//     const [editId, setEditId] = useState(null);

//     const years = ['1', '2', '3', '4'];

//     // 1. GET: Fetch existing mappings on mount
//     const fetchMappings = async () => {
//         try {
//             const data = await api.getAcademicYears();
//             // Normalize data to match your component's state structure
//             const normalized = data.map(item => ({
//                 id: item.academicYearId || item.id,
//                 qualification: item.qualificationName || item.qualification,
//                 program: item.programName || item.program,
//                 year: item.yearValue || item.year
//             }));
//             setAcademicYearsList(normalized);
//         } catch (err) {
//             console.error("Error fetching academic years:", err);
//         }
//     };

//     useEffect(() => {
//         fetchMappings();
//     }, []);

//     // 2. POST & PUT: Handle Save
//     const handleSave = async (e) => {
//         e.preventDefault();
//         if (!selectedQual || !selectedProgram || !selectedYear) return;

//         setLoading(true);
//         try {
//             const payload = {
//                 qualificationName: selectedQual,
//                 programName: selectedProgram,
//                 yearValue: selectedYear
//             };

//             if (isEditing) {
//                 await api.updateAcademicYear(editId, payload);
//                 alert("✅ Mapping updated successfully");
//             } else {
//                 await api.postAcademicYear(payload);
//                 alert("✅ Mapping created successfully");
//             }

//             resetForm();
//             fetchMappings(); // Refresh list from server
//         } catch (err) {
//             alert(err.response?.data || "Operation failed");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // 3. DELETE: Handle removal
//     const handleDelete = async (id) => {
//         if (!window.confirm("Are you sure you want to remove this mapping?")) return;
        
//         try {
//             await api.deleteAcademicYear(id);
//             setAcademicYearsList(prev => prev.filter(item => item.id !== id));
//         } catch (err) {
//             alert("Delete failed");
//         }
//     };

//     // Helper: Prepare for Edit
//     const handleEdit = (item) => {
//         setIsEditing(true);
//         setEditId(item.id);
//         setSelectedQual(item.qualification);
//         setSelectedProgram(item.program);
//         setSelectedYear(item.year);
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//     };

//     const resetForm = () => {
//         setSelectedQual('');
//         setSelectedProgram('');
//         setSelectedYear('');
//         setIsEditing(false);
//         setEditId(null);
//     };

//     return (
//         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//             {/* Header Card */}
//             <Card className="border-0 shadow-sm mb-4 text-white" style={{ background: 'linear-gradient(90deg, #6610f2 0%, #a020f0 100%)' }}>
//                 <Card.Body className="p-4 d-flex justify-content-between align-items-center">
//                     <div>
//                         <h4 className="fw-bold mb-1"><FaCalendarAlt className="me-2"/> Academic Year Mapping</h4>
//                         <p className="mb-0 opacity-75">Link qualifications and programs to specific academic years</p>
//                     </div>
//                     <div className="text-center bg-white bg-opacity-25 p-2 rounded" style={{ minWidth: '80px' }}>
//                         <h3 className="mb-0 fw-bold">{academicYearsList.length}</h3>
//                         <small className="text-uppercase" style={{ fontSize: '10px' }}>Mappings</small>
//                     </div>
//                 </Card.Body>
//             </Card>

//             {/* Selection Form */}
//             <Card className="border-0 shadow-sm mb-4">
//                 <Card.Body className="p-4">
//                     <div className="d-flex justify-content-between align-items-center mb-3">
//                         <h5 className="mb-0 text-muted small fw-bold text-uppercase">
//                             {isEditing ? "Edit Mapping" : "Create New Mapping"}
//                         </h5>
//                         {isEditing && (
//                             <Button variant="link" className="text-secondary p-0" onClick={resetForm}>
//                                 <FaTimes /> Cancel
//                             </Button>
//                         )}
//                     </div>
//                     <Form onSubmit={handleSave}>
//                         <Row className="g-3 align-items-end">
//                             <Col md={3}>
//                                 <Form.Label className="small fw-bold text-muted">Qualification</Form.Label>
//                                 <Form.Select value={selectedQual} onChange={(e) => setSelectedQual(e.target.value)} required>
//                                     <option value="">Select...</option>
//                                     {qualifications.map(q => <option key={q.id} value={q.name}>{q.name}</option>)}
//                                 </Form.Select>
//                             </Col>
//                             <Col md={3}>
//                                 <Form.Label className="small fw-bold text-muted">Program</Form.Label>
//                                 <Form.Select value={selectedProgram} onChange={(e) => setSelectedProgram(e.target.value)} required>
//                                     <option value="">Select...</option>
//                                     {programs.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
//                                 </Form.Select>
//                             </Col>
//                             <Col md={2}>
//                                 <Form.Label className="small fw-bold text-muted">Year</Form.Label>
//                                 <Form.Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} required>
//                                     <option value="">Select Year...</option>
//                                     {years.map(y => <option key={y} value={y}>{y}</option>)}
//                                 </Form.Select>
//                             </Col>
//                             <Col md={4}>
//                                 <Button 
//                                     type="submit" 
//                                     disabled={loading}
//                                     className="w-100 shadow-sm fw-bold d-flex align-items-center justify-content-center gap-2" 
//                                     style={{ background: isEditing ? '#28a745' : 'linear-gradient(45deg, #6610f2 0%, #a020f0 100%)', border: 'none' }}
//                                 >
//                                     {loading ? 'Processing...' : isEditing ? <><FaCheck /> UPDATE MAPPING</> : <><FaPlus /> MAP YEAR</>}
//                                 </Button>
//                             </Col>
//                         </Row>
//                     </Form>
//                 </Card.Body>
//             </Card>

//             {/* Display Table */}
//             <Card className="border-0 shadow-sm">
//                 <Table hover responsive className="align-middle mb-0 text-center">
//                     <thead className="bg-light">
//                         <tr className="text-muted small">
//                             <th className="ps-4">#</th>
//                             <th>QUALIFICATION</th>
//                             <th>PROGRAM</th>
//                             <th>ACADEMIC YEAR</th>
//                             <th>ACTIONS</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         <AnimatePresence>
//                             {academicYearsList.length > 0 ? (
//                                 academicYearsList.map((item, index) => (
//                                     <motion.tr 
//                                         key={item.id}
//                                         initial={{ opacity: 0, y: 10 }}
//                                         animate={{ opacity: 1, y: 0 }}
//                                         exit={{ opacity: 0, x: -20 }}
//                                     >
//                                         <td className="ps-4 text-muted">{index + 1}</td>
//                                         <td className="fw-bold">{item.qualification}</td>
//                                         <td>{item.program}</td>
//                                         <td>
//                                             <Badge bg="primary" className="px-3 py-2" style={{ borderRadius: '8px', background: '#6610f2' }}>
//                                                 Year {item.year}
//                                             </Badge>
//                                         </td>
//                                         <td>
//                                             <div className="d-flex justify-content-center gap-2">
//                                                 <Button 
//                                                     variant="link" 
//                                                     className="text-warning p-0"
//                                                     onClick={() => handleEdit(item)}
//                                                 >
//                                                     <FaEdit />
//                                                 </Button>
//                                                 <Button 
//                                                     variant="link" 
//                                                     className="text-danger p-0"
//                                                     onClick={() => handleDelete(item.id)}
//                                                 >
//                                                     <FaTrashAlt />
//                                                 </Button>
//                                             </div>
//                                         </td>
//                                     </motion.tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan="5" className="text-center py-5 text-muted">
//                                         <div className="opacity-25 mb-2" style={{ fontSize: '2rem' }}><FaLink /></div>
//                                         No academic year mappings created yet.
//                                     </td>
//                                 </tr>
//                             )}
//                         </AnimatePresence>
//                     </tbody>
//                 </Table>
//             </Card>
//         </motion.div>
//     );
// };

// export default PostAcademicYear;