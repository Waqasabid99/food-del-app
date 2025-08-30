import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Newsletter from "../components/Newsletter";
import useAuthStore from "../store/authStore";
// import { menu_list, food_list } from "../data/store";
import { GoPlus } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "axios";

const Menu = ({ handleShowLogin }) => {
  const { showLogin, showSignup } = useAuthStore();
  const [active, setActive] = useState({ index: null, category: null });
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const base_url = import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:5000";
  const [food_list, setFoodList] = useState([]);
  const [menu_list, setMenuList] = useState([]);

  useEffect(() => {
    axios.get(`${base_url}/api/menu/getmenu`, { withCredentials: true }).then((res) => {
      setMenuList(res.data.data);
      console.log(res.data.data)
    })
    axios.get(`${base_url}/api/food/getfood`, { withCredentials: true }).then((res) => {
      setFoodList(res.data.data);
      console.log(res.data.data)
    })
  }, [setMenuList, setFoodList])

  const getActive = (index, name) => {
    if (active.index === index) {
      setActive({ index: null, category: null });
    } else {
      setActive({ index: index, category: name });
    }
  };

  const showSingleProduct = (id) => {
    console.log(`Navigate to product: ${id}`);
    navigate(`/product/${id}`);
  };

  // Filter products based on active category
  const filteredProducts = active.category
    ? food_list.filter((item) => item.category === active.category)
    : food_list;

  const specialOffers = [
    {
      title: "Family Combo",
      description: "Perfect for 4 people - Save 20%",
      image:
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
      discount: "20% OFF",
      originalPrice: "$45.99",
      salePrice: "$36.99",
    },
    {
      title: "Weekend Special",
      description: "Free dessert with any main course",
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
      discount: "FREE DESSERT",
      originalPrice: "$24.99",
      salePrice: "$24.99",
    },
  ];

  return (
    <>
      {!showLogin && !showSignup && (
        <>
          <Navbar handleShowLogin={handleShowLogin} />

          {/* Hero Section */}
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-gray-800 dark:to-gray-700 py-16 px-6 transition-colors duration-300">
            <div className="max-w-6xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-6 transition-colors duration-300">
                Our Delicious Menu
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed transition-colors duration-300">
                Discover a world of flavors with our carefully curated menu.
                From comfort classics to exotic cuisines, we have something for
                everyone.
              </p>
            </div>
          </div>

          {/* Special Offers */}
          <div className="py-16 px-6 bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">
                  Today's Special Offers
                </h2>
                <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  Limited time deals you don't want to miss!
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {specialOffers.map((offer, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 relative overflow-hidden transition-colors duration-300"
                  >
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {offer.discount}
                    </div>
                    <div className="flex items-center gap-6">
                      <img
                        src={offer.image}
                        alt={offer.title}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300">
                          {offer.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-3 transition-colors duration-300">
                          {offer.description}
                        </p>
                        <div className="flex items-center gap-3">
                          {offer.originalPrice !== offer.salePrice && (
                            <span className="text-gray-500 dark:text-gray-400 line-through transition-colors duration-300">
                              {offer.originalPrice}
                            </span>
                          )}
                          <span className="text-2xl font-bold text-orange-500 dark:text-orange-400 transition-colors duration-300">
                            {offer.salePrice}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="w-full mt-4 bg-orange-500 dark:bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors duration-300">
                      Order Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Categories Section */}
          <div className="py-16 px-6 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
              {/* Headings */}
              <div className="headings mb-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">
                  Explore our Menu
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl transition-colors duration-300">
                  Choose from a wide range of delicious dishes and have them
                  delivered to your doorstep. Our mission is to provide you with
                  a satisfying and enjoyable dining experience.
                </p>
              </div>

              {/* Categories */}
              <div className="category py-3">
                <div className="categories flex flex-wrap justify-center gap-8 mt-8">
                  {menu_list.map((item, index) => {
                    return (
                      <div
                        onClick={() => getActive(index, item.name)}
                        key={index}
                        className={`category-item flex flex-col items-center gap-4 cursor-pointer p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
                          active.index === index
                            ? "border-4 border-orange-500 bg-white dark:bg-gray-700 shadow-lg dark:shadow-2xl"
                            : "bg-white dark:bg-gray-700 shadow-sm hover:shadow-md dark:hover:shadow-xl"
                        }`}
                      >
                        <img
                          src={`${base_url}/uploads/menuImages/${item.image}`}
                          alt={item.name}
                          className={`w-20 h-20 md:w-24 md:h-24 rounded-full object-cover transition-all ${
                            active.index === index
                              ? "ring-4 ring-orange-300"
                              : ""
                          }`}
                        />
                        <p
                          className={`text-sm md:text-base font-semibold text-center transition-colors duration-300 ${
                            active.index === index
                              ? "text-orange-500 dark:text-orange-400"
                              : "text-gray-800 dark:text-gray-200"
                          }`}
                        >
                          {item.name}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="py-16 px-6 bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">
                  {active.category
                    ? `${active.category} Menu`
                    : "All Menu Items"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  Showing {filteredProducts.length} of {food_list.length} items
                </p>
              </div>

              {/* Products Grid */}
              <div className="products-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((item, index) => (
                  <div
                    key={index}
                    className="item flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-lg dark:shadow-xl dark:hover:shadow-2xl hover:scale-105 cursor-pointer transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="relative">
                      <img
                        className="rounded-t-xl w-full h-48 object-cover"
                        src={`${base_url}/uploads/foodImages/${item.image}`}
                        alt={item.name}
                        onClick={() => showSingleProduct(item._id)}
                      />
                      <button className="absolute right-3 top-3 bg-white dark:bg-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all">
                        <GoPlus
                          onClick={() => addToCart(item, 1)}
                          className="text-orange-500 dark:text-gray-800 p-2 w-10 h-10 hover:scale-110 transition-transform"
                        />
                      </button>
                    </div>
                    <div
                      onClick={() => showSingleProduct(item._id)}
                      className="content flex flex-col gap-3 p-4 flex-grow"
                    >
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 transition-colors duration-300">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 flex-grow transition-colors duration-300">
                        {item.description}
                      </p>
                      <div className="flex justify-between items-center pt-2">
                        <p className="text-xl font-bold text-orange-500 dark:text-orange-400 transition-colors duration-300">
                          ${item.price}
                        </p>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">⭐</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                            4.5
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🍽️</div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300">
                    No items found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 transition-colors duration-300">
                    We couldn't find any items in this category.
                  </p>
                  <button
                    onClick={() => setActive({ index: null, category: null })}
                    className="bg-orange-500 dark:bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-600 dark:hover:bg-orange-700 transition-colors duration-300"
                  >
                    View All Items
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Popular Categories */}
          <div className="py-16 px-6 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">
                  Most Popular Categories
                </h2>
                <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  What our customers love the most
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6 bg-white dark:bg-gray-700 rounded-xl shadow-sm dark:shadow-xl transition-colors duration-300">
                  <div className="text-4xl mb-4">🍕</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100 transition-colors duration-300">
                    Pizza
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-300">
                    Fresh, hot, and delicious pizzas with premium toppings
                  </p>
                  <p className="text-orange-500 dark:text-orange-400 font-bold mt-3 transition-colors duration-300">
                    150+ orders daily
                  </p>
                </div>
                <div className="text-center p-6 bg-white dark:bg-gray-700 rounded-xl shadow-sm dark:shadow-xl transition-colors duration-300">
                  <div className="text-4xl mb-4">🍔</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100 transition-colors duration-300">
                    Burgers
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-300">
                    Juicy burgers made with fresh ingredients
                  </p>
                  <p className="text-orange-500 dark:text-orange-400 font-bold mt-3 transition-colors duration-300">
                    200+ orders daily
                  </p>
                </div>
                <div className="text-center p-6 bg-white dark:bg-gray-700 rounded-xl shadow-sm dark:shadow-xl transition-colors duration-300">
                  <div className="text-4xl mb-4">🍜</div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100 transition-colors duration-300">
                    Asian
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-300">
                    Authentic Asian cuisine with bold flavors
                  </p>
                  <p className="text-orange-500 dark:text-orange-400 font-bold mt-3 transition-colors duration-300">
                    100+ orders daily
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="py-16 px-6 bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 transition-colors duration-300">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h2 className="text-3xl font-bold mb-6">
                Can't Decide What to Order?
              </h2>
              <p className="text-xl leading-relaxed mb-8">
                Let our chefs surprise you with our daily specials and chef's
                recommendations. Fresh ingredients, bold flavors, delivered in
                25-30 minutes!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="bg-white text-orange-500 dark:bg-gray-200 dark:text-orange-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 dark:hover:bg-gray-300 transition-colors duration-300">
                  Chef's Choice
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-orange-500 dark:hover:bg-gray-200 dark:hover:text-orange-600 transition-colors duration-300">
                  View Cart
                </button>
              </div>
            </div>
          </div>

          <Newsletter />
          <Footer />
        </>
      )}
    </>
  );
};

export default Menu;
