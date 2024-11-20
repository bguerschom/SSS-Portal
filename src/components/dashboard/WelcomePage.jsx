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
  Bell,
  Key,
  Users,
  UserPlus
} from 'lucide-react';

// Animation variants remain the same as your previous version
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
    subItems: ['New Request', 'Update', 'Pending'],
    path: 'stakeholder'
  },
  {
    icon: UserCheck,
    text: 'Background Check Request',
    subItems: ['New Request', 'Update', 'Pending'],
    path: 'background'
  },
  {
    icon: BadgeCheck,
    text: 'Badge Request',
    subItems: ['New Request', 'Pending'],
    path: 'badge'
  },
  {
    icon: Key,
    text: 'Access Request',
    subItems: ['New Request', 'Update', 'Pending'],
    path: 'access'
  },
  {
    icon: Users,
    text: 'Attendance',
    subItems: ['New Request', 'Update', 'Pending'],
    path: 'attendance'
  },
  {
    icon: UserPlus,
    text: 'Visitors Management',
    subItems: ['New Request', 'Update', 'Pending'],
    path: 'visitors'
  },
  {
    icon: BarChart,
    text: 'Reports',
    subItems: ['SHR Report', 'BCR Report', 'BR Report', 'Access Report', 'Attendance Report', 'Visitors Report'],
    path: 'reports'
  }
];

const WelcomePage = ({ username, onLogout, onNavigate }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [expandedCard, setExpandedCard] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCardClick = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  const handleSubItemClick = (path, subItem) => {
    onNavigate(path, subItem);
  };

  // Rest of your WelcomePage component remains the same, just update the menuItems rendering
  // ... (keeping your existing layout and animations)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Your existing top bar code */}
      
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
                {/* Your existing card content structure */}
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
                            onClick={() => handleSubItemClick(item.path, subItem)}
                            whileHover={{ x: 4 }}
                            className="w-full text-left text-sm px-3 py-2 rounded
                                     text-gray-600 hover:text-emerald-600 hover:bg-emerald-100
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
