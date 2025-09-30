import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { logoutAsync } from '../store/slices/authSlice';
import {
  ChartBarIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import LokVaaniLogo from '../assets/logo.png';

const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = useCallback(async () => {
    await dispatch(logoutAsync());
    navigate('/');
  }, [dispatch, navigate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const navigationItems = useMemo(() => [
    { name: 'Home', href: '/', public: true },
    // { name: 'Drafts', href: '/drafts', public: true },
    { name: 'About', href: '/about', public: true },
    ...(isAuthenticated ? [
      { name: 'Dashboard', href: user?.role === 'ADMIN' ? '/admin' : '/drafts', public: false },
    ] : [])
  ], [isAuthenticated, user?.role]);

  const isActivePath = useCallback((path: string) => location.pathname === path, [location.pathname]);

  return (
    <>
      {/* Main Header */}
      <header className="max-w-7xl mx-auto bg-white border-b border-slate-200 fixed top-4 left-0 right-0 z-40 shadow-sm rounded-lg">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={LokVaaniLogo}
              alt="LokVaani" 
              className="h-12 w-auto"
            />
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-base font-medium transition-all duration-200 font-sans ${
                  isActivePath(item.href)
                    ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                    : 'text-slate-700 hover:text-blue-600 hover:border-b-2 hover:border-blue-600 hover:pb-1'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side - Auth Section */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-2 text-slate-700 hover:text-blue-600 transition-colors duration-200 font-sans"
                >
                  <UserCircleIcon className="h-6 w-6" />
                  <span className="text-sm font-medium">{user?.name}</span>
                  <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 z-50 overflow-hidden">
                    {/* User Info Header */}
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                      <div className="text-sm font-semibold text-slate-900">{user?.name}</div>
                      <div className="text-xs text-slate-500">{user?.email}</div>
                      <div className="text-xs text-blue-600 font-medium">{user?.role}</div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <Link
                        to={user?.role === 'ADMIN' ? '/admin' : '/drafts'}
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <ChartBarIcon className="h-4 w-4 mr-3 text-blue-600" />
                        Dashboard
                      </Link>
                      
                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3 text-red-600" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 font-sans">
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
