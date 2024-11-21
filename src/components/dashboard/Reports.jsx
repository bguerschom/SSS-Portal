import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, PieChart, Calendar, Download, Filter, 
  TrendingUp, Users, Clock, AlertCircle, FileText,
  Loader, ChevronDown, RefreshCw
} from 'lucide-react';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Sidebar from '../shared/Sidebar';
import ChartComponents from './ChartComponents';

const Reports = ({ onNavigate }) => {
  // States
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('week');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSender, setSelectedSender] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [refreshKey, setRefreshKey] = useState(0);

  // Constants
  const dateRanges = {
    'today': 'Today',
    'week': 'Last 7 Days',
    'month': 'Last 30 Days',
    'quarter': 'Last 3 Months',
    'year': 'Last Year',
    'all': 'All Years'
  };

  // Effects
  useEffect(() => {
    fetchRequests();
  }, [dateRange, selectedSender, selectedStatus]);

  // Helper Functions
  const getDateFilter = () => {
    if (dateRange === 'all') {
      return null;
    }

    const now = new Date();
    switch(dateRange) {
      case 'today':
        return new Date(now.setHours(0, 0, 0, 0));
      case 'week':
        return new Date(now.setDate(now.getDate() - 7));
      case 'month':
        return new Date(now.setDate(now.getDate() - 30));
      case 'quarter':
        return new Date(now.setMonth(now.getMonth() - 3));
      case 'year':
        return new Date(now.setFullYear(now.getFullYear() - 1));
      default:
        return null;
    }
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      let q = query(collection(db, 'stakeholder_requests'));
      const dateFilter = getDateFilter();
      
      if (dateFilter) {
        q = query(q, where('dateReceived', '>=', dateFilter.toISOString()));
      }
      
      if (selectedSender !== 'all') {
        q = query(q, where('sender', '==', selectedSender));
      }
      
      if (selectedStatus !== 'all') {
        q = query(q, where('status', '==', selectedStatus));
      }

      const querySnapshot = await getDocs(q);
      const requestData = [];
      querySnapshot.forEach((doc) => {
        requestData.push({ id: doc.id, ...doc.data() });
      });

      requestData.sort((a, b) => new Date(a.dateReceived) - new Date(b.dateReceived));
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
      value,
      percentage: (value / requests.length * 100).toFixed(1)
    }));
  };

  const getSenderData = () => {
    const senderCount = requests.reduce((acc, request) => {
      acc[request.sender] = (acc[request.sender] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(senderCount)
      .map(([sender, count]) => ({
        name: sender,
        requests: count,
        percentage: (count / requests.length * 100).toFixed(1)
      }))
      .sort((a, b) => b.requests - a.requests);
  };

  const getTimelineData = () => {
    const timeline = requests.reduce((acc, request) => {
      let dateKey;
      const date = new Date(request.dateReceived);
      
      if (dateRange === 'all') {
        dateKey = date.getFullYear().toString();
      } else if (dateRange === 'year') {
        dateKey = date.toLocaleDateString('default', { month: 'short', year: 'numeric' });
      } else {
        dateKey = date.toLocaleDateString();
      }
      
      acc[dateKey] = (acc[dateKey] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(timeline)
      .map(([date, count]) => ({
        date,
        requests: count
      }))
      .sort((a, b) => {
        if (dateRange === 'all') {
          return parseInt(a.date) - parseInt(b.date);
        }
        return new Date(a.date) - new Date(b.date);
      });
  };

  const handleExport = () => {
    const csvContent = [
      ['Reference Number', 'Date Received', 'Sender', 'Subject', 'Status', 'Response Date'],
      ...requests.map(request => [
        request.referenceNumber,
        request.dateReceived,
        request.sender,
        request.subject,
        request.status,
        request.responseDate || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stakeholder-requests-report-${new Date().toISOString()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };
  // Continue the Reports component
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex">
      <Sidebar activePage="reports" onNavigate={onNavigate} />
      
      <div className="flex-1 ml-64 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto space-y-6"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <BarChart className="h-6 w-6 text-emerald-600" />
                </div>
                <h1 className="text-2xl font-semibold text-gray-800">Reports Dashboard</h1>
              </div>
              
              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 
                           transition-colors flex items-center space-x-2"
                >
                  <Filter className="h-5 w-5 text-gray-500" />
                  <span>Filters</span>
                  <ChevronDown 
                    className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} 
                  />
                </motion.button>

                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none 
                           focus:ring-2 focus:ring-emerald-500"
                >
                  {Object.entries(dateRanges).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleExport}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 
                           transition-colors flex items-center space-x-2"
                >
                  <Download className="h-5 w-5" />
                  <span>Export Report</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setRefreshKey(prev => prev + 1);
                    fetchRequests();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <RefreshCw className="h-5 w-5 text-gray-500" />
                </motion.button>
              </div>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-gray-100"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sender
                      </label>
                      <select
                        value={selectedSender}
                        onChange={(e) => setSelectedSender(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg 
                                 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="all">All Senders</option>
                        <option value="NPPA">NPPA</option>
                        <option value="RIB">RIB</option>
                        <option value="MPG">MPG</option>
                        <option value="Private Advocate">Private Advocate</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg 
                                 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="all">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Answered">Answered</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { 
                title: 'Total Requests', 
                value: requests.length,
                icon: FileText,
                color: 'emerald'
              },
              { 
                title: 'Pending Requests', 
                value: requests.filter(r => r.status === 'Pending').length,
                icon: Clock,
                color: 'yellow'
              },
              { 
                title: 'Response Rate', 
                value: `${Math.round((requests.filter(r => r.status === 'Answered').length / 
                        requests.length) * 100 || 0)}%`,
                icon: TrendingUp,
                color: 'blue'
              },
              { 
                title: 'Average Response Time', 
                value: '2.5 days',
                icon: Users,
                color: 'indigo'
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className={`w-12 h-12 rounded-lg bg-${stat.color}-50 flex items-center 
                               justify-center mb-4`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-500`} />
                </div>
                <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                <p className="text-3xl font-semibold text-gray-900 mt-2">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Charts Section */}
          {!loading && (
            <ChartComponents
              timelineData={getTimelineData()}
              statusData={getStatusData()}
              senderData={getSenderData()}
            />
          )}

          {/* Quick Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Response Time Trends */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700">Response Time Trends</h3>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                  <span className="text-sm text-gray-600">
                    Average response time improved by 15% {dateRange === 'all' ? 'overall' : `this ${dateRange}`}
                  </span>
                </div>
              </div>

              {/* Peak Request Times */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700">Peak Request Times</h3>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-emerald-500" />
                  <span className="text-sm text-gray-600">
                    Most requests received between 9 AM and 11 AM
                  </span>
                </div>
              </div>

              {/* Additional Insights */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700">Top Sender</h3>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-emerald-500" />
                  <span className="text-sm text-gray-600">
                    {getSenderData()[0]?.name || 'N/A'} 
                    ({getSenderData()[0]?.percentage || 0}% of requests)
                  </span>
                </div>
              </div>

              {/* Historical Overview */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700">Historical Overview</h3>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-emerald-500" />
                  <span className="text-sm text-gray-600">
                    {dateRange === 'all' 
                      ? `Analyzing data from ${new Date(Math.min(...requests.map(r => 
                          new Date(r.dateReceived)))).getFullYear()} to present`
                      : `Showing data for the selected ${dateRange} period`
                    }
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Loading Overlay */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4"
                >
                  <Loader className="h-8 w-8 text-emerald-500 animate-spin" />
                  <p className="text-gray-600">Loading report data...</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Reports;
