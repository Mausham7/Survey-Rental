import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.models.js";

// Get user's cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming req.user is set by your auth middleware

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = { userId, items: [] }; // Return empty cart if none exists
    }

    return res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error("Error getting cart:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve cart",
      error: error.message,
    });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id; // From auth middleware
    const { productId, quantity, days, deliveryDate } = req.body;

    if (!productId || !quantity || !days) {
      return res.status(400).json({
        success: false,
        message: "Product ID, quantity, and rental days are required",
      });
    }

    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Not enough stock available",
      });
    }

    // Find or create user's cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Check if item already exists in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    const price = product.price;
    const total = price * quantity * days;

    if (itemIndex > -1) {
      // Update existing item
      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].days = days;
      cart.items[itemIndex].total = total;
      cart.items[itemIndex].price = price;
      cart.items[itemIndex].deliveryDate =
        deliveryDate || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    } else {
      // Add new item
      cart.items.push({
        productId,
        quantity,
        days,
        price,
        total,
        pName: product.pName,
        detail: product.detail || "",
        deliveryDate:
          deliveryDate || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        image: product.image,
      });
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Item added to cart",
      data: cart,
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add item to cart",
      error: error.message,
    });
  }
};

// Update cart item
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const { quantity, days, deliveryDate } = req.body;

    // Find user's cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Find the item in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    // Update item properties if provided
    if (quantity !== undefined) {
      cart.items[itemIndex].quantity = quantity;
    }

    if (days !== undefined) {
      cart.items[itemIndex].days = days;
    }

    if (deliveryDate !== undefined) {
      cart.items[itemIndex].deliveryDate = deliveryDate;
    }

    // Recalculate total
    cart.items[itemIndex].total =
      cart.items[itemIndex].price *
      cart.items[itemIndex].quantity *
      cart.items[itemIndex].days;

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart item updated",
      data: cart,
    });
  } catch (error) {
    console.error("Error updating cart item:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update cart item",
      error: error.message,
    });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Filter out the item to remove
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: cart,
    });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove item from cart",
      error: error.message,
    });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = [];
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared",
      data: cart,
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to clear cart",
      error: error.message,
    });
  }
};

// Sync local cart with database (for initial login/merge)
export const syncCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: "Valid items array is required",
      });
    }

    // Find or create user's cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Process each item from local storage
    for (const item of items) {
      const { productId, quantity, days, deliveryDate } = item;

      // Validate product exists
      const product = await Product.findById(productId);
      if (!product) continue;

      // Check stock availability
      if (product.stock < quantity) continue;

      // Check if item already exists in cart
      const itemIndex = cart.items.findIndex(
        (i) => i.productId.toString() === productId
      );

      const price = product.price;
      const total = price * quantity * days;

      if (itemIndex > -1) {
        // Merge with existing item (take higher quantity)
        cart.items[itemIndex].quantity = Math.max(
          cart.items[itemIndex].quantity,
          quantity
        );
        cart.items[itemIndex].days = days;
        cart.items[itemIndex].price = price;
        cart.items[itemIndex].total =
          price * cart.items[itemIndex].quantity * days;
        cart.items[itemIndex].deliveryDate = deliveryDate;
      } else {
        // Add new item
        cart.items.push({
          productId,
          quantity,
          days,
          price,
          total,
          pName: product.pName,
          detail: product.detail || "",
          deliveryDate,
          image: product.image,
        });
      }
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart synchronized",
      data: cart,
    });
  } catch (error) {
    console.error("Error syncing cart:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to sync cart",
      error: error.message,
    });
  }
};

export const cartCount = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(200).json({ count: 0 });
    }

    const count = cart.items.length;
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching cart count:", error);
    res.status(500).json({ message: "Server error" });
  }
};

