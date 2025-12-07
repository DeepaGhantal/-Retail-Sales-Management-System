# Retail Sales Management System

## Overview
A full-stack web application for managing and analyzing retail sales data with advanced search, filtering, sorting, and pagination capabilities. Built with React frontend and Node.js backend, this system processes structured sales data efficiently while maintaining clean architecture and professional code standards.

## Tech Stack

**Frontend:**
- React 18
- Vite
- Axios
- CSS3

**Backend:**
- Node.js
- Express.js
- CSV Parser
- CORS

## Search Implementation Summary
Full-text search implemented across Customer Name and Phone Number fields. The search is case-insensitive and works by filtering the dataset on the backend using JavaScript's string includes method. Search state is maintained alongside filters and sorting, ensuring all features work in combination without conflicts.

## Filter Implementation Summary
Multi-select filters implemented for Customer Region, Gender, Product Category, Tags, and Payment Method using checkbox-based UI. Range-based filters for Age (min/max) and Date (start/end) using input fields. Backend applies filters sequentially using array filter methods, supporting independent and combined filter operations. Filter state resets pagination to page 1 on changes.

## Sorting Implementation Summary
Three sorting options implemented: Date (Newest First), Quantity (descending), and Customer Name (A-Z). Sorting is applied on the backend after filtering using JavaScript's array sort method with custom comparators. Sort state is preserved when applying filters or searching, ensuring consistent user experience.

## Pagination Implementation Summary
Server-side pagination with 10 items per page. Backend calculates total pages and slices the filtered/sorted dataset based on page number and limit. Frontend provides Previous/Next navigation with disabled states at boundaries. Pagination state is maintained across filter and sort changes, resetting to page 1 only when filters change.

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Backend Setup
1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Place the `sales_data.csv` file in `backend/data/` directory

4. Start the server:
```bash
npm start
```

Backend will run on `http://localhost:5000`

### Frontend Setup
1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

### Running the Full Application
1. Start backend server (terminal 1)
2. Start frontend server (terminal 2)
3. Open browser to `http://localhost:3000`

### Production Build
Frontend:
```bash
cd frontend
npm run build
```

The build output will be in `frontend/dist/`

## Project Structure
```
root/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── models/
│   │   └── index.js
│   ├── data/
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── styles/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── README.md
├── docs/
│   └── architecture.md
└── README.md
```

## Features
- Real-time search across customer data
- Multi-select filtering with 7+ filter categories
- Three sorting options
- Pagination with 10 items per page
- Responsive design
- Clean and minimal UI
- Edge case handling (no results, empty filters, etc.)

## API Endpoints
- `GET /api/sales` - Fetch sales data with filters
- `GET /api/filters` - Get available filter options
- `GET /health` - Health check endpoint

## Notes
- Ensure backend is running before starting frontend
- CSV file must be placed in `backend/data/` directory
- Default ports: Backend (5000), Frontend (3000)
- CORS is enabled for local development
