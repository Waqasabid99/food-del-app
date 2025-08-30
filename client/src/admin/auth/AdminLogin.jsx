import React, { useState } from "react";
import { Link } from "react-router-dom";

const AdminLogin = ({ handleShowLogin, handleShowSignup }) => {
  const [identifier, setIdentifier] = useState(""); // email or phone
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const isPhone = (v) => /^\+?\d{10,15}$/.test(v.replace(/\s|-/g, "")); // 10–15 digits, optional +


  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="relative w-full max-h-full max-w-md mx-auto shadow-xl rounded-2xl p-6 md:p-8">
        <button
          onClick={() => handleShowLogin(false)}
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
        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
        <p className="text-gray-500 mt-1">Sign in to your account</p>

        {errors.form && (
          <div className="mt-4 rounded-lg bg-red-50 text-red-700 px-4 py-2 text-sm">
            {errors.form}
          </div>
        )}

        <form className="mt-6 space-y-4" noValidate>
          {/* Email or Phone */}
          <div>
            <label
              htmlFor="identifier"
              className="block text-sm font-medium text-gray-700"
            >
              Email or phone
            </label>
            <input
              id="identifier"
              name="identifier"
              inputMode="email"
              autoComplete="username"
              placeholder="e.g. alex@mail.com or +12345678901"
              className={`mt-1 w-full rounded-lg border px-4 py-3 outline-none focus:ring-2
              ${
                errors.identifier
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-orange-400"
              }`}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
            {errors.identifier && (
              <p className="mt-1 text-sm text-red-600">{errors.identifier}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <a
                href="#forgot"
                className="text-sm text-orange-600 hover:underline"
              >
                Forgot?
              </a>
            </div>
            <div className="relative mt-1">
              <input
                id="password"
                name="password"
                type={showPwd ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                className={`w-full rounded-lg border px-4 py-3 pr-12 outline-none focus:ring-2
                ${
                  errors.password
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-orange-400"
                }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                className="absolute inset-y-0 right-2 my-auto rounded-md px-3 text-sm text-gray-600 hover:bg-gray-100"
                aria-label={showPwd ? "Hide password" : "Show password"}
              >
                {showPwd ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Remember + Submit */}
          <div className="flex items-center justify-between">
            <label className="inline-flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-lg bg-orange-500 px-4 py-3 font-semibold text-white transition
            hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            onClick={() => {
              handleShowSignup(true);
              handleShowLogin(false);
            }}
            to="signup"
            className="font-medium text-orange-600 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
