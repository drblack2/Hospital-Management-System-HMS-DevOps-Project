import React, { useState, useEffect } from 'react';
import { Bell, X, Check, Clock, AlertCircle } from 'lucide-react';
import './NotificationCenter.css';

function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'appointment',
      title: 'Appointment Reminder',
      message: 'Dr. Smith appointment at 2:00 PM',
      timestamp: new Date(Date.now() - 5 * 60000),
      read: false,
      icon: Clock,
    },
    {
      id: 2,
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment of ₹5,000 received successfully',
      timestamp: new Date(Date.now() - 30 * 60000),
      read: false,
      icon: AlertCircle,
    },
    {
      id: 3,
      type: 'system',
      title: 'System Update',
      message: 'New patient records added to the system',
      timestamp: new Date(Date.now() - 2 * 60 * 60000),
      read: true,
      icon: AlertCircle,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getTimeString = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <div className="notification-center">
      {/* Bell Icon */}
      <button
        className="notification-bell"
        onClick={() => setIsOpen(!isOpen)}
        title="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          <div className="notification-overlay" onClick={() => setIsOpen(false)} />
          <div className="notification-panel">
            <div className="notification-header">
              <h3>Notifications</h3>
              {unreadCount > 0 && (
                <button
                  className="btn btn-sm"
                  onClick={markAllAsRead}
                  title="Mark all as read"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="notification-list">
              {notifications.length > 0 ? (
                notifications.map((notification) => {
                  const Icon = notification.icon;
                  return (
                    <div
                      key={notification.id}
                      className={`notification-item ${
                        notification.read ? 'read' : 'unread'
                      }`}
                    >
                      <div className="notification-icon">
                        <Icon size={18} />
                      </div>
                      <div className="notification-content">
                        <div className="notification-title">
                          {notification.title}
                        </div>
                        <div className="notification-message">
                          {notification.message}
                        </div>
                        <div className="notification-time">
                          {getTimeString(notification.timestamp)}
                        </div>
                      </div>
                      <div className="notification-actions">
                        {!notification.read && (
                          <button
                            className="btn-icon"
                            onClick={() => markAsRead(notification.id)}
                            title="Mark as read"
                          >
                            <Check size={16} />
                          </button>
                        )}
                        <button
                          className="btn-icon delete"
                          onClick={() => deleteNotification(notification.id)}
                          title="Delete"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="empty-notifications">
                  All caught up! No notifications.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default NotificationCenter;
