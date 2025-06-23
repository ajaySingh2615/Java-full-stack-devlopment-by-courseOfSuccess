import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AlertOctagon, ArrowLeft, LogIn } from 'lucide-react';

/**
 * Unauthorized access page
 * Displays when a user attempts to access a restricted page without permission
 */
const Unauthorized = () => {
  const location = useLocation();
  const message = location.state?.message || "You don't have permission to access this page";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-red-600 p-6 flex justify-center">
          <AlertOctagon size={64} color="white" />
        </div>
        
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">{message}</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/" 
              className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded transition-colors"
            >
              <ArrowLeft size={18} />
              <span>Back to Home</span>
            </Link>
            
            <Link 
              to="/login" 
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
            >
              <LogIn size={18} />
              <span>Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized; 