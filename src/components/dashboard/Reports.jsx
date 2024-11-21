import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, PieChart, Calendar, Download, Filter } from 'lucide-react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Sidebar from '../shared/Sidebar';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';

const Reports = ({ onNavigate }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('week');
  const [filterType, setFilterType] = useState('all');

  const COLORS = ['#059669', '#10B981', '#34D399', '#6EE7B7'];

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const q = query(collection(db, 'stakeholder_requests'));
      const querySnapshot = await getDocs(q);
      const requestData = [];
      querySnapshot.forEach((doc) => {
        requestData.push({ id: doc.id, ...doc.data() });
      });
      setRequests(requestData);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusData = () => {
    const statusCount = requests.reduce((acc, request) => {
      acc[request.status] = (acc[request.status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusCount).map(([name, value]) => ({
      name,
      value
    }));
  };

  const getSenderData = () => {
    const senderCount = requests.reduce((acc, request) => {
      acc[request.sender] = (acc[request.sender] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(senderCount).map(([sender, count]) => ({
      name: sender,
      requests: count
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex">
      <Sidebar activePage="reports" onNavigate={onNavigate} />
      
      <div className="flex-1 ml-64 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <BarChart className="h-6 w-6 text-emerald-600" />
                </div>
                <h1 className="text-2xl font-semibold text-gray-800">Reports Dashboard</h1>
              </div>
              
              <div className="flex space-x-4">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="year">Last Year</option>
                </select>
                
                <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 
                                transition-colors flex items-center space-x-2">
                  <Download className="h-5 w-5" />
                  <span>Export Report</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[
              { title: 'Total Requests', value: requests.length },
              { title: 'Pending Requests', value: requests.filter(r => r.status === 'Pending').length },
              { title: 'Response Rate', value: `${Math.round((requests.filter(r => r.status === 'Answered').length / requests.length) * 100 || 0)}%` }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                <p className="text-3xl font-semibold text-gray-900 mt-2">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Requests by Sender</h2>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={getSenderData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="requests" fill="#059669" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Request Status Distribution</h2>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={getStatusData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {getStatusData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {loading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full"
                />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Reports;
