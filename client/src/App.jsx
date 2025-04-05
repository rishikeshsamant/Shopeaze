import './App.css'
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faShoppingBag,
  faUsers,
  faFileInvoice,
  faCog,
  faSun,
  faMoon,
  faSignOutAlt,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import Customer from './pages/Customer'
import Home from './pages/Home';
import Invoice from './pages/Invoice';
import Items from './pages/Items';
import Setting from './pages/Setting';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext';

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
  { path: '/invoices', name: 'Invoices', icon: faFileInvoice }
];

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Main App content with theme toggle
function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, currentUser, logout } = useAuth();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Track window resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // If not authenticated, only show login/register pages
  if (!isAuthenticated) {
    return (
      <div className={`app-container ${theme}-theme`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    );
  }

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

          {/* User profile link */}
          <Link
            to="/profile"
            className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
          >
            <FontAwesomeIcon icon={faUser} />
            <span>Profile</span>
          </Link>

          {/* Logout button */}
          <button className="nav-link logout-link" onClick={logout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Logout</span>
          </button>
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
          <div className="mobile-header-actions">
            <div className="mobile-user">
              <Link to="/profile">
                <FontAwesomeIcon icon={faUser} />
                <span className="user-name">{currentUser?.name || 'User'}</span>
              </Link>
            </div>
            <button
              className="mobile-logout-btn"
              onClick={logout}
              title="Logout"
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
            </button>
            <button
              className="mobile-theme-toggle"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
            </button>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/items" element={<ProtectedRoute><Items /></ProtectedRoute>} />
          <Route path="/customers" element={<ProtectedRoute><Customer /></ProtectedRoute>} />
          <Route path="/invoices" element={<ProtectedRoute><Invoice /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Setting /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
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

// App component
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;