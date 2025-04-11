import React, { useState, useEffect, useRef } from "react";
import { CiSearch } from "react-icons/ci";
import { MdLogout, MdNotifications } from "react-icons/md";
import { IoMenu } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import { FaUser, FaShoppingCart, FaChevronDown, FaFirstOrder } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { getAllProducts } from "../../../api/Api";
import { GrOrderedList } from "react-icons/gr";
import { BsBucket } from "react-icons/bs";
import { Contact, ContactIcon } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const [isMenuClicked, setIsMenuClicked] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cartCount, setCartCount] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showBlur, setShowBlur] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef(null);


  useEffect(() => {
    fetchProducts();
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartCount(savedCart.length)

    // Add event listener to close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setShowBlur(!!searchTerm);
  }, [searchTerm]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(getAllProducts, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
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
        product.pName.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.detail.toLowerCase().includes(query)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  return (
    <>
      {showBlur && (
        <div
          className="fixed top-20 left-0 right-0 bottom-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => {
            setSearchTerm("");
            setFilteredProducts([]);
          }}
        />
      )}
      <nav className="w-full h-20 px-2 z-50 py-2 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/home")}>
          <img
            src="https://www.shutterstock.com/shutterstock/photos/2015198153/display_1500/stock-vector-symbol-for-a-surveyor-for-conducting-survey-cartographic-and-geodetic-works-2015198153.jpg"
            alt="logo"
            className="w-16 h-16 rounded-full object-cover"
          />
          <h2 className="text-xl text-[#FFAD33] font-semibold hidden md:block">Survey Rental</h2>
        </div>

        {/* Search */}
        <div className="relative w-full max-w-[40%]">
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

          {searchTerm && (
            <div className="absolute bg-white w-full mt-1 border z-50 border-gray-300 rounded shadow-lg max-h-96 overflow-auto">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center gap-4 p-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      navigate(`/product/${product._id}`);
                      setSearchTerm("");
                      setFilteredProducts([]);
                    }}
                  >
                    <img
                      src={`http://localhost:4000/${product.image}`}
                      alt={product.pName}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold text truncate">{product.pName}</span>
                      <span className="text-gray-500 text-xs line-clamp-2">{product.detail}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">No products found.</div>
              )}
            </div>
          )}
        </div>

        {/* Nav Links and Icons */}
        <div className="hidden md:flex items-center gap-6 mr-3">
          <NavLink to="/home" className={({ isActive }) => isActive ? "text-[#FFAD33] border-b-2 border-[#FFAD33]" : "hover:text-[#FFAD33]"}>Home</NavLink>
          <NavLink to="/products" className={({ isActive }) => isActive ? "text-[#FFAD33] border-b-2 border-[#FFAD33]" : "hover:text-[#FFAD33]"}>Products</NavLink>

          {/* Notification Icon */}
          <div className="relative cursor-pointer" onClick={() => navigate("/notification")}>
            <MdNotifications className="text-2xl hover:text-[#FFAD33]" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">2</span>
          </div>

          {/* Cart Icon */}
          <div className="relative cursor-pointer" onClick={() => navigate("/cart")}>
            <FaShoppingCart className="text-xl hover:text-[#FFAD33]" />
            {cartCount > 0 && (

              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">{cartCount}</span>
            )

            }
          </div>

          {/* Profile Menu */}
          <div className="relative" ref={profileDropdownRef}>
            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={toggleProfileDropdown}
            >
              <FaUser className="text-xl hover:text-[#FFAD33]" />
              <FaChevronDown className={`text-xs transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
            </div>

            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 py-1">
                <div
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                  onClick={() => {
                    navigate("/myprofile");
                    setShowProfileDropdown(false);
                  }}
                >
                  <FaUser className="text-gray-500" />
                  My Profile
                </div>
                <div
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                  onClick={() => {
                    navigate("/myorders");
                    setShowProfileDropdown(false);
                  }}
                >
                  <BsBucket className="text-gray-500" />

                  My Orders
                </div>
                <div
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                  onClick={() => {
                    navigate("/contact");
                    setShowProfileDropdown(false);
                  }}
                >
                  <ContactIcon className="text-gray-500" />

                  Contact
                </div>
                <div
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center gap-2 border-t"
                  onClick={() => {
                    navigate("/");
                    setShowProfileDropdown(false);
                  }}
                >
                  <MdLogout className="text-gray-500" />
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <IoMenu className="text-2xl cursor-pointer" onClick={() => setIsMenuClicked(true)} />
        </div>
      </nav>

      {/* Mobile Menu - Only visible on small screens */}
      {isMenuClicked && (
        <div className="fixed inset-0 bg-white z-50 p-4 md:hidden">
          <div className="flex justify-end">
            <RxCross1 className="text-2xl cursor-pointer" onClick={() => setIsMenuClicked(false)} />
          </div>
          <div className="flex flex-col gap-4 mt-8">
            <NavLink
              to="/home"
              className={({ isActive }) => isActive ? "text-[#FFAD33] font-semibold" : ""}
              onClick={() => setIsMenuClicked(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) => isActive ? "text-[#FFAD33] font-semibold" : ""}
              onClick={() => setIsMenuClicked(false)}
            >
              Products
            </NavLink>
            <NavLink
              to="/myorders"
              className={({ isActive }) => isActive ? "text-[#FFAD33] font-semibold" : ""}
              onClick={() => setIsMenuClicked(false)}
            >
              My Orders
            </NavLink>
            <NavLink
              to="/myprofile"
              className={({ isActive }) => isActive ? "text-[#FFAD33] font-semibold" : ""}
              onClick={() => setIsMenuClicked(false)}
            >
              My Profile
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => isActive ? "text-[#FFAD33] font-semibold" : ""}
              onClick={() => setIsMenuClicked(false)}
            >
              Contact
            </NavLink>
            <NavLink
              to="/cart"
              className={({ isActive }) => isActive ? "text-[#FFAD33] font-semibold" : ""}
              onClick={() => setIsMenuClicked(false)}
            >
              Cart
            </NavLink>
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => {
                navigate("/");
                setIsMenuClicked(false);
              }}
            >
              <MdLogout className="text-xl" />
              Logout
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;