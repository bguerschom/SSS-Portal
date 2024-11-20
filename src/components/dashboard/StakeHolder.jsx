import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Filter } from 'lucide-react';
import PageLayout from '../shared/PageLayout';
import { db } from '../../config/firebase';

const StakeHolder = ({ onNavigate, subItem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newRequest, setNewRequest] = useState({
    dateReceived: '',
    referenceNumber: '',
    senderSource: '',
    subject: '',
    status: '',
    response: '',
    answeredBy: '',
  });
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    const unsubscribe = db
      .collection('stakeholderRequests')
      .where('status', '==', 'Pending')
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPendingRequests(data);
      });

    return unsubscribe;
  }, [db]);

  const handleNewRequestSubmit = async () => {
    try {
      await db.collection('stakeholderRequests').add(newRequest);
      console.log('New stakeholder request saved to Firestore');
      setNewRequest({
        dateReceived: '',
        referenceNumber: '',
        senderSource: '',
        subject: '',
        status: '',
        response: '',
        answeredBy: '',
      });
    } catch (error) {
      console.error('Error saving new stakeholder request:', error);
    }
  };

  const renderContent = () => {
    switch (subItem) {
      case 'New Request':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">New Stake Holder Request</h2>
            <form onSubmit={handleNewRequestSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dateReceived" className="block text-gray-700 font-medium mb-2">
                    Date Received
                  </label>
                  <input
                    type="date"
                    id="dateReceived"
                    value={newRequest.dateReceived}
                    onChange={(e) =>
                      setNewRequest({ ...newRequest, dateReceived: e.target.value })
                    }
                    className="w-full border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label htmlFor="referenceNumber" className="block text-gray-700 font-medium mb-2">
                    Reference Number
                  </label>
                  <input
                    type="text"
                    id="referenceNumber"
                    value={newRequest.referenceNumber}
                    onChange={(e) =>
                      setNewRequest({ ...newRequest, referenceNumber: e.target.value })
                    }
                    className="w-full border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
              {/* Add other form fields here */}
              <button
                type="submit"
                className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Save
              </button>
            </form>
          </div>
        );
      case 'Update':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Update Stake Holder Request</h2>
            <p className="text-gray-600 mb-4">Update existing stake holder requests.</p>
            {/* Add your update form/list here */}
          </div>
        );
      case 'Pending':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search pending requests..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                <Filter className="h-5 w-5" />
                <span>Filter</span>
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold">Pending Requests</h2>
              </div>
              <div className="p-4">
                {pendingRequests.length > 0 ? (
                  <ul>
                    {pendingRequests.map((request) => (
                      <li key={request.id} className="py-2 border-b border-gray-100">
                        <h3 className="text-gray-800 font-medium">{request.subject}</h3>
                        <p className="text-gray-600">
                          Received on {request.dateReceived} - Ref. {request.referenceNumber}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">No pending requests found.</p>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Stake Holder Requests</h2>
            <p className="text-gray-600">Select an action from the sidebar to get started.</p>
          </div>
        );
    }
  };

  return (
    <PageLayout
      title="Stake Holder Request"
      icon={FileText}
      activePage="stakeholder"
      onNavigate={onNavigate}
    >
      {renderContent()}
    </PageLayout>
  );
};

export default StakeHolder;
