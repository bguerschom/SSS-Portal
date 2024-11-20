import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';

// Initialize Firebase
const firebaseConfig = {
  // Your Firebase configuration details
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const StakeholderRequestForm = () => {
  const [formData, setFormData] = useState({
    dateReceived: '',
    referenceNumber: '',
    senderSource: '',
    senderSourceOther: '',
    subject: '',
    subjectOther: '',
    status: '',
    response: '',
    answeredBy: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await db.collection('stakeholderRequests').add(formData);
      console.log('Data saved to Firebase');
      // Reset the form
      setFormData({
        dateReceived: '',
        referenceNumber: '',
        senderSource: '',
        senderSourceOther: '',
        subject: '',
        subjectOther: '',
        status: '',
        response: '',
        answeredBy: '',
      });
    } catch (error) {
      console.error('Error saving data to Firebase:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-lg shadow-md bg-white">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 font-medium">Date Received:</label>
          <input
            type="date"
            name="dateReceived"
            value={formData.dateReceived}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Reference Number:</label>
          <input
            type="text"
            name="referenceNumber"
            value={formData.referenceNumber}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Sender/Sources:</label>
          <select
            name="senderSource"
            value={formData.senderSource}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Select Sender/Source</option>
            <option value="NPPA">NPPA</option>
            <option value="RIB">RIB</option>
            <option value="MPG">MPG</option>
            <option value="Private Advocate">Private Advocate</option>
            <option value="Other">Other</option>
          </select>
          {formData.senderSource === 'Other' && (
            <input
              type="text"
              name="senderSourceOther"
              value={formData.senderSourceOther}
              onChange={handleInputChange}
              placeholder="Enter Other Sender/Source"
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          )}
        </div>
        <div>
          <label className="block mb-2 font-medium">Subject/Topic:</label>
          <select
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
          {formData.subject === 'Other' && (
            <input
              type="text"
              name="subjectOther"
              value={formData.subjectOther}
              onChange={handleInputChange}
              placeholder="Enter Other Subject/Topic"
              className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          )}
        </div>
        <div>
          <label className="block mb-2 font-medium">Status:</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Select Status</option>
            <option value="Pending">Pending</option>
            <option value="Answered">Answered</option>
          </select>
        </div>
        <div>
          <label className="block mb-2 font-medium">Response Date:</label>
          <input
            type="date"
            name="response"
            value={formData.response}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Answered By:</label>
          <select
            name="answeredBy"
            value={formData.answeredBy}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
      <div className="flex justify-end mt-6">
        <button
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default StakeholderRequestForm;
