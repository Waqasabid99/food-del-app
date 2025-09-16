import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
// import { food_list } from "../data/store";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { GoPlus } from "react-icons/go";
import Newsletter from "../components/Newsletter";
import { useCart } from "../context/CartContext";
import axios from "axios";

const SingleProduct = ({
  handleShowLogin,
  handleShowSignup,
  handleCloseAuth,
}) => {
  // From AuthStore (Zustand)
  const { showLogin, showSignup } = useAuthStore();
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState({});
  const [food_list, setFoodList] = useState([]);
  const base_url =
    import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    axios.get(`${base_url}/api/food/getfood`, { withCredentials: true }).then((res) => {
      setFoodList(res.data.data);
    });
  }, [setFoodList]);

  useEffect(() => {
    axios.get(`${base_url}/api/food/getfood/${id}`, { withCredentials: true }).then((res) => {
      setProduct(res.data.data);
      console.log(product);
    });
  }, [id]);

  const similarProducts = food_list.filter(
    (item) => item.category && item.category === product?.category
  );

  const [totalPrice, setTotalPrice] = useState(product?.price || 0);
  const showSingleProduct = (id) => {
    navigate(`/product/${id}`);
  };

  const increaseQuantity = () => setQuantity((q) => q + 1);
  const decreaseQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : q));

  useEffect(() => {
    if (product) {
      setTotalPrice(quantity * product.price);
    }
  }, [quantity, id, product]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  return (
    <>
      {!showLogin && !showSignup && (
        <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
          <Navbar
            handleShowSignup={handleShowSignup}
            handleShowLogin={handleShowLogin}
            handleCloseAuth={handleCloseAuth}
          />
          {/* Product Section */}
          <div className="main flex flex-col md:flex-row w-full p-6 gap-8">
            {/* Left Section - Product Image */}
            <div className="left flex-1 flex justify-center items-center">
              <img
                src={`${base_url}/uploads/foodImages/${product.image}`}
                alt={product.name}
                className="rounded-xl shadow-lg dark:shadow-2xl w-full max-w-md object-cover transition-all duration-300"
              />
            </div>

            {/* Right Section - Product Details */}
            <div className="right flex-1 flex flex-col gap-5">
              {/* Title */}
              <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">
                {product.name}
              </h1>

              {/* Description */}
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                {product.description}
              </p>

              {/* Price */}
              <p className="text-3xl font-semibold text-green-600 dark:text-green-400 transition-colors duration-300">
                ${totalPrice}
              </p>

              {/* Quantity Selector */}
              <div className="flex items-center gap-3">
                <button
                  onClick={decreaseQuantity}
                  className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
                >
                  -
                </button>
                <span className="text-lg font-medium text-gray-800 dark:text-gray-200 transition-colors duration-300">
                  {quantity}
                </span>
                <button
                  onClick={increaseQuantity}
                  className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
                >
                  +
                </button>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => {
                    addToCart(product, quantity, totalPrice);
                    setQuantity(1);
                  }}
                  className="bg-black dark:bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-gray-800 dark:hover:bg-orange-700 transition-colors duration-300"
                >
                  Add to Cart
                </button>
                <button className="border border-black dark:border-gray-600 text-black dark:text-gray-200 bg-white dark:bg-gray-800 px-6 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300">
                  Buy Now
                </button>
              </div>

              {/* Extra Info */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 transition-colors duration-300">
                  Delivery & Return
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  Free delivery within 20-30 minutes. Read our{" "}
                  <Link
                    className="text-orange-400 dark:text-orange-300 hover:text-orange-500 dark:hover:text-orange-200 transition-colors duration-300"
                    to="/return"
                  >
                    Return Policy
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Similar Products Section */}
          <div className="similar-products mt-5 px-4 sm:px-6 lg:px-10 w-full">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100 transition-colors duration-300">
              Similar Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-2 sm:p-4">
              {similarProducts.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="item flex flex-col bg-white dark:bg-gray-800 border-white dark:border-gray-700 border rounded-xl object-cover shadow-xl dark:shadow-2xl my-2 sm:my-4 hover:translate-y-2 hover:shadow-2xl hover:scale-105 cursor-pointer relative transition-all duration-300"
                  >
                    <span className="hidden">{item._id}</span>
                    <span className="hidden">{item.category}</span>
                    <img
                      onClick={() => showSingleProduct(item._id)}
                      className="rounded-t-xl w-full h-48 sm:h-56 md:h-64 object-cover relative"
                      src={`${base_url}/uploads/foodImages/${item.image}`}
                      alt={item.name}
                    />
                    <button className="absolute right-3 top-[35%] sm:top-[42%] text-xl sm:text-2xl">
                      <GoPlus
                        onClick={() => addToCart(item, 1)}
                        className="text-black dark:text-gray-800 bg-white dark:bg-gray-200 rounded-full p-1 w-7 h-7 sm:w-8 sm:h-8 active:scale-[-0.9] hover:scale-[1.3] transition-all duration-300 shadow-lg"
                      />
                    </button>
                    <div
                      onClick={() => showSingleProduct(item._id)}
                      className="content flex flex-col gap-2 w-full px-3 pt-2 pb-4 sm:pb-7"
                    >
                      <h2 className="text-lg sm:text-xl font-semibold line-clamp-2 text-gray-800 dark:text-gray-100 transition-colors duration-300">
                        {item.name}
                      </h2>
                      <p className="text-sm sm:text-md text-gray-500 dark:text-gray-400 line-clamp-2 transition-colors duration-300">
                        {item.description}
                      </p>
                      <p className="text-lg sm:text-xl font-bold text-orange-400 dark:text-orange-300 transition-colors duration-300">
                        ${item.price}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Newsletter />
          <Footer />
        </div>
      )}
    </>
  );
};

export default SingleProduct;
