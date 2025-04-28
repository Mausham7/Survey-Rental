import React from 'react'
import { BiSend } from "react-icons/bi";
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#FFAD33] text-white pt-10 w-full flex px-4 justify-between md:px-6 md:justify-evenly pb-9">
      <div className="flex flex-col items-start gap-5">
        <h2 className="text-2xl font-medium">Exclusive</h2>
        <h5>Get better deals everytime you rent</h5>

      </div>

      <div className="flex flex-col items-start gap-5">
        <h2 className="text-2xl font-medium">Support</h2>
        <h2>Kathmandu, Bagmati, 44600, Nepal.</h2>
        <h2>dhakalmausham41@gmail.com</h2>
      </div>

      <div className="hidden showFooter:flex flex-col items-start gap-5">
        <h1 className="text-2xl font-medium">Quick Link</h1>
        <Link to="/home" className="hover:underline">Home</Link>
        <Link to="/products" className="hover:underline">Products</Link>
        <Link to="/contact" className="hover:underline">Contacts</Link>
      </div>

    </footer>
  )
}

export default Footer