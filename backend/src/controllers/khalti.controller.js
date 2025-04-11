import axios from "axios";

export const callKhalti = async (formData, orders, req, res) => {
  try {
    console.log("calling khalti", formData);
    const headers = {
      Authorization: `Key 05bf95cc57244045b8df5fad06748dab`,
      "Content-Type": "application/json",
    };
    console.log(headers);
    const response = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/initiate/",
      formData,
      {
        headers,
      }
    );
    console.log("This is khalti response: ", response.data);
    console.log(response.data.payment_url);
    res.json({
      message: "khalti success",
      payment_method: "khalti",
      data: response.data,
      orders,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: err?.message });
  }
};

export const handleKhaltiCallback = async (req, res, next) => {
  try {
    const { txnId, pidx, amount, purchase_order_id, transaction_id, message } =
      req.query;
    if (message) {
      return res
        .status(400)
        .json({ error: message || "Error Processing Khalti" });
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

    console.log(response.data);
    if (response.data.status !== "Completed") {
      return res.status(400).json({ error: "Payment not completed" });
    }

    console.log("This is the id: ", purchase_order_id, pidx);
    req.transaction_uuid = purchase_order_id;
    req.transaction_code = pidx;
    next();
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ error: err?.message || "Error Processing Khalti" });
  }
};
