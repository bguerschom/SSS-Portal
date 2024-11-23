import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Shield, 
  Settings,
  Save,
  RefreshCw,
  Users,
  Activity,
  Clock,
  Search,
  Filter,
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart
} from 'lucide-react';
import { db } from '../config/firebase';
import firebase from "../config/firebase";
import { 
  collection, 
  query, 
  getDocs, 
  doc, 
  updateDoc,
  where,
  orderBy,
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import UserEditModal from './UserEditModal';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {
  // States
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [activityLogs, setActivityLogs] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    recentActivity: 0
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const { userProfile } = useAuth();

  // Initial data fetch
  useEffect(() => {
    fetchUsers();
    fetchActivityLogs();
    calculateStats();
  }, []);

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersRef = collection(db, 'users');
      let q = query(usersRef);
      
      if (filterRole) {
        q = query(q, where('role', '==', filterRole));
      }
      if (filterStatus) {
        q = query(q, where('status', '==', filterStatus));
      }
      
      const querySnapshot = await getDocs(q);
      const usersData = [];
      querySnapshot.forEach((doc) => {
        usersData.push({ id: doc.id, ...doc.data() });
      });
      
      setUsers(usersData);
      calculateStats(usersData);
    } catch (error) {
      setMessage({ type: 'error', text: 'Error fetching users' });
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch activity logs
  const fetchActivityLogs = async () => {
    try {
      const logsRef = collection(db, 'activityLogs');
      const q = query(logsRef, orderBy('timestamp', 'desc'), limit(10));
      const querySnapshot = await getDocs(q);
      
      const logs = [];
      querySnapshot.forEach((doc) => {
        logs.push({ id: doc.id, ...doc.data() });
      });
      
      setActivityLogs(logs);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    }
  };

  // Calculate stats
  const calculateStats = (userData = users) => {
    const stats = {
      totalUsers: userData.length,
      activeUsers: userData.filter(user => user.status === 'active').length,
      adminUsers: userData.filter(user => user.role === 'ADMINISTRATOR').length,
      recentActivity: activityLogs.length
    };
    setStats(stats);
  };

  // Update user
  const handleUpdateUser = async (userId, updatedData) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...updatedData,
        updatedAt: serverTimestamp(),
        updatedBy: userProfile.email
      });

      // Log activity
      const activityRef = collection(db, 'activityLogs');
      await addDoc(activityRef, {
        type: 'USER_UPDATE',
        performedBy: userProfile.email,
        targetUser: userId,
        details: 'User details updated',
        timestamp: serverTimestamp()
      });

      setMessage({ type: 'success', text: 'User updated successfully' });
      fetchUsers();
      fetchActivityLogs();
    } catch (error) {
      setMessage({ type: 'error', text: 'Error updating user' });
      console.error('Error:', error);
    }
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole ? user.role === filterRole : true;
    const matchesStatus = filterStatus ? user.status === filterStatus : true;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                {userProfile?.role}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Clock className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-600">
                {new Date().toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-emerald-600" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Users</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.activeUsers}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Admin Users</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.adminUsers}</p>
              </div>
              <Shield className="h-8 w-8 text-emerald-600" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Recent Activities</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.recentActivity}</p>
              </div>
              <Activity className="h-8 w-8 text-emerald-600" />
            </div>
          </motion.div>
        </div>

        {/* User Management Section */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
          </div>

          {/* Search and Filters */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1 max-w-md relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search users..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>

              <div className="flex space-x-4">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">All Roles</option>
                  <option value="ADMINISTRATOR">Administrator</option>
                  <option value="OPERATOR">Operator</option>
                  <option value="USER">User</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permissions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center">
                      <RefreshCw className="h-5 w-5 text-emerald-500 animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                            <User className="h-6 w-6 text-emerald-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.email}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {user.id.slice(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(user.permissions).map(([module, perms]) => 
                            Object.entries(perms).filter(([_, enabled]) => enabled)
                              .map(([action]) => (
                                <span 
                                  key={`${module}-${action}`}
                                  className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                                >
                                  {action}
                                </span>
                              ))
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="text-emerald-600 hover:text-emerald-900"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

{/* Recent Activity Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {activityLogs.map((log) => (
                <div 
                  key={log.id}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{log.performedBy}</span>
                      {' '}{log.details}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(log.timestamp?.toDate()).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {log.type === 'USER_UPDATE' && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        Update
                      </span>
                    )}
                    {log.type === 'USER_CREATE' && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Create
                      </span>
                    )}
                    {log.type === 'USER_DELETE' && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                        Delete
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
                message.type === 'success' ? 'bg-emerald-50' : 'bg-red-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                {message.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                <span className={message.type === 'success' ? 'text-emerald-700' : 'text-red-700'}>
                  {message.text}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* User Edit Modal */}
        <AnimatePresence>
          {selectedUser && (
            <UserEditModal
              user={selectedUser}
              onClose={() => setSelectedUser(null)}
              onSave={handleUpdateUser}
            />
          )}
        </AnimatePresence>

        {/* Loading Overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <div className="bg-white rounded-lg p-8">
                <RefreshCw className="h-8 w-8 text-emerald-500 animate-spin" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
