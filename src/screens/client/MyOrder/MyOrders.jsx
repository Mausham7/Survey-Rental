import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

import Data from '../components/UserDataCard';
import { get_my_orders } from '../../../api/Api';
import Header from '../components/Header';

const MyOrders = () => {
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
        paymentStatus: order.paymentMethod === "COD" ? "Pending" : "Completed",
        orderStatus: order.orderStatus,
        deliveryDate:new Date(order.deliveryDate),
        createdAt: new Date(order.createdAt),
        returnDate: new Date(new Date(order.deliveryDate).getTime() + (order.days * 24 * 60 * 60 * 1000)),
        customerDetails: {
          fullName: order.fullName,
          phone: order.phone,
          email: order.email,
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

  return (
    <div className=''>
      <Header/>
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
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.paymentStatus === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">{order.orderStatus}</td>
                    <td className="px-6 py-4">{order.deliveryDate.toDateString()}</td>
                    <td className="px-6 py-4">{order.returnDate.toDateString()}</td>
                    <td className="px-6 py-4">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsViewModalOpen(true);
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

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
              <div className="mt-4">
                <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setIsViewModalOpen(false)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
