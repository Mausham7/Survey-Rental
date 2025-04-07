
const location = "http://localhost:4000"
const url = `${location}/api/v1`;

// http://localhost:3000/api/v1/auth/login

export const imageUrl = location
export const manual_login = `${url}/auth/login`
export const manual_register = `${url}/auth/register`
export const add_product = `${url}/admin/addproduct`
export const getAllProducts = `${url}/user/getallproducts`
export const getCataProducts = `${url}/user/getCataProducts`
export const getFlashSaleProducts = `${url}/user/flashsale`
export const getProductById = `${url}/user/productbyid`
export const updateInStock = `${url}/admin/stockchange`
export const editStock = `${url}/admin/updatestocknumber`
export const updateInFlashSale = `${url}/admin/flashsalechange`
export const create_order = `${url}/user/createorder`
export const get_all_orders = `${url}/admin/order/getallorders`
export const get_my_orders = `${url}/user/order/getmyorders`
export const update_order = `${url}/admin/order/update`

