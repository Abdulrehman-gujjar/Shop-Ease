function Footer() {
  return (
    <footer className="bg-gray-950 text-white mt-16">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-extrabold">
              Shop<span className="text-blue-500">Ease</span>
            </h2>

            <p className="mt-4 text-gray-400 leading-7">
              Your simple and reliable online shopping destination for
              quality products at great prices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Quick Links
            </h3>

            <div className="space-y-3 text-gray-400">
              <p className="hover:text-white cursor-pointer transition">Home</p>
              <p className="hover:text-white cursor-pointer transition">Shop</p>
              <p className="hover:text-white cursor-pointer transition">Cart</p>
              <p className="hover:text-white cursor-pointer transition">Login</p>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Categories
            </h3>

            <div className="space-y-3 text-gray-400">
              <p className="hover:text-white cursor-pointer transition">Electronics</p>
              <p className="hover:text-white cursor-pointer transition">Fashion</p>
              <p className="hover:text-white cursor-pointer transition">Shoes</p>
              <p className="hover:text-white cursor-pointer transition">Beauty</p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Contact Us
            </h3>

            <div className="space-y-3 text-gray-400">
              <p>📧 support@shopease.com</p>
              <p>📞 +92 300 1234567</p>
              <p>📍 Pakistan</p>
            </div>
          </div>

        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 text-center text-gray-500 text-sm">
          © 2026 ShopEase. All Rights Reserved.
        </div>
      </div>

    </footer>
  );
}

export default Footer;