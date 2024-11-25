import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Charts = ({ timelineData = [], statusData = [], senderData = [] }) => {
  const COLORS = ['#059669', '#10B981', '#34D399', '#6EE7B7'];

  // Memoize the default data
  const defaultData = useMemo(() => ({
    timeline: [{ date: 'No Data', requests: 0 }],
    status: [{ name: 'No Data', value: 0, percentage: 100 }],
    sender: [{ name: 'No Data', requests: 0 }]
  }), []);

  // Error boundary component for individual charts
  const ChartErrorBoundary = ({ children }) => {
    try {
      return children;
    } catch (error) {
      console.error('Chart Error:', error);
      return (
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-500">Failed to load chart</p>
        </div>
      );
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Timeline Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Request Timeline</h2>
        <div className="h-[400px]">
          <ChartErrorBoundary>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData.length ? timelineData : defaultData.timeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  tickLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  tickLine={{ stroke: '#E5E7EB' }}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="requests"
                  stroke="#059669"
                  strokeWidth={2}
                  dot={{ fill: '#059669', stroke: '#059669', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartErrorBoundary>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Status Distribution</h2>
        <div className="h-[400px]">
          <ChartErrorBoundary>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData.length ? statusData : defaultData.status}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {(statusData.length ? statusData : defaultData.status).map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartErrorBoundary>
        </div>
      </div>

      {/* Sender Distribution */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Requests by Sender</h2>
        <div className="h-[400px]">
          <ChartErrorBoundary>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={senderData.length ? senderData : defaultData.sender}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <YAxis
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />
                <Tooltip />
                <Bar dataKey="requests" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default Charts;
