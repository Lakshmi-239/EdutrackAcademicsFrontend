import React from "react";

const DashboardCard = ({ title, value, icon }) => (
  <div className="card shadow-sm text-center h-100 border-0">
    <div className="card-body">
      <i className={`bi ${icon} fs-2 text-primary mb-2`}></i>
      <h6 className="card-title text-muted">{title}</h6>
      <p className="fs-4 fw-bold text-dark">{value}</p>
    </div>
  </div>
);

export default DashboardCard;