import React, { useState, useEffect } from 'react';
import { FaStar } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { getAllProducts } from '../../../../api/Api';
import { FaShoppingCart } from "react-icons/fa";
import ProductCard from "../../components/ProductCard"


const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortByPrice, setSortByPrice] = useState('none'); // none, highToLow, lowToHigh

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // Apply filters whenever filter states or products change
    applyFilters();
  }, [selectedCategory, priceRange, inStockOnly, sortByPrice, products]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(getAllProducts, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setProducts(data.products);

      // Extract unique categories from products
      const uniqueCategories = [...new Set(data.products.map(product => product.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const applyFilters = () => {
    let result = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }

    // Filter by price range
    result = result.filter(
      product => product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Filter by stock
    if (inStockOnly) {
      result = result.filter(product => product.stock > 0);
    }

    // Sort by price
    if (sortByPrice === 'highToLow') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortByPrice === 'lowToHigh') {
      result.sort((a, b) => a.price - b.price);
    }

    setFilteredProducts(result);
  };

  const handlePriceMinChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setPriceRange(prev => ({ ...prev, min: value }));
  };

  const handlePriceMaxChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setPriceRange(prev => ({ ...prev, max: value }));
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setPriceRange({ min: 0, max: 10000 });
    setInStockOnly(false);
    setSortByPrice('none');
  };

  return (
    <div className="p-4 md:p-6">
      {/* <h1 className="font-bold text-3xl md:text-4xl text-center mt-4 mb-6">Products</h1> */}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filter Section - Left Side */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm sticky top-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Filters</h2>
              <button
                onClick={resetFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Reset All
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Categories</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>

            
            

            {/* Stock Filter */}
            <div className="mb-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={() => setInStockOnly(!inStockOnly)}
                  className="h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">In Stock Only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Products Grid - Right Side */}
        <div className="flex-1">
          <div className="mb-4 text-sm text-gray-600">
            {filteredProducts.length} products found
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 pr-10">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500">
                <p>No products found matching your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;