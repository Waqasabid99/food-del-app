import React from "react";

const Newsletter = () => {
  return (
    <>
      <div className="newsletter w-full flex justify-center px-4 py-12 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="left w-full flex flex-col items-center text-center gap-5 px-6 py-12 bg-orange-400 dark:bg-gray-500 rounded-2xl shadow-lg dark:shadow-2xl transition-all duration-300">
          {/* Hero Text */}
          <p className="text-white dark:text-gray-100 uppercase tracking-wide">
            Newsletter
          </p>
          <h1 className="text-white dark:text-gray-100 text-4xl md:text-5xl font-bold">
            Subscribe to our newsletter
          </h1>
          <p className="text-white dark:text-gray-200 max-w-xl">
            Get the latest updates, exclusive offers, and tips delivered
            directly to your inbox.
          </p>

          {/* Email Input + Button */}
          <div className="flex flex-col sm:flex-row items-start gap-3 w-full max-w-md mt-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full flex-1 px-4 py-3 rounded-full outline-none 
                         bg-white dark:bg-gray-800 
                         text-gray-700 dark:text-gray-200 
                         placeholder:text-gray-500 dark:placeholder:text-gray-400
                         focus:ring-2 focus:ring-white dark:focus:ring-gray-300 
                         border-0 dark:border dark:border-gray-600
                         transition-all duration-300"
            />
            <button className="w-full sm:w-auto px-6 py-3 rounded-full 
                             bg-white dark:bg-gray-800 
                             text-orange-500 dark:text-gray-400 
                             font-semibold 
                             hover:bg-gray-100 dark:hover:bg-gray-700 
                             transition duration-300 hover:scale-95
                             border-0 dark:border dark:border-gray-600">
              Subscribe
            </button>
          </div>

          {/* Small Note */}
          <p className="text-sm text-white/80 dark:text-gray-300/80 mt-3">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </>
  );
};

export default Newsletter;