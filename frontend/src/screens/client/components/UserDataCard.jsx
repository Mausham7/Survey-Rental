import { TicketCheck } from 'lucide-react';
import React from 'react'
import { BsBoxSeam } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { FcCancel } from 'react-icons/fc';
import { IoCartOutline } from "react-icons/io5";
import { MdPending, MdWallet } from "react-icons/md";

const UserData = (data) => {
  return (
    <div className='h-52 w-[95%] py-7 my-5 flex border rounded-xl'>
      <div className='w-[25%] pl-7 border-r'>
        <div className='h-16 w-16 flex justify-center text-xl items-center border bg-[#FFAD33] rounded-full'>
          <BsBoxSeam />
        </div>
        <h1 className=' text-gray-400 my-2'>Total Orders </h1>
        <h1 className='text-4xl'>{data.data}</h1>
      </div>
      <div className='w-[25%] pl-7 border-r'>
        <div className='h-16 w-16 flex justify-center text-xl items-center border bg-[#FFC266] rounded-full'>
          <MdPending />
        </div>
        <h1 className=' text-gray-400 my-2'> Pending Orders </h1>
        <h1 className='text-4xl'>0</h1>
      </div>
      <div className='w-[25%] pl-7 border-r'>
        <div className='h-16 w-16 flex justify-center text-xl items-center border bg-[#FFD699] rounded-full'>
          <TicketCheck />
        </div>
        <h1 className=' text-gray-400 my-2'> Completed Orders </h1>
        <h1 className='text-4xl'>0</h1>
      </div>
      <div className='w-[25%] pl-7 '>
        <div className='h-16 w-16 flex justify-center text-xl items-center border bg-[#FFEBCC] rounded-full'>
          <FcCancel />
        </div>
        <h1 className=' text-gray-400 my-2'> Cancelled Orders </h1>
        <h1 className='text-4xl'>0</h1>
      </div>
    </div>
  )
}

export default UserData