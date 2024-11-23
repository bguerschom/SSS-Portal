import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, User, Shield, AlertCircle } from 'lucide-react';

const UserEditModal = ({ user, onClose, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    role: user?.role || 'USER',
    permissions: user?.permissions || {},
    status: user?.status || 'active'
  });

  const [error, setError] = useState('');

  const handlePermissionChange = (module, action, value) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [module]: {
          ...prev.permissions[module],
          [action]: value
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white rounded-xl shadow-lg w-full max-w-2xl mx-4 overflow-y-auto max-h-[90vh]"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {user ? 'Edit User' : 'Add New User'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
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

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Info */}
              {user && (
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{user.email}</h3>
                    <p className="text-sm text-gray-500">User ID: {user.uid}</p>
                  </div>
                </div>
              )}

              {/* Role Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="USER">User</option>
                  <option value="OPERATOR">Operator</option>
                  <option value="ADMINISTRATOR">Administrator</option>
                </select>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="active">Active</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>

              {/* Permissions */}
              {formData.role !== 'ADMINISTRATOR' && (
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-gray-900 flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-emerald-600" />
                    <span>Permissions</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                onChange={(e) => handlePermissionChange(module, action, e.target.checked)}
                                className="form-checkbox h-4 w-4 text-emerald-600 rounded"
                              />
                              <span className="text-sm text-gray-600 capitalize">
                                {action.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 
                           transition-colors flex items-center space-x-2 disabled:opacity-50"
                  disabled={isLoading}
                >
                  <Save className="h-5 w-5" />
                  <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UserEditModal;
