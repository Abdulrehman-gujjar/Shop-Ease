import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "https://shop-ease-backend-blush.vercel.app";

function AdminProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }

    fetchProducts();
  }, [token, navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/products`);

      const data = await response.json();

      console.log("Products Response:", data);

      if (!response.ok) {
        alert(data.message || "Failed to load products");
        return;
      }

      if (Array.isArray(data)) {
        setProducts(data);
      } else if (Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Fetch products error:", error);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setImageFile(null);
      setPreview("");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB");

      event.target.value = "";
      setImageFile(null);
      setPreview("");

      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image");

      event.target.value = "";
      setImageFile(null);
      setPreview("");

      return;
    }

    setImageFile(file);

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  };

  const handleAddProduct = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      alert("Please enter product name");
      return;
    }

    if (!price || Number(price) < 0) {
      alert("Please enter a valid product price");
      return;
    }

    if (!category.trim()) {
      alert("Please enter product category");
      return;
    }

    if (!imageFile) {
      alert("Please select a product image");
      return;
    }

    const formData = new FormData();

    formData.append("title", title.trim());
    formData.append("price", price);
    formData.append("category", category.trim());
    formData.append("image", imageFile);

    try {
      setUploading(true);

      const response = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      console.log("Add Product Response:", data);

      if (!response.ok) {
        alert(data.message || "Failed to add product");
        return;
      }

      alert("Product added successfully!");

      setTitle("");
      setPrice("");
      setCategory("");
      setImageFile(null);
      setPreview("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      await fetchProducts();
    } catch (error) {
      console.error("Add product error:", error);
      alert("Server error. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("Delete Product Response:", data);

      if (!response.ok) {
        alert(data.message || "Failed to delete product");
        return;
      }

      alert("Product deleted successfully!");

      await fetchProducts();
    } catch (error) {
      console.error("Delete product error:", error);
      alert("Server error while deleting product");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    navigate("/admin/login");
  };

  const getImageUrl = (thumbnail) => {
    if (!thumbnail) {
      return "/placeholder.png";
    }

    if (
      thumbnail.startsWith("http://") ||
      thumbnail.startsWith("https://")
    ) {
      return thumbnail;
    }

    return `${API_URL}/${thumbnail.replace(/^\/+/, "")}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <Link
              to="/admin"
              className="text-xl font-bold sm:text-2xl"
            >
              ShopEase Admin
            </Link>

            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-500 px-4 py-2 font-medium transition hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <Link
            to="/admin"
            className="text-blue-600 hover:underline"
          >
            ← Dashboard
          </Link>

          <h1 className="mt-4 text-3xl font-extrabold text-gray-900">
            Product Management
          </h1>

          <p className="mt-1 text-gray-500">
            Add new products or remove existing products.
          </p>
        </div>

        {/* Add Product */}
        <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Add New Product
          </h2>

          <form
            onSubmit={handleAddProduct}
            className="grid gap-5 sm:grid-cols-2"
          >
            {/* Product Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Product Name
              </label>

              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Product name"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {/* Price */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Price
              </label>

              <input
                type="number"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="100"
                min="0"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Category
              </label>

              <input
                type="text"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                placeholder="electronics"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {/* Image */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Product Image
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                className="w-full cursor-pointer rounded-xl border border-gray-200 bg-white px-4 py-3"
              />

              <p className="mt-2 text-sm text-gray-500">
                Maximum image size: 5MB.
              </p>
            </div>

            {/* Preview */}
            {preview && (
              <div className="sm:col-span-2">
                <p className="mb-3 font-semibold text-gray-700">
                  Image Preview
                </p>

                <div className="flex h-72 w-72 items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                  <img
                    src={preview}
                    alt="Product Preview"
                    className="h-full w-full object-contain"
                  />
                </div>

                <p className="mt-3 font-semibold text-green-600">
                  ✓ Image selected successfully
                </p>
              </div>
            )}

            {/* Submit */}
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={uploading}
                className="w-full rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400 sm:w-auto"
              >
                {uploading ? "Uploading..." : "+ Add Product"}
              </button>
            </div>
          </form>
        </div>

        {/* All Products */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              All Products
            </h2>

            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
              {products.length} Products
            </span>
          </div>

          {loading ? (
            <p className="text-gray-500">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-gray-500">No products found.</p>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product._id || product.id}
                  className="flex flex-col gap-4 rounded-xl border border-gray-200 p-4 sm:flex-row sm:items-center"
                >
                  {/* Image */}
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                    <img
                      src={getImageUrl(product.thumbnail)}
                      alt={product.title || "Product"}
                      onError={(event) => {
                        event.currentTarget.src = "/placeholder.png";
                      }}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  {/* Information */}
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">
                      {product.title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {product.category}
                    </p>

                    <p className="mt-1 font-bold text-blue-600">
                      ${Number(product.price || 0).toFixed(2)}
                    </p>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() =>
                      handleDelete(product._id || product.id)
                    }
                    className="rounded-lg bg-red-500 px-5 py-2.5 font-semibold text-white transition hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminProducts;