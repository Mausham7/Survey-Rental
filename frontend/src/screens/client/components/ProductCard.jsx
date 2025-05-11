import React, { useState } from 'react';
import { FaStar } from "react-icons/fa6";
import { FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'
import { add_to_cart, imageUrl } from '../../../api/Api';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const isAvailable = product.stock > 0 && product.inStock;

  const handleAddToCart = async (e) => {
    // Stop event propagation to prevent navigation when clicking the cart button
    e.stopPropagation();
    
    try {
      setIsLoading(true);

      const response = await fetch(add_to_cart, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
          days: 1,
          deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Item added to cart!");
      } else {
        throw new Error(data.message || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRentNowClick = (e) => {
    // Stop event propagation to prevent double navigation
    e.stopPropagation();
    navigate(`/product/${product._id}`);
  };

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div
      key={product._id}
      className="h-[25rem] shadow-md flex flex-col border border-gray-200  rounded-xl mb-2 transition-all hover:shadow-lg cursor-pointer"
      onClick={handleCardClick}
    >
      <img
        src={`${imageUrl}/${product.image}`}
        alt={`${product.pName} image`}
        className="rounded-t-xl h-[10rem] w-full object-scale-down"
      />
      <div className="w-full px-3 flex flex-col justify-evenly flex-1">
        <h2 className="font-medium text-lg truncate">{product.pName}</h2>
        <h3 className="text-gray-600 text-sm line-clamp-2">{product.detail}</h3>
        <div className="flex mb-1 mt-1">
          {[...Array(5)].map((_, index) => (
            <FaStar
              key={index}
              className={index < product.rating ? 'text-[#FFAD33]' : 'text-gray-300'}
            />
          ))}
        </div>
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <span className={isAvailable ? 'text-grey-600' : 'text-red-600'}>
            {isAvailable
              ? `In Stock (${product.stock})`
              : 'Out of Stock'}
          </span>
        </div>
        <div className="flex justify-between w-full items-center" onClick={(e) => e.stopPropagation()}>
          <h2 className="text-[#FFAD33] text-sm font-semibold">Rs {product.price} /Day</h2>
          <div className="flex space-x-2">
            <button
              className="bg-purple-100 hover:bg-gray-200  px-3 py-1.5 rounded-lg flex items-center justify-center transition-all duration-300 border border-gray-200 group disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!isAvailable || isLoading}
              onClick={handleAddToCart}
            >
              <FaShoppingCart className="text-[#FFAD33] group-hover:scale-110 transition-transform" />
            </button>
            <button
              className="bg-[#FFAD33] px-3 py-1.5 text-white rounded-lg hover:bg-amber-500 transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none"
              onClick={handleRentNowClick}
              disabled={!isAvailable}
            >
              Rent Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;