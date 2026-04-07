import React, { useState, useContext } from 'react';
import {
  Menu,
  X,
  Home,
  Users,
  Calendar,
  Pill,
  Clock,
  BarChart3,
  CreditCard,
  Settings,
  LogOut,
  ChevronDown,
  Moon,
  Sun,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeContext } from '../ThemeContext';
import NotificationCenter from './NotificationCenter';
import './Sidebar.css';

function Sidebar({ user, onLogout, isOpen, onToggle }) {
  const [expandedMenu, setExpandedMenu] = useState(null);
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Patients', path: '/patients' },
    {
      icon: Calendar,
      label: 'Appointments',
      path: '/appointments',
      submenu: [
        { label: 'View Appointments', path: '/appointments' },
        { label: 'Add Appointment', path: '/appointments' },
      ],
    },
    { icon: Pill, label: 'Prescriptions', path: '/prescriptions' },
    { icon: Clock, label: 'Doctor Schedule', path: '/doctor-schedule' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: CreditCard, label: 'Payments', path: '/payments' },
  ];

  const isActive = (path) => location.pathname === path;

  const toggleMenu = (index) => {
    setExpandedMenu(expandedMenu === index ? null : index);
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="sidebar-mobile-toggle"
        onClick={onToggle}
        title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${!isOpen ? 'collapsed' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">🏥</span>
            {isOpen && <span className="logo-text">HMS</span>}
          </div>
          <button
            className="sidebar-toggle"
            onClick={onToggle}
            title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isOpen ? <ChevronDown size={20} style={{ transform: 'rotate(90deg)' }} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isMenuActive =
              isActive(item.path) || item.submenu?.some((sub) => isActive(sub.path));

            return (
              <div key={index}>
                {hasSubmenu ? (
                  <>
                    <button
                      className={`sidebar-menu-item ${isMenuActive ? 'active' : ''}`}
                      onClick={() => toggleMenu(index)}
                    >
                      <Icon size={20} />
                      {isOpen && (
                        <>
                          <span className="menu-label">{item.label}</span>
                          <ChevronDown
                            size={16}
                            className={`submenu-icon ${
                              expandedMenu === index ? 'expanded' : ''
                            }`}
                          />
                        </>
                      )}
                    </button>
                    {isOpen && expandedMenu === index && (
                      <div className="submenu">
                        {item.submenu.map((subitem, subindex) => (
                          <Link
                            key={subindex}
                            to={subitem.path}
                            className={`submenu-item ${
                              isActive(subitem.path) ? 'active' : ''
                            }`}
                          >
                            {subitem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className={`sidebar-menu-item ${isActive(item.path) ? 'active' : ''}`}
                  >
                    <Icon size={20} />
                    {isOpen && <span className="menu-label">{item.label}</span>}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              {user?.firstName?.charAt(0).toUpperCase()}
            </div>
            {isOpen && (
              <div className="user-info">
                <div className="user-name">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="user-role">{user?.role || 'Staff'}</div>
              </div>
            )}
          </div>

          <div className="sidebar-actions">
            <NotificationCenter />
            <button
              className="sidebar-action-btn"
              onClick={toggleDarkMode}
              title={isDarkMode ? 'Light mode' : 'Dark mode'}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="sidebar-action-btn" title="Settings">
              <Settings size={20} />
            </button>
            <button
              className="sidebar-action-btn logout"
              onClick={onLogout}
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={onToggle} />}
    </>
  );
}

export default Sidebar;
