import * as csvService from '../services/dataService.js';
import * as mongoService from '../services/mongoService.js';

const USE_MONGODB = process.env.USE_MONGODB === 'true';
const service = USE_MONGODB ? mongoService : csvService;

export const getSales = async (req, res) => {
  try {
    const { 
      search, 
      customerRegion, 
      gender, 
      ageMin, 
      ageMax, 
      productCategory, 
      tags, 
      paymentMethod, 
      dateStart, 
      dateEnd, 
      customerType, 
      orderStatus, 
      brand, 
      sortBy, 
      page = 1, 
      limit = 10 
    } = req.query;

    // Input validation
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));

    const filters = {
      search: search?.trim(),
      customerRegion: customerRegion ? customerRegion.split(',').map(s => s.trim()) : undefined,
      gender: gender ? gender.split(',').map(s => s.trim()) : undefined,
      ageMin: ageMin ? Math.max(0, parseInt(ageMin)) : undefined,
      ageMax: ageMax ? Math.min(150, parseInt(ageMax)) : undefined,
      productCategory: productCategory ? productCategory.split(',').map(s => s.trim()) : undefined,
      tags: tags ? tags.split(',').map(s => s.trim()) : undefined,
      paymentMethod: paymentMethod ? paymentMethod.split(',').map(s => s.trim()) : undefined,
      customerType: customerType ? customerType.split(',').map(s => s.trim()) : undefined,
      orderStatus: orderStatus ? orderStatus.split(',').map(s => s.trim()) : undefined,
      brand: brand ? brand.split(',').map(s => s.trim()) : undefined,
      dateStart: dateStart?.trim(),
      dateEnd: dateEnd?.trim(),
      sortBy: sortBy?.trim()
    };

    const result = USE_MONGODB 
      ? await service.getSalesData(filters, pageNum, limitNum)
      : service.getSalesData(filters, pageNum, limitNum);

    res.json(result);
  } catch (error) {
    console.error('Error fetching sales data:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

export const getFilters = async (req, res) => {
  try {
    const filterOptions = USE_MONGODB 
      ? await service.getFilterOptions() 
      : service.getFilterOptions();
    
    // Set cache headers for filter options
    res.set({
      'Cache-Control': 'public, max-age=300', // 5 minutes
      'ETag': `"${Date.now()}"`
    });
    
    res.json(filterOptions);
  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const analytics = USE_MONGODB 
      ? await service.getAnalytics() 
      : service.getAnalytics();
    
    if (!analytics) {
      return res.status(404).json({ error: 'No data available for analytics' });
    }
    
    res.set({
      'Cache-Control': 'public, max-age=600', // 10 minutes
    });
    
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

export const healthCheck = (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    dataSource: USE_MONGODB ? 'MongoDB' : 'CSV'
  });
};