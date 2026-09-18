import { Link } from "react-router-dom";

const categories = [
  {
    name: "Electronics",
    icon: "📱",
    value: "Electronics",
  },
  {
    name: "Mens Wear",
    icon: "👕",
    value: "Mens wear",
  },
  {
    name: "Shoes",
    icon: "👟",
    value: "Shoes",
  },
  {
    name: "Watches",
    icon: "⌚",
    value: "Watches",
  },
  {
    name: "Accessories",
    icon: "👜",
    value: "Accessories",
  },
  {
    name: "Beauty",
    icon: "💄",
    value: "Beauty",
  },
];

function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16">
      {/* Heading */}
      <div className="mb-10 text-center">
        <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
          Browse Collection
        </span>

        <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Shop by Category
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-gray-500">
          Explore our popular categories and find exactly what you're looking
          for.
        </p>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-6">
        {categories.map((item) => (
          <Link
            key={item.value}
            to={`/shop?category=${encodeURIComponent(item.value)}`}
            className="group rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
          >
            {/* Icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-600">
              {item.icon}
            </div>

            {/* Name */}
            <h3 className="mt-4 font-semibold text-gray-800 transition group-hover:text-blue-600">
              {item.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Categories;