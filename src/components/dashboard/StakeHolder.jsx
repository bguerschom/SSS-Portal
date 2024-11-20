import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Save, 
  RefreshCw, 
  AlertCircle,
} from 'lucide-react';
import { db } from '../../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import Sidebar from '../shared/Sidebar';

const StakeholderForm = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    dateReceived: '',
    referenceNumber: '',
    sender: '',
    otherSender: '',
    subject: '',
    otherSubject: '',
    status: 'Pending',
    responseDate: '',
    answeredBy: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [showOtherSender, setShowOtherSender] = useState(false);
  const [showOtherSubject, setShowOtherSubject] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const senderOptions = ["NPPA", "RIB", "MPG", "Private Advocate", "Other"];
  const subjectOptions = [
    "Account Unblock",
    "MoMo Transaction",
    "Call History",
    "Reversal",
    "MoMo Transaction & Call History",
    "Account Information",
    "Account Status",
    "Balance",
    "Other"
  ];
  const statusOptions = ["Pending", "Answered"];
  const answeredByOptions = ["bigirig", "isimbie", "niragit", "nkomatm", "tuyisec"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'sender') {
      setShowOtherSender(value === 'Other');
    }
    if (name === 'subject') {
      setShowOtherSubject(value === 'Other');
    }

    // Clear error when field is being edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.dateReceived) newErrors.dateReceived = 'Date is required';
    if (!formData.referenceNumber) newErrors.referenceNumber = 'Reference number is required';
    if (!formData.sender) newErrors.sender = 'Sender is required';
    if (formData.sender === 'Other' && !formData.otherSender) {
      newErrors.otherSender = 'Please specify other sender';
    }
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (formData.subject === 'Other' && !formData.otherSubject) {
      newErrors.otherSubject = 'Please specify other subject';
    }
    if (!formData.description || formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage({
        type: 'error',
        text: 'Please fill all required fields correctly'
      });
      return;
    }

    setIsLoading(true);
    try {
      await addDoc(collection(db, 'stakeholder_requests'), {
        ...formData,
        sender: formData.sender === 'Other' ? formData.otherSender : formData.sender,
        subject: formData.subject === 'Other' ? formData.otherSubject : formData.subject,
        createdAt: new Date()
      });

      setMessage({
        type: 'success',
        text: 'Request saved successfully!'
      });
      
      handleReset();
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error saving request. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      dateReceived: '',
      referenceNumber: '',
      sender: '',
      otherSender: '',
      subject: '',
      otherSubject: '',
      status: 'Pending',
      responseDate: '',
      answeredBy: '',
      description: ''
    });
    setShowOtherSender(false);
    setShowOtherSubject(false);
    setErrors({});
    setMessage({ type: '', text: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex">
      {/* Sidebar */}
      <Sidebar activePage="stakeholder" onNavigate={onNavigate} />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <div className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-semibold text-gray-800 mb-6"
            >
              Stakeholder Request Record
            </motion.h2>

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
      <span>{isLoading ? 'Saving...' : 'Submit'}</span>
    </motion.button>
  </motion.div>
</form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StakeholderForm;
