import React from 'react';

function StudentDashboard() {
  return (
    <div className="container-fluid">
      <h2 className="mb-4">Welcome, Joseph 👋</h2>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-3">
            <small className="text-muted">Enrolled Courses</small>
            <h3 className="fw-bold">6</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-3">
            <small className="text-muted">Assignments Due</small>
            <h3 className="fw-bold">2</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-3">
            <small className="text-muted">Credit Points</small>
            <h3 className="fw-bold">142</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0 p-3">
            <small className="text-muted">Progress</small>
            <h3 className="fw-bold text-primary">75% Completed</h3>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="row">
        <div className="col-12 mb-4">
          <div className="card shadow-sm border-0 p-3">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Assignment Deadlines</h5>
              <button className="btn btn-link btn-sm text-decoration-none text-muted">View Details</button>
            </div>
            <div className="card-body p-0">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Course</th>
                    <th>Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Web Development</td>
                    <td>12 Apr</td>
                    <td><span className="badge bg-warning text-dark">Pending</span></td>
                  </tr>
                  <tr>
                    <td>DBMS</td>
                    <td>15 Apr</td>
                    <td><span className="badge bg-warning text-dark">Pending</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Activity</h5>
              <button className="btn btn-link btn-sm text-decoration-none text-muted">View Details</button>
            </div>
            <div className="card-body p-0">
              <table className="table table-hover mb-0">
                <tbody>
                  <tr>
                    <td className="ps-3">Web Development</td>
                    <td>12 Apr</td>
                    <td className="text-end pe-3 text-muted">Pending</td>
                  </tr>
                  <tr>
                    <td className="ps-3">DBMS</td>
                    <td>15 Apr</td>
                    <td className="text-end pe-3 text-muted">Pending</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;