// app/api/orders/route.js
import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import { getNextOrderId } from "@/lib/getNextOrderId";
import { sendOrderEmail } from "@/lib/sendOrderEmail";

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const {
      name,
      email,
      phoneNumber,
      address,
      cookies,
      deliveryZone,
      deliveryCharges,
      totalPrice,
      additionalRecommendations,
    } = body;

    // Validate required fields
    if (!name || !phoneNumber || !address || !cookies || cookies.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Missing required fields"
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Get the next order ID
    const orderId = await getNextOrderId();

    console.log("Creating order with data:", {
      orderId,
      name,
      email,
      phoneNumber,
      address,
      cookies,
      deliveryZone,
      deliveryCharges,
      totalPrice,
      additionalRecommendations,
    });

    // Create the order
    const newOrder = await Order.create({
      orderId,
      name,
      email,
      phoneNumber,
      address,
      cookies,
      deliveryZone,
      deliveryCharges,
      totalPrice,
      additionalRecommendations,
    });

    // Sending email
    await sendOrderEmail({
      orderId,
      name,
      email,
      phoneNumber,
      address,
      cookies,
      totalPrice,
      additionalRecommendations,
    });

    console.log("Order created successfully:", newOrder);

    return new Response(
      JSON.stringify({
        success: true,
        orderId: newOrder.orderId,
        message: "Order created successfully"
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Error creating order:", err);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Order creation failed",
        error: err.message
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}