import { Link } from 'react-router-dom';
import DarkModeToggle from './DarkModeToggle';

const NavBar = () => {
  return (
    <nav className="bg-card text-card-foreground p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-primary">FinPort</Link>
        <div className="flex items-center space-x-4">
          <Link to="/" className="hover:text-primary">Dashboard</Link>
          <Link to="/portfolios" className="hover:text-primary">Portfolios</Link>
          <Link to="/watchlist" className="hover:text-primary">Watchlist</Link>
          <Link to="/news" className="hover:text-primary">News</Link>
          <Link to="/settings" className="hover:text-primary">Settings</Link>
          <DarkModeToggle />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
