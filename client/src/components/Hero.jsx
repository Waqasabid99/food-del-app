import React from "react";

const Hero = () => {
  return (
    <>
      <div className="main w-full flex items-center relative h-[60vh] sm:h-[70vh] md:h-[75vh] lg:h-[85vh] py-6 transition-colors duration-300">
        {/* Background Image - Light Mode */}
        <div className="absolute inset-0 bg-[url('/header_img.png')] bg-cover bg-center bg-[#E17420] dark:opacity-0 opacity-100 transition-opacity duration-300"></div>
        
        {/* Background Overlay - Dark Mode */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 opacity-0 dark:opacity-100 transition-opacity duration-300"></div>
        
        {/* Optional: Dark mode pattern/texture overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 dark:opacity-30 transition-opacity duration-300"></div>

        {/*Left Section */}
        <div className="left relative z-10 flex flex-col justify-center gap-3 sm:gap-4 md:gap-6 px-4 sm:px-6 md:px-8 lg:px-5 h-full w-full sm:w-[80%] md:w-[70%] lg:w-[60%] xl:w-[49%]">
          {/* Hero Text */}
          <p className="text-white dark:text-gray-100 text-sm sm:text-base md:text-lg transition-colors duration-300">
            Welcome to FOODIE
          </p>
          <h1 className="text-white dark:text-gray-100 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight transition-colors duration-300">
            Order your favorite food from here and have it delivered to you
          </h1>
          <p className="text-white dark:text-gray-200 text-sm sm:text-base md:text-lg leading-relaxed transition-colors duration-300">
            Choose from a wide range of delicious dishes and have them delivered
            to your doorstep. Your satisfaction is our priority at Foodie. Our
            delivery service is fast and reliable, ensuring that you receive
            your food on time and in perfect condition.
          </p>
          {/* Buttons  */}
          <div className="buttons flex gap-3 mt-2 sm:mt-4">
            <button className="text-black dark:text-gray-800 bg-white dark:bg-gray-200 border-white dark:border-gray-200 border-[2px] px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-full text-sm sm:text-base md:text-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-300 transition-all duration-300 shadow-lg dark:shadow-gray-900">
              Shop now
            </button>
            {/* <button className="text-white border-[2px] px-4 py-1 rounded-full">About us</button> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;