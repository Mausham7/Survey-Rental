import React from 'react'
import { CiSearch } from "react-icons/ci";
import { BiSolidUserCircle } from "react-icons/bi";

const Upperbar = () => {
  return (
    <>
       <div className='h-12 w-[95%] m-5 justify-between flex items-center border border-gray-300 rounded-3xl'>
        <div className="relative max-w-sm flex flex-row ">
          <input
            type="text"
            className="w-52 h-8 pl-8 ml-3 bg-gray-200 rounded-3xl focus:outline-none"
            placeholder="Search"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
            <CiSearch className="text-gray-700 " />
          </div>
        </div>
        <div className='flex pr-16 items-center'>
          <h2 className='text-3xl font-thin'>|</h2>
          <h2 className='px-1 items-center text-4xl' ><BiSolidUserCircle /> </h2>
          <div className='text-xs'>
            <h2 className='font-medium'>Mike Tyson </h2>
            <h2 className='text-gray-300'>Admin</h2>  
          </div>
        </div>
      </div>
    </>
  )
}

export default Upperbar