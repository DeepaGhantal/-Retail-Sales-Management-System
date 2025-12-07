# Architecture Document

## System Overview

The Retail Sales Management System is built with a clean separation between frontend and backend, following RESTful API principles and component-based UI architecture.

## Backend Architecture

### Technology Stack
- Node.js with Express.js
- CSV Parser for data loading
- CORS for cross-origin requests

### Folder Structure
```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── routes/          # API route definitions
│   ├── utils/           # Helper functions
│   ├── models/          # Data models (if needed)
│   └── index.js         # Application entry point
├── data/                # CSV data storage
└── package.json
```

### Module Responsibilities

**index.js**
- Application initialization
- Middleware setup (CORS, JSON parsing)
- Route registration
- Server startup and data loading

**services/dataService.js**
- CSV data loading and caching
- Filter application logic
- Sorting implementation
- Data transformation

**controllers/salesController.js**
- Request parameter parsing
- Pagination logic
- Response formatting
- Error handling

**routes/salesRoutes.js**
- API endpoint definitions
- Route-to-controller mapping

### Data Flow
1. Client sends request with query parameters
2. Express routes request to controller
3. Controller parses and validates parameters
4. Service applies filters, sorting on cached data
5. Controller applies pagination
6. Response sent back to client

## Frontend Architecture

### Technology Stack
- React 18
- Vite (build tool)
- Axios (HTTP client)
- CSS3 (styling)

### Folder Structure
```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   ├── services/        # API communication
│   ├── hooks/           # Custom React hooks
│   ├── styles/          # CSS files
│   ├── utils/           # Helper functions
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Application entry point
├── public/              # Static assets
└── package.json
```

### Module Responsibilities

**main.jsx**
- React application initialization
- Root component rendering

**App.jsx**
- Main layout composition
- Component orchestration
- State management coordination

**hooks/useSalesData.js**
- Centralized state management
- API call orchestration
- Filter state management
- Pagination state handling

**services/api.js**
- HTTP request abstraction
- API endpoint definitions
- Response handling

**components/**
- SearchBar: Search input handling
- FilterPanel: Multi-select filter UI
- SortDropdown: Sort option selection
- SalesTable: Data display in table format
- Pagination: Page navigation controls

### Data Flow
1. User interacts with UI (search, filter, sort, paginate)
2. Component calls hook method to update state
3. Hook triggers API call with updated parameters
4. API service sends request to backend
5. Response updates local state
6. Components re-render with new data

## API Design

### Endpoints

**GET /api/sales**
- Purpose: Fetch filtered, sorted, paginated sales data
- Query Parameters:
  - search: string
  - customerRegion: comma-separated string
  - gender: comma-separated string
  - ageMin, ageMax: numbers
  - productCategory: comma-separated string
  - tags: comma-separated string
  - paymentMethod: comma-separated string
  - dateStart, dateEnd: ISO date strings
  - sortBy: enum (date_desc, quantity, customer_name)
  - page: number (default: 1)
  - limit: number (default: 10)
- Response: { data: [], pagination: {} }

**GET /api/filters**
- Purpose: Get available filter options
- Response: { customerRegion: [], gender: [], ... }

## State Management

### Frontend State
- Managed through custom hook (useSalesData)
- Single source of truth for filters
- Automatic API calls on state changes
- Pagination state preserved across filter changes

### Backend State
- Data loaded once at startup
- Cached in memory for fast access
- Stateless request handling

## Performance Considerations

1. **Backend**
   - In-memory data caching
   - Efficient filtering algorithms
   - Pagination to limit response size

2. **Frontend**
   - Debouncing on search input (can be added)
   - Minimal re-renders through proper state management
   - Lazy loading of filter options

## Security Considerations

1. Input validation on backend
2. CORS configuration
3. No sensitive data exposure
4. Error handling without stack traces in production

## Scalability

### Current Implementation
- Suitable for datasets up to 100K records
- In-memory processing

### Future Enhancements
- Database integration (PostgreSQL/MongoDB)
- Server-side pagination
- Caching layer (Redis)
- API rate limiting
- Authentication/Authorization

## Error Handling

### Backend
- Try-catch blocks in controllers
- Graceful error responses
- Startup validation (data file check)

### Frontend
- API error catching
- Loading states
- Empty state handling
- User-friendly error messages

## Testing Strategy

### Backend
- Unit tests for services
- Integration tests for API endpoints
- Edge case validation

### Frontend
- Component unit tests
- Integration tests for data flow
- E2E tests for user workflows

## Deployment

### Backend
- Can be deployed to: Heroku, AWS EC2, DigitalOcean, Render
- Environment variables for configuration
- Health check endpoint available

### Frontend
- Can be deployed to: Vercel, Netlify, AWS S3+CloudFront
- Environment-specific API URLs
- Build optimization with Vite

## Development Workflow

1. Backend runs on port 5000
2. Frontend runs on port 3000
3. CORS enabled for local development
4. Hot reload on both sides
