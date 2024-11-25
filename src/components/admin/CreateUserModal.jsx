import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, User, Shield, Mail, Lock, AlertCircle, Save } from 'lucide-react';
import { auth, db } from '../../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const CreateUserModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER',
    status: 'active',
    permissions: {
      stakeholder: {
        view: false,
        create: false,
        edit: false,
        delete: false
      },
      backgroundCheck: {
        view: false,
        create: false,
        edit: false,
        delete: false
      },
      badgeRequest: {
        view: false,
        create: false,
        edit: false,
        delete: false
      },
      accessRequest: {
        view: false,
        create: false,
        edit: false,
        delete: false
      },
      attendance: {
        view: false,
        create: false,
        edit: false,
        delete: false
      },
      visitorsManagement: {
        view: false,
        create: false,
        edit: false,
        delete: false
      },
      reports: {
        view: false,
        create: false
      }
    }
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    try {
      setLoading(true);

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Create user profile in Firestore
      const userProfile = {
        uid: userCredential.user.uid,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        permissions: formData.permissions,
        isFirstLogin: true,
        createdAt: new Date().toISOString(),
        lastLogin: null
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), userProfile);

      onSuccess(userProfile);
      onClose();
    } catch (error) {
      console.error('Error creating user:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <User className="h-5 w-5 mr-2 text-emerald-600" />
              Create New User
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleCreateUser} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="user@example.com"
                />
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="••••••"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="••••••"
                  />
                </div>
              </div>
            </div>

            {/* Role & Status Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="USER">User</option>
                  <option value="OPERATOR">Operator</option>
                  <option value="ADMINISTRATOR">Administrator</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
            </div>

            {/* Permissions Section */}
            {formData.role !== 'ADMINISTRATOR' && (
              <div className="space-y-4">
                <h3 className="text-md font-medium text-gray-900 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-emerald-600" />
                  Permissions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(formData.permissions).map(([module, actions]) => (
                    <div key={module} className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700 capitalize">
                        {module.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <div className="space-y-2">
                        {Object.entries(actions).map(([action, enabled]) => (
                          <label key={action} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={enabled}
                              onChange={(e) => {
                                const newPermissions = { ...formData.permissions };
                                newPermissions[module][action] = e.target.checked;
                                setFormData({ ...formData, permissions: newPermissions });
                              }}
                              className="form-checkbox h-4 w-4 text-emerald-600 rounded"
                            />
                            <span className="text-sm text-gray-600 capitalize">
                              {action}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 
                         transition-colors flex items-center space-x-2 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>Create User</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CreateUserModal;
