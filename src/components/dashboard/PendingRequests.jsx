import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  AlertCircle, 
  Save,
  Loader
} from 'lucide-react';
import { db } from '../../config/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs,
  doc,
  getDoc,
  updateDoc
} from 'firebase/firestore';

const PendingRequests = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showResults, setShowResults] = useState(false);
  const [formData, setFormData] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Options for dropdowns
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

  // Search for reference numbers
  const handleSearch = async () => {
    if (!searchTerm) return;

    setIsLoading(true);
    setMessage({ type: '', text: '' });
    setShowResults(true);

    try {
      const q = query(
        collection(db, 'stakeholder_requests'),
        where('status', '==', 'Pending'),
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
        setMessage({ type: 'info', text: 'No pending requests found' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error searching requests' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle request selection
  const handleSelectRequest = async (request) => {
    setSelectedRequest(request);
    setFormData(request);
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage({ type: '', text: '' });

    try {
      const docRef = doc(db, 'stakeholder_requests', selectedRequest.id);
      await updateDoc(docRef, formData);
      
      setMessage({ type: 'success', text: 'Request updated successfully' });
      // Refresh search results
      handleSearch();
    } catch (error) {
      setMessage({ type: 'error', text: 'Error updating request' });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-8">
      {/* Search Section */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Search Pending Requests</h2>
          
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
                            <p className="text-sm text-gray-500">{new Date(result.dateReceived).toLocaleDateString()}</p>
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
          {selectedRequest && formData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Update Request</h2>

              <form onSubmit={handleUpdate} className="space-y-6">
                {/* Form fields - similar to your original form but with values from formData */}
                {/* Add all your form fields here */}
                
                {/* Example of form fields */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Date Received</label>
                    <input
                      type="date"
                      name="dateReceived"
                      value={formData.dateReceived}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Reference Number</label>
                    <input
                      type="text"
                      name="referenceNumber"
                      value={formData.referenceNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  
                  {/* Add all other form fields */}
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
                <div className="flex justify-end space-x-3">
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
    </div>
  );
};

export default PendingRequests;
