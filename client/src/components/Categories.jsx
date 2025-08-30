import { React, useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
// import { menu_list } from "../data/store";
import Products from "./Products";
import axios from "axios";

const Categories = () => {
  const [active, setActive] = useState({ index: null, category: null });
  const [menu_list, setMenuList] = useState([]);
  const scrollRef = useRef(null);
  const base_url = import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    axios.get(`${base_url}/api/menu/getmenu`, { withCredentials: true }).then((res) => {
      setMenuList(res.data.data);
      console.log(res.data.data)
    })
  }, [setMenuList])

  const getActive = (index, name) => {
    if (active.index === index) {
      setActive({ index: null, category: null });
    } else {
      setActive({ index: index, category: name });
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <div className="menu w-full py-5 flex flex-col items-start px-4 sm:px-6 md:px-8 lg:px-10 bg-white dark:bg-gray-900 transition-colors duration-300">
        {/* Headings */}
        <div className="headings w-full sm:w-[80%] md:w-[70%] lg:w-[60%]">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-black dark:text-gray-100 transition-colors duration-300">
            Explore our Menu
          </h1>
          <p className="text-gray-800 dark:text-gray-300 text-sm sm:text-base md:text-[15px] pt-2 leading-relaxed transition-colors duration-300">
            Choose from a wide range of delicious dishes and have them delivered
            to your doorstep. Our mission is to provide you with a satisfying
            and enjoyable dining experience.
          </p>
        </div>

        {/* Categories */}
        <div className="category py-3 w-full">
          <div className="relative">
            {/* Left Arrow */}
            <button
              onClick={scrollLeft}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-orange-400 hover:bg-orange-500 dark:bg-gray-600 dark:hover:bg-gray-700 shadow-lg rounded-full p-2 transition-all duration-300 flex items-center justify-center"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} className="text-white dark:text-gray-200" />
            </button>

            {/* Right Arrow */}
            <button
              onClick={scrollRight}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-orange-400 hover:bg-orange-500 dark:bg-gray-600 dark:hover:bg-gray-700 shadow-lg rounded-full p-2 transition-all duration-300 flex items-center justify-center"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} className="text-white dark:text-gray-200" />
            </button>

            {/* Categories Container */}
            <div 
              ref={scrollRef}
              className="categories flex gap-3 sm:gap-4 md:gap-6 lg:gap-9 mt-5 overflow-x-auto pb-4 scrollbar-hide px-4 sm:px-12"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {menu_list.map((item, index) => {
                return (
                  <div
                    onClick={() => getActive(index, item.name)}
                    key={index}
                    className={`category-item pt-2 flex flex-col items-center gap-2 sm:gap-3 md:gap-4 cursor-pointer min-w-fit transition-all duration-300 hover:scale-105 ${
                      active.index === index 
                        ? "border-b-4 border-orange-500 dark:border-gray-400 pb-2" 
                        : ""
                    }`}
                  >
                    <img
                      src={`${base_url}/uploads/menuImages/${item.image}`}
                      alt={item.name}
                      className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-[120px] lg:h-[120px] rounded-full object-cover transition-all duration-300 ${
                        active.index === index 
                          ? "border-2 border-black dark:border-gray-400" 
                          : ""
                      }`}
                    />
                    <p className="text-xs sm:text-sm md:text-[15px] font-semibold text-center whitespace-nowrap text-black dark:text-gray-200 transition-colors duration-300">
                      {item.menu_name}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <hr className="my-5 text-gray-300 dark:border-gray-600 w-full transition-colors duration-300" />
      </div>
      <Products activeOptions={active} />
    </>
  );
};

export default Categories;