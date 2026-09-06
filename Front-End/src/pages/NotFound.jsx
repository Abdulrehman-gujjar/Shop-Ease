import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">

      <div className="text-center max-w-lg">

        {/* 404 */}
        <div className="relative">

          <h1 className="text-[120px] md:text-[160px] font-extrabold leading-none text-blue-600/10">
            404
          </h1>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-7xl md:text-8xl">
              🔍
            </span>
          </div>

        </div>

        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">
          Page Not Found
        </h2>

        <p className="text-gray-500 mt-4 leading-7">
          Sorry, the page you are looking for doesn't exist
          or may have been moved.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">

          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-xl font-bold transition shadow-md"
          >
            ← Go Home
          </Link>

          <Link
            to="/shop"
            className="border border-gray-300 hover:border-blue-600 hover:text-blue-600 bg-white px-7 py-3 rounded-xl font-bold transition"
          >
            Browse Shop
          </Link>

        </div>

      </div>

    </div>
  );
}

export default NotFound;