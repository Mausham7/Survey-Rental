import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload2 } from "../middlewares/filehandeller.middleware.js";
import { manualLogin, register } from "../controllers/auth.controller.js";
import {
  addProduct,
  getAllProducts,
  getFlashSaleProducts,
  getProductById,
  updateFlashSale,
  updateInStock,
} from "../controllers/product.controller.js";
import {
  addOrder,
  deleteOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/order.controller.js";

const router = Router();

// non secure routes
router.route("/auth/login").post(manualLogin);
router.route("/auth/register").post(register);




// Secured routes
router
  .route("/admin/addproduct")
  .post(verifyJWT, upload2.single("image"), addProduct);
router.route("/admin/stockchange").post(verifyJWT, updateInStock);
router.route("/admin/flashsalechange").post(verifyJWT, updateFlashSale);

// product fetch
router.route("/user/getallproducts").get(verifyJWT, getAllProducts);
router.route("/user/productbyid").post(verifyJWT, getProductById);
router.route("/user/flashsale").get(verifyJWT, getFlashSaleProducts);

//order routes
router
  .route("/user/createorder")
  .post(verifyJWT, upload2.single("image"), addOrder);
router.route("/admin/order/getallorders").get(verifyJWT, getAllOrders);
router.route("/user/order/getmyorders").get(verifyJWT, getMyOrders);
router.route("/admin/order/getorder:id").get(verifyJWT, getOrderById);
router.route("/admin/order/update").post(verifyJWT, updateOrderStatus);
router.route("/admin/order/delete:id").get(verifyJWT, deleteOrder);

export default router;
