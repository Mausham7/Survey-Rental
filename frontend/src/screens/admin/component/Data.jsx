import React from 'react'
import { BsBoxSeam } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { MdWallet } from "react-icons/md";

const Data = (data) => {
  return (
    <div className='h-52 w-[95%] py-7 my-5 flex border rounded-xl'>
      <div className='w-[25%] pl-7 border-r'>
        <div className='h-16 w-16 flex justify-center text-xl items-center border bg-[#FFAD33] rounded-full'>
          <BsBoxSeam />
        </div>
        <h1 className=' text-gray-400 my-2'>Total Number of Product </h1>
        <h1 className='text-4xl'>{data.data}</h1>
      </div>
      <div className='w-[25%] pl-7 border-r'>
        <div className='h-16 w-16 flex justify-center text-xl items-center border bg-[#FFC266] rounded-full'>
          <FaUsers />
        </div>
        <h1 className=' text-gray-400 my-2'> Total Number of Customers </h1>
        <h1 className='text-4xl'>250</h1>
      </div>
      <div className='w-[25%] pl-7 border-r'>
        <div className='h-16 w-16 flex justify-center text-xl items-center border bg-[#FFD699] rounded-full'>
          <IoCartOutline />
        </div>
        <h1 className=' text-gray-400 my-2'> Total Number of Orders </h1>
        <h1 className='text-4xl'>50</h1>
      </div>
      <div className='w-[25%] pl-7 '>
        <div className='h-16 w-16 flex justify-center text-xl items-center border bg-[#FFEBCC] rounded-full'>
          <MdWallet />
        </div>
        <h1 className=' text-gray-400 my-2'> Total Number of Sales </h1>
        <h1 className='text-4xl'>4k</h1>
      </div>
    </div>
  )
}

export default Data