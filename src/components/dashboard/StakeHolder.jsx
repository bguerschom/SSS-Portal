import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Filter } from 'lucide-react';
import PageLayout from '../shared/PageLayout';
import { db } from './firebase';

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

  const handleNewRequestSubmit = () => {
    // Disabled database save functionality
    console.log('New stakeholder request data:', newRequest);
  };

  const renderContent = () => {
    switch (subItem) {
      case 'New Request':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">New Stake Holder Request</h2>
            <form onSubmit={handleNewRequestSubmit}>
              {/* Form fields */}
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
            {/* Pending requests content */}
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
