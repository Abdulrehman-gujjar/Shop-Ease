import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

const API_URL = "https://shop-ease-backend-blush.vercel.app";

const Shop = () => {
  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/products`);

        if (!response.ok) {
          throw new Error(`Products API Error: ${response.status}`);
        }

        const data = await response.json();

        const allProducts = Array.isArray(data)
          ? data
          : data.products || data.data || [];

        const filteredProducts = selectedCategory
          ? allProducts.filter((product) => {
              const productCategory = product.category
                ?.trim()
                .toLowerCase();

              const categoryFromUrl = selectedCategory
                .trim()
                .toLowerCase();

              return productCategory === categoryFromUrl;
            })
          : allProducts;

        setProducts(filteredProducts);
      } catch (error) {
        console.error("Products loading error:", error);
        setError("Products load nahi ho rahe. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-16 text-center">
        <p className="mb-4 text-red-600">{error}</p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-10">
        <p className="mb-2 text-sm font-bold uppercase tracking-widest text-blue-600">
          ShopEase Collection
        </p>

        <h1 className="text-3xl font-bold capitalize text-gray-900 sm:text-4xl">
          {selectedCategory || "All Products"}
        </h1>

        <p className="mt-3 text-gray-500">
          Explore our latest products.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl bg-gray-50 px-6 py-16 text-center">
          <h2 className="text-xl font-bold text-gray-800">
            No products found
          </h2>

          <p className="mt-2 text-gray-500">
            Is category mein abhi koi product available nahi.
          </p>

          <a
            href="/shop"
            className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            View All Products
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Shop;