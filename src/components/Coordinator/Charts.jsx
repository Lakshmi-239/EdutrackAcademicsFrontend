import React from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, Tooltip,
  XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer
} from "recharts";

// 1. Enrollment Chart
export const EnrollmentChart = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
      <XAxis dataKey="course" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
      <Tooltip cursor={{fill: '#f8f9fc'}} />
      <Bar dataKey="students" fill="#4e73df" radius={[4, 4, 0, 0]} barSize={20} />
    </BarChart>
  </ResponsiveContainer>
);

// 2. Performance Chart
export const PerformanceChart = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
      <XAxis dataKey="batch" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
      <Tooltip />
      <Line type="monotone" dataKey="performance" stroke="#1cc88a" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
    </LineChart>
  </ResponsiveContainer>
);

// 3. Program Chart
export const StudentsByProgramChart = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
      <XAxis dataKey="program" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
      <Tooltip cursor={{fill: '#fff7e6'}} />
      <Bar dataKey="students" fill="#f6c23e" radius={[4, 4, 0, 0]} barSize={20} />
    </BarChart>
  </ResponsiveContainer>
);

// 4. Gender Chart
export const GenderDistributionChart = ({ data }) => {
  const COLORS = ["#4e73df", "#1cc88a"];
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          innerRadius={60}
          outerRadius={100}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={36}/>
      </PieChart>
    </ResponsiveContainer>
  );
};