import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "dhakalmausham41@gmail.com",
      pass: "ntgkjeqiqyldehix",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const message = {
    from: `surveyrental@maushamdhakal.com<${"delivery@maushamdhakal.com"}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  try {
    const info = await transporter.sendMail(message);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};

export default sendEmail;
