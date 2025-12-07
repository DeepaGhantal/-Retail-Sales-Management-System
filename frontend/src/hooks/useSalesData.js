import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchSalesData, fetchFilterOptions } from '../services/api';

const DEBOUNCE_DELAY = 300;

export const useSalesData = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [filterOptions, setFilterOptions] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    sortBy: '',
    customerRegion: [],
    gender: [],
    ageMin: '',
    ageMax: '',
    productCategory: [],
    tags: [],
    paymentMethod: [],
    customerType: [],
    orderStatus: [],
    brand: [],
    dateStart: '',
    dateEnd: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  
  const debounceRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Load filter options on mount
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const options = await fetchFilterOptions();
        setFilterOptions(options);
      } catch (err) {
        console.error('Failed to load filter options:', err);
        setError('Failed to load filter options');
      }
    };
    loadFilterOptions();
  }, []);

  // Debounced data fetching
  const fetchData = useCallback(async (searchFilters, page) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const params = {
        ...searchFilters,
        page,
        limit: 10
      };

      const response = await fetchSalesData(params, {
        signal: abortControllerRef.current.signal
      });

      setData(response.data || []);
      setPagination(response.pagination || {});
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Failed to fetch sales data:', err);
        setError('Failed to load sales data. Please try again.');
        setData([]);
        setPagination({});
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced effect for data fetching
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchData(filters, currentPage);
    }, DEBOUNCE_DELAY);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [filters, currentPage, fetchData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Reset to first page when filters change (except for page-specific changes)
    if (key !== 'page') {
      setCurrentPage(1);
    }
  }, []);

  const updatePage = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({
      search: '',
      sortBy: '',
      customerRegion: [],
      gender: [],
      ageMin: '',
      ageMax: '',
      productCategory: [],
      tags: [],
      paymentMethod: [],
      customerType: [],
      orderStatus: [],
      brand: [],
      dateStart: '',
      dateEnd: ''
    });
    setCurrentPage(1);
  }, []);

  return {
    data,
    pagination,
    filterOptions,
    loading,
    error,
    filters,
    currentPage,
    updateFilter,
    updatePage,
    clearAllFilters
  };
};