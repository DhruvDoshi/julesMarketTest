import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import StockSearchPage from './pages/StockSearchPage';
import StockDetailPage from './pages/StockDetailPage';
import PortfoliosPage from './pages/PortfoliosPage';
import WatchlistPage from './pages/WatchlistPage';
import NewsFeedPage from './pages/NewsFeedPage';
import SettingsPage from './pages/SettingsPage';
import NavBar from './components/NavBar';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-grow p-6 bg-background text-foreground">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/search" element={<StockSearchPage />} />
              <Route path="/stock/:symbol" element={<StockDetailPage />} />
              <Route path="/portfolios" element={<PortfoliosPage />} />
              <Route path="/watchlist" element={<WatchlistPage />} />
              <Route path="/news" element={<NewsFeedPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
