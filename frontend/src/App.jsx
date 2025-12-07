import React, { useMemo } from 'react';
import { useSalesData } from './hooks/useSalesData';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import SortDropdown from './components/SortDropdown';
import SalesTable from './components/SalesTable';
import Pagination from './components/Pagination';
import './styles/App.css';

function App() {
  const { 
    data, 
    pagination, 
    filterOptions, 
    loading, 
    error,
    filters, 
    updateFilter, 
    updatePage,
    clearAllFilters 
  } = useSalesData();

  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter(value => 
      Array.isArray(value) ? value.length > 0 : value && value !== ''
    ).length;
  }, [filters]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Retail Sales Management System</h1>
        <div className="header-stats">
          <span className="total-records">
            Total Records: {pagination.totalRecords || 0}
          </span>
          {activeFiltersCount > 0 && (
            <span className="active-filters">
              {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active
            </span>
          )}
        </div>
      </header>

      <main className="app-main">
        <div className="controls-section">
          <SearchBar 
            value={filters.search || ''} 
            onChange={(value) => updateFilter('search', value)}
            placeholder="Search by customer name or phone..."
          />
          <SortDropdown 
            value={filters.sortBy || ''} 
            onChange={(value) => updateFilter('sortBy', value)} 
          />
          <button 
            className="clear-filters-btn" 
            onClick={clearAllFilters}
            disabled={activeFiltersCount === 0}
          >
            Clear All ({activeFiltersCount})
          </button>
        </div>

        <div className="content-section">
          <aside className="sidebar">
            <FilterPanel
              filters={filters}
              filterOptions={filterOptions}
              onFilterChange={updateFilter}
            />
          </aside>

          <section className="main-content">
            {error && (
              <div className="error-message" role="alert">
                <strong>Error:</strong> {error}
                <button 
                  className="retry-btn"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              </div>
            )}
            
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <span>Loading sales data...</span>
              </div>
            ) : (
              <>
                <div className="results-info">
                  Showing {data.length} of {pagination.totalRecords || 0} records
                  {pagination.currentPage > 1 && (
                    <span> (Page {pagination.currentPage} of {pagination.totalPages})</span>
                  )}
                </div>
                
                <SalesTable data={data} loading={loading} />
                
                {pagination.totalPages > 1 && (
                  <Pagination 
                    pagination={pagination} 
                    onPageChange={updatePage} 
                  />
                )}
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;