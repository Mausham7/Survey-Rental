import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

const Carousel = () => {
  return (
    <div>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="h-full"
      >
        <SwiperSlide>
          <img
            src="https://media.gettyimages.com/id/533548487/photo/drone-with-camera.jpg?s=612x612&w=0&k=20&c=vZ7UcrTJhDX2j0JwbMF7bjOJXMJ6sXpXpyCPZ7MkoHE="
            alt="Slide 1"
            className="w-full h-full object-cover"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="https://media.gettyimages.com/id/1216397759/photo/drone-flying-low-above-plants-in-a-field.jpg?s=612x612&w=0&k=20&c=iXoW23md8dm0w0TOudokpiCdYbheycCam-_AEm3mx0o="
            alt="Slide 2"
            className="w-full h-full object-cover"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="https://media.gettyimages.com/id/497884595/photo/drone-at-sunset.jpg?s=612x612&w=0&k=20&c=a4y6L0KYP867C-bI5ext01ySAgahTrMS4gBNxfZ1ehc="
            alt="Slide 3"
            className="w-full h-full object-cover"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="https://media.gettyimages.com/id/1354157484/photo/close-up-of-drone-with-camera.jpg?s=612x612&w=0&k=20&c=WBexN6-XeZnH8uk_dexqYkLwKVBYkkXAXCMBOvWPpoI="
            alt="Slide 4"
            className="w-full h-full object-cover"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  )
}

export default Carousel