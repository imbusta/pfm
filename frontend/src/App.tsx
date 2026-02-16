import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Analytics from './pages/Analytics';
import Budget from './pages/Budget';
import Chat from './pages/Chat';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <nav className="bg-surface shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold text-primary">💰 Finance Copilot</h1>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    to="/"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-text-primary border-b-2 border-primary hover:border-primary-dark transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/transactions"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-text-secondary hover:text-text-primary border-b-2 border-transparent hover:border-primary/50 transition-colors"
                  >
                    Transactions
                  </Link>
                  <Link
                    to="/analytics"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-text-secondary hover:text-text-primary border-b-2 border-transparent hover:border-primary/50 transition-colors"
                  >
                    Analytics
                  </Link>
                  <Link
                    to="/budget"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-text-secondary hover:text-text-primary border-b-2 border-transparent hover:border-primary/50 transition-colors"
                  >
                    Budget
                  </Link>
                  <Link
                    to="/chat"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-text-secondary hover:text-text-primary border-b-2 border-transparent hover:border-primary/50 transition-colors"
                  >
                    💬 Chat
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
