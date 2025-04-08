import React, { useState, useEffect } from 'react';
import { FaStar } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { getFlashSaleProducts, imageUrl } from '../../../../api/Api'


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
      <div className="flex gap-10 w-full justify-center flex-wrap ">
        {products.map((product) => (
          <div
            key={product._id}
            className="h-[22rem] w-64  shadow-md flex flex-col border-black rounded-xl mb-8"
          >
            <img
              src={`${imageUrl}/${product.image}`}
              alt={`${product.pName} image`}
              className="rounded-t-xl h-[10rem]"
            />
            <div className="w-full px-3 flex flex-col justify-evenly flex-1">
              <h2 className='truncate'>{product.pName}</h2>
              <h3 className="line-clamp-2">{product.detail}</h3>
              <div className="flex mb-1 mt-1">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={index < product.rating ? 'text-[#FFAD33]' : 'text-gray-500'}
                  />
                ))}
              </div>
              <div className="flex justify-between w-full">
                <h2 className='text-[#FFAD33] font-medium'>{product.price}</h2>
                <button className="bg-[#FFAD33] px-2 py-1 text-white rounded-lg" onClick={() => navigate(`/product/${product._id}`)}>
                  Rent Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>


    </div>
  )
}

export default FlashSales