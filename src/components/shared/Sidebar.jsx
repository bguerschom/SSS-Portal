// src/components/layout/Sidebar.jsx

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Home,
  FileText, 
  UserCheck, 
  BadgeCheck, 
  BarChart,
  ChevronDown,
  Key,
  Users,
  UserPlus,
  Shield,
  Menu
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const MenuItem = ({ icon: Icon, text, path, subItems, isActive, onItemClick, hasPermission }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Filter subItems based on permissions
  const allowedSubItems = subItems?.filter(item => 
    hasPermission(text.toLowerCase().replace(/\s+/g, ''), item.toLowerCase().replace(/\s+/g, ''))
  );

  if (allowedSubItems?.length === 0) return null;

  return (
    <div className="mb-1">
      <button
        onClick={() => {
          if (subItems) {
            setIsOpen(!isOpen);
          } else {
            onItemClick(path);
          }
        }}
        className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors
                   ${isActive ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'}`}
      >
        <Icon className="h-5 w-5 mr-3" />
        <span className="flex-1 text-left text-sm font-medium">{text}</span>
        {subItems && (
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 
            ${isOpen ? 'transform rotate-180' : ''}`} />
        )}
      </button>
      {isOpen && subItems && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="pl-11 py-1 space-y-1"
        >
          {allowedSubItems.map((item, index) => (
            <button
              key={index}
              onClick={() => onItemClick(path, item)}
              className="w-full text-left px-3 py-2 text-sm text-gray-600 
                       hover:text-emerald-600 hover:bg-emerald-50 rounded-md
                       transition-colors"
            >
              {item}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile, hasPermission, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = useMemo(() => [
    {
      icon: Home,
      text: 'Dashboard',
      path: 'dashboard'
    },
    {
      icon: FileText,
      text: 'Stake Holder Request',
      path: 'stakeholder',
      subItems: ['New Request', 'Update', 'Pending']
    },
    {
      icon: UserCheck,
      text: 'Background Check Request',
      path: 'background',
      subItems: ['New Request', 'Update', 'Pending']
    },
    {
      icon: BadgeCheck,
      text: 'Badge Request',
      path: 'badge',
      subItems: ['New Request', 'Pending']
    },
    {
      icon: Key,
      text: 'Access Request',
      path: 'access',
      subItems: ['New Request', 'Update', 'Pending']
    },
    {
      icon: Users,
      text: 'Attendance',
      path: 'attendance',
      subItems: ['New Request', 'Update', 'Pending']
    },
    {
      icon: UserPlus,
      text: 'Visitors Management',
      path: 'visitors',
      subItems: ['New Request', 'Update', 'Pending']
    },
    {
      icon: BarChart,
      text: 'Reports',
      path: 'reports',
      subItems: ['SHR Report', 'BCR Report', 'BR Report', 'Access Report', 'Attendance Report', 'Visitors Report']
    },
    ...(isAdmin() ? [{
      icon: Shield,
      text: 'Admin Dashboard',
      path: 'admin'
    }] : [])
  ], [isAdmin]);

  const handleNavigate = (path, subItem = null) => {
    if (subItem) {
      navigate(`/${path}/${subItem.toLowerCase().replace(/\s+/g, '-')}`);
    } else {
      navigate(`/${path}`);
    }
    setIsMobileMenuOpen(false);
  };

  const getCurrentPath = () => {
    const pathSegments = location.pathname.split('/');
    return pathSegments[1] || 'dashboard';
  };

  const sidebarContent = (
    <>
      {/* Logo Section */}
      <div className="h-16 border-b flex items-center px-6">
        <img 
          src="/logo.png"
          alt="Logo"
          className="h-8 w-auto"
        />
      </div>

      {/* Menu Items */}
      <div className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-4rem)]">
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            icon={item.icon}
            text={item.text}
            path={item.path}
            subItems={item.subItems}
            isActive={getCurrentPath() === item.path}
            onItemClick={handleNavigate}
            hasPermission={hasPermission}
          />
        ))}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md"
      >
        <Menu className="h-6 w-6 text-gray-600" />
      </button>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300
                      ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className={`fixed inset-y-0 left-0 w-64 bg-white transform transition-transform duration-300
                        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {sidebarContent}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;
