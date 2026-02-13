# Finance Copilot Frontend

React + TypeScript + Vite web application for the Finance Copilot Agent.

## Features

- Dashboard with financial overview
- Transaction management (CRUD)
- Visual analytics and charts
- Budget and goal tracking
- AI-powered chat interface

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- Axios
- Tailwind CSS

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- Backend server running on `http://localhost:3000`

### Installation

```bash
# Install dependencies (from project root)
npm install

# Or install frontend only
cd frontend && npm install
```

### Running

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will start on `http://localhost:5173`.

## Pages

### Dashboard

- Monthly spending summary
- Category breakdown
- Quick actions

### Transactions

- View all transactions
- Add new transactions
- Edit and delete transactions
- Auto-classification with AI

### Analytics

- Monthly trends
- Category spending breakdown
- Visual charts and graphs

### Budget

- View and create budgets
- Track financial goals
- Budget recommendations

### Chat

- Natural language interface
- Ask questions about finances
- Get personalized advice
- Budget and spending insights

## Components

- `TransactionList` - Display transactions in a table
- `TransactionForm` - Form for creating transactions
- `MonthlySummary` - Display income/expense summary
- `CategoryBreakdown` - Visual category spending breakdown
- `BudgetView` - Display budgets and goals
- `ChatInterface` - AI chat interface

## API Integration

The frontend uses Axios to communicate with the backend API. All API calls are centralized in `src/api/client.ts`:

```typescript
import { transactionsApi, analyticsApi, budgetApi, goalsApi, agentApi } from './api/client';

// Example usage
const transactions = await transactionsApi.getAll();
const summary = await analyticsApi.getSummary(startDate, endDate);
const response = await agentApi.chat('How much did I spend last month?');
```

## Styling

The app uses Tailwind CSS for styling. Configuration is in `tailwind.config.js`.

## Environment Variables

Create a `.env` file if you need to customize the API URL:

```env
VITE_API_URL=http://localhost:3000/api
```

## Project Structure

```tree
frontend/
├── src/
│   ├── main.tsx          # Entry point
│   ├── App.tsx           # Main app component with routing
│   ├── components/       # Reusable components
│   ├── pages/            # Page components
│   ├── api/              # API client
│   ├── types/            # TypeScript types
│   └── styles/           # Global styles
├── public/               # Static assets
└── index.html            # HTML template
```

## Development

The Vite dev server includes hot module replacement (HMR) for fast development. Changes to components will update instantly without full page reloads.

## License

MIT
