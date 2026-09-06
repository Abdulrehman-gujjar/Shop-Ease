import { Link } from "react-router-dom";

const categories = [
  {
    name: "Electronics",
    icon: "📱",
    value: "electronics",
  },
  {
    name: "Fashion",
    icon: "👕",
    value: "fashion",
  },
  {
    name: "Shoes",
    icon: "👟",
    value: "shoes",
  },
  {
    name: "Watches",
    icon: "⌚",
    value: "watches",
  },
  {
    name: "Accessories",
    icon: "👜",
    value: "accessories",
  },
  {
    name: "Beauty",
    icon: "💄",
    value: "beauty",
  },
];

function Categories() {
  return (
    <section className="max-w-7xl mx-auto py-14 sm:py-16 px-4 sm:px-6">

      {/* Heading */}
      <div className="text-center mb-10">

        <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
          Browse Collection
        </span>

        <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-gray-900">
          Shop by Category
        </h2>

        <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
          Explore our popular categories and find exactly what you're looking for.
        </p>

      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">

        {categories.map((item) => (
          <Link
            key={item.name}
            to={`/shop?category=${item.value}`}
            className="group bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 transition-all duration-300"
          >

            {/* Icon */}
            <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-2xl bg-blue-50 text-3xl group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300">
              {item.icon}
            </div>

            {/* Name */}
            <h3 className="mt-4 font-semibold text-gray-800 group-hover:text-blue-600 transition">
              {item.name}
            </h3>

          </Link>
        ))}

      </div>

    </section>
  );
}

export default Categories;