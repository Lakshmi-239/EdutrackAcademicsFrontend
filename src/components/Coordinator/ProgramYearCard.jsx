import { useEffect, useState } from "react";
import axios from "axios";
 
export default function ProgramYearCard({ setProgramId, setYearId }) {
  const [programs, setPrograms] = useState([]);
  const [years, setYears] = useState([]);
 
  useEffect(() => {
    axios.get("https://localhost:7157/api/coordinator/programs")
      .then(res => setPrograms(res.data))
      .catch(err => console.error(err));
  }, []);
 
  const handleProgramChange = (id) => {
    setProgramId(id);
    setYearId("");
    setYears([]); // reset
 
    axios
      .get(`https://localhost:7157/api/coordinator/program/${id}/years`)
      .then(res => {
        console.log("Years Data:", res.data);
        setYears(res.data);
      })
      .catch(err => console.error(err));
  };
 
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="fw-semibold mb-3">Select Program & Year</h5>
 
        <div className="row">
 
          {/* PROGRAM */}
          <div className="col-md-6">
            <select
              className="form-select"
              style={{
                backgroundColor: "white",
                color: "black"
              }}
              onChange={(e) => handleProgramChange(e.target.value)}
            >
              <option value="">Select Program</option>
 
              {programs.map(p => (
                <option
                  key={p.programId}
                  value={p.programId}
                  style={{ color: "black" }}
                >
                  {p.programName}
                </option>
              ))}
            </select>
          </div>
 
          {/* YEAR */}
          <div className="col-md-6">
            <select
              className="form-select"
              style={{
                backgroundColor: "white",
                color: "black"
              }}
              onChange={(e) => setYearId(e.target.value)}
            >
              <option value="">Select Year</option>
 
              {years.map((y) => (
                <option
                  key={y.academicYearId}
                  value={y.academicYearId}
                  style={{ color: "black", backgroundColor: "white" }}
                >
                  Year {y.yearNumber || y.YearNumber}
                </option>
              ))}
            </select>
          </div>
 
        </div>
      </div>
    </div>
  );
}