import React from 'react';
import { Sprout, LayoutDashboard, Calendar, Plus, Flame, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type Props = {
  currentPage: 'dashboard' | 'habits' | 'add' | 'streaks';
  onNavigate: (page: 'dashboard' | 'habits' | 'add' | 'streaks') => void;
};

export const Navbar: React.FC<Props> = ({ currentPage, onNavigate }) => {
  const { signOut } = useAuth();

  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'habits' as const, label: 'Habits', icon: Calendar },
    { id: 'add' as const, label: 'Add Habit', icon: Plus },
    { id: 'streaks' as const, label: 'Streaks', icon: Flame },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800 hidden sm:inline">
              My Habit Tracker
            </span>
          </div>

          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                    isActive
                      ? 'bg-teal-500 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden md:inline">{item.label}</span>
                </button>
              );
            })}

            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-all ml-2"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
