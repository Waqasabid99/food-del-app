import { React } from "react";
// import { food_list } from "../data/store";
import { GoPlus } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

const Products = ({ activeOptions }) => {
  console.log(activeOptions);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [food_list, setFoodList] = useState([]);
  const base_url = import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    axios.get(`${base_url}/api/food/getfood`, { withCredentials: true }).then((res) => {
      setFoodList(res.data.data);
      console.log(res.data.data);
    })
  }, [setFoodList])

  const findProducts = () => {
    if (activeOptions.category != null) {
      return food_list.filter(
        (item) => item.category === activeOptions.category
      );
    }
  };
  const activeProducts = findProducts();
  const showSingleProduct = (id) => {
    console.log(id);
    navigate(`/product/${id}`);
  };

  return (
    <>
      <div className="products w-full px-4 sm:px-6 md:px-8 lg:px-10 bg-white dark:bg-gray-900 transition-colors duration-300">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 text-black dark:text-gray-100 transition-colors duration-300">
          Top dishes for you
        </h1>

        {/* Product Grid (ALL PRODUCTS) */}
        {activeOptions.category === null && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 p-2 sm:p-4">
            {food_list.slice(0, 12).map((item, index) => {
              return (
                <div
                  key={index}
                  className="item flex flex-col bg-white dark:bg-gray-800 border-white dark:border-gray-700 border rounded-xl object-cover shadow-xl dark:shadow-2xl my-2 sm:my-4 hover:translate-y-2 hover:shadow-2xl hover:scale-105 cursor-pointer relative transition-all duration-300"
                >
                  <span className="hidden">{item._id}</span>
                  <span className="hidden">{item.category}</span>
                  <div className="relative">
                    <img
                      onClick={() => showSingleProduct(item._id)}
                      className="rounded-t-xl w-full h-48 sm:h-52 md:h-56 lg:h-60 object-cover"
                      src={`${base_url}/uploads/foodImages/${item.image}`}
                      alt={item.name}
                    />
                    <button className="absolute right-3 top-[40%] sm:top-[42%] text-xl sm:text-2xl">
                      <GoPlus
                        onClick={() => addToCart(item, 1)}
                        className="text-black dark:text-gray-800 bg-white dark:bg-gray-200 rounded-full p-1 w-7 h-7 sm:w-8 sm:h-8 active:scale-90 hover:scale-110 transition-all duration-300 shadow-lg"
                      />
                    </button>
                  </div>
                  <div
                    onClick={() => showSingleProduct(item._id)}
                    className="content flex flex-col gap-2 px-3 sm:px-4 pt-3 pb-4 sm:pb-6"
                  >
                    <h2 className="text-lg sm:text-xl font-semibold line-clamp-2 text-black dark:text-gray-100 transition-colors duration-300">
                      {item.name}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 line-clamp-2 transition-colors duration-300">
                      {item.description}
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-orange-400 dark:text-orange-300 transition-colors duration-300">
                      {`$${item.price}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Product Grid (ACTIVE PRODUCTS) */}
        {activeProducts != null && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 p-2 sm:p-4">
            {activeProducts.map((item, index) => {
              return (
                <div
                  key={index}
                  className="item flex flex-col bg-white dark:bg-gray-800 border-white dark:border-gray-700 border rounded-xl object-cover shadow-xl dark:shadow-2xl my-2 sm:my-4 hover:translate-y-2 hover:shadow-2xl hover:scale-105 cursor-pointer relative transition-all duration-300"
                >
                  <span className="hidden">{item._id}</span>
                  <span className="hidden">{item.category}</span>
                  <div className="relative">
                    <img
                      onClick={() => showSingleProduct(item._id)}
                      className="rounded-t-xl w-full h-48 sm:h-52 md:h-56 lg:h-60 object-cover"
                      src={`${base_url}/uploads/foodImages/${item.image}`}
                      alt={item.name}
                    />
                    <button className="absolute right-3 top-[40%] sm:top-[42%] text-xl sm:text-2xl">
                      <GoPlus
                        onClick={() => addToCart(item, 1)}
                        className="text-black dark:text-gray-800 bg-white dark:bg-gray-200 rounded-full p-1 w-7 h-7 sm:w-8 sm:h-8 active:scale-90 hover:scale-110 transition-all duration-300 shadow-lg"
                      />
                    </button>
                  </div>
                  <div
                    onClick={() => showSingleProduct(item._id)}
                    className="content flex flex-col gap-2 px-3 sm:px-4 pt-3 pb-4 sm:pb-6"
                  >
                    <h2 className="text-lg sm:text-xl font-semibold line-clamp-2 text-black dark:text-gray-100 transition-colors duration-300">
                      {item.name}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 line-clamp-2 transition-colors duration-300">
                      {item.description}
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-orange-400 dark:text-orange-300 transition-colors duration-300">
                      {`$${item.price}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-center mt-6 sm:mt-8">
          <button
            onClick={() => navigate("/shop")}
            className="bg-orange-500 hover:bg-orange-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white dark:text-gray-100 px-6 py-2 sm:px-8 sm:py-3 text-sm sm:text-base rounded-md transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            View All
          </button>
        </div>
      </div>
    </>
  );
};

export default Products;