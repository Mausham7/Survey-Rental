import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload2 } from "../middlewares/filehandeller.middleware.js";
import { manualLogin, register } from "../controllers/auth.controller.js";
import {
  addProduct,
  getAllProducts,
  getCataProducts,
  getFlashSaleProducts,
  getProductById,
  updateFlashSale,
  updateInStock,
  updateStockNumber,
} from "../controllers/product.controller.js";
import {
  addMultipleOrders,
  addOrder,
  deleteOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderAfterPayment,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { getAllUsers, getProfile, updateProfile } from "../controllers/user.controller.js";
import { handleKhaltiCallback } from "../controllers/khalti.controller.js";
import { getNotifications } from "../controllers/notification.controller.js";

const router = Router(); //express ko routing garne package ho 

// non secure routes
router.route("/auth/login").post(manualLogin);
router.route("/auth/register").post(register);

// Secured routes
router
  .route("/admin/addproduct")
  .post(verifyJWT, upload2.single("image"), addProduct);
router.route("/admin/stockchange").post(verifyJWT, updateInStock);
router.route("/admin/updatestocknumber").post(verifyJWT, updateStockNumber);
router.route("/admin/flashsalechange").post(verifyJWT, updateFlashSale);
router.route("/admin/getallusers").get(verifyJWT, getAllUsers);

// product fetch
router.route("/user/getallproducts").get(verifyJWT, getAllProducts);
router.route("/user/getCataProducts").post(verifyJWT, getCataProducts);
router.route("/user/productbyid").post(verifyJWT, getProductById);
router.route("/user/flashsale").get(verifyJWT, getFlashSaleProducts);

//order routes
router
  .route("/user/createorder")
  .post(verifyJWT, upload2.single("image"), addOrder);
router
  .route("/user/createmultipleorders")
  .post(verifyJWT, upload2.single("image"), addMultipleOrders);
router.route("/admin/order/getallorders").get(verifyJWT, getAllOrders);
router.route("/user/order/getmyorders").get(verifyJWT, getMyOrders);
router.route("/admin/order/getorder:id").get(verifyJWT, getOrderById);
router.route("/admin/order/update").post(verifyJWT, updateOrderStatus);
router.route("/admin/order/delete:id").get(verifyJWT, deleteOrder);

//profile routes
router.route("/user/getprofile").get(verifyJWT, getProfile);
router.route("/user/updateprofile").put(verifyJWT, updateProfile);

//khalti routes

router.route("/callback").get(handleKhaltiCallback, updateOrderAfterPayment);
router.route("/user/getnotifications").get(verifyJWT, getNotifications);

export default router;
