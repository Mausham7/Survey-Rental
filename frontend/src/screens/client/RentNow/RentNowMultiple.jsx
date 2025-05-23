import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { create_multiple_order, get_cart, get_profile, imageUrl } from '../../../api/Api';

const RentNowMultiple = () => {
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log("cart data", cartItems)

  const [formData, setFormData] = useState({
    paymentMethod: 'COD',
    fullName: '',
    citizenID: '',
    streetAddress: '',
    coordinates: '',
    townCity: '',
    phone: '+977 9800000000',
    email: '',
    image: null,
  });


  const token = localStorage.getItem('token');

  const loadCart = async () => {
    try {
      await fetch(get_cart, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };






  useEffect(() => {
    try {
      // Get cart items from URL query parameters
      const searchParams = new URLSearchParams(location.search);
      const cartParam = searchParams.get('cart');

      if (cartParam) {
        const parsedCart = JSON.parse(decodeURIComponent(cartParam));
        setCartItems(parsedCart);
      } else {
        // If no cart parameter, try to get from localStorage
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(savedCart);
      }
      setLoading(false);
    } catch (err) {
      setError("Failed to parse cart data");
      setLoading(false);
    }
  }, [location]);

  useEffect(() => {
    // Load saved form data from localStorage
    const loadSavedFormData = () => {
      try {
        const savedFormData = JSON.parse(localStorage.getItem('savedFormData'));
        if (savedFormData) {
          // Don't override image from localStorage
          const { image, ...savedDataWithoutImage } = savedFormData;
          setFormData(prevState => ({
            ...prevState,
            ...savedDataWithoutImage
          }));
        }
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    };

    // Fetch profile data from API
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(get_profile, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setFormData(prevState => ({
            ...prevState,
            fullName: data.data.fullName || prevState.fullName,
            email: data.data.email || prevState.email,
            phone: data.data.phone || prevState.phone
          }));
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    // First load saved form data, then override with profile data if available
    loadSavedFormData();
    fetchProfileData();
  }, []);

  const khaltiCall = (data) => {
    window.location.href = data.payment_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    // Create FormData
    const formDataToSend = new FormData();
    console.log("form data", formDataToSend);

    // Add customer information
    formDataToSend.append('paymentMethod', formData.paymentMethod);
    formDataToSend.append('fullName', formData.fullName);
    formDataToSend.append('citizenID', formData.citizenID);
    formDataToSend.append('streetAddress', formData.streetAddress);
    formDataToSend.append('coordinates', formData.coordinates);
    formDataToSend.append('townCity', formData.townCity);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('totalAmount', calculateTotal());

    // Add image file if available
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    // Add cart items as JSON string
    formDataToSend.append('products', JSON.stringify(cartItems));
    

    try {
      const response = await fetch(create_multiple_order, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });


      if (response.ok) {
        // Save form data to localStorage for future autofill (except image)
        const { image, ...formDataWithoutImage } = formData;
        localStorage.setItem('savedFormData', JSON.stringify(formDataWithoutImage));
        const responseData = await response.json();
        console.log(responseData)
        if (responseData.payment_method === "khalti") {
          khaltiCall(responseData.data);
        }

        alert('Orders created successfully!');


        loadCart()

        // Redirect to home or orders page
        window.location.href = '/home';
      } else {
        const errorData = await response.json();
        console.log("errorData", errorData);
        alert(`Error creating orders: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      // alert('Failed to process your order. Please try again.');
     
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Calculate order totals
  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.total || 0), 0);
  };

  const calculateDeliveryCharge = () => {
    // 200 per item
    // return cartItems.reduce((sum, item) => sum + (item.quantity * 200), 0);
      return (cartItems || []).reduce((sum, item) => {
      const itemTotal = item.total || 0;
      return sum + itemTotal;
    }, 0);
  };

  
  const totalQuantity = () => {
    return (cartItems || []).reduce((sum, item) => {
      const quantityTotal = item.quantity || 0;
      return sum + quantityTotal;
    }, 0);
  };

  const calculateTotal = () => {
  const subtotal = calculateSubtotal();
  const quantity = totalQuantity();

  if (typeof subtotal !== 'number' || typeof quantity !== 'number') {
    return "0.00";
  }

  return (subtotal + quantity * 200).toFixed(2);
};


  if (loading) return <div>Loading checkout details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!cartItems.length) return <div>No items in cart to checkout</div>;

  return (
    <div>
      <Header />
      <div className='flex justify-evenly flex-wrap px-4'>
        <div className="w-full max-w-lg mb-8">
          <h1 className="text-2xl font-bold mb-6">Customer Information</h1>
          <label className='text-gray-400' htmlFor="FullName">Full Name</label>
          <br />
          <input
            className='bg-[#F5F5F5] rounded-md w-full py-2 mb-5 mt-2 px-3'
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            required
          />
          <br />
          <label className='text-gray-400' htmlFor="CitizenID">Citizen ID</label>
          <br />
          <input
            className='bg-[#F5F5F5] rounded-md w-full py-2 mb-5 mt-2 px-3'
            type="text"
            name="citizenID"
            value={formData.citizenID}
            onChange={handleInputChange}
            required
          />
          <br />
          <label className='text-gray-400' htmlFor="CitizenImage">Citizen Photo</label>
          <br />
          <input
            type='file'
            onChange={handleImageChange}
            required
            className='block w-full p-3 border rounded-lg'
          />
          {formData.image && (
            <img
              src={URL.createObjectURL(formData.image)}
              alt='Preview'
              className='mt-2 h-16 w-auto rounded'
            />
          )}
          <br />
          <label className='text-gray-400' htmlFor="StreetAddress">Street Address</label>
          <br />
          <input
            className='bg-[#F5F5F5] rounded-md w-full py-2 mb-5 mt-2 px-3'
            type="text"
            name="streetAddress"
            value={formData.streetAddress}
            onChange={handleInputChange}
            required
          />
          <br />
          <label className='text-gray-400' htmlFor="Coordinates">Coordinates (optional)</label>
          <br />
          <input
            className='bg-[#F5F5F5] rounded-md w-full py-2 mb-5 mt-2 px-3'
            type="text"
            name="coordinates"
            value={formData.coordinates}
            onChange={handleInputChange}
          />
          <br />
          <label className='text-gray-400' htmlFor="TownCity">Town/City</label>
          <br />
          <input
            className='bg-[#F5F5F5] rounded-md w-full py-2 mb-5 mt-2 px-3'
            type="text"
            name="townCity"
            value={formData.townCity}
            onChange={handleInputChange}
            required
          />
          <br />
          <label className='text-gray-400' htmlFor="Phone">Phone Number</label>
          <br />
          <input
            className='bg-[#F5F5F5] rounded-md w-full py-2 mb-5 mt-2 px-3'
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
          <br />
          <label className='text-gray-400' htmlFor="Email">Email Address</label>
          <br />
          <input
            className='bg-[#F5F5F5] rounded-md w-full py-2 mb-5 mt-2 px-3'
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <br />
        </div>

        <div className='w-full max-w-md'>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h1 className="text-2xl font-bold mb-6">Order Summary</h1>
            {cartItems.map((item, index) => (
              <div key={index} className='mb-4 pb-4 border-b border-gray-200'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-4'>
                    <img
                      src={`${imageUrl}/${item.image}`}
                      alt={item.pName}
                      className='h-12 w-12 object-cover rounded'
                    />
                    <div>
                      <h2 className="font-medium">{item.pName || "Product"}</h2>
                      <p className="text-sm text-gray-500">
                        {item.quantity} × {item.days} days
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3>Rs {item.total?.toFixed(2) || "0.00"} </h3>
                  </div>
                </div>
              </div>
            ))}

            <div className='py-3 border-t border-gray-300 flex justify-between'>
              <span>Subtotal:</span>
              <span>Rs {calculateSubtotal().toFixed(2)}</span>
            </div>

            <div className='py-3 border-t border-gray-300 flex justify-between'>
              <span>Delivery Charge:</span>
              <span className="font-medium">Rs {(totalQuantity() * 200).toFixed(0)}</span>
            </div>

            <div className='py-3 border-t border-b border-gray-300 flex justify-between font-bold'>
              <span>Total:</span>
              <span>Rs {calculateTotal()} </span>
            </div>

            <div className='my-6'>
              <h3 className="font-medium mb-2">Payment Method</h3>
              <div className='flex flex-col gap-2'>
                <label className="flex items-center gap-2">
                  <input
                    className='w-4 h-4'
                    type="radio"
                    name="paymentMethod"
                    value="khalti"
                    checked={formData.paymentMethod === "khalti"}
                    onChange={handleInputChange}
                  />
                  Khalti Payment
                </label>
                <label className="flex items-center gap-2">
                  <input
                    className='w-4 h-4'
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === "COD"}
                    onChange={handleInputChange}
                  />
                  Cash on Delivery
                </label>
              </div>

              <div className='flex gap-2 mt-4'>
                <img className="h-6" src="https://encdn.ratopati.com/media/news/khalti_ELEhMcPi9q_8KQHgO7gag.png" alt="khalti" />
                <img className="h-6" src="https://static-00.iconduck.com/assets.00/cash-on-delivery-icon-1024x345-7sgjf338.png" alt="COD" />
              </div>
            </div>

            <button
              className='w-full mt-6 p-4 rounded-md border border-[#FFAD33] bg-[#FFAD33] text-white font-medium hover:bg-[#E09A2D] transition'
              onClick={handleSubmit}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RentNowMultiple;