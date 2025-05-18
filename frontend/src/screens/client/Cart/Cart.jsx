import React, { useState, useEffect } from 'react';
import { Trash2, ShoppingBag, Calendar, Minus, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { get_cart, imageUrl, remove_from_cart, update_cart_item } from '../../../api/Api';

const CartPage = () => {
  const [cart, setCart] = useState({ items: [] });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const token = localStorage.getItem('token');

  //function to load cart data
  const loadCart = async () => {
    setIsLoading(false);
    try {
      const response = await fetch(get_cart, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setCart(data.data);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      setIsLoading(false);
      await fetch(remove_from_cart(productId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      loadCart();
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item from cart');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setIsLoading(false);
      await fetch(update_cart_item(productId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: newQuantity })
      });

      loadCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDaysChange = async (productId, newDays) => {
    if (newDays < 1) return;

    try {
      setIsLoading(false);
      await fetch(update_cart_item(productId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ days: newDays })
      });

      loadCart();
    } catch (error) {
      console.error('Error updating days:', error);
      alert('Failed to update rental days');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = async (productId, daysToAdd) => {
    try {
      setIsLoading(false);

      const currentItem = cart.items.find(item => item.productId === productId);
      const currentDate = new Date(currentItem.deliveryDate);
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + daysToAdd);

      await fetch(update_cart_item(productId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ deliveryDate: newDate })
      });

      loadCart();
    } catch (error) {
      console.error('Error updating date:', error);
      alert('Failed to update delivery date');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateSubtotal = () => {
    return (cart.items || []).reduce((sum, item) => {
      const itemTotal = item.total || 0;
      return sum + itemTotal;
    }, 0);
  };

  const totalQuantity = () => {
    return (cart.items || []).reduce((sum, item) => {
      const quantityTotal = item.quantity || 0;
      return sum + quantityTotal;
    }, 0);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleCheckout = () => {
    // Get cart data with proper formatting for backend
    const cartItemsForCheckout = (cart.items || []).map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      days: item.days,
      total: item.total,
      pName: item.pName,
      detail: item.detail || "",
      deliveryDate: item.deliveryDate,
      image: item.image
    }));

    // Navigate to checkout
    window.location.href = `/rent-now/multi?cart=${encodeURIComponent(JSON.stringify(cartItemsForCheckout))}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading cart...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8 mb-20">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {(cart.items || []).length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="flex justify-center mb-4">
              <ShoppingBag size={64} className="text-gray-300" />
            </div>
            <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <button
              className="px-6 py-3 bg-[#FFAD33] text-white font-medium rounded-md hover:bg-[#E89C2C] transition duration-300"
              onClick={() => navigate(`/home`)}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-md">
                {/* Cart Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold">Cart Items ({cart.items.length})</h2>
                </div>

                {/* Cart Items List */}
                <div className="divide-y divide-gray-200">
                  {cart.items.map((item) => (
                    <div key={item.productId} className="p-6">
                      <div className="flex flex-col sm:flex-row">
                        {/* Product Image */}
                        <div className="sm:w-1/4 mb-4 sm:mb-0">
                          <div className="aspect-square w-full max-w-[150px] mx-auto sm:mx-0 bg-gray-100 rounded-md overflow-hidden">
                            {item.image ? (
                              <img
                                src={`${imageUrl}/${item.image}`}
                                alt={item.pName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <ShoppingBag size={48} />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="sm:w-3/4 sm:pl-6">
                          <div className="flex justify-between mb-2">
                            <h3 className="text-lg font-medium">{item.pName}</h3>
                            <button
                              onClick={() => handleRemoveItem(item.productId)}
                              className="text-red-600 hover:text-red-400 transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            {/* Quantity Control */}
                            <div>
                              <label className="text-sm text-gray-500 mb-1 block">Quantity</label>
                              <div className="flex items-center">
                                <button
                                  onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md hover:bg-gray-100"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus size={16} />
                                </button>
                                <input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value) || 1)}
                                  className="h-8 w-12 border-y border-gray-300 focus:outline-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <button
                                  onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md hover:bg-gray-100"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                            </div>

                            {/* Rental Days */}
                            <div>
                              <label className="text-sm text-gray-500 mb-1 block">Rental Days</label>
                              <div className="flex items-center">
                                <button
                                  onClick={() => handleDaysChange(item.productId, item.days - 1)}
                                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md hover:bg-gray-100"
                                  disabled={item.days <= 1}
                                >
                                  <Minus size={16} />
                                </button>
                                <input
                                  type="number"
                                  min="1"
                                  value={item.days || 1}
                                  onChange={(e) => handleDaysChange(item.productId, parseInt(e.target.value) || 1)}
                                  className="h-8 w-12 border-y border-gray-300 focus:outline-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <button
                                  onClick={() => handleDaysChange(item.productId, (item.days || 1) + 1)}
                                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md hover:bg-gray-100"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                            </div>

                            {/* Delivery Date */}
                            <div>
                              <label className="text-sm text-gray-500 mb-1 block">Delivery Date</label>
                              <div className="flex items-center">
                                <button
                                  onClick={() => handleDateChange(item.productId, -1)}
                                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md hover:bg-gray-100"
                                >
                                  <ChevronLeft size={16} />
                                </button>
                                <div className="h-8 px-2 border-y border-gray-300 flex items-center justify-center min-w-[120px]">
                                  <span className="flex items-center">
                                    <Calendar size={14} className="mr-1" />
                                    {formatDate(item.deliveryDate)}
                                  </span>
                                </div>
                                <button
                                  onClick={() => handleDateChange(item.productId, 1)}
                                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md hover:bg-gray-100"
                                >
                                  <ChevronRight size={16} />
                                </button>
                              </div>
                            </div>

                            {/* Item Price */}
                            <div>
                              <label className="text-sm text-gray-500 mb-1 block">Price</label>
                              <div className="font-medium">
                                Rs {(item.total || 0).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">Rs {calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Charges</span>
                    <span className="font-medium">Rs {(totalQuantity() * 200).toFixed(0)}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-semibold">
                      Rs {calculateSubtotal() ? (calculateSubtotal() + (totalQuantity() * 200)).toFixed(2) : "0.00"}
                    </span>
                  </div>
                </div>

                <button
                  className="w-full py-3 bg-[#FFAD33] text-white font-medium rounded-md hover:bg-[#E89C2C] transition duration-300 flex items-center justify-center"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </button>

                <button
                  className="w-full py-3 mt-4 border border-[#FFAD33] text-[#FFAD33] font-medium rounded-md hover:bg-[#FFF5E6] transition duration-300 flex items-center justify-center"
                  onClick={() => navigate(`/home`)}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CartPage;