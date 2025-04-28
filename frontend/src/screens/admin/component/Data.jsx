import React, { useState, useEffect } from 'react'
import { BsBoxSeam } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { MdWallet } from "react-icons/md";
import { admin_stats } from '../../../api/Api';
import { GrOrderedList } from 'react-icons/gr';

const Data = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalEarned: 0,
    totalSales: 0,
  });



  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(admin_stats, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setStats(data);
        console.log("this is response", data)
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, []);



  return (
    <div className='h-52 w-[95%] py-7 my-5 flex border rounded-xl'>
      <div className='w-[25%] pl-7 border-r'>
        <div className='h-16 w-16 flex justify-center text-xl items-center border bg-[#FFAD33] rounded-full'>
          <BsBoxSeam />
        </div>
        <h1 className=' text-gray-400 my-2'>Total Number of Product </h1>
        <h1 className='text-4xl'>{stats.totalProducts}</h1>
      </div>
      <div className='w-[25%] pl-7 border-r'>
        <div className='h-16 w-16 flex justify-center text-xl items-center border bg-[#FFC266] rounded-full'>
          <FaUsers />
        </div>
        <h1 className=' text-gray-400 my-2'> Total Number of Customers </h1>
        <h1 className='text-4xl'>{stats.totalCustomers}</h1>
      </div>
      <div className='w-[25%] pl-7 '>
        <div className='h-16 w-16 flex justify-center text-xl items-center border bg-[#ffe8c6] rounded-full'>
          <GrOrderedList />
        </div>
        <h1 className=' text-gray-400 my-2'> Total Orders </h1>
        <h1 className='text-4xl'>{stats.totalSales}</h1>
      </div>
      <div className='w-[25%] pl-7 border-r'>
        <div className='h-16 w-16 flex justify-center text-xl items-center border bg-[#FFD699] rounded-full'>
          <MdWallet />
        </div>
        <h1 className=' text-gray-400 my-2'> Total Earned </h1>
        <h1 className='text-4xl'>Rs {stats.totalEarned}</h1>
      </div>
      
    </div>
  );
}
export default Data