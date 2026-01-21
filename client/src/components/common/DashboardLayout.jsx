import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useRef, useState } from 'react';
import {
  LayoutDashboard,
  Timer,
  ListTodo,
  BarChart3,
  LogOut,
  User,
  Settings
} from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleGoToSettings = () => {
    setIsUserMenuOpen(false);
    navigate('/dashboard/settings');
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/dashboard/timer', icon: Timer, label: 'Timer' },
    { path: '/dashboard/tasks', icon: ListTodo, label: 'Tasks' },
    { path: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-[#333333] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-[#00ff88] to-[#00cc6a] rounded-lg flex items-center justify-center">
                  <Timer className="w-5 h-5 text-black" />
                </div>
                <span className="text-xl font-bold text-white">DevFocus</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                      isActive(item.path)
                        ? 'bg-[#00ff88]/10 text-[#00ff88]'
                        : 'text-[#a0a0a0] hover:bg-[#2c2c2c] hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-3 relative" ref={userMenuRef}>
                {/* Clickable user box */}
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className="flex items-center space-x-2 bg-[#1a1a1a] border border-[#333333] px-3 py-2 rounded-lg"
                >
                  <User className="w-5 h-5 text-[#6b6b6b]" />
                  <span className="text-sm font-medium text-white">{user?.name}</span>
                </button>

                {/* Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-12 w-48 bg-[#1a1a1a] border border-[#333333] rounded-lg shadow-2xl overflow-hidden z-50">
                    <button
                      onClick={handleGoToSettings}
                      className="w-full flex items-center space-x-2 px-4 py-3 text-left text-[#a0a0a0] hover:bg-[#2c2c2c] hover:text-white transition-all"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-sm font-medium">Settings</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-3 text-left text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Existing Logout Button (kept as-is) */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-[#333333]">
          <nav className="flex justify-around py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all ${
                    isActive(item.path) ? 'text-[#00ff88]' : 'text-[#a0a0a0]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
};

export default DashboardLayout;
