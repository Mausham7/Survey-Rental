
import Header from '../components/Header'
import Footer from '../components/Footer'
import Details from './component/details'
import FlashSales from '../Landing/components/FlashSales'

const ProductDetails = () => {
  return (
    <div>
      <Header />
      <Details />
      {/* <div className='ml-[6.5rem] mt-40 flex gap-2 items-center'>
        <div className='w-5 h-8 ml bg-[#FFAD33] rounded-[0.3rem]'></div>
        <h2 className='text-[#FFAD33] font-semibold'>Related item</h2>
      </div>
      <FlashSales/> */}
      <div className='h-36'></div>
      <Footer />
    </div>
  )
}

export default ProductDetails