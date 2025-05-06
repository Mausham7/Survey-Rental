import { Order } from "../models/order.model.js";
import { Product } from "../models/product.models.js";

export const addProduct = async (req, res) => {
  const imagePath = req.uploadedFileName || null;
  console.log(imagePath);

  const { pName, detail, price, category, stock } = req.body;
  console.log(req.body);
  try {
    let product = new Product({
      pName,
      detail,
      price,
      category,
      stock,
      image: imagePath,
    });
    await product.save();
    console.log(product);
    res.status(201).json({ product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Fetch all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }); // Fetch all products
    res.status(200).json({ products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};
export const getCataProducts = async (req, res) => {
  try {
    console.log("Hit");
    const products = await Product.find().sort({ createdAt: -1 }); // Fetch all products
    res.status(200).json({ products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getFlashSaleProducts = async (req, res) => {
  try {
    const products = await Product.find({ inFlashSale: true }).sort({
      createdAt: -1,
    }); // Fetch all products
    res.status(200).json({ products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Fetch product by ID
export const getProductById = async (req, res) => {
  const { productId } = req.body; // Get product ID from the request params
  console.log(productId);
  try {
    const product = await Product.findById(productId); // Find product by ID
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Change inStock to true or false
export const updateInStock = async (req, res) => {
  const { productId } = req.body; // Get product ID from request params
  const { inStock } = req.body; // Get the inStock value from request body

  try {
    const product = await Product.findById(productId); // Find product by ID
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    product.inStock = inStock; // Update inStock value
    await product.save(); // Save the updated product

    res
      .status(200)
      .json({ message: "Product inStock status updated", product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};
export const updateStockNumber = async (req, res) => {
  const { productId } = req.body; // Get product ID from request params
  const { stock } = req.body; // Get the inStock value from request body

  try {
    const product = await Product.findById(productId); // Find product by ID
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    product.stock = stock; // Update inStock value
    await product.save(); // Save the updated product

    res.status(200).json({ message: "Product Stock updated", product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Change inStock to true or false
export const updateFlashSale = async (req, res) => {
  const { productId } = req.body; // Get product ID from request params
  const { inFlashSale } = req.body; // Get the inStock value from request body

  try {
    const product = await Product.findById(productId); // Find product by ID
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    product.inFlashSale = inFlashSale; // Update inStock value
    await product.save(); // Save the updated product

    res
      .status(200)
      .json({ message: "Product inFlashSale status updated", product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const giveRating = async (req, res) => {
  console.log(req.body)
  try {
    const { productId, rating } = req.body;

    if (!productId || typeof rating !== "number" || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({
          message: "Invalid productId or rating (must be between 1 and 5).",
        });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Calculate new average rating
    const totalRating = product.rating * product.NumberOfReview;
    const newTotalRating = totalRating + rating;
    const newNumberOfReview = product.NumberOfReview + 1;

    product.rating = newTotalRating / newNumberOfReview;
    product.NumberOfReview = newNumberOfReview;

    await product.save();

    res.status(200).json({ message: "Rating submitted successfully", product });
  } catch (error) {
    console.error("Error giving rating:", error);
    res.status(500).json({ message: "Server error" });
  }
};
