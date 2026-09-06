import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

  // =========================
  // CHECK ADMIN LOGIN
  // =========================

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }

    fetchProducts();
  }, [token, navigate]);

  // =========================
  // GET PRODUCTS
  // =========================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/products"
      );

      const data = await response.json();

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

  // =========================
  // IMAGE SELECT
  // =========================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setImageFile(null);
      setPreview("");
      return;
    }

    // Maximum 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB");

      e.target.value = "";
      setImageFile(null);
      setPreview("");

      return;
    }

    // Check image type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image");

      e.target.value = "";
      setImageFile(null);
      setPreview("");

      return;
    }

    setImageFile(file);

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  };

  // =========================
  // ADD PRODUCT
  // =========================

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter product name");
      return;
    }

    if (!price) {
      alert("Please enter product price");
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

    // IMPORTANT:
    // Backend multer field name must be "image"
    formData.append("image", imageFile);

    try {
      setUploading(true);

      const response = await fetch(
        "http://localhost:5000/api/products",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to add product");
        return;
      }

      alert("Product added successfully!");

      // Clear form
      setTitle("");
      setPrice("");
      setCategory("");
      setImageFile(null);
      setPreview("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Reload products
      fetchProducts();
    } catch (error) {
      console.error("Add product error:", error);
      alert("Server error. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // =========================
  // DELETE PRODUCT
  // =========================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete product");
        return;
      }

      alert("Product deleted successfully!");

      fetchProducts();
    } catch (error) {
      console.error("Delete product error:", error);
      alert("Server error");
    }
  };

  // =========================
  // ADMIN LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");

    navigate("/admin/login");
  };

  // =========================
  // PRODUCT IMAGE URL
  // =========================

  const getImageUrl = (thumbnail) => {
    if (!thumbnail) {
      return "";
    }

    // If image is already a complete URL
    if (
      thumbnail.startsWith("http://") ||
      thumbnail.startsWith("https://")
    ) {
      return thumbnail;
    }

    // If backend stores /uploads/filename
    return `http://localhost:5000${thumbnail.startsWith("/") ? "" : "/"}${thumbnail}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ================= HEADER ================= */}

      <header className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div className="h-16 flex items-center justify-between">

            <Link
              to="/admin"
              className="text-xl sm:text-2xl font-bold"
            >
              ShopEase Admin
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-medium transition"
            >
              Logout
            </button>

          </div>

        </div>
      </header>

      {/* ================= MAIN ================= */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Page Heading */}

        <div className="mb-8">

          <Link
            to="/admin"
            className="text-blue-600 hover:underline"
          >
            ← Dashboard
          </Link>

          <h1 className="text-3xl font-extrabold text-gray-900 mt-4">
            Product Management
          </h1>

          <p className="text-gray-500 mt-1">
            Add new products or remove existing products.
          </p>

        </div>

        {/* ================= ADD PRODUCT ================= */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-8">

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Add New Product
          </h2>

          <form
            onSubmit={handleAddProduct}
            className="grid sm:grid-cols-2 gap-5"
          >

            {/* Product Name */}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Name
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Product name"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
              />
            </div>

            {/* Price */}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price
              </label>

              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="100"
                min="0"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
              />
            </div>

            {/* Category */}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>

              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="electronics"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
              />
            </div>

            {/* Image Upload */}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Image
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white cursor-pointer"
              />

              <p className="text-sm text-gray-500 mt-2">
                Select an image from your computer. Maximum 5MB.
              </p>
            </div>

            {/* Image Preview */}

            {preview && (
              <div className="sm:col-span-2">

                <p className="font-semibold text-gray-700 mb-3">
                  Image Preview
                </p>

                <div className="w-72 h-72 border border-gray-200 rounded-2xl bg-gray-50 overflow-hidden flex items-center justify-center">

                  <img
                    src={preview}
                    alt="Product Preview"
                    className="w-full h-full object-contain"
                  />

                </div>

                <p className="text-green-600 font-semibold mt-3">
                  ✓ Image selected successfully
                </p>

              </div>
            )}

            {/* Add Button */}

            <div className="sm:col-span-2">

              <button
                type="submit"
                disabled={uploading}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-xl font-semibold transition"
              >
                {uploading ? "Uploading..." : "+ Add Product"}
              </button>

            </div>

          </form>

        </div>

        {/* ================= ALL PRODUCTS ================= */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-2xl font-bold text-gray-900">
              All Products
            </h2>

            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
              {products.length} Products
            </span>

          </div>

          {/* Loading */}

          {loading ? (
            <p className="text-gray-500">
              Loading products...
            </p>
          ) : products.length === 0 ? (

            <p className="text-gray-500">
              No products found.
            </p>

          ) : (

            <div className="space-y-4">

              {products.map((product) => (

                <div
                  key={product._id || product.id}
                  className="border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row gap-4 sm:items-center"
                >

                  {/* Product Image */}

                  <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">

                    {product.thumbnail ? (
                      <img
                        src={getImageUrl(product.thumbnail)}
                        alt={product.title}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">
                        No Image
                      </span>
                    )}

                  </div>

                  {/* Product Information */}

                  <div className="flex-1">

                    <h3 className="font-bold text-gray-900">
                      {product.title}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {product.category}
                    </p>

                    <p className="text-blue-600 font-bold mt-1">
                      ${Number(product.price).toFixed(2)}
                    </p>

                  </div>

                  {/* Delete */}

                  <button
                    onClick={() =>
                      handleDelete(product._id || product.id)
                    }
                    className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold transition"
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