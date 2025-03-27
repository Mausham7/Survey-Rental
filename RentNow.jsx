import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Form from './components/Form';


const RentNow = () => {
  const { id } = useParams();


  return (
    <div>
      <Header />
      <div className='flex justify-evenly'>
        <Form/>
        <div className='flex items-center'>
          <div>
            <div className='mb-10 w-96 flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <img src="https://cadsonline.com/wp-content/uploads/2022/12/5-Benefits-Of-Using-A-Drone-For-Land-Surveys-1-1920x1080px-1366x768.jpg" alt="pic" className='h-12 w-12' />
                <h2>Item No.1</h2>
              </div>
              <div>
                <h3>NPR400</h3>
              </div>
            </div>
            <div className='mb-3 mt-3'>
              <h2 className='pb-3 mb-3 mt-3 border-b border-gray-300'>Subtotal:</h2>
            </div>
            <h2 className='pb-3 mb-3 mt-3 border-b border-gray-300'>Delivery Charge:  </h2>
            <h2 className='mb-3 mt-3'>Total:</h2>
            <div className='flex mb-3 mt-3'>
              <div>
                <input className='m-3 ml-0 w-4 h-4' type="radio" name="payment" id="bank" />Bank
                <br />
                <input className='m-3 ml-0 w-4 h-4' type="radio" name="payment" id="cash" />Cash on Delivery
              </div>
              <div className='h-7  mb-3 mt-3 flex'>
                <img src="https://developer.esewa.com.np/assets/img/esewa_logo.png" alt="" />
                <img src="https://cdn4.iconfinder.com/data/icons/flat-brand-logo-2/512/visa-512.png" alt="" />
                <img src="https://static-00.iconduck.com/assets.00/mastercard-icon-2048x1225-3kb6axel.png" alt="" />
              </div>
            </div>
            <div className='flex justify-between'>
              <input className='p-3 rounded-md border border-black' type="text" placeholder='Coupon Code' />
              <button className='p-3 rounded-md border border-[#FFAD33] bg-[#FFAD33] text-white'>Apply Coupon</button>
            </div>
            <button className='mt-7 p-3 rounded-md border border-[#FFAD33] bg-[#FFAD33] text-white'>Place order</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RentNow;
