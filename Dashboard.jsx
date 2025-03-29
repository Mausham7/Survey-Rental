import React, { useState, useEffect } from 'react';
import Menu from './component/Menu'
import Upperbar from './component/Upperbar';
import Data from './component/Data';
import { MdSort } from "react-icons/md";
import { add_product, getAllProducts, updateInFlashSale, updateInStock } from '../../api/Api';



const Dashboard = () => {

  const [showPopup, setShowPopup] = useState(false);
  const [products, setProducts] = useState([]);
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    pName: '',
    category: '',
    price: 0,
    stock: true,
    image: null,
    detail: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const openDetailPopup = (product) => {
    setSelectedProduct(product);
    setShowDetailPopup(true);
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(getAllProducts, {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formDataToSend = new FormData();
    formDataToSend.append('pName', formData.pName);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('stock', formData.stock);
    formDataToSend.append('detail', formData.detail);
    formDataToSend.append('image', formData.image);

    try {
      const response = await fetch(add_product, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        alert('Product added successfully!');
        setShowPopup(false);
        setFormData(
          {
            pName: '',
            category: '',
            price: 0,
            stock: true,
            image: null,
            detail: '',
          }
        )
        fetchProducts();
      } else {
        alert('Error adding product');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleProductStatus = async (productId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(updateInStock, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          productId,
          inStock: !currentStatus
        })
      });

      if (response.ok) {
        fetchProducts();
      } else {
        console.error('Failed to update stock status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };
  const toggleProductFlashSale = async (productId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(updateInFlashSale, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          productId,
          inFlashSale: !currentStatus
        })
      });

      if (response.ok) {
        fetchProducts();
      } else {
        console.error('Failed to update flashSale status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className='flex'>
      <Menu />
      <div className='w-full flex-col justify-items-center  '>
        <Upperbar />
        <Data data={products.length} />
        <div className='h-auto w-[95%] border rounded-lg'>
          <div className='p-3 flex justify-between'>
            <h2 className='text-lg font-medium  '>Product Lists</h2>
            <div className='flex items-center'>
              <MdSort className='text-2xl' />
              <button className='h-5 flex p-4 mx-3 rounded-lg items-center bg-[#FFAD333B]'>See All</button>
              <button onClick={() => setShowPopup(true)} className='h-5 flex p-4 rounded-lg items-center bg-[#FFC266]'>+ Add Product</button>
            </div>
          </div>
          <div className=''>
            <div className='p-3 flex flex-row font-medium border-b border-b-gray-200'>
              <h1 className='w-[35%]'>Product Name</h1>
              <h1 className='w-[15%]'>Category</h1>
              <h1 className='w-[10%]'>Price/Day</h1>
              <h1 className='w-[15%]'>Stock</h1>
              <h1 className='w-[20%]'>Flash Sale</h1>
            </div>
            <div>
              {products && products.length > 0 && products.map((details, index) => (
                <div key={index} className='p-5 flex border-b border-b-gray-200'>
                  <h2 className='w-[35%]'>{details.pName || 'N/A'}</h2>
                  <h2 className='w-[15%]'>{details.category || 'N/A'}</h2>
                  <h2 className='w-[10%] font-medium'>{details.price || 'N/A'}</h2>
                  {/* <h2 className='w-[10%]'>{details.inStock ? "In Stock" : "Out Of Stock" || 'N/A'}</h2> */}
                  <div className='w-[15%] gap-5 flex'>
                    <div className=' flex items-center gap-2'>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={details.inStock}
                          onChange={() => toggleProductStatus(details._id, details.inStock)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FFAD33]"></div>
                      </label>
                      <span className={`text-sm ${details.inStock ? 'text-green-600' : 'text-red-600'}`}>
                        {details.inStock ? "In Stock" : "Out Of Stock"}
                      </span>
                    </div>
                  </div>
                  <div className='w-[20%]'>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={details.inFlashSale}
                        onChange={() => toggleProductFlashSale(details._id, details.inFlashSale)}
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FFAD33]"></div>
                    </label>
                  </div>
                  <button onClick={() => openDetailPopup(details)} className='text-[#FFAD33]'>Details</button>


                </div>
              ))}
              {showDetailPopup && selectedProduct && (
                <div className='fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50'>
                  <div className='bg-white p-10 rounded-lg shadow-lg w-[50%]'>
                    <h2 className='text-lg font-medium mb-4'>Product Details</h2>
                    <img src={`http://localhost:3000/${selectedProduct.image}`} alt='Product' className='w-full max-h-[50vh] object-contain rounded-lg' />
                    <h3 className='text-xl font-bold mt-4'>{selectedProduct.pName}</h3>
                    <p className='text-gray-700'><strong>Category:</strong> {selectedProduct.category}</p>
                    <p className='text-gray-700'><strong>Price:</strong> NPR{selectedProduct.price}</p>
                    <p className='text-gray-700'><strong>Status:</strong> {selectedProduct.inStock ? "In Stock" : "Out Of Stock"}</p>
                    <p className='text-gray-700'><strong>Details:</strong> {selectedProduct.detail}</p>
                    <button onClick={() => setShowDetailPopup(false)} className='mt-4 p-3 bg-gray-500 text-white rounded-lg'>Close</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showPopup && (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50'>
          <div className='bg-white p-10 rounded-lg shadow-lg w-[60%]'>
            <h2 className='text-lg font-medium mb-4'>Add Product</h2>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <input type='text' name='pName' placeholder='Product Name' value={formData.pName} onChange={handleInputChange} required className='block w-full p-3 border rounded-lg' />
              {/* Category Dropdown */}
              <select
                name='category'
                value={formData.category}
                onChange={handleInputChange}
                required
                className='block w-full p-3 border rounded-lg'
              >
                <option value='' disabled>Select Category</option>
                <option value='Total Stations'>Total Stations</option>
                <option value='Hand GPS'>Hand GPS</option>
                <option value='GNSS'>GNSS</option>
                <option value='Level Machine'>Level Machine</option>
                <option value='Theodolites'>Theodolites</option>
                <option value='Prisms'>Prisms</option>
                <option value=' Survey Drones'>Survey Drones</option>
                <option value='Prism Stand'>Prism Stand</option>
                <option value='Prism Poles'>Prism Poles</option>
                <option value='Survey Staff'>Survey Staff</option>
              </select>
              <textarea name='detail' placeholder='Detail' value={formData.detail} onChange={handleInputChange} required className='block w-full p-3 border rounded-lg h-32' />
              <input type='text' name='price' placeholder='Price' value={formData.price} onChange={handleInputChange} required className='block w-full p-3 border rounded-lg' />
              {/* Stock Dropdown */}
              <select
                name='stock'
                value={formData.stock}
                onChange={handleInputChange}
                required
                className='block w-full p-3 border rounded-lg'
              >
                <option value='' disabled>Select Stock Status</option>
                <option value='true'>In Stock</option>
                <option value='false'>Out of Stock</option>
              </select>
              <input type='file' onChange={handleImageChange} required className='block w-full p-3 border rounded-lg' />
              {formData.image && <img src={URL.createObjectURL(formData.image)} alt='Preview' className='mt-2 h-16 w-auto rounded' />}
              <button type='submit' className='bg-[#FFAD33] text-white p-3 rounded-lg'>Submit</button>
              <button type='button' onClick={() => setShowPopup(false)} className='ml-2 p-3 bg-gray-500 text-white rounded-lg'>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard