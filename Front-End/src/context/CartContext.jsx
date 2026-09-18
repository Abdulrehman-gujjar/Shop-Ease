import { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const isLoggedIn = Boolean(localStorage.getItem("token"));
    const savedCart = isLoggedIn ? localStorage.getItem("cart") : null;
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    if (localStorage.getItem("token")) {
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cart]);

  useEffect(() => {
    const handleAuthChange = () => {
      if (!localStorage.getItem("token")) {
        setCart([]);
        localStorage.removeItem("cart");
      }
    };

    window.addEventListener("authChange", handleAuthChange);
    return () => window.removeEventListener("authChange", handleAuthChange);
  }, []);

  const addToCart = (product) => {
    setCart((previousCart) => {
      const productId = product._id || product.id;

      const existingProduct = previousCart.find(
        (item) => (item._id || item.id) === productId
      );

      if (existingProduct) {
        return previousCart.map((item) =>
          (item._id || item.id) === productId
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...previousCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (id) => {
    setCart((previousCart) =>
      previousCart.filter(
        (item) => (item._id || item.id) !== id
      )
    );
  };

  const increaseQuantity = (id) => {
    setCart((previousCart) =>
      previousCart.map((item) =>
        (item._id || item.id) === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          (item._id || item.id) === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Clear cart after successful order
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const cartCount = cart.reduce(
    (total, item) => total + Number(item.quantity),
    0
  );

  const cartTotal = cart.reduce(
    (total, item) =>
      total + Number(item.price) * Number(item.quantity),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;