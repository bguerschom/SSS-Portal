import React, { useState, useEffect } from 'react';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
Calendar, 
@@ -7,20 +7,10 @@ import {
AlertCircle,
CheckCircle,
ChevronRight,
  ChevronLeft,
  Search, 
  Loader
  ChevronLeft
} from 'lucide-react';
import { db } from '../../config/firebase';
import { 
  collection, 
  addDoc,  
  query, 
  where, 
  getDocs,
  doc,
  getDoc,
  updateDoc } from 'firebase/firestore';
import { collection, addDoc } from 'firebase/firestore';
import Sidebar from '../shared/Sidebar';

const steps = [
@@ -46,15 +36,7 @@ const steps = [
}
];


const [subItem, setSubItem] = useState('');

const handleSubItemChange = (value) => {
  setSubItem(value);
};

const StakeholderForm = ({ onNavigate }) => {
    const [subItem, setSubItem] = useState('');
const [currentStep, setCurrentStep] = useState(1);
const [formData, setFormData] = useState({
dateReceived: '',
@@ -74,98 +56,6 @@ const StakeholderForm = ({ onNavigate }) => {
const [showOtherSubject, setShowOtherSubject] = useState(false);
const [isLoading, setIsLoading] = useState(false);
const [message, setMessage] = useState({ type: '', text: '' });
  const [searchTerm, setSearchTerm] = useState('');
const [searchResults, setSearchResults] = useState([]);
const [selectedRequest, setSelectedRequest] = useState(null);
const [showResults, setShowResults] = useState(false);
const [isUpdating, setIsUpdating] = useState(false);


// Add to your existing state variables
const [pendingRequests, setPendingRequests] = useState([]);
const [isLoadingPending, setIsLoadingPending] = useState(false);

// Add these new functions
useEffect(() => {
  if (subItem === 'Pending') {
    fetchPendingRequests();
  }
}, [subItem]);

const fetchPendingRequests = async () => {
  setIsLoadingPending(true);
  try {
    const q = query(
      collection(db, 'stakeholder_requests'),
      where('status', '==', 'Pending')
    );
    const querySnapshot = await getDocs(q);
    const requests = [];
    querySnapshot.forEach((doc) => {
      requests.push({ id: doc.id, ...doc.data() });
    });
    setPendingRequests(requests);
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    setMessage({ type: 'error', text: 'Error loading pending requests' });
  } finally {
    setIsLoadingPending(false);
  }
};

const handleSearch = async () => {
  if (!searchTerm) return;

  setIsLoading(true);
  setMessage({ type: '', text: '' });
  setShowResults(true);

  try {
    const q = query(
      collection(db, 'stakeholder_requests'),
      where('referenceNumber', '>=', searchTerm),
      where('referenceNumber', '<=', searchTerm + '\uf8ff')
    );

    const querySnapshot = await getDocs(q);
    const results = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });

    setSearchResults(results);
    if (results.length === 0) {
      setMessage({ type: 'info', text: 'No requests found' });
    }
  } catch (error) {
    setMessage({ type: 'error', text: 'Error searching requests' });
  } finally {
    setIsLoading(false);
  }
};

const handleSelectRequest = async (request) => {
  setSelectedRequest(request);
  setFormData(request);
};

const handleUpdate = async (e) => {
  e.preventDefault();
  setIsUpdating(true);
  setMessage({ type: '', text: '' });

  try {
    const docRef = doc(db, 'stakeholder_requests', selectedRequest.id);
    await updateDoc(docRef, formData);
    
    setMessage({ type: 'success', text: 'Request updated successfully' });
    handleSearch(); // Refresh search results
  } catch (error) {
    setMessage({ type: 'error', text: 'Error updating request' });
  } finally {
    setIsUpdating(false);
  }
};

// Your existing options arrays here
const senderOptions = ["NPPA", "RIB", "MPG", "Private Advocate", "Other"];
@@ -354,222 +244,251 @@ const handleUpdate = async (e) => {
</div>
);

      // For Update case
case 'Update':
  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Search Request</h2>
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter Reference Number"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {isLoading && (
              <motion.div 
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      case 2:
        return (
          <div className="space-y-6">
            {/* Sender/Sources */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <label className="block text-sm font-medium text-gray-700">
                Sender/Sources *
              </label>
              <select
                name="sender"
                value={formData.sender}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500
                          ${errors.sender ? 'border-red-300' : 'border-gray-200'}`}
                required
>
                <Loader className="h-5 w-5 text-emerald-500" />
              </motion.div>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 
                     transition-colors flex items-center space-x-2"
          >
            <Search className="h-5 w-5" />
            <span>Check</span>
          </button>
        </div>
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

        {/* Search Results */}
        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              {searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((result) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedRequest?.id === result.id
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-emerald-300'
                      }`}
                      onClick={() => handleSelectRequest(result)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-800">{result.referenceNumber}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(result.dateReceived).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-sm text-emerald-600">
                          {result.sender}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : message.text && (
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
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500
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
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-medium text-gray-700">
                Subject/Topic *
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500
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
                  className="text-center text-gray-500 py-4"
                  className="text-sm text-red-500 mt-1"
>
                  {message.text}
                </motion.div>
                  {errors.subject}
                </motion.p>
)}
</motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Update Form */}
      <AnimatePresence>
        {selectedRequest && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Update Request</h2>
            <form onSubmit={handleUpdate} className="space-y-6">
              {/* Your existing form fields here */}
              <div className="flex justify-end">
                <motion.button
                  type="submit"
                  disabled={isUpdating}
                  className={`px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 
                            transition-colors flex items-center space-x-2 ${
                              isUpdating ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                  whileHover={!isUpdating ? { scale: 1.02 } : {}}
                  whileTap={!isUpdating ? { scale: 0.98 } : {}}
            {/* Other Subject */}
            <AnimatePresence>
              {showOtherSubject && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
>
                  <Save className="h-5 w-5" />
                  <span>{isUpdating ? 'Updating...' : 'Update Request'}</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
                  <label className="block text-sm font-medium text-gray-700">
                    Specify Other Subject *
                  </label>
                  <input
                    type="text"
                    name="otherSubject"
                    value={formData.otherSubject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500
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
          </div>
        );

// For Pending case
case 'Pending':
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Pending Requests</h2>
        </div>
        
        {/* Table Header */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Received
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingRequests.map((request, index) => (
                <motion.tr 
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50"
      case 3:
        return (
          <div className="space-y-6">
            {/* Description */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <label className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500
                          ${errors.description ? 'border-red-300' : 'border-gray-200'}`}
                required
              />
              {errors.description && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-500 mt-1"
>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {request.referenceNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(request.dateReceived).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.sender}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.subject}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {request.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleSelectRequest(request)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Update
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
                  {errors.description}
                </motion.p>
              )}
            </motion.div>
          </div>
        );

      {/* Update Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-xl shadow-lg max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      case 4:
        return (
          <div className="space-y-6">
            {/* Response Date */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
>
              {/* Your update form content */}
              <label className="block text-sm font-medium text-gray-700">
                Response Date
              </label>
              <div className="relative">
<input
                  type="date"
                  name="responseDate"
                  value={formData.responseDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
</motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

            {/* Status */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-medium text-gray-700">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
              transition={{ delay: 0.2 }}
            >
              <label className="block text-sm font-medium text-gray-700">
                Answered By
              </label>
              <select
                name="answeredBy"
                value={formData.answeredBy}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select Person</option>
                {answeredByOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </motion.div>
          </div>
        );

default:
return null;
