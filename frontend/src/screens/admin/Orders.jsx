import React, { useState, useEffect } from 'react';
import OrdersTable from './OrdersTable';
import { AlertCircle } from 'lucide-react';
import Menu from './component/Menu';
import Data from './component/Data';
import { get_all_orders, imageUrl } from '../../api/Api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      const response = await fetch(get_all_orders, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      console.log("Orders data:", data);

      // Transform the API data to match your component's expected format
      const formattedOrders = data.map(order => ({
        _id: order._id,
        user: order.userId._id,
        image: order.image,
        product: order.pName,
        rentalDuration: order.days,
        totalPrice: order.total,
        paymentStatus: order.paymentMethod === "COD" ? "Pending" : "Completed",
        orderStatus: order.orderStatus, // You might want to add this field to your API response
        createdAt: new Date(order.createdAt),
        returnDate: new Date(new Date(order.createdAt).getTime() + (order.days * 24 * 60 * 60 * 1000)),
        customerDetails: {
          firstName: order.fullName,
          citizenId: order.citizenID,
          streetAddress: order.streetAddress,
          apartment: "", // Add this field if needed
          city: order.townCity,
          phoneNumber: order.phone,
          email: order.email,
          saveInfo: false, // Add this field if needed
        },
      }));
      console.log()
      setOrders(formattedOrders);
      console.log(formattedOrders)
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    console.log("Selected order: ", order)
    setIsViewModalOpen(true);
  };

  const handleDeleteOrder = (orderId) => {
    setOrderToDelete(orderId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Replace with your delete order API endpoint
      const response = await fetch(`${get_all_orders}/${orderToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete order');
      }

      // Remove the deleted order from state
      setOrders(orders.filter(order => order._id !== orderToDelete));
      setIsDeleteModalOpen(false);
      setOrderToDelete(null);

    } catch (err) {
      console.error("Error deleting order:", err);
      setError("Failed to delete order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex'>
      <Menu />

      <div className="container ml-52 mx-auto px-4 py-8">
        <Data data={orders.length} />
        <h1 className="text-2xl font-bold mb-6">Orders Management</h1>

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
        ) : (
          <OrdersTable

            orders={orders}
            onView={handleViewOrder}
            onDelete={handleDeleteOrder}
            onRefresh={fetchAllOrders}
          />
        )}

        {isViewModalOpen && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-full overflow-y-auto my-4 mx-auto">
              <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-700 mb-3">Order Information</h3>
                      <div className="space-y-2">
                        <p><span className="font-medium text-gray-600">Order ID:</span> {selectedOrder._id}</p>
                        <p><span className="font-medium text-gray-600">Product:</span> {selectedOrder.product}</p>
                        <p><span className="font-medium text-gray-600">Total Price:</span> Rs. {selectedOrder.totalPrice}</p>
                        <p><span className="font-medium text-gray-600">Payment Method:</span> {selectedOrder.paymentStatus}</p>
                        <p><span className="font-medium text-gray-600">Order Status:</span>
                          <span className={`ml-2 px-2 py-1 text-sm rounded ${selectedOrder.orderStatus === 'Completed' ? 'bg-green-100 text-green-800' :
                              selectedOrder.orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                            }`}>
                            {selectedOrder.orderStatus}
                          </span>
                        </p>
                        <p><span className="font-medium text-gray-600">Rental Duration:</span> {selectedOrder.rentalDuration} days</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-700 mb-3">Customer Details</h3>
                      <div className="space-y-2">
                        <p><span className="font-medium text-gray-600">Name:</span> {selectedOrder.customerDetails.firstName}</p>
                        <p><span className="font-medium text-gray-600">Phone:</span> {selectedOrder.customerDetails.phoneNumber}</p>
                        
                        <p><span className="font-medium text-gray-600">Address:</span> {selectedOrder.customerDetails.streetAddress}, {selectedOrder.customerDetails.city}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 mb-3">Citizenship Document</h3>
                    <div className="flex justify-center">
                      <img
                        className="max-h-80 w-auto object-contain rounded-lg shadow"
                        src={`${imageUrl}/${selectedOrder.image}`}
                        alt="Citizenship document"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-white p-4 border-t flex justify-end">
                <button
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                  onClick={() => setIsViewModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
              <p>Are you sure you want to delete this order?</p>
              <div className="mt-4 flex justify-end">
                <button className="px-4 py-2 bg-gray-200 rounded mr-2" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
                <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={confirmDelete}>
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;