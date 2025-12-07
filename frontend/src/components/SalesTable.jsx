import React from 'react';

const SalesTable = ({ data, loading }) => {
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!data.length) {
    return <div className="no-results">No results found</div>;
  }

  return (
    <div className="table-container">
      <table className="sales-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Customer Name</th>
            <th>Phone</th>
            <th>Product</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Final Amount</th>
            <th>Payment</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item['Date']}</td>
              <td>{item['Customer Name']}</td>
              <td>{item['Phone Number']}</td>
              <td>{item['Product Name']}</td>
              <td>{item['Product Category']}</td>
              <td>{item['Quantity']}</td>
              <td>${item['Price per Unit']}</td>
              <td>${item['Final Amount']}</td>
              <td>{item['Payment Method']}</td>
              <td>{item['Order Status']}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesTable;
