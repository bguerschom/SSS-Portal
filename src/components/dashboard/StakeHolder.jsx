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

  // ... rest of the component code ...
};

export default StakeHolder;
