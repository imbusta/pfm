# Finance Copilot Backend

Express + TypeScript API server for the Finance Copilot Agent.

## Features

- RESTful API endpoints for financial data management
- AI-powered transaction classification using Claude
- Analytics and spending insights
- Budget planning and recommendations
- Natural language chat interface

## Tech Stack

- Node.js + TypeScript
- Express.js
- Anthropic Claude AI
- PostgreSQL (planned)
- Jest for testing

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- Anthropic API key

### Installation

```bash
# Install dependencies (from project root)
npm install

# Or install backend only
cd backend && npm install
```

### Configuration

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your API keys:

   ```env
   ANTHROPIC_API_KEY=your_key_here
   PORT=3000
   NODE_ENV=development
   ```

### Running

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

The server will start on `http://localhost:3000`.

## API Endpoints

### Transactions

- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get single transaction
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `POST /api/transactions/batch` - Create multiple transactions

### Analytics

- `GET /api/analytics/summary?startDate&endDate` - Get spending summary
- `GET /api/analytics/breakdown` - Get category breakdown
- `GET /api/analytics/trends` - Get monthly trends
- `GET /api/analytics/recurring` - Detect recurring transactions
- `GET /api/analytics/anomalies` - Detect spending anomalies

### Budget

- `GET /api/budget` - Get all budgets
- `POST /api/budget` - Create budget
- `GET /api/budget/suggestions` - Get budget suggestions
- `GET /api/budget/optimize` - Get optimization recommendations
- `GET /api/budget/goals` - Get all goals
- `POST /api/budget/goals` - Create goal
- `GET /api/budget/goals/:id/plan` - Get goal plan

### Agent

- `POST /api/agent/chat` - Chat with AI copilot
- `POST /api/agent/analyze` - Analyze specific transactions

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Project Structure

```tree
backend/
├── src/
│   ├── index.ts          # Server entry point
│   ├── app.ts            # Express app configuration
│   ├── config/           # Configuration
│   ├── models/           # Data models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── utils/            # Utilities
│   └── types/            # TypeScript types
├── tests/                # Test files
└── package.json
```

## Development

The backend uses in-memory storage for now. PostgreSQL integration will be added in a future update.

## License

MIT
