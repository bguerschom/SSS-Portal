import React from 'react';
import { motion } from 'framer-motion';
import { User, Lock } from 'lucide-react';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg"
      >
        <div className="w-full bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="p-10">
            {/* Logo Container */}
            <motion.div 
              className="flex justify-center mb-10"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src="/logo.png"
                alt="Logo"
                className="h-28 w-auto"
              />
            </motion.div>

            {/* Login Form */}
            <form className="space-y-6">
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-6 w-6 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                             transition-all duration-300 ease-in-out text-base
                             hover:border-emerald-300"
                    placeholder="Username"
                  />
                </div>
              </motion.div>

              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-6 w-6 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                             transition-all duration-300 ease-in-out text-base
                             hover:border-emerald-300"
                    placeholder="Password"
                  />
                </div>
              </motion.div>

              <motion.div 
                className="flex items-center justify-between"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <label className="flex items-center group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded 
                             focus:ring-emerald-500 transition-colors duration-200"
                  />
                  <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-200">
                    Remember me
                  </span>
                </label>
                <a 
                  href="#" 
                  className="text-sm text-emerald-600 hover:text-emerald-700 
                           transition-colors duration-200 hover:underline"
                >
                  Forgot password?
                </a>
              </motion.div>

              <motion.button
                type="submit"
                className="w-full bg-emerald-600 text-white py-4 px-6 rounded-lg
                         hover:bg-emerald-700 focus:outline-none focus:ring-2 
                         focus:ring-emerald-500 focus:ring-offset-2 
                         transform transition-all duration-200 ease-in-out
                         hover:scale-[1.02] active:scale-[0.98]
                         disabled:opacity-50 disabled:cursor-not-allowed
                         font-medium text-lg shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Sign in
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;