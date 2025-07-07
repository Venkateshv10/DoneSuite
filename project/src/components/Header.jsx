import React, { useState } from 'react';
import { LogOut, User, Sun, Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Header({ darkMode, onToggleDarkMode }) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <header className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg px-6 py-4 flex items-center justify-between relative z-10">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-extrabold text-white tracking-wide drop-shadow-lg select-none">
          <span className="inline-block align-middle mr-2">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="#fff" fillOpacity="0.15"/>
              <path d="M12 8l-2 8h6l-3 8 8-12h-6l2-4z" fill="#fff" stroke="#fff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          DoneSuite
        </span>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white shadow transition-all focus:outline-none"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        {user && (
          <div className="relative">
            <button
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-full px-3 py-1 text-white font-medium shadow transition-all focus:outline-none"
              onClick={() => setDropdownOpen(v => !v)}
            >
              <span className="w-8 h-8 rounded-full bg-white/40 flex items-center justify-center text-lg font-bold text-indigo-700 shadow-inner">
                {initials}
              </span>
              <span className="hidden sm:block max-w-[120px] truncate">{user.name || user.email}</span>
              <User className="w-5 h-5 opacity-70" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-3 px-4 z-20 animate-fade-in">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-xl font-bold text-indigo-700">
                    {initials}
                  </span>
                  <div>
                    <div className="font-semibold text-indigo-700">{user.name || 'User'}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </div>
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium transition-all"
                  onClick={logout}
                >
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}