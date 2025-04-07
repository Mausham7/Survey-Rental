import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { MdLogout } from "react-icons/md";
import { IoMenu } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { getAllProducts } from "../../../api/Api";

const Header = () => {
  const navigate = useNavigate();
  const [isMenuClicked, setIsMenuClicked] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(getAllProducts, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(data)
      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchTerm(query);
    if (query) {
      const filtered = products.filter((product) =>
        product.pName.toLowerCase().includes(query)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  };

  return (
    <nav className="w-full h-20 px-2 py-2 flex justify-between items-center ">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/home")}>
        <img
          src="https://www.shutterstock.com/shutterstock/photos/2015198153/display_1500/stock-vector-symbol-for-a-surveyor-for-conducting-survey-cartographic-and-geodetic-works-2015198153.jpg"
          alt="logo"
          className="w-16 h-16 rounded-full object-cover"
        />
        <h2 className="text-xl text-[#FFAD33] font-semibold hidden md:block">Survey Rental</h2>
      </div>

      <div className="relative w-full max-w-sm">
        <input
          type="text"
          className="w-full px-4 py-2 pr-10 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFAD33]"
          placeholder="Search in site"
          value={searchTerm}
          onChange={handleSearch}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <CiSearch className="text-gray-700" />
        </div>
        {filteredProducts.length > 0 && (
          <div className="absolute bg-white w-full mt-1 border z-50 border-gray-300 rounded shadow-md">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <img src={`http://localhost:4000/${product.image}`} alt={product.pName} className="w-10 h-10 object-cover" />
                <span>{product.pName}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="hidden md:flex items-center gap-8 mr-3">
        <NavLink to="/home" className={({ isActive }) => isActive ? "text-[#FFAD33] border-b-2 border-[#FFAD33]" : "hover:cursor-pointer"}>Home</NavLink>
        <NavLink to="/products" className={({ isActive }) => isActive ? "text-[#FFAD33] border-b-2 border-[#FFAD33]" : "hover:cursor-pointer"}>Products</NavLink>
        <NavLink to="/myorders" className={({ isActive }) => isActive ? "text-[#FFAD33] border-b-2 border-[#FFAD33]" : "hover:cursor-pointer"}>My Orders</NavLink>
        <NavLink to="/contact" className={({ isActive }) => isActive ? "text-[#FFAD33] border-b-2 border-[#FFAD33]" : "hover:cursor-pointer"}>Contact</NavLink>
        <MdLogout className="text-2xl cursor-pointer" onClick={() => navigate("/")} />
      </div>
    </nav>
  );
};

export default Header;