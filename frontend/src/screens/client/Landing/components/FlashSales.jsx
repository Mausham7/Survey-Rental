import React, { useState, useEffect } from 'react';
import { FaStar } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { getFlashSaleProducts, imageUrl } from '../../../../api/Api'
import { FaShoppingCart } from 'react-icons/fa';
import ProductCard from '../../components/ProductCard';


const FlashSales = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const handleProducts = () => {
    navigate("/products")
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      //getFlashSaleProducts = http://localhost:3000/api/v1/user/flashsale
      const response = await fetch(getFlashSaleProducts, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(data)
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <div className="p-10">
      <h1 className="font-bold text-4xl text-center mt-6 mb-6 hidden md:block">Flash Sales</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-28 ">
        {products.slice(0, 5).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      <div className="flex justify-center">
        <button className="bg-[#FFAD33] px-2 py-1 text-white rounded-lg mt-6" onClick={handleProducts}>
          Show More
        </button>
      </div>

    </div>
  )
}

export default FlashSales