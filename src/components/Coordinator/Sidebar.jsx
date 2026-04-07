export default function Sidebar({ active, setActive }) {
  return (
    <div
      className="d-flex flex-column justify-content-between bg-white border-end vh-100 p-3"
      style={{ width: "260px" }}
    >
      <div>
        <h4 className="fw-bold">EduTrack</h4>
        <p className="text-muted small">Coordinator Portal</p>

        <ul className="nav flex-column mt-4">
          <li className="nav-item mb-2">
            <button
              className={`btn w-100 text-start ${
                active === "dashboard" ? "btn-primary" : "btn-light"
              }`}
              onClick={() => setActive("dashboard")}
            >
              Dashboard
            </button>
          </li>

          <li className="nav-item mb-2">
            <button
              className={`btn w-100 text-start ${
                active === "programs" ? "btn-primary" : "btn-light"
              }`}
              onClick={() => setActive("programs")}
            >
              Programs
            </button>
          </li>

          <li className="nav-item mb-2">
            <button
              className={`btn w-100 text-start ${
                active === "courses" ? "btn-primary" : "btn-light"
              }`}
              onClick={() => setActive("courses")}
            >
              Courses
            </button>
          </li>

          <li className="nav-item mb-2">
            <button
              className={`btn w-100 text-start ${
                active === "batches" ? "btn-primary" : "btn-light"
              }`}
              onClick={() => setActive("batches")}
            >
              Batches
            </button>
          </li>

          <li className="nav-item mb-2">
            <button
              className={`btn w-100 text-start ${
                active === "students" ? "btn-primary" : "btn-light"
              }`}
              onClick={() => setActive("students")}
            >
              Students
            </button>
          </li>
        </ul>
      </div>

      <div className="d-flex align-items-center bg-light p-2 rounded">
        <div
          className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2"
          style={{ width: "40px", height: "40px" }}
        >
          C
        </div>
        <div>
          <div className="fw-semibold">Coordinator</div>
          <small className="text-muted">Coordinator</small>
        </div>
      </div>
    </div>
  );
}