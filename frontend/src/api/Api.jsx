
const location = "http://localhost:4000"
const url = `${location}/api/v1`;

// http://localhost:3000/api/v1/auth/login

export const imageUrl = location
export const manual_login = `${url}/auth/login`
export const resend_verification = `${url}/resend-verification`
export const manual_register = `${url}/auth/register`
export const add_product = `${url}/admin/addproduct`
export const getAllProducts = `${url}/user/getallproducts`
export const getCataProducts = `${url}/user/getCataProducts`
export const getFlashSaleProducts = `${url}/user/flashsale`
export const getRecommendedProducts = `${url}/user/recommended`
export const getProductById = `${url}/user/productbyid`
export const updateInStock = `${url}/admin/stockchange`
export const editStock = `${url}/admin/updatestocknumber`
export const updateInFlashSale = `${url}/admin/flashsalechange`
export const create_order = `${url}/user/createorder`
export const create_multiple_order = `${url}/user/createmultipleorders`
export const get_all_orders = `${url}/admin/order/getallorders`
export const get_my_orders = `${url}/user/order/getmyorders`
export const update_order = `${url}/admin/order/update`
export const extend_order = `${url}/order/extend`
export const get_notification = `${url}/user/getnotifications`
export const notification_count = `${url}/notification/count`
export const notification_markseen = `${url}/notification/markseen`
export const cart_count = `${url}/cart/count`
export const get_All_Users = `${url}/admin/getallusers`
export const admin_stats = `${url}/admin/stats`
export const rate_order = `${url}/user/giverating`


export const get_profile = `${url}/user/getprofile`
export const update_profile = `${url}/user/updateprofile`

// Cart Routes
export const get_cart = `${url}/cart`;
export const add_to_cart = `${url}/cart/add`;
export const update_cart_item = (productId) => `${url}/cart/item/${productId}`;
export const remove_from_cart = (productId) => `${url}/cart/item/${productId}`;
export const clear_cart = `${url}/cart`;
export const sync_cart = `${url}/cart/sync`;

//forgot password
export const forgot_password = `${url}/user/forgotpassword`;
export const verify_opt = `${url}/user/verifyotp`;
export const password_reset = `${url}/user/forgotpasswordreset`;

//practice
export const add_practice_data =`${url}/practice/add`

