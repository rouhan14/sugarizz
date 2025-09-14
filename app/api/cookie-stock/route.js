import dbConnect from '@/lib/mongoose';
import CookieStock from '@/models/CookieStock';
import data from '@/data';

export async function GET() {
  try {
    await dbConnect();
    
    // Get all cookie stock records
    const stockRecords = await CookieStock.find({});
    
    // Create a map for quick lookup
    const stockMap = stockRecords.reduce((acc, record) => {
      acc[record.cookieName] = record.isOutOfStock;
      return acc;
    }, {});
    
    // Build response with all cookies from data.js and their stock status
    const cookieStockStatus = data.map(cookie => ({
      cookieName: cookie.title,
      isOutOfStock: stockMap[cookie.title] || false
    }));

    return Response.json({
      success: true,
      data: cookieStockStatus
    });

  } catch (error) {
    console.error('Error fetching cookie stock:', error);
    return Response.json({
      success: false,
      message: 'Failed to fetch cookie stock status',
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    
    const { cookieName, isOutOfStock } = await request.json();
    
    if (!cookieName) {
      return Response.json({
        success: false,
        message: 'Cookie name is required'
      }, { status: 400 });
    }
    
    // Update or create stock record
    const stockRecord = await CookieStock.findOneAndUpdate(
      { cookieName },
      { 
        isOutOfStock: !!isOutOfStock,
        lastUpdated: new Date()
      },
      { 
        upsert: true, 
        new: true 
      }
    );

    return Response.json({
      success: true,
      message: `Stock status updated for ${cookieName}`,
      data: stockRecord
    });

  } catch (error) {
    console.error('Error updating cookie stock:', error);
    return Response.json({
      success: false,
      message: 'Failed to update cookie stock status',
      error: error.message
    }, { status: 500 });
  }
}
