import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Save, 
  RefreshCw, 
  AlertCircle,
  Search,
  Filter,
  Download,
  Trash2,
  Edit,
  Eye
} from 'lucide-react';
import { db } from '../../config/firebase';
import { collection, addDoc, getDocs, query, orderBy, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import Sidebar from '../shared/Sidebar';
import * as XLSX from 'xlsx';

const StakeholderForm = ({ onNavigate }) => {
  // ... (previous state remains the same)
  const [showRecords, setShowRecords] = useState(false);
  const [records, setRecords] = useState([]);
  const [filterCriteria, setFilterCriteria] = useState({
    dateFrom: '',
    dateTo: '',
    status: '',
    sender: ''
  });
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch records
  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const q = query(collection(db, 'stakeholder_requests'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedRecords = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
      setRecords(fetchedRecords);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!formData.dateReceived) errors.dateReceived = 'Date is required';
    if (!formData.referenceNumber) errors.referenceNumber = 'Reference number is required';
    if (!formData.sender) errors.sender = 'Sender is required';
    if (formData.sender === 'Other' && !formData.otherSender) {
      errors.otherSender = 'Please specify other sender';
    }
    if (!formData.subject) errors.subject = 'Subject is required';
    if (formData.subject === 'Other' && !formData.otherSubject) {
      errors.otherSubject = 'Please specify other subject';
    }
    if (!formData.description || formData.description.length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }
    return errors;
  };

  // Enhanced submit with validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setMessage({
        type: 'error',
        text: 'Please fill all required fields correctly'
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isEditing && selectedRecord) {
        await updateDoc(doc(db, 'stakeholder_requests', selectedRecord.id), {
          ...formData,
          updatedAt: new Date()
        });
        setMessage({ type: 'success', text: 'Record updated successfully!' });
      } else {
        await addDoc(collection(db, 'stakeholder_requests'), {
          ...formData,
          createdAt: new Date()
        });
        setMessage({ type: 'success', text: 'Record saved successfully!' });
      }
      await fetchRecords();
      handleReset();
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error saving record. Please try again.'
      });
    } finally {
      setIsLoading(false);
      setIsEditing(false);
      setSelectedRecord(null);
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    const exportData = records.map(record => ({
      'Date Received': new Date(record.dateReceived).toLocaleDateString(),
      'Reference Number': record.referenceNumber,
      'Sender': record.sender,
      'Subject': record.subject,
      'Status': record.status,
      'Response Date': record.responseDate ? new Date(record.responseDate).toLocaleDateString() : '',
      'Answered By': record.answeredBy,
      'Description': record.description
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Stakeholder Requests');
    XLSX.writeFile(wb, 'stakeholder_requests.xlsx');
  };

  // Filter records
  const filteredRecords = records.filter(record => {
    const matchesSearch = 
      record.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.subject.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = 
      (!filterCriteria.dateFrom || record.dateReceived >= filterCriteria.dateFrom) &&
      (!filterCriteria.dateTo || record.dateReceived <= filterCriteria.dateTo) &&
      (!filterCriteria.status || record.status === filterCriteria.status) &&
      (!filterCriteria.sender || record.sender === filterCriteria.sender);

    return matchesSearch && matchesFilter;
  });

  // Delete record
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await deleteDoc(doc(db, 'stakeholder_requests', id));
        await fetchRecords();
        setMessage({ type: 'success', text: 'Record deleted successfully!' });
      } catch (error) {
        setMessage({ type: 'error', text: 'Error deleting record' });
      }
    }
  };

  // Edit record
  const handleEdit = (record) => {
    setSelectedRecord(record);
    setFormData({
      ...record,
      dateReceived: record.dateReceived.split('T')[0],
      responseDate: record.responseDate ? record.responseDate.split('T')[0] : ''
    });
    setIsEditing(true);
    setShowRecords(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex">
      {/* Sidebar */}
      <Sidebar activePage="stakeholder" onNavigate={onNavigate} />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <div className="p-8">
          {/* Toggle View */}
          <div className="mb-6 flex justify-between items-center">
            <motion.h1 
              className="text-2xl font-semibold text-gray-800"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {showRecords ? 'Stakeholder Records' : 'New Stakeholder Request'}
            </motion.h1>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowRecords(!showRecords)}
              className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
            >
              {showRecords ? 'New Request' : 'View Records'}
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            {showRecords ? (
              // Records View
              <motion.div
                key="records"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                {/* Search and Filter */}
                <div className="mb-6 space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        placeholder="Search records..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <button
                      onClick={exportToExcel}
                      className="px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <Download className="h-5 w-5" />
                      <span>Export</span>
                    </button>
                  </div>

                  {/* Filters */}
                  <div className="grid grid-cols-4 gap-4">
                    <input
                      type="date"
                      placeholder="From Date"
                      value={filterCriteria.dateFrom}
                      onChange={(e) => setFilterCriteria(prev => ({ ...prev, dateFrom: e.target.value }))}
                      className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                      type="date"
                      placeholder="To Date"
                      value={filterCriteria.dateTo}
                      onChange={(e) => setFilterCriteria(prev => ({ ...prev, dateTo: e.target.value }))}
                      className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <select
                      value={filterCriteria.status}
                      onChange={(e) => setFilterCriteria(prev => ({ ...prev, status: e.target.value }))}
                      className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">All Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Answered">Answered</option>
                    </select>
                    <select
                      value={filterCriteria.sender}
                      onChange={(e) => setFilterCriteria(prev => ({ ...prev, sender: e.target.value }))}
                      className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">All Senders</option>
                      {senderOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Records Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Reference</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Sender</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Subject</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRecords.map((record) => (
                        <motion.tr
                          key={record.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {new Date(record.dateReceived).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{record.referenceNumber}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{record.sender}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{record.subject}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              record.status === 'Pending' 
                                ? 'bg-yellow-100 text-yellow-700' 
                                : 'bg-green-100 text-green-700'
                            }`}>
                              {record.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleEdit(record)}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded-full"
                              >
                                <Edit className="h-4 w-4" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDelete(record.id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded-full"
                              >
                                <Trash2 className="h-4 w-4" />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            ) : (
              // Form View
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl shadow-sm"
              >
                {/* Your existing form code goes here */}
              // Form View (continuation)
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Date Received */}
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="block text-sm font-medium text-gray-700">
                        Date Received *
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="dateReceived"
                          value={formData.dateReceived}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500
                                    ${errors.dateReceived ? 'border-red-300' : 'border-gray-200'}`}
                          required
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                      {errors.dateReceived && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm text-red-500 mt-1"
                        >
                          {errors.dateReceived}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Reference Number */}
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="block text-sm font-medium text-gray-700">
                        Reference Number *
                      </label>
                      <input
                        type="text"
                        name="referenceNumber"
                        value={formData.referenceNumber}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500
                                  ${errors.referenceNumber ? 'border-red-300' : 'border-gray-200'}`}
                        required
                      />
                      {errors.referenceNumber && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm text-red-500 mt-1"
                        >
                          {errors.referenceNumber}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Sender/Sources */}
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className="block text-sm font-medium text-gray-700">
                        Sender/Sources *
                      </label>
                      <select
                        name="sender"
                        value={formData.sender}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500
                                  ${errors.sender ? 'border-red-300' : 'border-gray-200'}`}
                        required
                      >
                        <option value="">Select Sender/Sources</option>
                        {senderOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      {errors.sender && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm text-red-500 mt-1"
                        >
                          {errors.sender}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Other Sender */}
                    <AnimatePresence>
                      {showOtherSender && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2"
                        >
                          <label className="block text-sm font-medium text-gray-700">
                            Specify Other Sender *
                          </label>
                          <input
                            type="text"
                            name="otherSender"
                            value={formData.otherSender}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500
                                      ${errors.otherSender ? 'border-red-300' : 'border-gray-200'}`}
                            required={showOtherSender}
                          />
                          {errors.otherSender && (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-sm text-red-500 mt-1"
                            >
                              {errors.otherSender}
                            </motion.p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Subject/Topic */}
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label className="block text-sm font-medium text-gray-700">
                        Subject/Topic *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500
                                  ${errors.subject ? 'border-red-300' : 'border-gray-200'}`}
                        required
                      >
                        <option value="">Select Subject/Topic</option>
                        {subjectOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      {errors.subject && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm text-red-500 mt-1"
                        >
                          {errors.subject}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Other Subject */}
                    <AnimatePresence>
                      {showOtherSubject && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2"
                        >
                          <label className="block text-sm font-medium text-gray-700">
                            Specify Other Subject *
                          </label>
                          <input
                            type="text"
                            name="otherSubject"
                            value={formData.otherSubject}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500
                                      ${errors.otherSubject ? 'border-red-300' : 'border-gray-200'}`}
                            required={showOtherSubject}
                          />
                          {errors.otherSubject && (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-sm text-red-500 mt-1"
                            >
                              {errors.otherSubject}
                            </motion.p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Description */}
                    <motion.div 
                      className="space-y-2 md:col-span-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <label className="block text-sm font-medium text-gray-700">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500
                                  ${errors.description ? 'border-red-300' : 'border-gray-200'}`}
                        required
                      />
                      {errors.description && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm text-red-500 mt-1"
                        >
                          {errors.description}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Response Date */}
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <label className="block text-sm font-medium text-gray-700">
                        Response Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="responseDate"
                          value={formData.responseDate}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </motion.div>

                    {/* Status */}
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <label className="block text-sm font-medium text-gray-700">
                        Status *
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                      >
                        {statusOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </motion.div>

                    {/* Answered By */}
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <label className="block text-sm font-medium text-gray-700">
                        Answered By
                      </label>
                      <select
                        name="answeredBy"
                        value={formData.answeredBy}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="">Select Person</option>
                        {answeredByOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </motion.div>
                  </div>

                  {/* Message Display */}
                  <AnimatePresence>
                    {message.text && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`p-4 rounded-lg flex items-center space-x-2 ${
                          message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                        }`}
                      >
                        <AlertCircle className="h-5 w-5" />
                        <span>{message.text}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Form Actions */}
                  <motion.div 
                    className="flex justify-end space-x-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    <motion.button
                      type="button"
                      onClick={handleReset}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <RefreshCw className="h-5 w-5" />
                      <span>Refresh</span>
                    </motion.button>

                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 
                                transition-colors flex items-center space-x-2 ${
                                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                    >
                      <Save className="h-5 w-5" />
                      <span>{isLoading ? 'Saving...' : isEditing ? 'Update' : 'Submit'}</span>
                    </motion.button>
                  </motion.div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default StakeholderForm;
