import React from 'react';

const FilterPanel = ({ filters, filterOptions, onFilterChange }) => {
  const handleMultiSelect = (key, value) => {
    const current = filters[key] || [];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    onFilterChange(key, updated);
  };

  return (
    <div className="filter-panel">
      <h3>Filters</h3>

      <div className="filter-group">
        <label>Customer Region</label>
        {filterOptions.customerRegion?.map(region => (
          <label key={region} className="checkbox-label">
            <input
              type="checkbox"
              checked={filters.customerRegion?.includes(region)}
              onChange={() => handleMultiSelect('customerRegion', region)}
            />
            {region}
          </label>
        ))}
      </div>

      <div className="filter-group">
        <label>Gender</label>
        {filterOptions.gender?.map(gender => (
          <label key={gender} className="checkbox-label">
            <input
              type="checkbox"
              checked={filters.gender?.includes(gender)}
              onChange={() => handleMultiSelect('gender', gender)}
            />
            {gender}
          </label>
        ))}
      </div>

      <div className="filter-group">
        <label>Age Range</label>
        <input
          type="number"
          placeholder="Min"
          value={filters.ageMin}
          onChange={(e) => onFilterChange('ageMin', e.target.value)}
          className="range-input"
        />
        <input
          type="number"
          placeholder="Max"
          value={filters.ageMax}
          onChange={(e) => onFilterChange('ageMax', e.target.value)}
          className="range-input"
        />
      </div>

      <div className="filter-group">
        <label>Product Category</label>
        {filterOptions.productCategory?.map(category => (
          <label key={category} className="checkbox-label">
            <input
              type="checkbox"
              checked={filters.productCategory?.includes(category)}
              onChange={() => handleMultiSelect('productCategory', category)}
            />
            {category}
          </label>
        ))}
      </div>

      <div className="filter-group">
        <label>Tags</label>
        <div className="scrollable-list">
          {filterOptions.tags?.map(tag => (
            <label key={tag} className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.tags?.includes(tag)}
                onChange={() => handleMultiSelect('tags', tag)}
              />
              {tag}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label>Payment Method</label>
        {filterOptions.paymentMethod?.map(method => (
          <label key={method} className="checkbox-label">
            <input
              type="checkbox"
              checked={filters.paymentMethod?.includes(method)}
              onChange={() => handleMultiSelect('paymentMethod', method)}
            />
            {method}
          </label>
        ))}
      </div>

      <div className="filter-group">
        <label>Customer Type</label>
        {filterOptions.customerType?.map(type => (
          <label key={type} className="checkbox-label">
            <input
              type="checkbox"
              checked={filters.customerType?.includes(type)}
              onChange={() => handleMultiSelect('customerType', type)}
            />
            {type}
          </label>
        ))}
      </div>

      <div className="filter-group">
        <label>Order Status</label>
        {filterOptions.orderStatus?.map(status => (
          <label key={status} className="checkbox-label">
            <input
              type="checkbox"
              checked={filters.orderStatus?.includes(status)}
              onChange={() => handleMultiSelect('orderStatus', status)}
            />
            {status}
          </label>
        ))}
      </div>

      <div className="filter-group">
        <label>Brand</label>
        <div className="scrollable-list">
          {filterOptions.brand?.map(brand => (
            <label key={brand} className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.brand?.includes(brand)}
                onChange={() => handleMultiSelect('brand', brand)}
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label>Date Range</label>
        <input
          type="date"
          value={filters.dateStart}
          onChange={(e) => onFilterChange('dateStart', e.target.value)}
          className="date-input"
        />
        <input
          type="date"
          value={filters.dateEnd}
          onChange={(e) => onFilterChange('dateEnd', e.target.value)}
          className="date-input"
        />
      </div>
    </div>
  );
};

export default FilterPanel;
