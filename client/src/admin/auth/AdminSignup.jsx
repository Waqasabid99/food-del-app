import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Link } from "react-router-dom";

const AdminSignup = ({ handleShowSignup, handleShowLogin }) => {
  const [useEmail, setUseEmail] = useState(true); // toggle between email/phone
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhoneChange = (value) => {
    setFormData({
      ...formData,
      phone: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };

  return (
    <div className="w-full flex justify-center py-10">
      <div className="relative w-[400px] bg-white shadow-lg rounded-2xl p-6">
        <button
          onClick={() => handleShowSignup(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-center mb-5">Sign Up</h2>

        {/* Switch Option */}
        <div className="flex justify-center mb-4 gap-3">
          <button
            type="button"
            onClick={() => setUseEmail(true)}
            className={`px-4 py-2 rounded-lg ${
              useEmail ? "bg-orange-500 text-white" : "bg-gray-200"
            }`}
          >
            Use Email
          </button>
          <button
            type="button"
            onClick={() => setUseEmail(false)}
            className={`px-4 py-2 rounded-lg ${
              !useEmail ? "bg-orange-500 text-white" : "bg-gray-200"
            }`}
          >
            Use Phone
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email or Phone */}
          {useEmail ? (
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="p-3 border rounded-lg focus:outline-orange-500"
              required
            />
          ) : (
            <PhoneInput
              country={"us"}
              value={formData.phone}
              onChange={handlePhoneChange}
              inputStyle={{
                width: "100%",
                height: "45px",
                borderRadius: "8px",
              }}
            />
          )}

          {/* Username */}
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="p-3 border rounded-lg focus:outline-orange-500"
            required
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="p-3 border rounded-lg focus:outline-orange-500"
            required
          />

          <button
            type="submit"
            className="bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link
            onClick={() => {
              handleShowSignup(false);
              handleShowLogin(true);
            }}
            to="/login"
            className="text-orange-500 font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminSignup;
