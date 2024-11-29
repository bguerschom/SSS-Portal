// src/components/shared/ModernSidebar.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, ChevronLeft } from 'lucide-react';

const ModernSidebar = ({ currentPage, items, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Sliding Indicator */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40">
        <motion.button
          onClick={() => setIsOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-r-lg shadow-lg"
        >
          <Menu className="h-5 w-5" />
        </motion.button>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Sidebar Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-lg z-50"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 bg-emerald-500 text-white">
                <h2 className="font-semibold">{currentPage}</h2>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-full"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="p-4">
                {items.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      onNavigate(item.path);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg mb-2
                      ${item.active 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'hover:bg-gray-50 text-gray-700'
                      }`}
                  >
                    {item.icon && <item.icon className="h-5 w-5" />}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModernSidebar;
