import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "https://shop-ease-backend-blush.vercel.app";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      console.log("Register API Response:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed. Please try again."
        );
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      alert("Registration Successful!");

      navigate("/login");
    } catch (error) {
      console.error("Registration Error:", error);

      setError(
        error.message || "Server error. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center text-white">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-3xl backdrop-blur">
            🛍️
          </div>

          <h1 className="text-3xl font-extrabold">
            Create Your Account
          </h1>

          <p className="mt-2 text-blue-100">
            Join ShopEase and start shopping today
          </p>
        </div>

        <div className="rounded-3xl bg-white p-7 shadow-2xl md:p-9">
          {error && (
            <div className="mb-5 rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Password
              </label>

              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={6}
                required
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-7 border-t border-gray-100 pt-6 text-center">
            <p className="text-gray-500">
              Already have an account?
            </p>

            <Link
              to="/login"
              className="mt-2 inline-block font-bold text-blue-600 transition hover:text-blue-700"
            >
              Login to your account →
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-blue-100">
          © 2026 ShopEase. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Register;