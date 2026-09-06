const Order = require("../models/Order");

// Create order
const createOrder = async (req, res) => {
  try {
    const {
      items,
      totalPrice,
      shippingAddress,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Order must contain at least one product",
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        message: "Shipping address is required",
      });
    }

    const {
      fullName,
      phone,
      address,
      city,
      postalCode,
      country,
    } = shippingAddress;

    if (
      !fullName ||
      !phone ||
      !address ||
      !city ||
      !postalCode ||
      !country
    ) {
      return res.status(400).json({
        message: "Please provide complete shipping information",
      });
    }

    const order = await Order.create({
      user: req.user._id,

      items,

      totalPrice: Number(totalPrice),

      shippingAddress: {
        fullName,
        phone,
        address,
        city,
        postalCode,
        country,
      },

      // New orders start as Pending
      status: "Pending",
    });

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
};


// Customer: get my orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to get orders",
      error: error.message,
    });
  }
};


// Customer: get single order
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product")
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (
      order.user._id.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not authorized to view this order",
      });
    }

    res.status(200).json(order);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to get order",
      error: error.message,
    });
  }
};


// Admin: get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to get all orders",
      error: error.message,
    });
  }
};


// Admin: update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.status = status;

    await order.save();

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to update order status",
      error: error.message,
    });
  }
};


module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};