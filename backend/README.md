# Backend - Retail Sales Management System

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Place the `sales_data.csv` file in the `data/` directory

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### GET /api/sales
Fetch sales data with filters, search, sort, and pagination.

Query Parameters:
- `search` - Search by customer name or phone
- `customerRegion` - Comma-separated regions
- `gender` - Comma-separated genders
- `ageMin`, `ageMax` - Age range
- `productCategory` - Comma-separated categories
- `tags` - Comma-separated tags
- `paymentMethod` - Comma-separated payment methods
- `dateStart`, `dateEnd` - Date range (YYYY-MM-DD)
- `sortBy` - Sort option (date_desc, quantity, customer_name)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

### GET /api/filters
Get available filter options from the dataset.

## Environment
- Port: 5000 (default)
