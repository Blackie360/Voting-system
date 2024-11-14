import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Vote, PlusCircle, LayoutDashboard, LogOut, LogIn, User as UserIcon, BarChart } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, isAdmin, signInAnon, signInWithGoogle, signOut, displayName } = useAuthStore();
  const [showAuthMenu, setShowAuthMenu] = useState(false);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Vote className="h-8 w-8 text-red-800" />
            <span className="text-xl font-bold text-red-800">People`s Choice </span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              to="/polls"
              className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600"
            >
              <BarChart className="h-5 w-5" />
              <span>View Polls</span>
            </Link>

            {user && (
              <Link
                to="/create"
                className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600"
              >
                <PlusCircle className="h-5 w-5" />
                <span>Create Poll</span>
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600"
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>Admin</span>
              </Link>
            )}

            <div className="relative">
              <button
                onClick={() => setShowAuthMenu(!showAuthMenu)}
                className="flex items-center space-x-1 px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                {user ? (
                  <>
                    <UserIcon className="h-5 w-5" />
                    <span>{displayName || 'Anonymous'}</span>
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5" />
                    <span>Sign In</span>
                  </>
                )}
              </button>

              <AnimatePresence>
                {showAuthMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1"
                  >
                    {user ? (
                      <>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowAuthMenu(false)}
                        >
                          Profile Settings
                        </Link>
                        <button
                          onClick={() => {
                            signOut();
                            setShowAuthMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            signInWithGoogle();
                            setShowAuthMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Sign in with Google
                        </button>
                        <button
                          onClick={() => {
                            signInAnon();
                            setShowAuthMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Continue Anonymously
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}