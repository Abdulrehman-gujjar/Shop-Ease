import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import Loader from "./Loader";

const API_URL = "https://shop-ease-backend-blush.vercel.app";

function HighlightedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/products`
        );

        const productData = response.data.products || response.data;

        setProducts(productData);
      } catch (error) {
        console.error("Products error:", error);

        setError("Products load nahi ho rahe.");
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <section className="mx-auto max-w-6xl px-6 py-12 text-center">
        <p className="text-lg text-red-500">{error}</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <h2 className="mb-10 text-center text-3xl font-bold">
        Featured Products
      </h2>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">
          No products found.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 8).map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default HighlightedProducts;