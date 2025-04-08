import React, { useState, useEffect } from 'react';
import { Trash2, ShoppingBag, Calendar, Minus, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { imageUrl } from '../../../api/Api';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to extract price from an item
  const extractPrice = (item) => {
    if (typeof item.price === 'number' && item.price > 0) return item.price;
    // If we have total, days and quantity, we can calculate price
    if (item.total && item.days > 0 && item.quantity > 0) {
      return item.total / (item.days * item.quantity);
    }
    // If we only have total, assume 1 day and 1 quantity
    if (item.total) return item.total;
    // Default price
    return 0;
  };

  useEffect(() => {
    // Load cart data from localStorage
    const loadCart = () => {
      try {
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        // Convert deliveryDate strings back to Date objects and ensure price property exists
        const cartWithDates = savedCart.map(item => {
          // Make sure we have all required properties with fallbacks
          const updatedItem = {
            ...item,
            quantity: item.quantity || 1,
            days: item.days || 1,
            price: extractPrice(item),
            deliveryDate: new Date(item.deliveryDate || Date.now())
          };
          
          // Recalculate total to ensure consistency
          updatedItem.total = updatedItem.price * updatedItem.quantity * updatedItem.days;
          
          return updatedItem;
        });
        
        setCart(cartWithDates);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading cart:', error);
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  const saveCart = (updatedCart) => {
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const handleRemoveItem = (productId) => {
    const updatedCart = cart.filter(item => item.productId !== productId);
    saveCart(updatedCart);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cart.map(item => {
      if (item.productId === productId) {
        const updatedQuantity = newQuantity;
        // Make sure price is available and a number
        const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
        const updatedTotal = price * updatedQuantity * item.days;
        return { 
          ...item, 
          quantity: updatedQuantity, 
          total: updatedTotal,
          price: price // Ensure price is always stored
        };
      }
      return item;
    });
    
    saveCart(updatedCart);
  };

  const handleDaysChange = (productId, newDays) => {
    if (newDays < 1) return;
    
    const updatedCart = cart.map(item => {
      if (item.productId === productId) {
        const updatedDays = newDays;
        // Make sure price is available and a number
        const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
        const updatedTotal = price * item.quantity * updatedDays;
        // Update delivery date based on new days value
        return { 
          ...item, 
          days: updatedDays, 
          total: updatedTotal,
          price: price, // Ensure price is always stored
        };
      }
      return item;
    });
    
    saveCart(updatedCart);
  };

  const handleDateChange = (productId, daysToAdd) => {
    const updatedCart = cart.map(item => {
      if (item.productId === productId) {
        const currentDate = new Date(item.deliveryDate);
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + daysToAdd);
        return { ...item, deliveryDate: newDate };
      }
      return item;
    });
    
    saveCart(updatedCart);
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => {
      // Handle potential null or undefined values
      const itemTotal = item.total || 0;
      return sum + itemTotal;
    }, 0);
  };
  const totalQuantity = () => {
    return cart.reduce((sum, item) => {
      // Handle potential null or undefined values
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading cart...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header/>
      
      <div className="max-w-7xl mx-auto px-4 py-8 mb-20">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        
        {cart.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="flex justify-center mb-4">
              <ShoppingBag size={64} className="text-gray-300" />
            </div>
            <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <button 
              className="px-6 py-3 bg-[#FFAD33] text-white font-medium rounded-md hover:bg-[#E89C2C] transition duration-300"
              onClick={() => window.history.back()}
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
                  <h2 className="text-xl font-semibold">Cart Items ({cart.length})</h2>
                </div>
                
                {/* Cart Items List */}
                <div className="divide-y divide-gray-200">
                  {cart.map((item) => (
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
                              className="text-gray-400 hover:text-red-500 transition-colors"
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
                    <span className="font-medium">Rs {(totalQuantity()*200).toFixed(0)}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-semibold">
                      Rs {calculateSubtotal() ? (calculateSubtotal() +(totalQuantity()*200)).toFixed(2) : "0.00"}
                    </span>
                  </div>
                </div>
                
                <button className="w-full py-3 bg-[#FFAD33] text-white font-medium rounded-md hover:bg-[#E89C2C] transition duration-300 flex items-center justify-center">
                  Proceed to Checkout
                </button>
                
                <button 
                  className="w-full py-3 mt-4 border border-[#FFAD33] text-[#FFAD33] font-medium rounded-md hover:bg-[#FFF5E6] transition duration-300 flex items-center justify-center"
                  onClick={() => window.history.back()}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Footer/>
    </div>
  );
};

export default CartPage;