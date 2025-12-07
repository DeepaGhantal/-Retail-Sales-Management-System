import Sale from '../models/Sale.js';

export const getSalesData = async (filters = {}) => {
  const query = {};
  const sortOptions = {};

  if (filters.search) {
    query.$or = [
      { customerName: { $regex: filters.search, $options: 'i' } },
      { phoneNumber: { $regex: filters.search, $options: 'i' } }
    ];
  }

  if (filters.customerRegion?.length) query.customerRegion = { $in: filters.customerRegion };
  if (filters.gender?.length) query.gender = { $in: filters.gender };
  if (filters.productCategory?.length) query.productCategory = { $in: filters.productCategory };
  if (filters.paymentMethod?.length) query.paymentMethod = { $in: filters.paymentMethod };
  if (filters.tags?.length) query.tags = { $in: filters.tags };
  if (filters.customerType?.length) query.customerType = { $in: filters.customerType };
  if (filters.orderStatus?.length) query.orderStatus = { $in: filters.orderStatus };
  if (filters.brand?.length) query.brand = { $in: filters.brand };

  if (filters.ageRange) {
    query.age = { $gte: filters.ageRange[0], $lte: filters.ageRange[1] };
  }

  if (filters.dateRange) {
    query.date = { $gte: new Date(filters.dateRange[0]), $lte: new Date(filters.dateRange[1]) };
  }

  if (filters.sortBy === 'date_desc') sortOptions.date = -1;
  else if (filters.sortBy === 'quantity') sortOptions.quantity = -1;
  else if (filters.sortBy === 'customer_name') sortOptions.customerName = 1;

  const total = await Sale.countDocuments(query);
  const data = await Sale.find(query).sort(sortOptions).lean();

  return { data, total };
};

export const getFilterOptions = async () => {
  try {
    const [regions, genders, categories, methods, tags, customerTypes, orderStatuses, brands, ageStats] = await Promise.all([
      Sale.distinct('customerRegion'),
      Sale.distinct('gender'),
      Sale.distinct('productCategory'),
      Sale.distinct('paymentMethod'),
      Sale.distinct('tags'),
      Sale.distinct('customerType'),
      Sale.distinct('orderStatus'),
      Sale.distinct('brand'),
      Sale.aggregate([{ $group: { _id: null, min: { $min: '$age' }, max: { $max: '$age' } } }])
    ]);

    // Ensure comprehensive options with fallbacks
    return {
      customerRegion: regions.length > 0 ? regions.sort() : 
        ['North', 'South', 'East', 'West', 'Central'],
      
      gender: genders.length > 0 ? genders.sort() : 
        ['Male', 'Female', 'Other'],
      
      productCategory: categories.length > 0 ? categories.sort() : 
        ['Electronics', 'Clothing', 'Beauty', 'Home & Garden', 'Sports', 'Books'],
      
      paymentMethod: methods.length > 0 ? methods.sort() : 
        ['Credit Card', 'Debit Card', 'UPI', 'Cash', 'Net Banking', 'Wallet'],
      
      tags: tags.length > 0 ? tags.flat().sort() : 
        ['organic', 'wireless', 'cotton', 'smart', 'portable', 'fashion', 'skincare', 'gadgets'],
      
      customerType: customerTypes.length > 0 ? customerTypes.sort() : 
        ['New', 'Returning', 'Regular', 'Premium'],
      
      orderStatus: orderStatuses.length > 0 ? orderStatuses.sort() : 
        ['Completed', 'Pending', 'Cancelled', 'Returned', 'Failed'],
      
      brand: brands.length > 0 ? brands.sort() : 
        ['TechPulse', 'NovaGear', 'CyberCore', 'VoltEdge'],
      
      ageRange: { 
        min: ageStats[0]?.min || 18, 
        max: ageStats[0]?.max || 65 
      }
    };
  } catch (error) {
    // Return fallback options if database query fails
    return {
      customerRegion: ['North', 'South', 'East', 'West', 'Central'],
      gender: ['Male', 'Female', 'Other'],
      productCategory: ['Electronics', 'Clothing', 'Beauty', 'Home & Garden', 'Sports', 'Books'],
      paymentMethod: ['Credit Card', 'Debit Card', 'UPI', 'Cash', 'Net Banking', 'Wallet'],
      tags: ['organic', 'wireless', 'cotton', 'smart', 'portable', 'fashion', 'skincare', 'gadgets'],
      customerType: ['New', 'Returning', 'Regular', 'Premium'],
      orderStatus: ['Completed', 'Pending', 'Cancelled', 'Returned', 'Failed'],
      brand: ['TechPulse', 'NovaGear', 'CyberCore', 'VoltEdge'],
      ageRange: { min: 18, max: 65 }
    };
  }
};
