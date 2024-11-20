import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Save, RefreshCw, AlertCircle } from 'lucide-react';
import { db } from '../../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

const StakeholderForm = () => {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const docRef = await addDoc(collection(db, 'stakeholder_requests'), {
        ...formData,
        createdAt: new Date(),
        sender: formData.sender === 'Other' ? formData.otherSender : formData.sender,
        subject: formData.subject === 'Other' ? formData.otherSubject : formData.subject
      });

      setMessage({
        type: 'success',
        text: 'Request saved successfully!'
      });

      // Reset form
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
    setMessage({ type: '', text: '' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm"
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
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Date Received
            </label>
            <div className="relative">
              <input
                type="date"
                name="dateReceived"
                value={formData.dateReceived}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Reference Number */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Reference Number
            </label>
            <input
              type="text"
              name="referenceNumber"
              value={formData.referenceNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {/* Sender/Sources */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Sender/Sources
            </label>
            <select
              name="sender"
              value={formData.sender}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            >
              <option value="">Select Sender/Sources</option>
              {senderOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Other Sender */}
          {showOtherSender && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <label className="block text-sm font-medium text-gray-700">
                Specify Other Sender
              </label>
              <input
                type="text"
                name="otherSender"
                value={formData.otherSender}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required={showOtherSender}
              />
            </motion.div>
          )}

          {/* Subject/Topic */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Subject/Topic
            </label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            >
              <option value="">Select Subject/Topic</option>
              {subjectOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Other Subject */}
          {showOtherSubject && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <label className="block text-sm font-medium text-gray-700">
                Specify Other Subject
              </label>
              <input
                type="text"
                name="otherSubject"
                value={formData.otherSubject}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required={showOtherSubject}
              />
            </motion.div>
          )}

          {/* Description */}
          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {/* Response Date */}
          <div className="space-y-2">
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
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Status
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
          </div>

          {/* Answered By */}
          <div className="space-y-2">
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
          </div>
        </div>

        {/* Message Display */}
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg flex items-center space-x-2 ${
              message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
            }`}
          >
            <AlertCircle className="h-5 w-5" />
            <span>{message.text}</span>
          </motion.div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
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
        </div>
      </form>
    </motion.div>
  );
};

export default StakeholderForm;
