// import axios from "axios";

// export const callKhalti = async (formData, orders, req, res) => {
//   try {
//     console.log("calling khalti", formData);
//     const headers = {
//       Authorization: `Key 05bf95cc57244045b8df5fad06748dab`,
//       "Content-Type": "application/json",
//     };
//     console.log(headers);
//     const response = await axios.post(
//       "https://dev.khalti.com/api/v2/epayment/initiate/",
//       formData,
//       {
//         headers,
//       }
//     );
//     console.log("This is khalti response: ", response.data);
//     console.log(response.data.payment_url);
//     res.json({
//       message: "khalti success",
//       payment_method: "khalti",
//       data: response.data,
//       orders,
//     });
//   } catch (err) {
//     console.log(err);
//     return res.status(400).json({ error: err?.message });
//   }
// };

// export const handleKhaltiCallback = async (req, res, next) => {
//   try {
//     const {
//       txnId,
//       pidx,
//       amount,
//       purchase_order_id,
//       order_state,
//       transaction_id,
//       message,
//     } = req.query;
//     if (message) {
//       return res
//         .status(400)
//         .json({ error: message || "Error Processing Khalti" });
//     }

//     const headers = {
//       Authorization: `Key 05bf95cc57244045b8df5fad06748dab`,
//       "Content-Type": "application/json",
//     };
//     const response = await axios.post(
//       "https://a.khalti.com/api/v2/epayment/lookup/",
//       { pidx },
//       { headers }
//     );

//     console.log(response.data);
//     if (response.data.status !== "Completed") {
//       return res.status(400).json({ error: "Payment not completed" });
//     }

//     console.log("This is the id: ", purchase_order_id, order_state, pidx);
//     req.transaction_uuid = purchase_order_id;
//     req.transaction_code = pidx;
//     req.state = order_state;
//     next();
//   } catch (err) {
//     console.log(err);
//     return res
//       .status(400)
//       .json({ error: err?.message || "Error Processing Khalti" });
//   }
// };

// new code 

import axios from "axios";
import sendEmail from "../middlewares/sendEmail.js";
import { Order } from "../models/order.model.js";

// 🔁 Step 1: Initiate Khalti Payment
export const callKhalti = async (formData, orders, req, res) => {
  try {
    // console.log("calling khalti", formData);
    const headers = {
      Authorization: `Key 05bf95cc57244045b8df5fad06748dab`,
      "Content-Type": "application/json",
    };

    const response = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/initiate/",
      formData,
      { headers }
    );

    console.log("This is khalti response: ", response.data);
    res.json({
      message: "khalti success",
      payment_method: "khalti",
      data: response.data,
      orders,
    });
  } catch (err) {
    console.error("Khalti Init Error:", err);
    return res.status(400).json({ error: err?.message || "Khalti initiation failed" });
  }
};

// 🔁 Step 2: Middleware to Verify Khalti Payment
export const handleKhaltiCallback = async (req, res, next) => {
  try {
    const { pidx, purchase_order_id, message } = req.query;

    if (message) {
      return res.status(400).json({ error: message });
    }

    const headers = {
      Authorization: `Key 05bf95cc57244045b8df5fad06748dab`,
      "Content-Type": "application/json",
    };

    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      { headers }
    );

    if (response.data.status !== "Completed") {
      return res.status(400).json({ error: "Payment not completed" });
    }

    // Save to req for next step
    req.transaction_uuid = purchase_order_id;
    req.transaction_code = pidx;

    next();
  } catch (err) {
    console.error("Khalti Lookup Error:", err);
    return res.status(400).json({ error: err?.message || "Error Processing Khalti" });
  }
};

// 🔁 Step 3: Confirm Order & Send Email
export const confirmKhaltiOrder = async (req, res, next) => {
  try {
    const { transaction_uuid } = req;

    const orders = await Order.find({ trackingNumber: transaction_uuid });
    // console.log(orders)

    if (orders.length === 0) {
      return res.status(404).json({ error: "No order found for this payment." });
    }

    const { fullName, emailAddress } = orders[0];

    await sendEmail({
      email: emailAddress,
      subject: "Payment Received - Order Confirmed",
      message: `
        Dear ${fullName},

        Your payment via Khalti has been successfully processed.
        Your order #${transaction_uuid} is now confirmed.

        Thank you for choosing Survey Equipment Rental.

        Best regards,
        Survey Rental Team
      `,
    });

    next();

    // return res.status(200).json({
    //   message: "Payment confirmed and email sent.",
    //   orderTracking: transaction_uuid,
    // });
  } catch (err) {
    console.error("Confirm Order Error:", err);
    return res.status(500).json({ error: "Failed to confirm Khalti order" });
  }
};

