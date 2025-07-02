import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send order email to yourself
 */
export async function sendOrderEmail({ orderId, name, email, phoneNumber, address, cookies, totalPrice, additionalRecommendations }) {
  const cookieList = cookies
    .map((c) => `<li>${c.quantity} × ${c.name} (Rs. ${c.price})</li>`)
    .join("");

  const mailOptions = {
    from: `"SugarRizz Orders" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // send to yourself
    subject: `🧁 New Order #${orderId} Received`,
    html: `
      <h2>New Order Placed</h2>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phoneNumber}</p>
      <p><strong>Address:</strong> ${address}</p>
      <p><strong>Cookies:</strong></p>
      <ul>${cookieList}</ul>
      <p><strong>Total Price:</strong> Rs. ${totalPrice}</p>
      <p><strong>Recommendations:</strong> ${additionalRecommendations || "None"}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}