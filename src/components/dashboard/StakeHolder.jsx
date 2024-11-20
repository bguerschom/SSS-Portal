import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Save, 
  RefreshCw, 
  AlertCircle,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Search, 
  Loader
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
import Sidebar from '../shared/Sidebar';

const steps = [
  {
    id: 1,
    title: 'Basic Information',
    description: 'Reference and date details'
  },
  {
    id: 2,
    title: 'Request Details',
    description: 'Sender and subject information'
  },
  {
    id: 3,
    title: 'Description',
    description: 'Detailed request information'
  },
  {
    id: 4,
    title: 'Response',
    description: 'Status and response details'
  }
];

const StakeholderForm = ({ onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(1);
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

  const validateStep = (step) => {
    const stepErrors = {};
    
    switch (step) {
      case 1:
        if (!formData.dateReceived) stepErrors.dateReceived = 'Date is required';
        if (!formData.referenceNumber) stepErrors.referenceNumber = 'Reference number is required';
        break;
      case 2:
        if (!formData.sender) stepErrors.sender = 'Sender is required';
        if (formData.sender === 'Other' && !formData.otherSender) {
          stepErrors.otherSender = 'Please specify other sender';
        }
        if (!formData.subject) stepErrors.subject = 'Subject is required';
        if (formData.subject === 'Other' && !formData.otherSubject) {
          stepErrors.otherSubject = 'Please specify other subject';
        }
        break;
      case 3:
        if (!formData.description || formData.description.length < 10) {
          stepErrors.description = 'Description must be at least 10 characters';
        }
        break;
      default:
        break;
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
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
    setCurrentStep(1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Date Received */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500
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
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm font-medium text-gray-700">
                Reference Number *
              </label>
              <input
                type="text"
                name="referenceNumber"
                value={formData.referenceNumber}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500
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
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-gray-500 py-4"
                >
                  {message.text}
                </motion.div>
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
            >
              {/* Your update form content */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex">
      {/* Sidebar */}
      <Sidebar activePage="stakeholder" onNavigate={onNavigate} />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <div className="p-8">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div 
                    className={`flex flex-col items-center ${
                      index !== steps.length - 1 ? 'w-full' : ''
                    }`}
                  >
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full 
                      ${currentStep >= step.id ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-600'}
                      transition-colors duration-200`}
                    >
                      {currentStep > step.id ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <span>{step.id}</span>
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <div className="text-sm font-medium text-gray-900">{step.title}</div>
                      <div className="text-xs text-gray-500">{step.description}</div>
                    </div>
                  </div>
                  {index !== steps.length - 1 && (
                    <div 
                      className={`w-full h-1 mx-4 ${
                        currentStep > step.id ? 'bg-emerald-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm"
          >
            {/* Card Header */}
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">
                {steps[currentStep - 1].title}
              </h2>
              <p className="text-sm text-gray-500">
                {steps[currentStep - 1].description}
              </p>
            </div>

            {/* Card Content */}
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                {renderStepContent()}

                {/* Messages */}
                <AnimatePresence>
                  {message.text && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`p-4 rounded-lg flex items-center space-x-2 mt-6 ${
                        message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}
                    >
                      <AlertCircle className="h-5 w-5" />
                      <span>{message.text}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form Actions */}
                <div className="flex justify-between mt-8">
                  <motion.button
                    type="button"
                    onClick={() => currentStep > 1 && setCurrentStep(prev => prev - 1)}
                    className={`px-6 py-2 flex items-center space-x-2 rounded-lg transition-colors ${
                      currentStep === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                    }`}
                    disabled={currentStep === 1}
                    whileHover={currentStep !== 1 ? { scale: 1.02 } : {}}
                    whileTap={currentStep !== 1 ? { scale: 0.98 } : {}}
                  >
                    <ChevronLeft className="h-5 w-5" />
                    <span>Previous</span>
                  </motion.button>

                  <div className="flex space-x-3">
                    <motion.button
                      type="button"
                      onClick={handleReset}
                      className="px-6 py-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 
                               rounded-lg transition-colors flex items-center space-x-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <RefreshCw className="h-5 w-5" />
                      <span>Reset</span>
                    </motion.button>

                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      className={`px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 
                                transition-colors flex items-center space-x-2 ${
                                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                      whileHover={!isLoading ? { scale: 1.02 } : {}}
                      whileTap={!isLoading ? { scale: 0.98 } : {}}
                    >
                      {currentStep === steps.length ? (
                        <>
                          <Save className="h-5 w-5" />
                          <span>{isLoading ? 'Saving...' : 'Submit'}</span>
                        </>
                      ) : (
                        <>
                          <span>Next</span>
                          <ChevronRight className="h-5 w-5" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StakeholderForm;
