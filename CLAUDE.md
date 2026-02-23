# CLAUDE.md

This file provides guidance when working with AI agents in this repository. The project uses the **OpenAI Agentic Framework (`@openai/agents`)** for AI-powered features.

---

## Commands

```bash
# Install all dependencies (run from root)
npm install

# Run both backend and frontend in development
npm run dev

# Run individually
npm run dev:backend   # Express API on port 3000
npm run dev:frontend  # Vite dev server on port 5173

# Build
npm run build

# Tests
npm run test                        # All tests
npm run test:backend                # Backend only
npm test --workspace=backend        # Same
npx jest --testPathPattern=<name>   # Single test file (from backend/)

# Type checking
npm run type-check --workspace=backend
npm run type-check --workspace=frontend

# Linting
npm run lint --workspace=backend
npm run lint --workspace=frontend

# Clean
npm run clean && npm install

Backend dev uses `nodemon` + `ts-node` (no compile step needed). Frontend uses Vite HMR. Production runs compiled output from `backend/dist/`.

## Architecture

**Monorepo** with npm workspaces: `backend/`, `frontend/`, `shared/`.

**Backend** (`Express.js + TypeScript + PostgreSQL`, port 3000):
- `src/routes/` → thin route handlers, delegate to services
- `src/services/` → business logic: `agent.ts` (OpenAI Agentic Framework integration), `analytics.ts`, `planner.ts`, `classifier.ts`, `recurrence.ts`
- `src/models/` → SQL queries against PostgreSQL (singleton pool in `db/`)
- `src/types/index.ts` → shared TypeScript interfaces

**Frontend** (`React + Vite + Tailwind`, port 5173):
- `src/pages/` → route-level components (Dashboard, Transactions, Analytics, Budget, Chat)
- `src/components/` → reusable UI components
- `src/api/client.ts` → all Axios calls to the backend API
- Vite dev proxy routes `/api/*` → `http://localhost:3000`, eliminating CORS issues in dev

**Database**: PostgreSQL (`finance_db`). Tables: `transactions`, `budgets`, `budget_categories`, `categories`, `subcategories`, `currencies`, `payment_methods`, `goals`, `preferences`. Transactions use soft deletes (`deleted_at`). The Transaction model auto-resolves category/currency names to IDs.

**AI Integration**: Uses the **OpenAI Agentic Framework (`@openai/agents`)** for all AI-powered features.

- **Entry point**: `src/services/agent.ts` — wraps the OpenAI Agents SDK, defines tools, and runs the agent loop
- **Agents**: Defined with `new Agent({ name, instructions, tools })`. Each agent has a system prompt and a set of typed tools it can call
- **Tools**: Thin wrappers around deterministic service functions (e.g. `analytics.ts`, `planner.ts`). Tools are defined with `tool({ name, description, parameters, execute })` using Zod schemas for parameter validation
- **Runner**: `Runner.run(agent, input)` (or `.runStream`) drives the agent loop — tool calls are automatically dispatched and results fed back to the model
- **Agents directory**: `src/services/agents/` — individual agent definitions (e.g. `plannerAgent.ts`)
- **Model**: defaults to `gpt-4o`; override per-agent via the `model` field

## Environment Setup

Copy `backend/.env.example` to `backend/.env` and fill in:
- `OPENAI_API_KEY` — required for the chat/agent feature
- `DB_*` variables — PostgreSQL connection (default: `localhost:5432`, db `finance_db`, user `postgres`)

## Key Design Rules

- **Deterministic for math**: summations, averages, outlier detection, budget feasibility → `services/analytics.ts`, `services/planner.ts`
- **LLM for reasoning only**: explanations, scenario narratives, clarifying questions → `services/agent.ts`
- **Conservative financial guidance**: always include assumptions, confidence level, and alternatives in recommendations
- **No bank integrations**: transactions are entered manually or imported via CSV/JSON
