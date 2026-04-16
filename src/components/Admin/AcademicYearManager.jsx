// import React, { useState, useEffect } from 'react';
// import { Table, Button, Modal, Form, Container, Card, Spinner } from 'react-bootstrap';
// import { adminService } from "../../services/AdminService";
 
// const AcademicYearManager = () => {
//     const [academicYears, setAcademicYears] = useState([]);
//     const [qualifications, setQualifications] = useState([]);
//     const [programs, setPrograms] = useState([]);
//     const [show, setShow] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [isEditMode, setIsEditMode] = useState(false);
//     const [oldYearNum, setOldYearNum] = useState(null); // Patha year number ni track cheyadaniki
 
//     const [form, setForm] = useState({
//         qualificationName: '',
//         programId: '',
//         yearNumber: ''
//     });
 
//     useEffect(() => {
//         loadInitialData();
//     }, []);
 
//     const loadInitialData = async () => {
//         setLoading(true);
//         try {
//             const [yearRes, qualRes, progRes] = await Promise.all([
//                 adminService.getAcademicYears(),
//                 adminService.getQualifications(),
//                 adminService.getPrograms()
//             ]);
//             setAcademicYears(yearRes.data);
//             setQualifications(qualRes.data);
//             setPrograms(progRes.data);
//         } catch (err) {
//             console.error("Data load failure:", err);
//         } finally {
//             setLoading(false);
//         }
//     };
 
//     // Filtered Programs logic
//     const filteredPrograms = programs.filter(p =>
//         p.qualificationName === form.qualificationName
//     );
 
//     // Edit button kottinappudu modal open chesi data set chestundi
//     const handleEdit = (item) => {
//         setIsEditMode(true);
//         setOldYearNum(item.yearNumber); // Patha name/year string identifier ga backend ki pampadaniki
//         setForm({
//             qualificationName: '', // Idhi dropdown user select cheyali filter kosam
//             programId: item.programName,
//             yearNumber: item.yearNumber
//         });
//         setShow(true);
//     };
 
//     const handleClose = () => {
//         setShow(false);
//         setIsEditMode(false);
//         setForm({ qualificationName: '', programId: '', yearNumber: '' });
//     };
 
//     const handleSave = async () => {
//         if (!form.programId || !form.yearNumber) {
//             return alert("Please select program and enter year!");
//         }
 
//         const payload = {
//             programId: form.programId,
//             yearNumber: parseInt(form.yearNumber)
//         };
 
//         try {
//             if (isEditMode) {
//                 // Update logic: patha year number tho vethiki kotha data update chestundi
//                 await adminService.updateAcademicYear(oldYearNum, payload);
//                 alert("Updated Successfully!");
//             } else {
//                 // Add logic
//                 await adminService.addAcademicYear(payload);
//                 alert("Saved Successfully!");
//             }
//             handleClose();
//             loadInitialData();
//         } catch (err) {
//             console.error("Operation Error:", err.response?.data);
//             alert("Operation failed: " + (err.response?.data?.Message || "Check Console"));
//         }
//     };
 
//     const handleDelete = async (yearNum) => {
//         if (window.confirm(`Delete academic year ${yearNum}?`)) {
//             try {
//                 await adminService.deleteAcademicYear(yearNum);
//                 loadInitialData();
//             } catch (err) { alert("Delete failed"); }
//         }
//     };
 
//     return (
//         <Container className="mt-4">
//             <Card className="shadow-sm border-0">
//                 <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center p-3">
//                     <h5 className="mb-0">Academic Year Management</h5>
//                     <Button variant="light" size="sm" onClick={() => setShow(true)} className="fw-bold">
//                         + Add New Year
//                     </Button>
//                 </Card.Header>
//                 <Card.Body className="p-0">
//                     {loading ? (
//                         <div className="text-center p-5"><Spinner animation="border" variant="primary" /></div>
//                     ) : (
//                         <Table hover responsive className="mb-0">
//                             <thead className="table-light">
//                                 <tr>
//                                     <th className="ps-4">Program Name</th>
//                                     <th>Year Number</th>
//                                     <th className="text-end pe-4">Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {academicYears.map((item, idx) => (
//                                     <tr key={idx}>
//                                         <td className="ps-4">{item.programName}</td>
//                                         <td>{item.yearNumber}</td>
//                                         <td className="text-end pe-4">
//                                             <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(item)}>
//                                                 Edit
//                                             </Button>
//                                             <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item.yearNumber)}>
//                                                 Delete
//                                             </Button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </Table>
//                     )}
//                 </Card.Body>
//             </Card>
 
//             <Modal show={show} onHide={handleClose} centered>
//                 <Modal.Header closeButton>
//                     <Modal.Title>{isEditMode ? 'Edit Academic Year' : 'Add Academic Year'}</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <Form>
//                         <Form.Group className="mb-3">
//                             <Form.Label className="fw-bold">Select Qualification</Form.Label>
//                             <Form.Select
//                                 value={form.qualificationName}
//                                 onChange={(e) => setForm({...form, qualificationName: e.target.value, programId: ''})}
//                             >
//                                 <option value="">-- Select Qualification --</option>
//                                 {qualifications.map((q, i) => (
//                                     <option key={i} value={q.qualificationName}>{q.qualificationName}</option>
//                                 ))}
//                             </Form.Select>
//                             {isEditMode && <small className="text-muted">Current Program: {form.programId}</small>}
//                         </Form.Group>
 
//                         <Form.Group className="mb-3">
//                             <Form.Label className="fw-bold">Select Program</Form.Label>
//                             <Form.Select
//                                 value={form.programId}
//                                 onChange={(e) => setForm({...form, programId: e.target.value})}
//                                 disabled={!form.qualificationName && !isEditMode}
//                             >
//                                 <option value="">-- Select Program --</option>
//                                 {filteredPrograms.map((p, i) => (
//                                     <option key={i} value={p.programName}>{p.programName}</option>
//                                 ))}
//                             </Form.Select>
//                         </Form.Group>
 
//                         <Form.Group className="mb-3">
//                             <Form.Label className="fw-bold">Year Number</Form.Label>
//                             <Form.Control
//                                 type="number"
//                                 value={form.yearNumber}
//                                 onChange={(e) => setForm({...form, yearNumber: e.target.value})}
//                             />
//                         </Form.Group>
//                     </Form>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={handleClose}>Cancel</Button>
//                     <Button variant="primary" onClick={handleSave}>
//                         {isEditMode ? 'Update Changes' : 'Save Year'}
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         </Container>
//     );
// };
 
// export default AcademicYearManager;
 import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Container, Card, Spinner } from 'react-bootstrap';
import { adminService } from "../../services/AdminService";
 
const AcademicYearManager = () => {
    const [academicYears, setAcademicYears] = useState([]);
    const [qualifications, setQualifications] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [oldYearNum, setOldYearNum] = useState(null);
 
    const [form, setForm] = useState({
        qualificationName: '',
        programId: '',
        yearNumber: ''
    });
 
    useEffect(() => {
        loadInitialData();
    }, []);
 
    const loadInitialData = async () => {
        setLoading(true);
        try {
            const [yearRes, qualRes, progRes] = await Promise.all([
                adminService.getAcademicYears(),
                adminService.getQualifications(),
                adminService.getPrograms()
            ]);
            setAcademicYears(yearRes.data || []);
            setQualifications(qualRes.data || []);
            setPrograms(progRes.data || []);
        } catch (err) {
            console.error("Data load failure:", err);
        } finally {
            setLoading(false);
        }
    };
 
    const filteredPrograms = programs.filter(p =>
        p.qualificationName === form.qualificationName
    );
 
    const handleEdit = (item) => {
        setIsEditMode(true);
        setOldYearNum(item.yearNumber);
        setForm({
            qualificationName: item.qualificationName || '',
            programId: item.programId || item.programName,
            yearNumber: item.yearNumber
        });
        setShow(true);
    };
 
    const handleClose = () => {
        setShow(false);
        setIsEditMode(false);
        setForm({ qualificationName: '', programId: '', yearNumber: '' });
    };
 
    const handleSave = async () => {
        if (!form.programId || !form.yearNumber) {
            return alert("Please select program and enter year!");
        }
 
        const payload = {
            programId: form.programId,
            yearNumber: parseInt(form.yearNumber)
        };
 
        try {
            if (isEditMode) {
                await adminService.editAcademicYear(oldYearNum, payload);
                alert("Updated Successfully!");
            } else {
                await adminService.addAcademicYear(payload);
                alert("Saved Successfully!");
            }
            handleClose();
            loadInitialData();
        } catch (err) {
            console.error("Operation Error:", err.response?.data);
            alert("Operation failed: " + (err.response?.data?.Message || "Check Console"));
        }
    };
 
    const handleDelete = async (yearNum) => {
        if (window.confirm(`Delete academic year ${yearNum}?`)) {
            try {
                await adminService.deleteAcademicYear(yearNum);
                loadInitialData();
            } catch (err) { alert("Delete failed"); }
        }
    };
 
    return (
        <Container className="mt-4">
            <Card className="shadow-sm border-0">
                <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center p-3">
                    <h5 className="mb-0">Academic Year Management</h5>
                    <Button variant="light" size="sm" onClick={() => setShow(true)} className="fw-bold">+ Add New Year</Button>
                </Card.Header>
                <Card.Body className="p-0">
                    {loading ? (
                        <div className="text-center p-5"><Spinner animation="border" variant="primary" /></div>
                    ) : (
                        <Table hover responsive className="mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="ps-4">Qualification</th>
                                    <th>Program Name</th>
                                    <th>Year Number</th>
                                    <th className="text-end pe-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {academicYears.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="ps-4" style={{fontWeight: '500', color: '#0d6efd'}}>{item.qualificationName}</td>
                                        <td>{item.programName}</td>
                                        <td>{item.yearNumber}</td>
                                        <td className="text-end pe-4">
                                            <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(item)}>Edit</Button>
                                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item.yearNumber)}>Delete</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>
 
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditMode ? 'Edit Academic Year' : 'Add Academic Year'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Select Qualification</Form.Label>
                            <Form.Select value={form.qualificationName} onChange={(e) => setForm({...form, qualificationName: e.target.value, programId: ''})}>
                                <option value="">-- Select Qualification --</option>
                                {qualifications.map((q, i) => (<option key={i} value={q.qualificationName}>{q.qualificationName}</option>))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Select Program</Form.Label>
                            <Form.Select value={form.programId} onChange={(e) => setForm({...form, programId: e.target.value})} disabled={!form.qualificationName}>
                                <option value="">-- Select Program --</option>
                                {filteredPrograms.map((p, i) => (<option key={i} value={p.programId || p.programName}>{p.programName}</option>))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-bold">Year Number</Form.Label>
                            <Form.Control type="number" value={form.yearNumber} onChange={(e) => setForm({...form, yearNumber: e.target.value})} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                    <Button variant="primary" onClick={handleSave}>{isEditMode ? 'Update Changes' : 'Save Year'}</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};
 
export default AcademicYearManager;
 