// pages/api/orders.js (or app/api/orders/route.js for App Router)
import { sendOrderEmail } from '@/lib/sendOrderEmail';

export async function POST(request) {
  try {
    const orderData = await request.json();
    
    // Validate required fields
    if (!orderData.name || !orderData.email || !orderData.phoneNumber || 
        !orderData.userInputAddress || !orderData.cookies || orderData.cookies.length === 0) {
      return Response.json({
        success: false,
        message: 'Missing required fields'
      }, { status: 400 });
    }

    // Generate unique order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // Prepare complete order data
    const completeOrderData = {
      orderId,
      ...orderData
    };

    // Send email notification
    await sendOrderEmail(completeOrderData);

    return Response.json({
      success: true,
      message: 'Order placed successfully',
      orderId
    });

  } catch (error) {
    console.error('Order processing error:', error);
    return Response.json({
      success: false,
      message: 'Failed to process order. Please try again.'
    }, { status: 500 });
  }
}