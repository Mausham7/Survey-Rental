import React, { useState, useEffect } from "react";
import { FaLaptop, FaCar, FaCamera, FaStar } from "react-icons/fa";
import { GiSofa } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { getCataProducts } from "../../../../api/Api";

const FilterButton = () => {
  const [selectedOption, setSelectedOption] = useState("Total Station");
  const [activeCategory, setActiveCategory] = useState("Total Station");
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Fetch products when component mounts and when category changes
  useEffect(() => {
    fetchProducts(activeCategory);
  }, [activeCategory]);

  const fetchProducts = async (category) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(getCataProducts, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category }),
      });
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleChange = (event) => {
    const newCategory = event.target.value;
    setSelectedOption(newCategory);
    setActiveCategory(newCategory);
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setSelectedOption(category);
  };

  const categories = [
    { name: "Total Station", icon: <GiSofa className="text-4xl" /> },
    { name: "Level Machine", icon: <FaLaptop className="text-4xl" /> },
    { name: "GNSS", icon: <FaCar className="text-4xl" /> },
    { name: "Drone", icon: <FaCamera className="text-4xl" /> },
  ];

  return (
    <>
      <div>
        <h1 className="font-bold text-4xl text-center mt-6 hidden md:block">
          Popular Categories
        </h1>

        {/* Category Buttons */}
        <div className="hidden md:flex items-center justify-center gap-16 mt-5 flex-wrap">
          {categories.map((category) => (
            <div key={category.name}>
              <div
                onClick={() => handleCategoryClick(category.name)}
                className={`cursor-pointer w-48 h-48 rounded-full flex flex-col justify-center items-center border transition-colors ${activeCategory === category.name
                    ? "bg-[#FFAD33] text-white"
                    : "bg-[#f3f4f6] text-[#FFAD33]"
                  }`}
              >
                <div
                  className={`text-4xl ${activeCategory === category.name ? "text-white" : "text-[#FFAD33]"
                    }`}
                >
                  {category.icon}
                </div>
              </div>
              <h2 className="text-xl text-center mt-4 font-semibold">
                {category.name}
              </h2>
            </div>
          ))}
        </div>

        {/* Dropdown Filter */}
        <div className="w-full h-12 showMenu:hidden mt-6 flex items-center justify-between px-4">
          <h2 className="text-2xl font-semibold">Category</h2>
          <select
            id="dropdown"
            name="options"
            value={selectedOption}
            onChange={handleChange}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none text-lg font-medium"
          >
            {categories.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product List */}
      <div className="p-10">
        <h1 className="font-bold text-4xl text-center mt-6 mb-6 hidden md:block">
          Products
        </h1>
        {products.length === 0 ? (
          <p className="text-center text-gray-500">No products available.</p>
        ) : (
          <div className="flex gap-10 w-full justify-center flex-wrap">
            {products.map((product) => (
              <div
                key={product._id}
                className="h-[22rem] w-64 shadow-md flex flex-col border border-gray-300 rounded-xl mb-8"
              >
                <img
                  src={`http://localhost:4000/${product.image}`}
                  alt={`${product.pName} image`}
                  className="rounded-t-xl h-[10rem] w-full object-cover"
                />
                <div className="w-full px-3 flex flex-col justify-evenly flex-1">
                  <h2 className="truncate font-semibold">{product.pName}</h2>
                  <p className="line-clamp-2 text-gray-600">{product.detail}</p>

                  {/* Star Ratings */}
                  <div className="flex mb-1 mt-1">
                    {[...Array(5)].map((_, index) => (
                      <FaStar
                        key={index}
                        className={index < product.rating ? "text-[#FFAD33]" : "text-gray-500"}
                      />
                    ))}
                  </div>

                  {/* Price & Rent Now Button */}
                  <div className="flex justify-between w-full items-center">
                    <h2 className="text-[#FFAD33] font-medium">Rs {product.price} /Day</h2>
                    <button
                      className="bg-[#FFAD33] px-2 py-1 text-white rounded-lg transition hover:bg-[#e6952f]"
                      onClick={() => navigate(`/product/${product._id}`)}
                    >
                      Rent Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default FilterButton;
