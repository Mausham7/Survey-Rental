// reminderController.js
import sendEmail from "../middlewares/sendEmail.js";
import { Order } from "../models/order.model.js";

// Controller function to check and send return date reminders
export const sendReturnReminders = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentTime = currentDate.getHours();
    
    // Only execute if it's around 6 PM (between 5:30 PM and 6:30 PM)
    // You can adjust or remove this check if you're using a cron job
    if (currentTime < 17 || currentTime > 19) {
      return res.status(200).json({
        success: true,
        message: "Not execution time. Reminders are sent at 6 PM only.",
      });
    }

    // Get today's date at the start of the day
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate tomorrow and day after tomorrow dates (at start of day)
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    
    // Calculate the end of tomorrow and day after tomorrow
    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(23, 59, 59, 999);
    
    const dayAfterTomorrowEnd = new Date(dayAfterTomorrow);
    dayAfterTomorrowEnd.setHours(23, 59, 59, 999);

    // Find orders due tomorrow that haven't received a 1-day reminder
    const oneDayAwayOrders = await Order.find({
      orderStatus: { $nin: ["completed", "cancelled"] },
      deliveryDate: { $gte: tomorrow, $lte: tomorrowEnd },
      "reminderSent.oneDayReminder": false
    });

    // Find orders due day after tomorrow that haven't received a 2-day reminder
    const twoDaysAwayOrders = await Order.find({
      orderStatus: { $nin: ["completed", "cancelled"] },
      deliveryDate: { $gte: dayAfterTomorrow, $lte: dayAfterTomorrowEnd },
      "reminderSent.twoDayReminder": false
    });

    console.log(`Found ${oneDayOrders.length} orders due tomorrow`);
    console.log(`Found ${twoDayOrders.length} orders due in 2 days`);

    let oneDayEmailsSent = 0;
    let twoDayEmailsSent = 0;

    // Send 1-day reminder emails
    for (const order of oneDayAwayOrders) {
      const returnDate = order.deliveryDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      await sendEmail({
        email: order.emailAddress,
        subject: "🔔 REMINDER: Your Rental Return Is Due Tomorrow",
        message: `
Dear ${order.fullName},

This is a friendly reminder that your rental item "${order.pName}" is due for return TOMORROW (${returnDate}).

Order Details:
- Product: ${order.pName}
- Tracking Number: ${order.trackingNumber}
- Quantity: ${order.quantity}
- Return Address: Our store location

Please ensure that the item is returned in good condition to avoid any additional charges.

If you have any questions or need an extension, please contact our customer service immediately at ${order.phone}.

Thank you for choosing our rental service!

Best regards,
The Rental Team
        `
      });

      // Update the order to mark that the reminder has been sent
      await Order.findByIdAndUpdate(order._id, {
        "reminderSent.oneDayReminder": true
      });

      oneDayEmailsSent++;
    }

    // Send 2-day reminder emails
    for (const order of twoDaysAwayOrders) {
      const returnDate = order.deliveryDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      await sendEmail({
        email: order.emailAddress,
        subject: "🔔 REMINDER: Your Rental Return Is Due in 2 Days",
        message: `
Dear ${order.fullName},

This is a friendly reminder that your rental item "${order.pName}" is due for return in 2 DAYS (${returnDate}).

Order Details:
- Product: ${order.pName}
- Tracking Number: ${order.trackingNumber}
- Quantity: ${order.quantity}
- Return Address: Our store location

Please ensure that the item is returned in good condition to avoid any additional charges.

If you have any questions or need an extension, please contact our customer service immediately at ${order.phone}.

Thank you for choosing our rental service!

Best regards,
The Rental Team
        `
      });

      // Update the order to mark that the reminder has been sent
      await Order.findByIdAndUpdate(order._id, {
        "reminderSent.twoDayReminder": true
      });

      twoDayEmailsSent++;
    }

    return res.status(200).json({
      success: true,
      message: `Reminder emails sent successfully: ${oneDayEmailsSent} one-day reminders and ${twoDayEmailsSent} two-day reminders.`,
    });
  } catch (error) {
    console.error("Error sending reminder emails:", error);
    return res.status(500).json({
      success: false,
      message: "Error sending reminder emails",
      error: error.message,
    });
  }
};