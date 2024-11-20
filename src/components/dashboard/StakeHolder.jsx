import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Filter } from 'lucide-react';
import PageLayout from '../shared/PageLayout';

const StakeHolder = ({ onNavigate, subItem }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const renderContent = () => {
    switch (subItem) {
      case 'New Request':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">New Stake Holder Request</h2>
            <p className="text-gray-600 mb-4">Create a new stake holder request form here.</p>
            {/* Add your form components here */}
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
                <p className="text-gray-600">No pending requests found.</p>
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