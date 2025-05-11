import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload2 } from "../middlewares/filehandeller.middleware.js";
import { manualLogin, register, resendVerificationEmail, verifyEmail } from "../controllers/auth.controller.js";
import {
  addProduct,
  getAllProducts,
  getCataProducts,
  getFlashSaleProducts,
  getProductById,
  getRecommendedProducts,
  giveRating,
  updateFlashSale,
  updateInStock,
  updateStockNumber,
} from "../controllers/product.controller.js";
import {
  addMultipleOrders,
  addOrder,
  deleteOrder,
  extendOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderAfterPayment,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { getAllUsers, getProfile, getStats, updateProfile } from "../controllers/user.controller.js";
import { handleKhaltiCallback } from "../controllers/khalti.controller.js";
import { getNotifications, markAllNotificationsAsSeen, notificationCount } from "../controllers/notification.controller.js";
import { addToCart, cartCount, clearCart, getCart, removeFromCart, syncCart, updateCartItem } from "../controllers/cart.controller.js";
import { forgotPassword, forgotPasswordReset, verifyOtp } from "../controllers/forgotPassword.controller.js";
import { sendReturnReminders } from "../controllers/remainder.controller.js";

const router = Router();

// non secure routes
router.route("/auth/login").post(manualLogin);
router.route("/auth/register").post(register);
router.route("/verify-email/:token").get(verifyEmail);
router.route("/resend-verification").post(resendVerificationEmail);

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
router.route("/user/recommended").get(verifyJWT, getRecommendedProducts);
router.route("/user/giverating").post(verifyJWT, giveRating);

//order routes
router
  .route("/user/createorder")
  .post(verifyJWT, upload2.single("image"), addOrder);
router
  .route("/user/createmultipleorders")
  .post(verifyJWT, upload2.single("image"), addMultipleOrders);
router.route("/admin/order/getallorders").get(verifyJWT, getAllOrders);
router.route("/admin/stats").get(verifyJWT, getStats);
router.route("/user/order/getmyorders").get(verifyJWT, getMyOrders);
router.route("/admin/order/getorder:id").get(verifyJWT, getOrderById);
router.route("/admin/order/update").post(verifyJWT, updateOrderStatus);
router.route("/order/extend").post(verifyJWT, extendOrder);
router.route("/admin/order/delete:id").get(verifyJWT, deleteOrder);
router.route("/send-reminders").get(sendReturnReminders);
// router.get("/send-reminders", sendReturnReminders);

//profile routes
router.route("/user/getprofile").get(verifyJWT, getProfile);
router.route("/user/updateprofile").put(verifyJWT, updateProfile);

//khalti routes

router.route("/callback").get(handleKhaltiCallback, updateOrderAfterPayment);


//Notification routes
router.route("/user/getnotifications").get(verifyJWT, getNotifications);
router.route("/notification/count").get(verifyJWT, notificationCount);
router.route("/notification/markseen").get(verifyJWT, markAllNotificationsAsSeen);



//Cart Routes
router.route("/cart").get(verifyJWT, getCart);
router.route("/cart/count").get(verifyJWT, cartCount);
router.route("/cart/add").post(verifyJWT, addToCart);
router.route("/cart/item/:productId").put(verifyJWT, updateCartItem);
router.route("/cart/item/:productId").delete(verifyJWT, removeFromCart);
router.route("/cart").delete(verifyJWT, clearCart);
router.route("/cart/sync").post(verifyJWT, syncCart);

//OTP ROUTES
router.route("/user/forgotpassword").post(forgotPassword);
router.route("/user/verifyotp").post(verifyOtp);
router.route("/user/forgotpasswordreset").post(forgotPasswordReset);

export default router;
