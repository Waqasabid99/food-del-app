import React from "react";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { Link, NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <div className="main bg-[#EC6A14] dark:bg-gray-500 text-white dark:text-gray-100 py-10 px-6 md:px-16 rounded-t transition-all duration-300">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* About Us */}
          <div className="about-us space-y-4">
            <h1 className="logo text-2xl font-bold tracking-wide text-white dark:text-gray-100">
              FOODIE
            </h1>
            <p className="text-sm leading-relaxed text-white dark:text-gray-200">
              We are the best food delivery service in the world. Your satisfaction is our first priority.
            </p>
            <div className="social-media flex gap-4 text-xl">
              <Link 
                to="/" 
                className="hover:text-black dark:hover:text-gray-300 transition-colors duration-200"
              >
                <FaFacebook />
              </Link>
              <Link 
                to="/" 
                className="hover:text-black dark:hover:text-gray-300 transition-colors duration-200"
              >
                <FaInstagram />
              </Link>
              <Link 
                to="/" 
                className="hover:text-black dark:hover:text-gray-300 transition-colors duration-200"
              >
                <FaYoutube />
              </Link>
              <Link 
                to="/" 
                className="hover:text-black dark:hover:text-gray-300 transition-colors duration-200"
              >
                <FaSquareXTwitter />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="quick-links space-y-4">
            <h2 className="text-lg font-semibold text-white dark:text-gray-100">
              Quick Links
            </h2>
            <ul className="flex flex-col gap-2 text-sm font-bold">
              <NavLink 
                to="/" 
                className="hover:underline text-white dark:text-gray-200 hover:text-gray-200 dark:hover:text-gray-300 transition-colors duration-200"
              >
                Home
              </NavLink>
              <NavLink 
                to="/menu" 
                className="hover:underline text-white dark:text-gray-200 hover:text-gray-200 dark:hover:text-gray-300 transition-colors duration-200"
              >
                Menu
              </NavLink>
              <NavLink 
                to="/about" 
                className="hover:underline text-white dark:text-gray-200 hover:text-gray-200 dark:hover:text-gray-300 transition-colors duration-200"
              >
                About
              </NavLink>
              <NavLink 
                to="/contact" 
                className="hover:underline text-white dark:text-gray-200 hover:text-gray-200 dark:hover:text-gray-300 transition-colors duration-200"
              >
                Contact
              </NavLink>
            </ul>
          </div>

          {/* Pages */}
          <div className="pages space-y-4">
            <h2 className="text-lg font-semibold text-white dark:text-gray-100">
              Pages
            </h2>
            <ul className="flex flex-col gap-2 text-sm font-bold">
              <NavLink 
                to="/" 
                className="hover:underline text-white dark:text-gray-200 hover:text-gray-200 dark:hover:text-gray-300 transition-colors duration-200"
              >
                Terms and Conditions
              </NavLink>
              <NavLink 
                to="/menu" 
                className="hover:underline text-white dark:text-gray-200 hover:text-gray-200 dark:hover:text-gray-300 transition-colors duration-200"
              >
                Privacy Policy
              </NavLink>
              <NavLink 
                to="/about" 
                className="hover:underline text-white dark:text-gray-200 hover:text-gray-200 dark:hover:text-gray-300 transition-colors duration-200"
              >
                Refund Policy
              </NavLink>
              <NavLink 
                to="/contact" 
                className="hover:underline text-white dark:text-gray-200 hover:text-gray-200 dark:hover:text-gray-300 transition-colors duration-200"
              >
                Cookie Policy
              </NavLink>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="contact space-y-4">
            <h2 className="text-lg font-semibold text-white dark:text-gray-100">
              Contact Info
            </h2>
            <ul className="space-y-2 text-sm">
              <li className="text-white dark:text-gray-200">
                <span className="font-medium">Address:</span> 123 Foodie Street, Callifornia CA
              </li>
              <li className="text-white dark:text-gray-200">
                <span className="font-medium">Email:</span> support@foodie.com
              </li>
              <li className="text-white dark:text-gray-200">
                <span className="font-medium">Phone:</span> +1 (123) 456-7890
              </li>
            </ul>
          </div>

          {/* Map */}
          {/* <div className="newsletter space-y-4">
            <h2 className="text-lg font-semibold">Our location</h2>
            <div className="flex gap-2">
             <iframe className="rounded pr-2" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3315.4274728874752!2d72.69864347441973!3d33.80128003094251!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38df0807768ac521%3A0x5efbfb548b85239d!2sMughal%20Gardens%20Wah!5e0!3m2!1sen!2s!4v1755722973251!5m2!1sen!2s" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
          </div> */}
        </div>

        {/* Copyright */}
        <div className="copyright text-center mt-10 text-sm font-bold border-t border-white dark:border-gray-300 pt-4 transition-colors duration-300">
          <p className="text-white dark:text-gray-200">
            © 2025 FOODIE. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
};

export default Footer;