import './App.css'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faShoppingBag,
  faUsers,
  faFileInvoice,
  faCog,
  faSun,
  faMoon
} from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import Customer from './pages/Customer'
import Home from './pages/Home';
import Invoice from './pages/Invoice';
import Items from './pages/Items';
import Setting from './pages/Setting';
import Profile from './pages/Profile';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

// Navigation links data
const navLinks = [
  { path: '/', name: 'Home', icon: faHome },
  { path: '/items', name: 'Items', icon: faShoppingBag },
  { path: '/customers', name: 'Customers', icon: faUsers },
  { path: '/invoices', name: 'Invoices', icon: faFileInvoice },
  { path: '/settings', name: 'Settings', icon: faCog }
];

const navLinksMobile = [
  { path: '/items', name: 'Items', icon: faShoppingBag },
  { path: '/customers', name: 'Customers', icon: faUsers },
  { path: '/', name: 'Home', icon: faHome },
  { path: '/invoices', name: 'Invoices', icon: faFileInvoice },
  { path: '/settings', name: 'Settings', icon: faCog }
];

// Main App content with theme toggle
function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Track window resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`app-container ${theme}-theme`}>
      {/* Side Navigation for desktop */}
      <nav className="side-navigation desktop-only">
        <div className="logo">
          <img src="Images/shopeazelogo.png" alt="logo" />
        </div>
        <div className="nav-links">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              <FontAwesomeIcon icon={link.icon} />
              <span>{link.name}</span>
            </Link>
          ))}
        </div>

        <button className="theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
          <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
        </button>
      </nav>

      {/* Mobile Header - Only shown when isMobile is true */}
      {isMobile && (
        <header className="mobile-header">
          <div className="mobile-logo">
            <img src="Images/shopeazelogo.png" alt="logo" />
          </div>
          <button className="mobile-theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
            <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
          </button>
        </header>
      )}

      {/* Main Content */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/items" element={<Items />} />
          <Route path="/customers" element={<Customer />} />
          <Route path="/invoices" element={<Invoice />} />
          <Route path="/settings" element={<Setting />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>

      {/* Mobile Bottom Navigation - Only shown when isMobile is true */}
      {isMobile && (
        <nav className="mobile-navigation">
          <div className="mobile-nav">
            {navLinksMobile.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`mobile-nav-link ${link.name} ${location.pathname === link.path ? 'active' : ''}`}
              >
                <FontAwesomeIcon icon={link.icon} />
                <span>{link.name}</span>
              </Link>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}

// Wrap with ThemeProvider and Router
function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;