import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { create_order, get_all_orders, getProductById, imageUrl } from '../../../api/Api';

const RentNow = () => {
  const { id } = useParams();
  const location = useLocation();
  const { quantity, duration, dayCount, deliveryDate } = location.state || {};
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(0);

  const [formData, setFormData] = useState({
    productId: '',
    paymentMethod: 'COD',
    fullName: '',
    deliveryDate: '',
    citizenID: '',
    streetAddress: '',
    coordinates: '',
    townCity: '',
    phone: '+977 9800000000',
    email: '',
    quantity: 1,
    days: 1,
    total: 0,
    pName: '',
    detail: '',
    image: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formDataToSend = new FormData();
    formDataToSend.append('productId', product._id);
    formDataToSend.append('paymentMethod', formData.paymentMethod);
    formDataToSend.append('fullName', formData.fullName);
    formDataToSend.append('deliveryDate', deliveryDate);
    formDataToSend.append('citizenID', formData.citizenID);
    formDataToSend.append('streetAddress', formData.streetAddress);
    formDataToSend.append('coordinates', formData.coordinates);
    formDataToSend.append('townCity', formData.townCity);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('quantity', quantity);
    formDataToSend.append('days', days);
    formDataToSend.append('total', total);
    formDataToSend.append('pName', product.pName);
    formDataToSend.append('detail', product.detail);
    formDataToSend.append('image', formData.image);

    try {
      const response = await fetch(create_order, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        alert('order created successfully!');
        setFormData(
          {
            productId: '',
            paymentMethod: 'COD',
            fullName: '',
            deliveryDate: '',
            citizenID: '',
            streetAddress: '',
            coordinates: '',
            townCity: '',
            phone: '+977 9800000000',
            email: '',
            quantity: 1,
            days: 1,
            total: 0,
            pName: '',
            detail: '',
            image: null,
          }
        )
      } else {
        alert('Error creating order');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  


  // Fetch product details when component mounts
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        // setLoading(true);
        const token = localStorage.getItem("token");

        console.log("this is id: ", id)
        const response = await fetch(getProductById, {
          method: "POST",
          body: JSON.stringify({ productId: id }),
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch product details');
        }
        const data = await response.json();
        console.log(data)

        setProduct(data.product);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        // setLoading(false);
      }
    };

    const fetchall = async () => {
      try {
        // setLoading(true);
        const token = localStorage.getItem("token");

        console.log("this is id: ", id)
        const response = await fetch(get_all_orders, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch product details');
        }
        const data = await response.json();
        console.log(data)



      } catch (err) {

        // setLoading(false);
      }
    };

    fetchProductDetails();
    fetchall();
    if (duration == "days") {

      setDays(dayCount)
    } else {
      setDays(28 * dayCount)
    }
  }, [id]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Calculate order totals
  const subtotal = product?.price * quantity * days;
  const deliveryCharge = 200; // Example delivery charge
  const total = subtotal + deliveryCharge;

  if (loading) return <div>Loading product details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div>
      <Header />
      <div className='flex justify-evenly flex-wrap px-4'>
        <div className="w-full max-w-lg mb-8">
          <h1 className="text-2xl font-bold mb-6">Customer Information</h1>
          <label className='text-gray-400' htmlFor="FirstName">fullName</label>
          <br />
          <input
            className='bg-[#F5F5F5] rounded-md w-full py-2 mb-5 mt-2 px-3'
            type="text"
            name="fullName"
            value={formData.fullName} onChange={handleInputChange}
          />
          <br />
          <label className='text-gray-400' htmlFor="CitizenID">Citizen ID</label>
          <br />
          <input
            className='bg-[#F5F5F5] rounded-md w-full py-2 mb-5 mt-2 px-3'
            type="text"
            name="citizenID"
            value={formData.citizenID} onChange={handleInputChange}
          />
          <br />
          <label className='text-gray-400' htmlFor="CitizenID">Citizen Photo</label>
          <br />
          <input type='file' onChange={handleImageChange} required className='block w-full p-3 border rounded-lg' />
          {formData.image && <img src={URL.createObjectURL(formData.image)} alt='Preview' className='mt-2 h-16 w-auto rounded' />}
          <br />
          <label className='text-gray-400' htmlFor="Street Address">Street Address</label>
          <br />
          <input
            className='bg-[#F5F5F5] rounded-md w-full py-2 mb-5 mt-2 px-3'
            type="text"
            name="streetAddress"
            value={formData.streetAddress}
            onChange={handleInputChange}
          />
          <br />
          <label className='text-gray-400' htmlFor="Apartment, floor">coordinates (optional)</label>
          <br />
          <input
            className='bg-[#F5F5F5] rounded-md w-full py-2 mb-5 mt-2 px-3'
            type="text"
            name="coordinates"
            value={formData.coordinates}
            onChange={handleInputChange}
          />
          <br />
          <label className='text-gray-400' htmlFor="Town/City">Town/City</label>
          <br />
          <input
            className='bg-[#F5F5F5] rounded-md w-full py-2 mb-5 mt-2 px-3'
            type="text"
            name="townCity"
            value={formData.townCity}
            onChange={handleInputChange}
          />
          <br />
          <label className='text-gray-400' htmlFor="PhoneNumber">Phone Number</label>
          <br />
          <input
            className='bg-[#F5F5F5] rounded-md w-full py-2 mb-5 mt-2 px-3'
            type="number"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
          <br />
          <label className='text-gray-400' htmlFor="EmailAddress">Email Address</label>
          <br />
          <input
            className='bg-[#F5F5F5] rounded-md w-full py-2 mb-5 mt-2 px-3'
            type="text"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <br />
        </div>

        <div className='w-full max-w-md'>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h1 className="text-2xl font-bold mb-6">Order Summary</h1>
            <div className='mb-6 flex items-center justify-between'>
              <div className='flex items-center gap-4'>
                <img
                  src={`${imageUrl}/${product.image}`}
                  alt={product.pName}
                  className='h-12 w-12 object-cover rounded'
                />
                <h2>{product.pName || "Product Name"}</h2>
              </div>
              <div>
                <h3>Rs {product.price?.toFixed(2) || "0.00"}</h3>
              </div>
            </div>

            <div className='py-3 border-t border-gray-300 flex justify-between'>
              <span>Quantity:</span>
              <span>{quantity}</span>
            </div>
            <div className='py-3 border-t border-gray-300 flex justify-between'>
              <span>Duration:</span>
              <span>{days} days</span>
            </div>
            <div className='py-3 border-t border-gray-300 flex justify-between'>
              <span>Subtotal:</span>
              <span>Rs {subtotal.toFixed(2)}</span>
            </div>

            <div className='py-3 border-t border-gray-300 flex justify-between'>
              <span>Delivery Charge:</span>
              <span>Rs {deliveryCharge.toFixed(2)}</span>
            </div>

            <div className='py-3 border-t border-b border-gray-300 flex justify-between font-bold'>
              <span>Total:</span>
              <span>Rs {total.toFixed(2)}</span>
            </div>

            <div className='my-6'>
              <h3 className="font-medium mb-2">Payment Method</h3>
              <div className='flex flex-col gap-2'>
                <label className="flex items-center gap-2">
                  <input
                    className='w-4 h-4'
                    type="radio"
                    name="payment"
                    id="bank"
                    checked={formData.paymentMethod === "khalti"}
                    onChange={handleInputChange}
                  />
                  Khalti Payment
                </label>
                <label className="flex items-center gap-2">
                  <input
                    className='w-4 h-4'
                    type="radio"
                    name="payment"
                    id="cash"
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
              onClick={(e) => handleSubmit(e)}
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

export default RentNow;