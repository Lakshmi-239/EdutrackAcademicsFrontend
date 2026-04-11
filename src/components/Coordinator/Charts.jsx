import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

export const EnrollmentChart = ({ data }) => (
  <BarChart width={450} height={250} data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="course" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="students" fill="#8884d8" />
  </BarChart>
);

export const PerformanceChart = ({ data }) => (
  <LineChart width={450} height={250} data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="batch" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="performance" stroke="#82ca9d" />
  </LineChart>
);

export const StudentsByProgramChart = ({ data }) => (
  <BarChart width={450} height={250} data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="program" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="students" fill="#ffc658" />
  </BarChart>
);

export const GenderDistributionChart = ({ data }) => {
  const COLORS = ["#0088FE", "#FF8042"];
  return (
    <PieChart width={450} height={250}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="gender"
        cx="50%"
        cy="50%"
        outerRadius={100}
        fill="#8884d8"
        label
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export const RecentActivityTable = ({ data, title }) => (
  <div className="mb-4">
    <h5 className="fw-bold">{title}</h5>
    <table className="table table-hover">
      <thead>
        <tr>
          {Object.keys(data[0]).map((key, index) => (
            <th key={index}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            {Object.values(item).map((val, i) => (
              <td key={i}>{val}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);