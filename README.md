# Finance Copilot Agent

A Personal Finance Management system with an AI-powered copilot agent for intelligent financial insights and guidance.

## Overview

This project provides a comprehensive personal finance management platform that combines traditional tracking and analytics with AI-powered assistance. The system helps users track transactions, analyze spending patterns, create budgets, and receive personalized financial guidance through natural language interactions.

## Architecture

- **Backend**: Node.js + TypeScript + Express API
- **Frontend**: React + TypeScript + Vite
- **Database**: PostgreSQL (to be integrated)
- **AI**: Claude AI (Anthropic)

## Project Structure

```
pfm/
├── backend/          # Express API server
├── frontend/         # React web application
├── shared/           # Shared TypeScript types
└── docs/             # Documentation
```

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL (for future database integration)

## Getting Started

### 1. Install Dependencies

From the project root:

```bash
npm install
```

This will install dependencies for all workspaces (backend, frontend, and shared).

### 2. Configure Environment Variables

**Backend:**

```bash
cd backend
cp .env.example .env
# Edit .env and add your API keys
```

Required environment variables:
- `ANTHROPIC_API_KEY`: Your Claude AI API key
- `PORT`: Backend server port (default: 3000)
- `NODE_ENV`: Environment (development/production)

### 3. Run Development Servers

**Run both frontend and backend:**

```bash
npm run dev
```

**Or run individually:**

```bash
# Backend only (http://localhost:3000)
npm run dev:backend

# Frontend only (http://localhost:5173)
npm run dev:frontend
```

## Development

### Backend Development

The backend provides RESTful API endpoints for:

- **Transactions**: CRUD operations for financial transactions
- **Analytics**: Spending summaries, category breakdowns, trends
- **Budget**: Budget planning and tracking
- **Agent**: Natural language Q&A and financial guidance

See `backend/README.md` for detailed API documentation.

### Frontend Development

The frontend provides:

- Dashboard with financial overview
- Transaction management
- Visual analytics and charts
- Budget planning interface
- Chat interface for AI copilot

See `frontend/README.md` for component documentation.

### Shared Types

Common TypeScript types and interfaces are defined in the `shared/` package and imported by both backend and frontend for type consistency.

## Scripts

- `npm run dev` - Run both backend and frontend in development mode
- `npm run dev:backend` - Run backend only
- `npm run dev:frontend` - Run frontend only
- `npm run build` - Build both projects for production
- `npm run test` - Run all tests
- `npm run clean` - Remove all node_modules and build artifacts

## Features

### Current
- Transaction management
- AI-powered transaction classification
- Spending analytics and visualizations
- Budget planning assistance
- Natural language financial Q&A

### Planned
- PostgreSQL database integration
- Recurring transaction detection
- Goal tracking and progress
- Multi-currency support
- Export and reporting

## Documentation

- [Context & Requirements](./docs/00-context.md)
- [Agent Architecture](./docs/AGENT.md)
- [API Documentation](./backend/README.md)
- [Frontend Guide](./frontend/README.md)

## Contributing

This is a personal project, but suggestions and improvements are welcome.

## License

MIT
