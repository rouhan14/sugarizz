import { sendOrderEmail } from '@/lib/sendOrderEmail';
import { getNextOrderId } from '@/lib/getNextOrderId';
import dbConnect from '@/lib/mongoose';
import Order from '@/models/Order';
import { calculateCookieQuantities, calculateMaterialCost } from '@/utils/orderCalculations';
import { CostPrices } from '@/models/Settings';

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

    console.log('Connecting to database...');
    // Connect to database
    await dbConnect();
    console.log('Database connected successfully');

    console.log('Getting next order ID...');
    // Generate numeric order ID
    const numericOrderId = await getNextOrderId();
    console.log('Generated order ID:', numericOrderId);

    // Get cost prices for material cost calculation
    const costPricesDoc = await CostPrices.findOne({});
    const costPrices = costPricesDoc || {};

    // Calculate cookie quantities and material costs
    const cookieQuantities = calculateCookieQuantities(orderData.cookies);
    const materialPackagingCost = calculateMaterialCost(cookieQuantities, costPrices);
    
    // Calculate rider payment: deliveryCharges + 150
    const riderPayment = (orderData.deliveryCharges || 0) + 150;
    const revenue = orderData.totalPrice - riderPayment;
    const grossProfit = revenue - materialPackagingCost;

    // Prepare order data for database (matching the Order schema)
    const dbOrderData = {
      orderId: numericOrderId,
      name: orderData.name,
      email: orderData.email,
      phoneNumber: orderData.phoneNumber,
      userInputAddress: orderData.userInputAddress,
      resolvedAddress: orderData.resolvedAddress,
      coordinates: orderData.coordinates,
      cookies: orderData.cookies.map(cookie => ({
        name: cookie.name,
        price: cookie.price,
        quantity: cookie.quantity,
        image: cookie.image,
        title: cookie.title
      })),
      deliveryZone: orderData.deliveryZone,
      deliveryCharges: orderData.deliveryCharges || 0,
      subtotal: orderData.subtotal,
      paymentMethod: orderData.paymentMethod,
      paymentDiscount: orderData.paymentDiscount || 0,
      finalPrice: orderData.finalPrice,
      appliedVoucher: orderData.appliedVoucher,
      voucherDiscount: orderData.voucherDiscount || 0,
      finalPriceWithVoucher: orderData.finalPriceWithVoucher,
      totalPrice: orderData.totalPrice,
      estimatedDeliveryTime: orderData.estimatedDeliveryTime,
      eta: orderData.eta,
      distanceFromStore: orderData.distanceFromStore,
      orderTime: orderData.orderTime,
      additionalRecommendations: orderData.additionalRecommendations || '',
      
      // Auto-calculated fields
      riderPayment: riderPayment,
      materialPackagingCost: materialPackagingCost,
      revenue: revenue,
      grossProfit: grossProfit,
      adminNotes: ''
    };

    console.log('Saving order to database...');
    // Save order to database
    const savedOrder = await Order.create(dbOrderData);
    console.log('Order saved successfully:', savedOrder._id);

    // Prepare complete order data for email (with string orderId for display)
    const completeOrderData = {
      orderId: `ORD-${numericOrderId}`,
      ...orderData,
      dbOrderId: savedOrder._id
    };

    console.log('Sending email notification...');
    // Send email notification
    await sendOrderEmail(completeOrderData);
    console.log('Email sent successfully');

    return Response.json({
      success: true,
      message: 'Order placed successfully',
      orderId: `ORD-${numericOrderId}`,
      dbOrderId: savedOrder._id
    });

  } catch (error) {
    console.error('Order processing error:', error);
    return Response.json({
      success: false,
      message: 'Failed to process order. Please try again.',
      error: error.message
    }, { status: 500 });
  }
}