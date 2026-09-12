import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://shop-ease-backend-blush.vercel.app",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Registration Successful!");
        navigate("/login");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      alert("Server error, try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center px-6 py-12">

      <div className="w-full max-w-md">

        {/* Logo / Heading */}
        <div className="text-center text-white mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur rounded-2xl text-3xl mb-4">
            🛍️
          </div>

          <h1 className="text-3xl font-extrabold">
            Create Your Account
          </h1>

          <p className="text-blue-100 mt-2">
            Join us and start shopping today
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-7 md:p-9">

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border border-gray-200 bg-gray-50 px-4 py-3.5 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-200 bg-gray-50 px-4 py-3.5 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-200 bg-gray-50 px-4 py-3.5 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold shadow-md hover:shadow-lg transition"
            >
              Create Account
            </button>

          </form>

          {/* Login */}
          <div className="text-center mt-7 pt-6 border-t border-gray-100">
            <p className="text-gray-500">
              Already have an account?
            </p>

            <Link
              to="/login"
              className="inline-block mt-2 text-blue-600 hover:text-blue-700 font-bold transition"
            >
              Login to your account →
            </Link>
          </div>

        </div>

        <p className="text-center text-blue-100 text-sm mt-6">
          © 2026 Your Store. All rights reserved.
        </p>

      </div>
    </div>
  );
}

export default Register;