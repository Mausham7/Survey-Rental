import { Order } from "../models/order.model.js";
import { Product } from "../models/product.models.js";

export const addProduct = async (req, res) => {
  // Use the correct file-upload middleware property if needed
  const imagePath = req.file ? req.file.filename : "no-image.jpg"; // default image if missing
  const { pName, detail, price, category, stock } = req.body;

  console.log("Request file:", req.file);
  console.log("Request body:", req.body);

  try {
    const product = new Product({
      pName,
      detail,
      price,
      category,
      stock: stock !== undefined ? stock : 0, // default stock if not provided
      image: imagePath,
    });
    await product.save();
    res.status(201).json({ product });
  } catch (error) {
    console.error("Error message:", error.message);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ error: "Server error " });
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
    console.log("Hit")
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

    res
      .status(200)
      .json({ message: "Product Stock updated", product });
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



