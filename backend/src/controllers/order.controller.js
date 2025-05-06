import sendEmail from "../middlewares/sendEmail.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.models.js";
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
    console.log("order data", order);
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
    if (req.body.orderStatus === "completed") {

      if (order) {
        const product = await Product.findById(order.productId);
        if (product) {
          product.stock += order.quantity;

          // Optional: If stock becomes greater than 0, mark it as inStock
          if (product.stock > 0) {
            product.inStock = true;
          }

          await product.save();
        }
      }
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
    if (req.body.orderStatus === "shipped") {
      await sendEmail({
        email: order.emailAddress,
        subject: "Your Order has been shipped!",
        message: `
              Dear ${order.fullName},
              
              We have shipped your order. Thank you for choosing Us!
              
              Best regards,
              Your Survey Rental Team
            `,
      });
    }
    if (req.body.orderStatus === "delivered") {
      await sendEmail({
        email: order.emailAddress,
        subject: "Your Order has been delivered!",
        message: `
              Dear ${order.fullName},
              
              We have delivered your order on your location. Thank you for choosing Us!
              
              Best regards,
              Your Survey Rental Team
            `,
      });
    }

    

    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    console.error("Update Order Error:", error);
    res.status(500).json({ error: "Failed to update order" });
  }
};

export const extendOrder = async (req, res) => {
  try {
    const { orderId, extendDays, additionalAmount } = req.body;
    console.log(req.body);

    // Validate input
    if (!orderId || !extendDays || !additionalAmount) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Update the order
    order.days += Number(extendDays);
    order.total += Number(additionalAmount);
    await order.save();
    console.log(order);

    const formData = {
      return_url: "http://localhost:4000/api/v1/callback",
      website_url: "http://localhost:4000",
      amount: additionalAmount * 100, //paisa
      purchase_order_id: order.trackingNumber,
      order_state: "new",
      purchase_order_name: "test",
    };
    console.log(formData);
    const admins = await User.find({ role: "admin" });
    for (const admin of admins) {
      await createNotification({
        recipientId: admin._id,
        recipientModel: "User",
        orderId: order.trackingNumber,
        type: "order_placed",
        title: "Order Extended",
        isRead: false,
        message: `Order of tracking number: #${order.trackingNumber} has been extended by ${req.user.fullName}.`,
      });
    }
    callKhalti(formData, order, req, res);

    // res.status(200).json({
    //   message: "Order extended successfully.",
    //   updatedOrder: order,
    // });
  } catch (error) {
    console.error("Error extending order:", error);
    res.status(500).json({ message: "Server error." });
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
    products, // stringified JSON array
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

  const imagePath = req.uploadedFileName || null;
  const trackingNumber = generateTrackingNumber();

  try {
    // Validate presence of all required fields
    if (
      !products ||
      !paymentMethod ||
      !fullName ||
      !citizenID ||
      !streetAddress ||
      !townCity ||
      !phone ||
      !email ||
      !totalAmount ||
      !imagePath
    ) {
      return res.status(400).json({
        error:
          "All fields including products, paymentMethod, fullName, citizenID, streetAddress, townCity, phone, email, totalAmount, and image are required.",
      });
    }

    // Parse and validate products
    let parsedProducts =
      typeof products === "string" ? JSON.parse(products) : products;

    if (!Array.isArray(parsedProducts) || parsedProducts.length === 0) {
      return res
        .status(400)
        .json({ error: "At least one product is required." });
    }

    // Validate each product in the array
    for (const product of parsedProducts) {
      const requiredFields = [
        "productId",
        "quantity",
        "days",
        "total",
        "pName",
        "detail",
      ];
      const missingFields = requiredFields.filter((field) => !product[field]);
      if (missingFields.length > 0) {
        return res.status(400).json({
          error: `Each product must include: ${requiredFields.join(
            ", "
          )}. Missing: ${missingFields.join(", ")}`,
        });
      }
    }

    // Save all orders
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

      // 🔥 Update product stock after order is saved
      const product = await Product.findById(item.productId);
      if (product) {
        product.stock -= item.quantity;

        // Optional: If stock goes to 0 or below, mark as out of stock
        if (product.stock <= 0) {
          product.stock = 0;
          product.inStock = false;
        }

        await product.save();
      }
    }

    // ✅ Create notification for customer
    await createNotification({
      recipientId: req.user._id,
      recipientModel: "User",
      orderId: trackingNumber,
      type: "order_placed",
      isRead: false,
      title: "Order Placed Successfully",
      message: `Your order #${trackingNumber} has been placed successfully.`,
    });

    // ✅ Notify all admins
    const admins = await User.find({ role: "admin" });
    for (const admin of admins) {
      await createNotification({
        recipientId: admin._id,
        recipientModel: "User",
        orderId: trackingNumber,
        type: "order_placed",
        title: "New Order Received",
        isRead: false,
        message: `New order #${trackingNumber} placed by ${req.user.fullName}.`,
      });
    }
    await sendEmail({
      email: email,
      subject: "Thank you for placing Order!",
      message: `
            Dear ${fullName},
            
            We have received your order. Thank you for choosing Us!
            
            Best regards,
            Your Survey Rental Team
          `,
    });

    // ✅ Handle payment
    if (paymentMethod === "khalti") {
      const formData = {
        return_url: "http://localhost:4000/api/v1/callback",
        website_url: "http://localhost:4000",
        amount: totalAmount * 100, // paisa
        purchase_order_id: trackingNumber,
        order_state: "new",
        purchase_order_name: "survey rental",
      };
      return callKhalti(formData, orders, req, res);
    }

    // ✅ Return success
    return res
      .status(201)
      .json({ message: "Order created successfully", orders });
  } catch (error) {
    console.error("Multiple Order Error:", error);
    return res.status(500).json({ error: "Failed to place orders" });
  }
};

export const updateOrderAfterPayment = async (req, res, next) => {
  try {
    console.log(req.body);

    const { transaction_uuid, transaction_code } = req;

    const result = await Order.updateMany(
      { trackingNumber: transaction_uuid },
      {
        $set: {
          paymentStatus: "paid",
          transaction_code: transaction_code,
        },
      }
    );

    

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
