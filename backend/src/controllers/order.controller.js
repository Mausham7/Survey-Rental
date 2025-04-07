import { Order } from "../models/order.model.js";

// CREATE - Add a new order
export const addOrder = async (req, res) => {
  const {
    productId,
    paymentMethod,
    deliveryDate,
    fullName,
    citizenID,
    streetAddress,
    coordinates,
    townCity,
    phone,
    email,
    quantity,
    days,
    total,
    pName,
    detail,
  } = req.body;

  console.log("Order Body:", req.body);
  const imagePath = req.uploadedFileName || null;
  console.log(imagePath);

  try {
    const order = new Order({
      userId: req.user._id,
      productId,
      paymentMethod,
      deliveryDate,
      fullName,
      citizenID,
      streetAddress,
      coordinates,
      townCity,
      phone,
      email,
      quantity,
      days,
      total,
      image: imagePath,
      pName,
      detail,
    });

    await order.save();
    res.status(201).json({ order });
  } catch (error) {
    console.error("Order Creation Error:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

// READ - Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("userId").populate("productId");
    res.status(200).json(orders);
  } catch (error) {
    console.error("Get Orders Error:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate("productId")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// READ - Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId")
      .populate("productId");
    if (!order) return res.status(404).json({ error: "Order not found" });

    res.status(200).json(order);
  } catch (error) {
    console.error("Get Order Error:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

// UPDATE - Update an order
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.body.orderId); // Find product by ID
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.orderStatus = req.body.orderStatus; // Update inStock value
    await order.save(); // Save the updated product

    res
      .status(200)
      .json({ message: "Order status updated", order });
  } catch (error) {
    console.error("Update Order Error:", error);
    res.status(500).json({ error: "Failed to update order" });
  }
};

// DELETE - Delete an order
export const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder)
      return res.status(404).json({ error: "Order not found" });

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Delete Order Error:", error);
    res.status(500).json({ error: "Failed to delete order" });
  }
};
