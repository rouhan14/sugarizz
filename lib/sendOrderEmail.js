// services/emailService.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Generate beautiful HTML email template
 */
function generateOrderEmailHTML({
  orderId,
  name,
  email,
  phoneNumber,
  userInputAddress,
  resolvedAddress,
  coordinates,
  cookies,
  deliveryCharges,
  finalPrice,
  totalPrice,
  additionalRecommendations,
  paymentMethod,
  eta
}) {
  const cookieList = cookies
    .map((c) => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 12px; text-align: left;">
              <div style="font-weight: 600; color: #1f2937;">${c.name}</div>
              <div style="font-size: 14px; color: #6b7280;">Rs. ${c.price} each</div>
            </div>
          </div>
        </td>
        <td style="padding: 12px; text-align: center; font-weight: 600; color: #1f2937;">${c.quantity}</td>
        <td style="padding: 12px; text-align: right; font-weight: 600; color: #059669;">Rs. ${c.price * c.quantity}</td>
      </tr>
    `)
    .join("");

  // const subtotal = cookies.reduce((acc, c) => acc + (c.price * c.quantity), 0);
  const subtotal = finalPrice;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order - SugarRizz</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background-color: #f9fafb; line-height: 1.6;">
      <div style="max-width: 800px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">🧁 New Order Received!</h1>
          <p style="color: #e9d5ff; margin: 10px 0 0 0; font-size: 16px;">Order #${orderId}</p>
        </div>

        <!-- Customer Information -->
        <div style="padding: 30px;">
          <div style="background-color: #f3f4f6; border-left: 4px solid #3b82f6; padding: 20px; margin-bottom: 25px; border-radius: 0 8px 8px 0;">
            <h2 style="margin: 0 0 15px 0; color: #1f2937; font-size: 20px; font-weight: 600;">👤 Customer Details</h2>
            <div style="display: grid; gap: 8px;">
              <div><strong style="color: #374151;">Name:</strong> <span style="color: #1f2937;">${name}</span></div>
              <div><strong style="color: #374151;">Email:</strong> <span style="color: #1f2937;">${email}</span></div>
              <div><strong style="color: #374151;">Phone:</strong> <span style="color: #1f2937;">${phoneNumber}</span></div>
            </div>
          </div>

          <!-- Delivery Addresses -->
          <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 20px; margin-bottom: 25px; border-radius: 0 8px 8px 0;">
            <h2 style="margin: 0 0 15px 0; color: #1f2937; font-size: 20px; font-weight: 600;">📍 Delivery Information</h2>
            
            <div style="margin-bottom: 15px;">
              <h3 style="margin: 0 0 8px 0; color: #374151; font-size: 16px; font-weight: 600;">Customer Entered Address:</h3>
              <div style="background-color: #ffffff; padding: 12px; border-radius: 6px; border: 1px solid #d1d5db;">
                <p style="margin: 0; color: #1f2937; line-height: 1.5;">${userInputAddress}</p>
              </div>
            </div>

            ${resolvedAddress ? `
            <div style="margin-bottom: 15px;">
              <h3 style="margin: 0 0 8px 0; color: #374151; font-size: 16px; font-weight: 600;">Verified/Location-based Address:</h3>
              <div style="background-color: #ffffff; padding: 12px; border-radius: 6px; border: 1px solid #d1d5db;">
                <p style="margin: 0; color: #1f2937; line-height: 1.5;">${resolvedAddress}</p>
              </div>
            </div>
            ` : ''}

            ${coordinates ? `
            <div>
              <h3 style="margin: 0 0 8px 0; color: #374151; font-size: 16px; font-weight: 600;">GPS Coordinates:</h3>
              <div style="background-color: #ffffff; padding: 12px; border-radius: 6px; border: 1px solid #d1d5db;">
                <p style="margin: 0; color: #1f2937;">Latitude: ${coordinates.lat}, Longitude: ${coordinates.lng}</p>
                <a href="https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}" target="_blank" style="color: #3b82f6; text-decoration: none; font-weight: 500;">📍 View on Google Maps</a>
              </div>
            </div>
            ` : ''}

            ${paymentMethod ? `
            <div>
              <h3 style="margin: 0 0 8px 0; color: #374151; font-size: 16px; font-weight: 600;">Payment Method:</h3>
              <div style="background-color: #ffffff; padding: 12px; border-radius: 6px; border: 1px solid #d1d5db;">
                <p style="margin: 0; color: #1f2937;">Payment Method: ${paymentMethod}</p>
              </div>
            </div>
            ` : ''}
            
            ${eta ? `
            <div>
              <h3 style="margin: 0 0 8px 0; color: #374151; font-size: 16px; font-weight: 600;">Delivery Time:</h3>
              <div style="background-color: #ffffff; padding: 12px; border-radius: 6px; border: 1px solid #d1d5db;">
                <p style="margin: 0; color: #1f2937;">${eta}</p>
              </div>
            </div>
            ` : ''}
          </div>

          <!-- Order Items -->
          <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin-bottom: 25px; border-radius: 0 8px 8px 0;">
            <h2 style="margin: 0 0 15px 0; color: #1f2937; font-size: 20px; font-weight: 600;">🛍️ Order Items</h2>
            <div style="background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #d1d5db;">
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #f9fafb;">
                    <th style="padding: 15px; text-align: left; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">Item</th>
                    <th style="padding: 15px; text-align: center; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">Qty</th>
                    <th style="padding: 15px; text-align: right; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${cookieList}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Order Summary -->
          <div style="background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin-bottom: 25px; border-radius: 0 8px 8px 0;">
            <h2 style="margin: 0 0 15px 0; color: #1f2937; font-size: 20px; font-weight: 600;">💰 Order Summary</h2>
            <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #d1d5db;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px; padding-bottom: 8px;">
                <span style="color: #374151; font-weight: 500;">Subtotal:</span>
                <span style="color: #1f2937; font-weight: 600;">Rs. ${subtotal}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px; padding-bottom: 8px;">
                <span style="color: #374151; font-weight: 500;">Delivery Charges:</span>
                <span style="color: #1f2937; font-weight: 600;">Rs. ${deliveryCharges}</span>
              </div>
              <hr style="border: none; border-top: 2px solid #e5e7eb; margin: 15px 0;">
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #1f2937; font-weight: 700; font-size: 18px;">Total Amount:</span>
                <span style="color: #059669; font-weight: 700; font-size: 20px;">Rs. ${totalPrice}</span>
              </div>
            </div>
          </div>

          ${additionalRecommendations ? `
          <!-- Additional Notes -->
          <div style="background-color: #fdf4ff; border-left: 4px solid #c084fc; padding: 20px; margin-bottom: 25px; border-radius: 0 8px 8px 0;">
            <h2 style="margin: 0 0 15px 0; color: #1f2937; font-size: 20px; font-weight: 600;">📝 Additional Notes</h2>
            <div style="background-color: #ffffff; padding: 15px; border-radius: 6px; border: 1px solid #d1d5db;">
              <p style="margin: 0; color: #1f2937; line-height: 1.5; font-style: italic;">"${additionalRecommendations}"</p>
            </div>
          </div>
          ` : ''}

          <!-- Action Required -->
          <div style="background-color: #fee2e2; border-left: 4px solid #ef4444; padding: 20px; border-radius: 0 8px 8px 0;">
            <h2 style="margin: 0 0 10px 0; color: #dc2626; font-size: 18px; font-weight: 600;">⚡ Action Required</h2>
            <p style="margin: 0; color: #7f1d1d; font-weight: 500;">Please process this order and contact the customer to confirm delivery details.</p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #1f2937; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
          <p style="color: #9ca3af; margin: 0; font-size: 14px;">
            This is an automated notification from SugarRizz Order Management System
          </p>
          <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 12px;">
            Order received at ${new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Karachi',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })} PKT
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Send order email to yourself with beautiful template
 */
export async function sendOrderEmail(orderData) {
  const htmlContent = generateOrderEmailHTML(orderData);

  const mailOptions = {
    from: `"SugarRizz Orders" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `🧁 New Order #${orderData.orderId} - Rs. ${orderData.totalPrice}`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Order email sent successfully for order #${orderData.orderId}`);
  } catch (error) {
    console.error("Error sending order email:", error);
    throw error;
  }
}