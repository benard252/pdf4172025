
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useBalance } from '../hooks/useBalance';
import { LogOut, UserCircle, Home, Edit3, DollarSign } from 'lucide-react';

export const Navbar: React.FC = () => {
  const auth = useAuth();
  const balance = useBalance();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (auth) auth.logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-teal-400 hover:text-teal-300 transition-colors">
            PDF417 Gen
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center">
              <Home size={18} className="mr-1"/> Home
            </Link>
            {auth && auth.user ? (
              <>
                <Link to="/dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center">
                  <UserCircle size={18} className="mr-1"/> Dashboard
                </Link>
                <Link to="/generate" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center">
                  <Edit3 size={18} className="mr-1"/> Generate
                </Link>
                <div className="text-gray-300 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                  <DollarSign size={18} className="mr-1 text-green-400"/> 
                  Balance: ${balance ? balance.balance.toFixed(2) : '0.00'}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center bg-red-600 hover:bg-red-700 transition-colors"
                >
                  <LogOut size={18} className="mr-1"/> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
