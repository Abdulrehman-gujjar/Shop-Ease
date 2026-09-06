import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import Loader from "./Loader";

function HighlightedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get(
          "https://shop-ease-backend-912xhys0i-e-commerce-e21d.vercel.app/api/products"
        );

        setProducts(response.data);
      } catch (error) {
        console.log(error);
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
      <section className="max-w-6xl mx-auto px-6 py-12 text-center">
        <p className="text-red-500 text-lg">{error}</p>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-14">
      <h2 className="text-3xl font-bold text-center mb-10">
        Featured Products
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.slice(0, 8).map((product) => (
          <ProductCard
            key={product._id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}

export default HighlightedProducts;