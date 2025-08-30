import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Newsletter from "../components/Newsletter";
import useAuthStore from "../store/authStore";

const About = ({ handleShowLogin }) => {
  const { showLogin, showSignup } = useAuthStore();

  const stats = [
    { number: "10K+", label: "Happy Customers" },
    { number: "500+", label: "Delicious Dishes" },
    { number: "15KM", label: "Free Delivery Range" },
    { number: "25-30", label: "Minutes Delivery" },
  ];

  const features = [
    {
      title: "Fast Delivery",
      description: "Get your favorite food delivered within 25-30 minutes",
      icon: "🚚",
    },
    {
      title: "Fresh Ingredients",
      description: "We use only the freshest and highest quality ingredients",
      icon: "🥬",
    },
    {
      title: "Wide Selection",
      description: "Choose from hundreds of delicious dishes and cuisines",
      icon: "🍽️",
    },
    {
      title: "Free Delivery",
      description: "Enjoy free delivery within 15KM radius",
      icon: "🎁",
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Head Chef",
      image: "https://images.unsplash.com/photo-1594824020552-bb8aac2aa29d?w=300&h=300&fit=crop&crop=face",
    },
    {
      name: "Mike Chen",
      role: "Operations Manager",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    },
    {
      name: "Emily Rodriguez",
      role: "Customer Experience Lead",
      image: "https://images.unsplash.com/photo-1494790108755-2616b95ab644?w=300&h=300&fit=crop&crop=face",
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
                About Our Story
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed transition-colors duration-300">
                We're passionate about delivering fresh, delicious meals right to your doorstep. 
                Serving California with love, one meal at a time.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="py-16 px-6 bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-orange-500 dark:text-orange-400 mb-2 transition-colors duration-300">
                      {stat.number}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 font-medium transition-colors duration-300">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Our Story Section */}
          <div className="py-16 px-6 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 transition-colors duration-300">Our Story</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed transition-colors duration-300">
                    Founded in the heart of California, our food delivery service was born from a simple 
                    idea: everyone deserves access to fresh, delicious meals without the hassle of cooking 
                    or leaving home.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed transition-colors duration-300">
                    What started as a small local operation has grown into a trusted name across California, 
                    serving thousands of happy customers daily. We partner with the best local restaurants 
                    and chefs to bring you an incredible variety of cuisines.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                    Our commitment to quality, speed, and customer satisfaction drives everything we do. 
                    From our kitchen to your table, we ensure every meal is prepared with care and 
                    delivered with a smile.
                  </p>
                </div>
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop"
                    alt="Our kitchen"
                    className="rounded-xl shadow-lg dark:shadow-2xl w-full transition-all duration-300"
                  />
                  <div className="absolute -bottom-6 -left-6 bg-orange-500 dark:bg-orange-600 text-white p-4 rounded-lg shadow-lg dark:shadow-2xl transition-colors duration-300">
                    <p className="font-bold">California's #1</p>
                    <p className="text-sm">Food Delivery Service</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="py-16 px-6 bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">Why Choose Us?</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-colors duration-300">
                  We're committed to providing you with the best food delivery experience in California
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <div key={index} className="text-center p-6 rounded-xl hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800 border border-transparent dark:border-gray-700">
                    <div className="text-5xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 transition-colors duration-300">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed transition-colors duration-300">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Service Areas */}
          <div className="py-16 px-6 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 transition-colors duration-300">Our Service Area</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto transition-colors duration-300">
                We proudly serve customers across California with our fast and reliable delivery service
              </p>
              <div className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-sm dark:shadow-xl transition-colors duration-300">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="text-orange-500 dark:text-orange-400 text-2xl font-bold mb-2 transition-colors duration-300">📍</div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300">Coverage Area</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-300">Serving all major cities across California</p>
                  </div>
                  <div className="text-center">
                    <div className="text-orange-500 dark:text-orange-400 text-2xl font-bold mb-2 transition-colors duration-300">🚚</div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300">Free Delivery</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-300">Within 15KM radius from our locations</p>
                  </div>
                  <div className="text-center">
                    <div className="text-orange-500 dark:text-orange-400 text-2xl font-bold mb-2 transition-colors duration-300">⏰</div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300">Quick Delivery</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-300">Your order arrives in 25-30 minutes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="py-16 px-6 bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">Meet Our Team</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-colors duration-300">
                  The passionate people behind your favorite food delivery experience
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {team.map((member, index) => (
                  <div key={index} className="text-center p-6 rounded-xl bg-white dark:bg-gray-800 shadow-sm dark:shadow-xl hover:shadow-lg dark:hover:shadow-2xl transition-all duration-300">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-lg dark:shadow-2xl transition-all duration-300"
                    />
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300">{member.name}</h3>
                    <p className="text-orange-500 dark:text-orange-400 font-medium transition-colors duration-300">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mission Section */}
          <div className="py-16 px-6 bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 transition-colors duration-300">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-xl leading-relaxed mb-8">
                To make delicious, fresh food accessible to everyone in California through our 
                fast, reliable, and affordable delivery service. We believe great food brings 
                people together and creates moments of joy in everyday life.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="bg-white text-orange-500 dark:bg-gray-200 dark:text-orange-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 dark:hover:bg-gray-300 transition-colors duration-300">
                  Order Now
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-orange-500 dark:hover:bg-gray-200 dark:hover:text-orange-600 transition-colors duration-300">
                  Contact Us
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

export default About