// src/components/dashboard/WelcomePage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  UserCheck, 
  BadgeCheck, 
  BarChart,
  ChevronDown,
  Key,
  Users,
  UserPlus,
  Shield,
  Clock,
  Bell,
  Settings,
  LogOut 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const menuItems = [
  {
    icon: FileText,
    text: 'Stake Holder Request',
    path: 'stakeholder',
    subItems: ['New Request', 'Update', 'Pending'],
    permission: 'stakeholder'
  },
  {
    icon: UserCheck,
    text: 'Background Check Request',
    path: 'background',
    subItems: ['New Request', 'Update', 'Pending'],
    permission: 'backgroundCheck'
  },
  {
    icon: BadgeCheck,
    text: 'Badge Request',
    path: 'badge',
    subItems: ['New Request', 'Pending'],
    permission: 'badgeRequest'
  },
  {
    icon: Key,
    text: 'Access Request',
    path: 'access',
    subItems: ['New Request', 'Update', 'Pending'],
    permission: 'accessRequest'
  },
  {
    icon: Users,
    text: 'Attendance',
    path: 'attendance',
    subItems: ['New Request', 'Update', 'Pending'],
    permission: 'attendance'
  },
  {
    icon: UserPlus,
    text: 'Visitors Management',
    path: 'visitors',
    subItems: ['New Request', 'Update', 'Pending'],
    permission: 'visitorsManagement'
  },
  {
    icon: BarChart,
    text: 'Reports',
    path: 'reports',
    subItems: ['SHR Report', 'BCR Report', 'BR Report', 'Access Report', 'Attendance Report', 'Visitors Report'],
    permission: 'reports'
  }
];

const WelcomePage = () => {
  const navigate = useNavigate();
  const { userProfile, hasPermission, isAdmin, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [expandedCard, setExpandedCard] = useState(null);
  const [notifications] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCardClick = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleNavigate = (path, subItem = null) => {
    if (subItem) {
      navigate(`/${path}/${subItem.toLowerCase().replace(/\s+/g, '-')}`);
    } else {
      navigate(`/${path}`);
    }
  };

  // Filter menu items based on permissions
  const filteredMenuItems = menuItems.filter(item => {
    if (isAdmin()) return true;
    return item.subItems.some(subItem => 
      hasPermission(item.permission, subItem.toLowerCase().replace(/\s+/g, ''))
    );
  });

  const getAvailableActions = (item) => {
    if (isAdmin()) return item.subItems;
    return item.subItems.filter(subItem => 
      hasPermission(item.permission, subItem.toLowerCase().replace(/\s+/g, ''))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 right-0 left-0 h-16 bg-white shadow-sm z-40 pl-64">
        <div className="h-full px-6 mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
          </div>

          <div className="flex items-center space-x-6">
            {/* Admin Badge */}
            {isAdmin() && (
              <div className="px-3 py-1 bg-emerald-100 rounded-full flex items-center space-x-1">
                <Shield className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-600">Admin</span>
              </div>
            )}

            {/* Time Display */}
            <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg">
              <Clock className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium text-gray-600">
                {currentTime.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })}
              </span>
            </div>

            {/* Notifications */}
            <motion.div 
              className="relative cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell className="h-5 w-5 text-gray-500 hover:text-emerald-600 transition-colors" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                  {notifications}
                </span>
              )}
            </motion.div>

            {/* Settings */}
            <motion.div
              className="cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings className="h-5 w-5 text-gray-500 hover:text-emerald-600 transition-colors" />
            </motion.div>

            {/* Divider */}
            <div className="h-6 w-px bg-gray-200" />

            {/* User Profile & Logout */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-emerald-600">
                    {userProfile?.email?.[0]?.toUpperCase()}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700">
                    {userProfile?.email}
                  </span>
                  <span className="text-xs text-gray-500">
                    {userProfile?.role}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-24 px-6 pb-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto mb-12"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome back, {userProfile?.email?.split('@')[0]}!
          </h1>
          <p className="text-lg text-gray-600">
            Select an option below to get started with your tasks
          </p>
        </motion.div>

        {/* Menu Grid */}
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
          >
            {filteredMenuItems.map((item, index) => {
              const availableActions = getAvailableActions(item);
              if (availableActions.length === 0) return null;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: index * 0.1 } 
                  }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer"
                  onClick={() => handleCardClick(index)}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-emerald-50 rounded-lg">
                        <item.icon className="h-6 w-6 text-emerald-600" />
                      </div>
                      <motion.div
                        animate={{ rotate: expandedCard === index ? 180 : 0 }}
                      >
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      </motion.div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {item.text}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {availableActions.length} actions available
                    </p>
                  </div>

                  <AnimatePresence>
                    {expandedCard === index && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="border-t border-gray-100 bg-gray-50"
                      >
                        <div className="p-4 space-y-1">
                          {availableActions.map((subItem, subIndex) => (
                            <motion.button
                              key={subIndex}
                              whileHover={{ x: 4 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNavigate(item.path, subItem);
                              }}
                              className="w-full text-left px-4 py-2 rounded-lg
                                       text-sm text-gray-600 hover:text-emerald-600
                                       hover:bg-emerald-50 transition-colors"
                            >
                              {subItem}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}

            {/* Admin Dashboard Card - Only visible for admins */}
            {isAdmin() && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: filteredMenuItems.length * 0.1 } 
                }}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleNavigate('admin')}
                className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-emerald-50 rounded-lg">
                      <Shield className="h-6 w-6 text-emerald-600" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Admin Dashboard
                  </h3>
                  <p className="text-sm text-gray-500">
                    Manage users and permissions
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
