import React from 'react'
import { BiSend } from "react-icons/bi";

const Footer = () => {
  return (
    <footer className="bg-[#FFAD33] text-white pt-10 w-full flex px-4 justify-between md:px-6 md:justify-evenly pb-9">
      <div className="flex flex-col items-start gap-5">
        <h2 className="text-2xl font-medium">Exclusive</h2>
        <h4 className="text-xl">Subscribe</h4>
        <h5>Get better deals everytime you rent</h5>
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            className="w-full px-4 py-2 pr-10 border text-white border-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-none bg-[#FFAD33] placeholder-white"
            placeholder="Search in site"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-white">
            <BiSend className="text-white text-xl" />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start gap-5">
        <h2 className="text-2xl font-medium">Support</h2>
        <h2>Kathmandu, Bagmati, 44600, Nepal.</h2>
        <h2>dhakalmausham41@gmail.com</h2>
        {/* <h2>xxxxx xxxxxx xxx xx xxx</h2> */}
      </div>

      {/* <div className="hidden showFooter:flex flex-col items-start gap-5 ">
        <h2 className="text-2xl font-medium">Login / Register</h2>
        <h2></h2>
      </div> */}

      <div className="hidden showFooter:flex flex-col items-start gap-5">
        <h1 className="text-2xl font-medium">Quick Link</h1>
        <h2>Home</h2>
        <h2>Products</h2>
        <h2>Contacts</h2>
      </div>

    </footer>
  )
}

export default Footer