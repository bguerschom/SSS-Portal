import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, 
  User, 
  ChevronDown,
  FileText, 
  UserCheck, 
  BadgeCheck, 
  BarChart,
  Clock,
  Settings,
  Bell
} from 'lucide-react';

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: i => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  }),
  hover: {
    scale: 1.02,
    rotate: [0, -1, 1, -1, 0],
    transition: {
      duration: 0.3,
      rotate: {
        repeat: Infinity,
        repeatType: "reverse",
        duration: 2
      }
    }
  }
};

const SubMenuVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto' }
};

const WelcomePage = ({ username, onLogout }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [expandedCard, setExpandedCard] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCardClick = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  const menuItems = [
    {
      icon: FileText,
      text: 'Stake Holder Request',
      subItems: ['New Request', 'Update'],
      color: 'emerald'
    },
    {
      icon: UserCheck,
      text: 'Background Check Request',
      subItems: ['New Request', 'Update'],
      color: 'emerald'
    },
    {
      icon: BadgeCheck,
      text: 'Badge Request',
      subItems: ['New Request'],
      color: 'emerald'
    },
    {
      icon: BarChart,
      text: 'Reports',
      subItems: ['SHR Report', 'BCR Report', 'BR Report'],
      color: 'emerald'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Top Bar */}
      <div className="fixed top-0 right-0 left-0 h-16 bg-white shadow-sm z-20">
        <div className="h-full px-6 flex items-center justify-between max-w-7xl mx-auto">
          <img 
            src="/logo.png"
            alt="Logo"
            className="h-8 w-auto"
          />
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-lg">
              <Clock className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium text-gray-600">
                {currentTime.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })}
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="relative"
              >
                <Bell className="h-5 w-5 text-gray-500 hover:text-emerald-600 cursor-pointer transition-colors" />
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-emerald-500 rounded-full" />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
              >
                <Settings className="h-5 w-5 text-gray-500 hover:text-emerald-600 cursor-pointer transition-colors" />
              </motion.div>
              <div className="h-6 w-px bg-gray-200" />
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium text-gray-700">{username}</span>
              </div>
              <button
                onClick={onLogout}
                className="text-sm text-gray-500 hover:text-emerald-600 transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 pt-24">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 py-6 mb-8"
        >
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-white">Welcome to SSS Portal</h2>
            <p className="text-emerald-50 mt-1">Select an option to get started</p>
          </div>
        </motion.div>

        {/* Menu Grid */}
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            initial="hidden"
            animate="visible"
          >
            {menuItems.map((item, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={cardVariants}
                whileHover="hover"
                onClick={() => handleCardClick(index)}
                className="bg-white rounded-lg shadow-sm overflow-hidden
                          cursor-pointer group transition-all duration-300"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-lg bg-emerald-50 
                                  group-hover:bg-emerald-100 transition-colors">
                      <item.icon className="h-6 w-6 text-emerald-600" />
                    </div>
                    <motion.div
                      animate={{ rotate: expandedCard === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="h-5 w-5 text-gray-400 group-hover:text-emerald-600" />
                    </motion.div>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">{item.text}</h3>
                  <p className="text-xs text-gray-500">
                    {item.subItems.length} actions available
                  </p>
                </div>
                
                <AnimatePresence>
                  {expandedCard === index && (
                    <motion.div
                      variants={SubMenuVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="border-t border-gray-100 bg-emerald-50"
                    >
                      <div className="p-3 space-y-1">
                        {item.subItems.map((subItem, subIndex) => (
                          <motion.button
                            key={subIndex}
                            whileHover={{ x: 4, backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
                            className="w-full text-left text-sm px-3 py-2 rounded
                                     text-gray-600 hover:text-emerald-600
                                     transition-colors"
                          >
                            {subItem}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
