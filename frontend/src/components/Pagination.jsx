import React from 'react';

const Pagination = ({ pagination, onPageChange }) => {
  const { page, totalPages, total } = pagination;

  if (!total) return null;

  return (
    <div className="pagination">
      <div className="pagination-info">
        Showing page {page} of {totalPages} ({total} total records)
      </div>
      <div className="pagination-controls">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="pagination-btn"
        >
          Previous
        </button>
        <span className="page-number">Page {page}</span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="pagination-btn"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
