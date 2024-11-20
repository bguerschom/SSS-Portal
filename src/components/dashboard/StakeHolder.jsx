import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Filter } from 'lucide-react';
import PageLayout from '../shared/PageLayout';

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

  const handleNewRequestSubmit = () => {
    console.log('New stakeholder request data:', newRequest);
  };

  const renderContent = () => {
    switch (subItem) {
      case 'New Request':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">New Stake Holder Request</h2>
<form onSubmit={handleNewRequestSubmit}>
              <div className="grid grid-cols-2 gap-4">
                {/* ... other fields ... */}
                <div>
                  <label htmlFor="senderSource" className="block text-gray-700 font-medium mb-2">
                    Sender/Sources
                  </label>
                  <select
                    id="senderSource"
                    value={newRequest.senderSource}
                    onChange={(e) =>
                      setNewRequest({ ...newRequest, senderSource: e.target.value })
                    }
                    className="w-full border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Select Sender/Sources</option>
                    <option value="NPPA">NPPA</option>
                    <option value="RIB">RIB</option>
                    <option value="MPG">MPG</option>
                    <option value="Private Advocate">Private Advocate</option>
                    <option value="Other">Other</option>
                  </select>
                  {newRequest.senderSource === 'Other' && (
                    <input
                      type="text"
                      placeholder="Enter other sender/source"
                      value={newRequest.senderSource}
                      onChange={(e) =>
                        setNewRequest({ ...newRequest, senderSource: e.target.value })
                      }
                      className="mt-2 w-full border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  )}
                </div>
                <div>
                  <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
                    Subject/Topic
                  </label>
                  <select
                    id="subject"
                    value={newRequest.subject}
                    onChange={(e) =>
                      setNewRequest({ ...newRequest, subject: e.target.value })
                    }
                    className="w-full border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Select Subject/Topic</option>
                    <option value="account unblock">Account Unblock</option>
                    <option value="MoMo Transaction">MoMo Transaction</option>
                    <option value="Call History">Call History</option>
                    <option value="Reversal">Reversal</option>
                    <option value="MoMo Transaction & Call History">MoMo Transaction & Call History</option>
                    <option value="Account Information">Account Information</option>
                    <option value="Account Status">Account Status</option>
                    <option value="Balance">Balance</option>
                    <option value="Other">Other</option>
                  </select>
                  {newRequest.subject === 'Other' && (
                    <input
                      type="text"
                      placeholder="Enter other subject/topic"
                      value={newRequest.subject}
                      onChange={(e) =>
                        setNewRequest({ ...newRequest, subject: e.target.value })
                      }
                      className="mt-2 w-full border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  )}
                </div>
                <div>
                  <label htmlFor="status" className="block text-gray-700 font-medium mb-2">
                    Status
                  </label>
                  <select
                    id="status"
                    value={newRequest.status}
                    onChange={(e) =>
                      setNewRequest({ ...newRequest, status: e.target.value })
                    }
                    className="w-full border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Select Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Answered">Answered</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="answeredBy" className="block text-gray-700 font-medium mb-2">
                    Answered By
                  </label>
                  <select
                    id="answeredBy"
                    value={newRequest.answeredBy}
                    onChange={(e) =>
                      setNewRequest({ ...newRequest, answeredBy: e.target.value })
                    }
                    className="w-full border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Select Answered By</option>
                    <option value="bigirig">bigirig</option>
                    <option value="isimbie">isimbie</option>
                    <option value="niragit">niragit</option>
                    <option value="nkomatm">nkomatm</option>
                    <option value="tuyisec">tuyisec</option>
                  </select>
                </div>
              </div>
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
