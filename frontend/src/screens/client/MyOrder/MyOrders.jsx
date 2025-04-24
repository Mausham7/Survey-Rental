import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

import Data from '../components/UserDataCard';
import { extend_order, get_my_orders, update_order } from '../../../api/Api';
import Header from '../components/Header';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [extendDays, setExtendDays] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);



  const khaltiCall = (data) => {
    window.location.href = data.payment_url;
  };

  // Daily rental rate (simplified - in a real app, this would come from the product data)
  const getDailyRate = (totalPrice, days) => totalPrice / days;

  const updateStatus = async (orderId, newStatus = "cancelled") => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(update_order, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ orderId, orderStatus: newStatus })
      });

      if (response.ok) {
        fetchMyOrders(); // Refresh orders
        console.log("Order status updated");
      } else {
        console.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const extendRental = async (orderId, additionalDays) => {
    try {
      setPaymentProcessing(true);
      const token = localStorage.getItem('token');

      // In a real implementation, you would handle payment processing here
      // This is a simplified version
      const order = orders.find(o => o._id === orderId);
      const dailyRate = getDailyRate(order.totalPrice, order.rentalDuration);
      const additionalCost = dailyRate * additionalDays;

      // Mock a payment process
      await new Promise(resolve => setTimeout(resolve, 1000));

      // After payment is successful, update the order with extended duration
      const response = await fetch(extend_order, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          orderId,
          extendDays: additionalDays,
          additionalAmount: additionalCost
        })
      });

      if (response.ok) {
        setIsExtendModalOpen(false);
        fetchMyOrders(); // Refresh orders
        // console.log("Rental period extended successfully");

        const responseData = await response.json();
        console.log(responseData)
        if (responseData.payment_method === "khalti") {
          khaltiCall(responseData.data);
        }
      } else {
        console.error('Failed to extend rental period');
        setError('Failed to extend rental period. Please try again.');
      }
    } catch (error) {
      console.error('Error extending rental:', error);
      setError('Error processing your request. Please try again.');
    } finally {
      setPaymentProcessing(false);
    }
  };

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

  // Determine if an order is eligible for extension
  const canExtendRental = (order) => {
    return order.orderStatus !== 'completed' && order.orderStatus !== 'cancelled';
  };

  return (
    <div className='h-[101vh]'>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Data data={orders.length} />
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : orders.length === 0 ? (
          <p className="text-gray-600">You have no orders yet.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">#</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Product</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Rental (days)</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Total Price</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Payment</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Order Status</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Receive Date</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Return Date</th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order, index) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{order.product}</td>
                    <td className="px-6 py-4">{order.rentalDuration}</td>
                    <td className="px-6 py-4">Rs. {order.totalPrice}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.paymentStatus === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                        }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">{order.orderStatus}</td>
                    <td className="px-6 py-4">{order.deliveryDate.toDateString()}</td>
                    <td className="px-6 py-4">{order.returnDate.toDateString()}</td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsViewModalOpen(true);
                        }}
                      >
                        View
                      </button>
                      {order.orderStatus === 'processing' && (
                        <button
                          className="text-red-600 hover:underline"
                          onClick={() => updateStatus(order._id)}
                        >
                          Cancel
                        </button>
                      )}
                      {canExtendRental(order) && (
                        <button
                          className="text-green-600 hover:underline"
                          onClick={() => {
                            setSelectedOrder(order);
                            setExtendDays(1);
                            setIsExtendModalOpen(true);
                          }}
                        >
                          Extend
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* View Order Modal */}
        {isViewModalOpen && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-xl w-full p-6">
              <h2 className="text-xl font-bold mb-4">Order Details</h2>
              <p><strong>Order ID:</strong> {selectedOrder._id}</p>
              <p><strong>Product:</strong> {selectedOrder.product}</p>
              <p><strong>Total Price:</strong> Rs. {selectedOrder.totalPrice}</p>
              <p><strong>Rental Duration:</strong> {selectedOrder.rentalDuration} days</p>
              <p><strong>Return Date:</strong> {selectedOrder.returnDate.toDateString()}</p>
              <p><strong>Payment Status:</strong> {selectedOrder.paymentStatus}</p>
              <p><strong>Customer:</strong> {selectedOrder.customerDetails.fullName}</p>
              <p><strong>Phone:</strong> {selectedOrder.customerDetails.phone}</p>
              <p><strong>Email:</strong> {selectedOrder.customerDetails.email}</p>
              <p><strong>Address:</strong> {selectedOrder.customerDetails.address}</p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
                  onClick={() => setIsViewModalOpen(false)}
                >
                  Close
                </button>
                {selectedOrder.orderStatus === 'processing' && (
                  <button
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
                    onClick={() => {
                      updateStatus(selectedOrder._id);
                      setIsViewModalOpen(false);
                    }}
                  >
                    Cancel Order
                  </button>
                )}
                {canExtendRental(selectedOrder) && (
                  <button
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
                    onClick={() => {
                      setIsViewModalOpen(false);
                      setExtendDays(1);
                      setIsExtendModalOpen(true);
                    }}
                  >
                    Extend Rental
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Extend Rental Modal */}
        {isExtendModalOpen && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <h2 className="text-xl font-bold mb-4">Extend Rental Period</h2>
              <p><strong>Product:</strong> {selectedOrder.product}</p>
              <p><strong>Current Rental:</strong> {selectedOrder.rentalDuration} days</p>
              <p><strong>Current Return Date:</strong> {selectedOrder.returnDate.toDateString()}</p>

              <div className="my-4">
                <label className="block text-gray-700 mb-2">Additional Days:</label>
                <div className="flex items-center">
                  <button
                    className="px-3 py-1 bg-gray-200 rounded-l hover:bg-gray-300 disabled:opacity-50"
                    onClick={() => setExtendDays(Math.max(1, extendDays - 1))}
                    disabled={extendDays <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="w-20 text-center border-y border-gray-300 py-1"
                    value={extendDays}
                    onChange={(e) => setExtendDays(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                  />
                  <button
                    className="px-3 py-1 bg-gray-200 rounded-r hover:bg-gray-300"
                    onClick={() => setExtendDays(extendDays + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p><strong>New Return Date:</strong> {new Date(selectedOrder.returnDate.getTime() + (extendDays * 24 * 60 * 60 * 1000)).toDateString()}</p>
                <p><strong>Additional Cost:</strong> Rs. {(getDailyRate(selectedOrder.totalPrice, selectedOrder.rentalDuration) * extendDays).toFixed(2)}</p>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
                  onClick={() => setIsExtendModalOpen(false)}
                  disabled={paymentProcessing}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded flex items-center justify-center disabled:opacity-70"
                  onClick={() => extendRental(selectedOrder._id, extendDays)}
                  disabled={paymentProcessing}
                >
                  {paymentProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    'Pay & Extend'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;