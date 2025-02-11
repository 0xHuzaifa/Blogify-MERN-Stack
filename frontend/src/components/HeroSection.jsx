import React from 'react';
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className=" bg-gradient-to-r from-[#6E8E59] to-[#CAE0BC] py-20">
      <div className="container mx-auto text-center">
        {/* Headline */}
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-[#EAFAEA] mb-4">
          Welcome to <span className='text-[#6E8E59]'>Blogify</span> 
        </h1>

        {/* Description */}
        <p className="text-md px-4 sm:text-lg md:text-xl  text-[#EAFAEA] mb-8">
          Discover amazing stories, share your thoughts, and connect with a community of passionate writers.
        </p>

        {/* Call-to-Action Button */}
        <button className="bg-[#6E8E59] text-white px-3 sm:px-5 md:px-8 py-2 sm:py-2 rounded-lg text-sm sm:text-base md:text-lg font-semibold hover:bg-[#780C28] transition duration-300">
          <Link to={"/blogs"}>Start Reading</Link>
        </button>
      </div>
    </div>
  );
};

export default HeroSection;