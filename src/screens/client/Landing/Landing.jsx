import React from "react";
import Header from "../components/Header";
import Carousel from "./components/Carousel";
import FilterButton from "./components/FilterButton";
import FlashSales from "./components/FlashSales";
import Footer from "../components/Footer";


const Landing = () => {



  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Header />
      <Carousel />
      <FilterButton />
      <FlashSales />
      <Footer/>
    </div>
  );
};

export default Landing;
