import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
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
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Tell Navbar that login happened
        window.dispatchEvent(
          new CustomEvent("authChange", {
            detail: data.user,
          })
        );

        alert("Login Successful!");

        navigate("/");
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      alert("Server error, try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-4 py-12">

      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <Link
            to="/"
            className="text-3xl font-extrabold text-blue-600"
          >
            Shop<span className="text-gray-900">Ease</span>
          </Link>

          <p className="text-gray-500 mt-2">
            Welcome back! Please login to your account.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center">
            Welcome Back
          </h1>

          <p className="text-center text-gray-500 mt-2 mb-7">
            Login to continue shopping
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

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
                className="w-full border border-gray-200 px-4 py-3 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-200 px-4 py-3 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-100"
            >
              Login
            </button>

          </form>

          <div className="mt-7 pt-6 border-t border-gray-100 text-center">
            <p className="text-gray-500">
              Don't have an account?

              <Link
                to="/register"
                className="text-blue-600 font-semibold ml-2 hover:text-blue-700"
              >
                Create Account
              </Link>
            </p>
          </div>

        </div>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-sm text-gray-500 hover:text-blue-600"
          >
            ← Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Login;