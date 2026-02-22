import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
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
                  <NavLink
                    to="/"
                    end
                    className={({ isActive }) =>
                      `inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors ${
                        isActive
                          ? 'text-text-primary border-primary hover:border-primary-dark'
                          : 'text-text-secondary border-transparent hover:text-text-primary hover:border-primary/50'
                      }`
                    }
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/transactions"
                    className={({ isActive }) =>
                      `inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors ${
                        isActive
                          ? 'text-text-primary border-primary hover:border-primary-dark'
                          : 'text-text-secondary border-transparent hover:text-text-primary hover:border-primary/50'
                      }`
                    }
                  >
                    Transactions
                  </NavLink>
                  <NavLink
                    to="/analytics"
                    className={({ isActive }) =>
                      `inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors ${
                        isActive
                          ? 'text-text-primary border-primary hover:border-primary-dark'
                          : 'text-text-secondary border-transparent hover:text-text-primary hover:border-primary/50'
                      }`
                    }
                  >
                    Analytics
                  </NavLink>
                  <NavLink
                    to="/budget"
                    className={({ isActive }) =>
                      `inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors ${
                        isActive
                          ? 'text-text-primary border-primary hover:border-primary-dark'
                          : 'text-text-secondary border-transparent hover:text-text-primary hover:border-primary/50'
                      }`
                    }
                  >
                    Budget
                  </NavLink>
                  <NavLink
                    to="/chat"
                    className={({ isActive }) =>
                      `inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors ${
                        isActive
                          ? 'text-text-primary border-primary hover:border-primary-dark'
                          : 'text-text-secondary border-transparent hover:text-text-primary hover:border-primary/50'
                      }`
                    }
                  >
                    💬 Chat
                  </NavLink>
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
