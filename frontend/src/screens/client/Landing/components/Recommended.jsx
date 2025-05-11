import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecommendedProducts, imageUrl } from '../../../../api/Api'
import ProductCard from '../../components/ProductCard';


const Recommended = () => {
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
      const response = await fetch(getRecommendedProducts, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(data);
      setProducts(data.products || []); // ✅ fallback to empty array
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]); // ✅ prevent undefined if error occurs
    }
  };


  return (
    <div className="p-10">
      <h1 className="font-bold text-4xl text-center mt-6 mb-6 hidden md:block">Recommended Products</h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">No recommended products available.</p>
      ) : (
        <>
          {products.length < 4 && (
            <p className="text-center text-yellow-600 mb-4">
              Only {products.length} recommended product{products.length > 1 ? 's' : ''} available.
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-28">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );

}

export default Recommended