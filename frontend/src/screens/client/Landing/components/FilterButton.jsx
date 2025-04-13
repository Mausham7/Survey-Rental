import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getCataProducts } from "../../../../api/Api";
import ProductCard from "../../components/ProductCard";

const FilterButton = () => {
  const [selectedOption, setSelectedOption] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const navigate = useNavigate();

  // Fetch all products once on mount
  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(getCataProducts, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}), // No category
      });
      const data = await response.json();
      const all = data.products || [];

      setAllProducts(all);
      setProducts(all);

      const categoryCount = {};
      all.forEach((product) => {
        const cat = product.category;
        if (cat) {
          categoryCount[cat] = (categoryCount[cat] || 0) + 1;
        }
      });

      const top = Object.entries(categoryCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([name]) => name);

      setTopCategories(top);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setSelectedOption(category);

    if (category === "All") {
      setProducts(allProducts);
    } else {
      const filtered = allProducts.filter(p => p.category === category);
      setProducts(filtered);
    }
  };

  return (
    <>
      <div>
        <h1 className="font-bold text-4xl text-center mt-6 hidden md:block">
          Popular Categories
        </h1>

        {/* Category Buttons */}
        <div className="hidden md:flex items-center justify-center gap-10 mt-5 flex-wrap">
          {["All", ...topCategories].map((category) => (
            <div key={category}>
              <div
                onClick={() => handleCategoryClick(category)}
                className={`cursor-pointer w-44 h-44 rounded-full flex flex-col justify-center items-center border transition-colors ${activeCategory === category
                  ? "bg-[#FFAD33] text-white"
                  : "bg-[#f3f4f6] text-[#FFAD33]"
                  }`}
              >
                <h2 className={`text-xl font-semibold`}>
                  {category}
                </h2>
              </div>
            </div>
          ))}
        </div>

        {/* Dropdown Filter for Mobile */}
        <div className="w-full h-12 showMenu:hidden mt-6 flex items-center justify-between px-4">
          <h2 className="text-2xl font-semibold">Category</h2>
          <select
            id="dropdown"
            name="options"
            value={selectedOption}
            onChange={(e) => handleCategoryClick(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none text-lg font-medium"
          >
            {["All", ...topCategories].map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product List */}
      <div className="p-10">

        {products.length === 0 ? (
          <p className="text-center text-gray-500">No products available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-28">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default FilterButton;
