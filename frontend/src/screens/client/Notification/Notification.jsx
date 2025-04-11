import { useState, useEffect } from 'react';
import { get_notification } from '../../../api/Api';
import Footer from '../components/Footer';
import Header from '../components/Header';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(get_notification, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }

        const data = await response.json();
        setNotifications(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load notifications');
        setLoading(false);
        console.error('Error fetching notifications:', err);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order_placed':
        return '🛒';
      case 'order_status_change':
        return '📦';
      case 'payment_received':
        return '💰';
      case 'system':
        return '🔔';
      default:
        return '📌';
    }
  };

  const getNotificationColor = (type) => {
    // Using shades of the theme color for different notification types
    switch (type) {
      case 'order_placed':
        return 'bg-orange-100 border-orange-300';
      case 'order_status_change':
        return 'bg-amber-100 border-amber-300';
      case 'payment_received':
        return 'bg-yellow-100 border-yellow-300';
      case 'system':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-amber-50 border-amber-200';
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto p-4 mt-8">
        <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-t-amber-500 border-b-amber-500 border-amber-200 rounded-full animate-spin"></div>
            <p className="text-gray-600 mt-4 text-lg">Loading your notifications...</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto p-4 mt-8">
        <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow">
          <div className="text-center">
            <div className="text-4xl mb-4">❌</div>
            <p className="text-red-500 text-lg font-medium">{error}</p>
            <p className="text-gray-600 mt-2">Please try again later</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto p-4 mt-8 mb-16">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Custom gradient with theme color */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-400 px-6 py-4 flex justify-between items-center" style={{ backgroundColor: '#FFAD33' }}>
            <h2 className="text-2xl font-bold text-white">Your Notifications</h2>
            <div className="bg-white bg-opacity-25 px-3 py-1 rounded-full text-white text-sm">
              {notifications.length} {notifications.length === 1 ? 'notification' : 'notifications'}
            </div>
          </div>
          
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 p-8 text-center">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-xl font-medium text-gray-700">No notifications yet</h3>
              <p className="text-gray-500 mt-2">We'll notify you when something important happens</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-6 hover:bg-amber-50 transition-all duration-200 cursor-pointer ${!notification.isRead ? 'border-l-4' : 'border-l-4 border-transparent'} ${!notification.isRead ? getNotificationColor(notification.type) : ''}`}
                  onClick={() => !notification.isRead && markAsRead(notification._id)}
                >
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 mr-4 flex items-center justify-center w-12 h-12 rounded-full ${getNotificationColor(notification.type)}`}>
                      <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-semibold text-lg text-gray-900">{notification.title}</h3>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500">
                            {new Date(notification.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {!notification.isRead && (
                            <div className="ml-3">
                              <span className="inline-block w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: '#FFAD33' }}></span>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 mb-2">{notification.message}</p>
                      {notification.trackingNumber && (
                        <div className=" items-center mt-2 text-sm text-amber-800 bg-amber-100 py-1 px-3 rounded-full inline-block">
                          <span className="mr-1">📋</span>
                          Order: {notification.trackingNumber}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Notification;