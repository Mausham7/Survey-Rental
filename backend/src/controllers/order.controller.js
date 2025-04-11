import { Order } from "../models/order.model.js";
import { User } from "../models/user.models.js";
import { callKhalti } from "./khalti.controller.js";
import { createNotification } from "./notification.controller.js";

function generateTrackingNumber() {
  const prefix = "REC";
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
  const randomString = Math.random().toString(36).substr(2, 8).toUpperCase(); // 8-character random alphanumeric
  return `${prefix}-${date}-${randomString}`;
}

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
  const trackingNumber = generateTrackingNumber();
  console.log("trackingNumber", trackingNumber);

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
      trackingNumber,
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
    if (
      req.body.orderStatus == "delivered" ||
      req.body.orderStatus == "completed"
    ) {
      order.paymentStatus = "paid";
    }
    await order.save(); // Save the updated product

    const customerNotification = {
      recipientId: order.userId,
      recipientModel: "User",
      orderId: order._id,
      type: "order_status_change",
      isRead: false,
      title: `Order Status Changed`,
      message: `Your order status with trackingNumber #${order?.trackingNumber.toString()} has been changed to ${
        order.orderStatus
      }.`,
    };

    await createNotification(customerNotification);

    res.status(200).json({ message: "Order status updated", order });
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

export const addMultipleOrders = async (req, res) => {
  const {
    products, // array of products (expected as an array)
    paymentMethod,
    fullName,
    citizenID,
    streetAddress,
    coordinates,
    townCity,
    phone,
    email,
    totalAmount,
  } = req.body;

  console.log(req.body);
  console.log(req.body.fullName);
  const imagePath = req.uploadedFileName || null;
  const trackingNumber = generateTrackingNumber();
  console.log("trackingNumber", trackingNumber);

  try {
    // Check if products is a string; if so, parse it into an array.
    let parsedProducts = products;
    if (typeof products === "string") {
      parsedProducts = JSON.parse(products);
    }

    const orders = [];

    for (const item of parsedProducts) {
      const order = new Order({
        userId: req.user._id,
        productId: item.productId,
        paymentMethod,
        deliveryDate: item.deliveryDate,
        fullName,
        citizenID,
        streetAddress,
        coordinates,
        townCity,
        phone,
        emailAddress: email,
        quantity: item.quantity,
        days: item.days,
        total: item.total,
        image: imagePath,
        pName: item.pName,
        detail: item.detail,
        trackingNumber,
      });

      const savedOrder = await order.save();
      orders.push(savedOrder);
    }

    const customerNotification = {
      recipientId: req.user._id,
      recipientModel: "User",
      orderId: trackingNumber,
      type: "order_placed",
      isRead: false,
      title: "Order Placed Successfully",
      message: `Your order #${trackingNumber.toString()} has been placed successfully.`,
    };

    await createNotification(customerNotification);

    const admins = await User.find({ role: "admin" });

    for (const admin of admins) {
      const adminNotification = {
        recipientId: admin._id,
        recipientModel: "User",
        orderId: trackingNumber,
        type: "order_placed",
        title: "New Order Received",
        isRead: false,
        message: `New order #${trackingNumber.toString()} has been placed by ${
          req.user.fullName
        }.`,
      };
      await createNotification(adminNotification);
    }

    if (paymentMethod === "khalti") {
      console.log(paymentMethod);
      const formData = {
        return_url: "http://localhost:4000/api/v1/callback",
        website_url: "http://localhost:4000",
        amount: totalAmount * 100, //paisa
        purchase_order_id: trackingNumber,
        purchase_order_name: "test",
      };
      console.log(formData);
      callKhalti(formData, orders, req, res);
    } else if (paymentMethod === "COD") {
      res.status(201).json("order created successfully");
    }
  } catch (error) {
    console.error("Multiple Order Error:", error);
    res.status(500).json({ error: "Failed to place orders" });
  }
};

export const updateOrderAfterPayment = async (req, res, next) => {
  try {
    console.log(req.body);

    const { transaction_uuid, transaction_code } = req.body;

    const result = await Order.updateMany(
      { trackingNumber: transaction_uuid },
      {
        $set: {
          paymentStatus: "paid",
          transaction_code: transaction_code,
        },
      }
    );

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ error: "No matching orders found to update." });
    }

    // const customerNotification = {
    //   recipientId: req.user._id,
    //   recipientModel: "User",
    //   orderId: transaction_uuid,
    //   type: type,
    //   isRead: false,
    // };

    // console.log(customerNotification);

    res.redirect("http://localhost:5173/myorders");
  } catch (err) {
    return res
      .status(400)
      .json({ error: err?.message || "Error updating orders" });
  }
};
