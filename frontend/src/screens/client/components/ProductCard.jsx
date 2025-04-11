import React from 'react';
import { FaStar } from "react-icons/fa6";
import { FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleAddToCart = () => {
    const cartItem = {
      productId: product._id,
      quantity: 1,
      days: 1,
      total: product.price,
      pName: product.pName,
      detail: product.detail,
      deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      image: product.image
    };

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => item.productId === product._id);

    if (existingItemIndex !== -1) {
      // Update quantity and total if item exists
      cart[existingItemIndex].quantity += 1;
      cart[existingItemIndex].total += product.price;
    } else {
      // Add new item if not found
      cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    alert("Item added to cart!");
  };


  return (
    <div
      key={product._id}
      className="h-[25rem] shadow-md flex flex-col border border-gray-200 rounded-xl mb-2 transition-all hover:shadow-lg"
    >
      <img
        src={`http://localhost:4000/${product.image}`}
        alt={`${product.pName} image`}
        className="rounded-t-xl h-[10rem] w-full object-cover"
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
          <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
            {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
          </span>
        </div>
        <div className="flex justify-between w-full items-center">
          <h2 className="text-[#FFAD33] font-semibold">Rs {product.price} /Day</h2>
          <div className="flex space-x-2">
            <button
              className="bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg flex items-center justify-center transition-all duration-300 border border-gray-200 group disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={product.stock <= 0}
              onClick={handleAddToCart}
            >
              <FaShoppingCart className="text-[#FFAD33] group-hover:scale-110 transition-transform" />
            </button>
            <button
              className="bg-[#FFAD33] px-3 py-1.5 text-white rounded-lg hover:bg-amber-500 transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none"
              onClick={() => navigate(`/product/${product._id}`)}
              disabled={product.stock <= 0}
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
