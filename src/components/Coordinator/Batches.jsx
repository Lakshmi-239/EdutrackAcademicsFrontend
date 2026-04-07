import React, { useState } from "react";
import axios from "axios";
 
const Batches = () => {
  const [courseId, setCourseId] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [batchSize, setBatchSize] = useState("");
  const [batches, setBatches] = useState([]);
 
  // FETCH
  const fetchStudents = async () => {
    if (!courseId) return alert("Enter Course ID");
 
    try {
      const res = await axios.get(
        "https://localhost:7157/api/coordinator/eligible-students",
        { params: { courseId } }
      );
 
      setStudents(Array.isArray(res.data) ? res.data : []);
      setSelectedStudents([]);
      setBatches([]);
    } catch {
      alert("Error fetching students");
    }
  };
 
  // SELECT
  const toggleStudent = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id]
    );
  };
 
  const selectAll = () => {
    setSelectedStudents(
      selectedStudents.length === students.length
        ? []
        : students.map((s) => s.studentId)
    );
  };
 
  // GENERATE
  const generateBatches = () => {
    if (!batchSize || batchSize <= 0)
      return alert("Enter valid batch size");
 
    if (selectedStudents.length === 0)
      return alert("Select students");
 
    let temp = [];
    for (let i = 0; i < selectedStudents.length; i += batchSize) {
      temp.push({
        instructorId: "",
        studentIds: selectedStudents.slice(i, i + batchSize)
      });
    }
 
    setBatches(temp);
  };
 
  const setInstructor = (index, value) => {
    const updated = [...batches];
    updated[index].instructorId = value;
    setBatches(updated);
  };
 
  // SUBMIT
  const submitBatches = async () => {
    for (let b of batches) {
      if (!b.instructorId)
        return alert("Select instructor for all batches");
    }
 
    try {
      await axios.post(
        "https://localhost:7157/api/coordinator/assign-batches",
        {
          courseId,
          batches
        }
      );
 
      alert("Batches Assigned Successfully ✅");
 
      setStudents([]);
      setSelectedStudents([]);
      setBatches([]);
      setBatchSize("");
    } catch {
      alert("Error assigning batches");
    }
  };
 
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎯 Batch Assignment Dashboard</h1>
 
      {/* COURSE INPUT */}
      <div style={styles.card}>
        <input
          style={styles.input}
          placeholder="Enter Course ID (e.g., C001)"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
        />
        <button style={styles.primaryBtn} onClick={fetchStudents}>
          Fetch Students
        </button>
      </div>
 
      {/* STUDENTS */}
      <div style={styles.card}>
        <div style={styles.headerRow}>
          <h3>Students</h3>
          <button style={styles.secondaryBtn} onClick={selectAll}>
            Select All
          </button>
        </div>
 
        <div style={{ maxHeight: "200px", overflowY: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Select</th>
                <th>ID</th>
                <th>Name</th>
              </tr>
            </thead>
 
            <tbody>
              {students.length > 0 ? (
                students.map((s) => (
                  <tr key={s.studentId}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(s.studentId)}
                        onChange={() => toggleStudent(s.studentId)}
                      />
                    </td>
                    <td>{s.studentId}</td>
                    <td>{s.studentName}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No students found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
 
      {/* BATCH SIZE */}
      <div style={styles.card}>
        <h3>Batch Settings</h3>
        <input
          style={styles.input}
          type="number"
          placeholder="Enter batch size"
          value={batchSize}
          onChange={(e) => setBatchSize(Number(e.target.value))}
        />
        <button style={styles.primaryBtn} onClick={generateBatches}>
          Generate Batches
        </button>
      </div>
 
      {/* BATCHES */}
      {batches.length > 0 && (
        <div style={styles.card}>
          <h3>Generated Batches</h3>
 
          <div style={styles.batchGrid}>
            {batches.map((batch, index) => (
              <div key={index} style={styles.batchCard}>
                <h4>Batch {index + 1}</h4>
 
                <select
                  style={styles.input}
                  onChange={(e) =>
                    setInstructor(index, e.target.value)
                  }
                >
                  <option value="">Select Instructor</option>
                  <option value="I001">I001</option>
                  <option value="I002">I002</option>
                  <option value="I003">I003</option>
                </select>
 
                <p style={{ fontSize: "14px" }}>
                  {batch.studentIds.join(", ")}
                </p>
              </div>
            ))}
          </div>
 
          <button style={styles.successBtn} onClick={submitBatches}>
            Assign Batches
          </button>
        </div>
      )}
    </div>
  );
};
 
export default Batches;
 
const styles = {
  container: {
    padding: "30px",
    background: "#f4f6f9",
    minHeight: "100vh",
    fontFamily: "Segoe UI"
  },
  title: {
    marginBottom: "20px"
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  input: {
    padding: "10px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid #ccc",
    width: "100%"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse"
  },
  primaryBtn: {
    background: "#007bff",
    color: "#fff",
    padding: "10px 15px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginLeft: "10px"
  },
  secondaryBtn: {
    background: "#6c757d",
    color: "#fff",
    padding: "8px 12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },
  successBtn: {
    background: "#28a745",
    color: "#fff",
    padding: "12px 20px",
    border: "none",
    borderRadius: "8px",
    marginTop: "20px",
    cursor: "pointer"
  },
  batchGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "15px"
  },
  batchCard: {
    padding: "15px",
    background: "#f9fafc",
    borderRadius: "10px",
    border: "1px solid #ddd"
  }
};
 