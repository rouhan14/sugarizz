// Utility functions for order calculations

export const calculateCookieQuantities = (cookies) => {
  const quantities = {
    classic: 0,
    double: 0,
    hazelnut: 0,
    redVelvet: 0,
    cookiesAndCream: 0,
    peanutButter: 0,
    walnut: 0,
    kunafa: 0
  };

  cookies.forEach(cookie => {
    const name = cookie.name || cookie.title;
    const quantity = cookie.quantity || 0;
    
    // Map cookie names to our standardized names
    const nameMapping = {
      'Classic Chocolate': 'classic',
      'Classic': 'classic',
      'Double Chocolate': 'double',
      'Double': 'double',
      'Hazelnut': 'hazelnut',
      'Red Velvet': 'redVelvet',
      'Cookies and Cream': 'cookiesAndCream',
      'Cookies & Cream': 'cookiesAndCream',
      'Peanut Butter': 'peanutButter',
      'Walnut': 'walnut',
      'Kunafa': 'kunafa'
    };

    const mappedName = nameMapping[name] || name.toLowerCase().replace(/\s+/g, '');
    if (quantities.hasOwnProperty(mappedName)) {
      quantities[mappedName] += quantity;
    } else if (quantities.hasOwnProperty(mappedName.replace(/chocolate/g, ''))) {
      quantities[mappedName.replace(/chocolate/g, '')] += quantity;
    }
  });

  return quantities;
};

export const calculateMaterialCost = (cookieQuantities, costPrices) => {
  if (!costPrices || Object.keys(costPrices).length === 0) return 0;
  
  return (
    (cookieQuantities.classic || 0) * (costPrices.classic || 0) +
    (cookieQuantities.double || 0) * (costPrices.double || 0) +
    (cookieQuantities.hazelnut || 0) * (costPrices.hazelnut || 0) +
    (cookieQuantities.redVelvet || 0) * (costPrices.redVelvet || 0) +
    (cookieQuantities.cookiesAndCream || 0) * (costPrices.cookiesAndCream || 0) +
    (cookieQuantities.peanutButter || 0) * (costPrices.peanutButter || 0) +
    (cookieQuantities.walnut || 0) * (costPrices.walnut || 0) +
    (cookieQuantities.kunafa || 0) * (costPrices.kunafa || 0)
  );
};

export const calculateWebsiteOrderProfit = (order, riderPayment = 0, costPrices = {}) => {
  // Revenue = Total order amount - rider payment
  const revenue = (order.totalPrice || 0) - riderPayment;
  
  // Get cookie quantities from the order
  const cookieQuantities = calculateCookieQuantities(order.cookies || []);
  
  // Calculate material cost
  const materialCost = calculateMaterialCost(cookieQuantities, costPrices);
  
  // Gross profit = Revenue - Material costs
  const grossProfit = revenue - materialCost;
  
  return {
    revenue,
    materialCost,
    grossProfit,
    cookieQuantities
  };
};
