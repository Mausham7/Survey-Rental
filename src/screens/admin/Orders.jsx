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

      <div className="container mx-auto px-4 py-8">
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-6">
              <h2 className="text-xl font-bold mb-4">Order Details</h2>
              <p><strong>Order ID:</strong> {selectedOrder._id}</p>
              <p><strong>Product:</strong> {selectedOrder.product}</p>
              <p><strong>Customer:</strong> {selectedOrder.customerDetails.firstName}</p>
              <p><strong>Total Price:</strong> Rs. {selectedOrder.totalPrice}</p>
              <p><strong>Payment Method:</strong> {selectedOrder.paymentStatus}</p>
              <p><strong>Order Status:</strong> {selectedOrder.orderStatus}</p>
              <p><strong>Rental Duration:</strong> {selectedOrder.rentalDuration} days</p>
              <p><strong>Customer Phone:</strong> {selectedOrder.customerDetails.phoneNumber}</p>
              <p><strong>Customer Email:</strong> {selectedOrder.customerDetails.email}</p>
              <p><strong>Address:</strong> {selectedOrder.customerDetails.streetAddress}, {selectedOrder.customerDetails.city}</p>
              <br />
              <p><strong>Citizenship Photo:</strong> </p>
              <br />
              <img className='h-[20rem]' src={`${imageUrl}/${selectedOrder.image}`} />
              <div className="mt-4">
                <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setIsViewModalOpen(false)}>Close</button>
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