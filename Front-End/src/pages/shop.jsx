import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

function Shop() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams, setSearchParams] =
    useSearchParams();

  // =========================================
  // CATEGORY MAPPING
  // =========================================

  const categoryGroups = {
    electronics: [
      "smartphones",
      "laptops",
      "tablets",
      "mobile-accessories",
    ],

    fashion: [
      "mens-shirts",
      "womens-dresses",
      "tops",
      "mens-shirts",
      "womens-dresses",
    ],

    shoes: [
      "mens-shoes",
      "womens-shoes",
    ],

    watches: [
      "mens-watches",
      "womens-watches",
    ],

    accessories: [
      "womens-bags",
      "womens-jewellery",
      "sunglasses",
      "accessories",
    ],

    beauty: [
      "beauty",
      "skin-care",
      "fragrances",
    ],
  };

  // =========================================
  // GET CATEGORY FROM URL
  // =========================================

  useEffect(() => {
    const urlCategory =
      searchParams.get("category");

    if (urlCategory) {
      setCategory(urlCategory);
    } else {
      setCategory("all");
    }
  }, [searchParams]);

  // =========================================
  // GET PRODUCTS
  // =========================================

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          "http://localhost:5000/api/products"
        );

        setProducts(response.data);
      } catch (error) {
        console.error(
          "Products Error:",
          error
        );

        setError(
          "Unable to load products."
        );
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  // =========================================
  // REAL DATABASE CATEGORIES
  // =========================================

  const categories = useMemo(() => {
    return [
      "all",
      ...new Set(
        products
          .map(
            (product) =>
              product.category
          )
          .filter(Boolean)
      ),
    ];
  }, [products]);

  // =========================================
  // FILTER PRODUCTS
  // =========================================

  const filteredProducts = useMemo(() => {
    let result = products.filter(
      (product) => {
        const title =
          product.title || "";

        const productCategory =
          String(
            product.category || ""
          ).toLowerCase();

        // Search
        const matchesSearch =
          title
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );

        // Category
        let matchesCategory = true;

        if (category === "all") {
          matchesCategory = true;
        } else if (
          categoryGroups[category]
        ) {
          matchesCategory =
            categoryGroups[
              category
            ].includes(
              productCategory
            );
        } else {
          matchesCategory =
            productCategory ===
            category.toLowerCase();
        }

        return (
          matchesSearch &&
          matchesCategory
        );
      }
    );

    // =======================================
    // SORT
    // =======================================

    if (sort === "low") {
      result.sort(
        (a, b) =>
          Number(a.price) -
          Number(b.price)
      );
    }

    if (sort === "high") {
      result.sort(
        (a, b) =>
          Number(b.price) -
          Number(a.price)
      );
    }

    if (sort === "rating") {
      result.sort(
        (a, b) =>
          Number(b.rating || 0) -
          Number(a.rating || 0)
      );
    }

    return result;
  }, [
    products,
    search,
    category,
    sort,
  ]);

  // =========================================
  // CHANGE CATEGORY
  // =========================================

  const handleCategoryChange = (
    value
  ) => {
    setCategory(value);

    if (value === "all") {
      setSearchParams({});
    } else {
      setSearchParams({
        category: value,
      });
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return <Loader />;
  }

  // =========================================
  // ERROR
  // =========================================

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">

        <div className="text-center">

          <h2 className="text-2xl font-bold text-red-500">
            {error}
          </h2>

          <p className="text-gray-500 mt-2">
            Make sure your backend server is running.
          </p>

        </div>

      </div>
    );
  }

  // =========================================
  // PAGE
  // =========================================

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* ================================= */}
      {/* HEADING */}
      {/* ================================= */}

      <div className="text-center mb-10">

        <p className="text-blue-600 font-semibold uppercase tracking-wider text-sm">
          Our Collection
        </p>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
          Shop All Products
        </h1>

        <p className="text-gray-500 mt-3">
          Find exactly what you're looking for.
        </p>

      </div>

      {/* ================================= */}
      {/* FILTERS */}
      {/* ================================= */}

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* SEARCH */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Products
            </label>

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search products..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* CATEGORY */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>

            <select
              value={category}
              onChange={(e) =>
                handleCategoryChange(
                  e.target.value
                )
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
            >

              <option value="all">
                All Categories
              </option>

              <option value="electronics">
                Electronics
              </option>

              <option value="fashion">
                Fashion
              </option>

              <option value="shoes">
                Shoes
              </option>

              <option value="watches">
                Watches
              </option>

              <option value="accessories">
                Accessories
              </option>

              <option value="beauty">
                Beauty
              </option>

              {/* Actual database categories */}
              {categories
                .filter(
                  (item) =>
                    item !== "all"
                )
                .map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}

            </select>

          </div>

          {/* SORT */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>

            <select
              value={sort}
              onChange={(e) =>
                setSort(
                  e.target.value
                )
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
            >

              <option value="default">
                Default
              </option>

              <option value="low">
                Price: Low to High
              </option>

              <option value="high">
                Price: High to Low
              </option>

              <option value="rating">
                Highest Rated
              </option>

            </select>

          </div>

        </div>

      </div>

      {/* ================================= */}
      {/* RESULT COUNT */}
      {/* ================================= */}

      <div className="flex items-center justify-between mb-6">

        <p className="text-gray-600">

          Showing{" "}

          <span className="font-semibold text-gray-900">
            {filteredProducts.length}
          </span>{" "}

          products

        </p>

      </div>

      {/* ================================= */}
      {/* PRODUCTS */}
      {/* ================================= */}

      {filteredProducts.length ===
      0 ? (
        <div className="text-center py-20">

          <div className="text-5xl mb-4">
            🔍
          </div>

          <h2 className="text-2xl font-bold text-gray-700">
            No products found
          </h2>

          <p className="text-gray-500 mt-2">
            Try another search or category.
          </p>

        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {filteredProducts.map(
            (product) => (
              <ProductCard
                key={
                  product._id ||
                  product.id
                }
                product={product}
              />
            )
          )}

        </div>
      )}

    </section>
  );
}

export default Shop;