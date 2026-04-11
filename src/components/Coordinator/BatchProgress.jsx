import React from "react";

const BatchProgress = ({ batchName, enrolled, capacity }) => {
  const percent = Math.min((enrolled / capacity) * 100, 100);
  return (
    <div className="mb-3">
      <h6>{batchName} ({enrolled}/{capacity})</h6>
      <div className="progress">
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${percent}%` }}
          aria-valuenow={enrolled}
          aria-valuemin="0"
          aria-valuemax={capacity}
        >
          {percent.toFixed(0)}%
        </div>
      </div>
    </div>
  );
};

export default BatchProgress;