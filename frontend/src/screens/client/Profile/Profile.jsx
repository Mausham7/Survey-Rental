import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { AlertCircle } from 'lucide-react';
import { get_my_orders, get_profile, update_profile } from '../../../api/Api';


const UserProfile = () => {
  // Initial user state based on schema
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'client',
    createdAt: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [passwordChange, setPasswordChange] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      const response = await fetch(get_my_orders, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error('Failed to fetch orders');

      const data = await response.json();
      const formattedOrders = data.map(order => ({
        _id: order._id,
        product: order.pName,
        rentalDuration: order.days,
        totalPrice: order.total,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        deliveryDate: new Date(order.deliveryDate),
        createdAt: new Date(order.createdAt),
        returnDate: new Date(new Date(order.deliveryDate).getTime() + (order.days * 24 * 60 * 60 * 1000)),
        customerDetails: {
          fullName: order.fullName,
          phone: order.phone,
          email: order.emailAddress,
          address: `${order.streetAddress}, ${order.townCity}`,
        },
      }));

      setOrders(formattedOrders);
    } catch (err) {
      setError(err.message || "Error loading orders");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user data (mock)
  useEffect(() => {
    // Replace with actual API call
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(get_profile, {
          headers: {
            Authorization: `Bearer ${token}`, // token from your auth system
          },
        });
        const data = await response.json();
        if (data.success) {
          setUser(data.data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordChange({ ...passwordChange, [name]: value });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSuccessMessage('');
  };

  const handleSave = async () => {
    // Password validation if user is changing password
    if (
      passwordChange.newPassword &&
      passwordChange.newPassword !== passwordChange.confirmPassword
    ) {
      setPasswordError('Passwords do not match');
      return;
    }
    user.newPassword = passwordChange.newPassword
    user.confirmPassword = passwordChange.confirmPassword
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(update_profile, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });
      const data = await response.json();
      console.log(data)
      setIsEditing(false)
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-full mx-auto ">
      {/* Navbar placeholder */}
      <Header />

      <div className="bg-white px-[10%] mt-10 overflow-hidden">


        <div className="p-6">
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
              {successMessage}
            </div>
          )}

          <div className="flex flex-col md:flex-row md:space-x-6">
            <div className="md:w-1/3  mb-6 md:mb-0">
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <div className="flex justify-center mb-4">
                  <div className="w-32 h-32 bg-amber-200 rounded-full flex items-center justify-center">
                    <span className="text-4xl font-bold text-amber-600">
                      {user.fullName ? user.fullName.charAt(0).toUpperCase() : '?'}
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <h2 className="text-xl font-bold text-gray-800">{user.fullName}</h2>
                  <p className="text-amber-600 font-medium">{user.role}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Member since {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="md:w-2/3">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Account Information</h2>
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-8 8a2 2 0 01-1.414.586H5a1 1 0 01-1-1V12.5a2 2 0 01.586-1.414l8-8z" />
                    </svg>
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Save Changes
                  </button>
                )}
              </div>

              <div className="">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={user.fullName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full p-2 border rounded-md ${isEditing
                      ? 'border-amber-300 focus:ring-2 focus:ring-amber-200 focus:border-amber-500'
                      : 'bg-gray-50 border-gray-200'
                      }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full p-2 border border-gray-200 rounded-md bg-gray-50"
                  />
                  <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={user.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full p-2 border rounded-md ${isEditing
                      ? 'border-amber-300 focus:ring-2 focus:ring-amber-200 focus:border-amber-500'
                      : 'bg-gray-50 border-gray-200'
                      }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    name="role"
                    value={user.role}
                    disabled
                    className="w-full p-2 border border-gray-200 rounded-md bg-gray-50"
                  >
                    <option value="client">Customer</option>

                  </select>
                  <p className="mt-1 text-xs text-gray-500">Role cannot be changed</p>

                </div>
              </div>

              {isEditing && (
                <div className="mt-8">
                  <h3 className="font-bold text-gray-800 mb-4">Change Password</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordChange.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full p-2 border border-amber-300 rounded-md focus:ring-2 focus:ring-amber-200 focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordChange.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full p-2 border border-amber-300 rounded-md focus:ring-2 focus:ring-amber-200 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {passwordError && (
                    <p className="mt-2 text-red-500 text-sm">{passwordError}</p>
                  )}

                  <p className="mt-2 text-xs text-gray-500">
                    Leave blank if you don't want to change your password
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20"></div>

      {/* Footer placeholder */}
      <Footer />
    </div>
  );
};

export default UserProfile;