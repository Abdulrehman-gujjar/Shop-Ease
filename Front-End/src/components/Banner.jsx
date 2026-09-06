import { Link } from "react-router-dom";

function Banner() {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 md:py-20 grid md:grid-cols-2 gap-10 lg:gap-16 items-center">

        {/* Content */}
        <div className="text-center md:text-left">
          <span className="inline-block px-4 py-2 mb-5 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
            Welcome to ShopEase
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
            Shop Smart.
            <span className="block text-blue-600">
              Live Better.
            </span>
          </h1>

          <p className="mt-5 max-w-xl mx-auto md:mx-0 text-base sm:text-lg text-gray-600 leading-7">
            Discover quality products at amazing prices and enjoy a simple,
            fast and convenient shopping experience.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
            >
              Shop Now
            </Link>

            <Link
              to="/shop"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl border-2 border-gray-200 bg-white text-gray-800 font-semibold hover:border-blue-500 hover:text-blue-600 transition"
            >
              Explore Products
            </Link>
          </div>
        </div>

        {/* Image */}
        <div className="relative">
          <div className="absolute -inset-4 bg-blue-200/30 rounded-3xl blur-2xl"></div>

          <img
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900"
            alt="ShopEase featured product"
            className="relative w-full h-[320px] sm:h-[400px] object-cover rounded-3xl shadow-2xl"
          />
        </div>

      </div>
    </section>
  );
}

export default Banner;