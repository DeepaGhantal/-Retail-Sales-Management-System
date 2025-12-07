import React from 'react';

const SortDropdown = ({ value, onChange }) => {
  return (
    <div className="sort-dropdown">
      <label>Sort By:</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">None</option>
        <option value="date_desc">Date (Newest First)</option>
        <option value="quantity">Quantity</option>
        <option value="customer_name">Customer Name (A-Z)</option>
      </select>
    </div>
  );
};

export default SortDropdown;
