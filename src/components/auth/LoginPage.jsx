
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, AlertCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { auth, db } from '../../config/firebase';
import LoadingSpinner from '../common/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signIn } = useAuth();

  // Handle session expired message
  useEffect(() => {
    if (location.state?.message) {
      setError(location.state.message);
      // Clear the message after showing it
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const email = username.includes('@') ? username : `${username}@yourdomain.com`;
      await signIn(email, password);
      
      // Auth context will automatically redirect to dashboard if login is successful
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

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

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-50 text-red-500 p-4 rounded-lg mb-6 flex items-center"
                >
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                             transition-all duration-300 ease-in-out text-base
                             hover:border-emerald-300"
                    placeholder="Username"
                    disabled={isLoading}
                    required
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                             transition-all duration-300 ease-in-out text-base
                             hover:border-emerald-300"
                    placeholder="Password"
                    disabled={isLoading}
                    required
                  />
                </div>
              </motion.div>

              <motion.button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-emerald-600 text-white py-4 px-6 rounded-lg
                         hover:bg-emerald-700 focus:outline-none focus:ring-2 
                         focus:ring-emerald-500 focus:ring-offset-2 
                         transform transition-all duration-200 ease-in-out
                         hover:scale-[1.02] active:scale-[0.98]
                         disabled:opacity-50 disabled:cursor-not-allowed
                         font-medium text-lg shadow-lg
                         ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span className="ml-2">Signing in...</span>
                  </div>
                ) : (
                  'Sign in'
                )}
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
