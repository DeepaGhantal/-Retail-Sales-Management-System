import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let salesData = [];
let filterOptionsCache = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
let cacheTimestamp = 0;

export const loadData = async () => {
  if (salesData.length > 0) return salesData;
  
  return new Promise((resolve, reject) => {
    const dataPath = path.join(__dirname, '../../data/sales_data.csv');
    const results = [];

    fs.createReadStream(dataPath)
      .pipe(csv())
      .on('data', (data) => {
        // Normalize and validate data on load
        const normalized = {
          ...data,
          Age: parseInt(data.Age) || 0,
          Quantity: parseInt(data.Quantity) || 0,
          'Price per Unit': parseFloat(data['Price per Unit']) || 0,
          'Discount Percentage': parseFloat(data['Discount Percentage']) || 0,
          'Total Amount': parseFloat(data['Total Amount']) || 0,
          'Final Amount': parseFloat(data['Final Amount']) || 0,
          Date: new Date(data.Date)
        };
        results.push(normalized);
      })
      .on('end', () => {
        salesData = results;
        console.log(`Loaded ${salesData.length} records`);
        resolve(salesData);
      })
      .on('error', reject);
  });
};

export const getSalesData = (filters = {}, page = 1, limit = 10) => {
  const filterFunctions = [];

  // Build filter chain for better performance
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filterFunctions.push(item => 
      item['Customer Name']?.toLowerCase().includes(searchLower) ||
      item['Phone Number']?.includes(filters.search)
    );
  }

  if (filters.customerRegion?.length) {
    const regionSet = new Set(filters.customerRegion);
    filterFunctions.push(item => regionSet.has(item['Customer Region']));
  }

  if (filters.gender?.length) {
    const genderSet = new Set(filters.gender);
    filterFunctions.push(item => genderSet.has(item['Gender']));
  }

  if (filters.ageMin || filters.ageMax) {
    const min = parseInt(filters.ageMin) || 0;
    const max = parseInt(filters.ageMax) || 999;
    filterFunctions.push(item => item.Age >= min && item.Age <= max);
  }

  if (filters.productCategory?.length) {
    const categorySet = new Set(filters.productCategory);
    filterFunctions.push(item => categorySet.has(item['Product Category']));
  }

  if (filters.tags?.length) {
    const tagSet = new Set(filters.tags);
    filterFunctions.push(item => {
      const itemTags = item['Tags']?.split(',').map(t => t.trim()) || [];
      return itemTags.some(tag => tagSet.has(tag));
    });
  }

  if (filters.paymentMethod?.length) {
    const methodSet = new Set(filters.paymentMethod);
    filterFunctions.push(item => methodSet.has(item['Payment Method']));
  }

  if (filters.dateStart || filters.dateEnd) {
    const start = filters.dateStart ? new Date(filters.dateStart) : new Date('1900-01-01');
    const end = filters.dateEnd ? new Date(filters.dateEnd) : new Date('2100-01-01');
    filterFunctions.push(item => item.Date >= start && item.Date <= end);
  }

  if (filters.customerType?.length) {
    const typeSet = new Set(filters.customerType);
    filterFunctions.push(item => typeSet.has(item['Customer Type']));
  }

  if (filters.orderStatus?.length) {
    const statusSet = new Set(filters.orderStatus);
    filterFunctions.push(item => statusSet.has(item['Order Status']));
  }

  if (filters.brand?.length) {
    const brandSet = new Set(filters.brand);
    filterFunctions.push(item => brandSet.has(item['Brand']));
  }

  // Apply all filters in single pass
  let filtered = salesData.filter(item => 
    filterFunctions.every(fn => fn(item))
  );

  // Sorting with optimized comparisons
  if (filters.sortBy) {
    const sortFn = getSortFunction(filters.sortBy);
    filtered.sort(sortFn);
  }

  // Pagination
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const paginatedData = filtered.slice(startIndex, startIndex + limit);

  return {
    data: paginatedData,
    pagination: {
      currentPage: page,
      totalPages,
      totalRecords: total,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
};

const getSortFunction = (sortBy) => {
  switch (sortBy) {
    case 'date_desc':
      return (a, b) => b.Date - a.Date;
    case 'quantity':
      return (a, b) => b.Quantity - a.Quantity;
    case 'customer_name':
      return (a, b) => a['Customer Name'].localeCompare(b['Customer Name']);
    case 'amount_desc':
      return (a, b) => b['Final Amount'] - a['Final Amount'];
    default:
      return () => 0;
  }
};

export const getFilterOptions = () => {
  const now = Date.now();
  
  // Return cached result if still valid
  if (filterOptionsCache && (now - cacheTimestamp) < CACHE_TTL) {
    return filterOptionsCache;
  }

  if (salesData.length === 0) {
    filterOptionsCache = {
      customerRegion: ['Central', 'East', 'North', 'South', 'West'],
      gender: ['Female', 'Male'],
      productCategory: ['Beauty', 'Clothing', 'Electronics'],
      tags: ['accessories', 'beauty', 'casual', 'cotton', 'fashion', 'formal', 'fragrance-free', 'gadgets', 'makeup', 'organic', 'portable', 'skincare', 'smart', 'unisex', 'wireless'],
      paymentMethod: ['Cash', 'Credit Card', 'Debit Card', 'Net Banking', 'UPI', 'Wallet'],
      customerType: ['Loyal', 'New', 'Returning'],
      orderStatus: ['Cancelled', 'Completed', 'Pending', 'Returned'],
      brand: ['ComfortLine', 'CyberCore', 'EliteWear', 'GlowEssence', 'NovaGear', 'PureBloom', 'SilkSkin', 'StreetLayer', 'TechPulse', 'UrbanWeave', 'VelvetTouch', 'VoltEdge'],
      ageRange: { min: 18, max: 65 }
    };
    cacheTimestamp = now;
    return filterOptionsCache;
  }

  // Optimized single-pass extraction with Maps for better performance
  const extractors = {
    regions: new Set(),
    genders: new Set(),
    categories: new Set(),
    tags: new Set(),
    methods: new Set(),
    customerTypes: new Set(),
    orderStatuses: new Set(),
    brands: new Set()
  };
  
  let minAge = Infinity, maxAge = -Infinity;

  salesData.forEach(item => {
    extractors.regions.add(item['Customer Region']);
    extractors.genders.add(item['Gender']);
    extractors.categories.add(item['Product Category']);
    extractors.methods.add(item['Payment Method']);
    extractors.customerTypes.add(item['Customer Type']);
    extractors.orderStatuses.add(item['Order Status']);
    extractors.brands.add(item['Brand']);
    
    if (item['Tags']) {
      item['Tags'].split(',').forEach(tag => {
        const trimmed = tag.trim();
        if (trimmed) extractors.tags.add(trimmed);
      });
    }
    
    if (item.Age > 0) {
      minAge = Math.min(minAge, item.Age);
      maxAge = Math.max(maxAge, item.Age);
    }
  });

  filterOptionsCache = {
    customerRegion: [...extractors.regions].sort(),
    gender: [...extractors.genders].sort(),
    productCategory: [...extractors.categories].sort(),
    tags: [...extractors.tags].sort(),
    paymentMethod: [...extractors.methods].sort(),
    customerType: [...extractors.customerTypes].sort(),
    orderStatus: [...extractors.orderStatuses].sort(),
    brand: [...extractors.brands].sort(),
    ageRange: { 
      min: minAge === Infinity ? 18 : minAge, 
      max: maxAge === -Infinity ? 65 : maxAge 
    }
  };
  
  cacheTimestamp = now;
  return filterOptionsCache;
};

export const clearCache = () => {
  filterOptionsCache = null;
  cacheTimestamp = 0;
};

// Analytics functions for dashboard
export const getAnalytics = () => {
  if (salesData.length === 0) return null;

  const analytics = {
    totalRevenue: 0,
    totalOrders: salesData.length,
    avgOrderValue: 0,
    topCategories: {},
    topBrands: {},
    regionStats: {},
    monthlyTrends: {}
  };

  salesData.forEach(item => {
    analytics.totalRevenue += item['Final Amount'];
    
    // Category stats
    const category = item['Product Category'];
    analytics.topCategories[category] = (analytics.topCategories[category] || 0) + 1;
    
    // Brand stats
    const brand = item['Brand'];
    analytics.topBrands[brand] = (analytics.topBrands[brand] || 0) + 1;
    
    // Region stats
    const region = item['Customer Region'];
    analytics.regionStats[region] = (analytics.regionStats[region] || 0) + item['Final Amount'];
    
    // Monthly trends
    const month = item.Date.toISOString().slice(0, 7);
    analytics.monthlyTrends[month] = (analytics.monthlyTrends[month] || 0) + item['Final Amount'];
  });

  analytics.avgOrderValue = analytics.totalRevenue / analytics.totalOrders;
  
  return analytics;
};