import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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
import Customer from './pages/Customer'
import Home from './pages/Home';
import Invoice from './pages/Invoice';
import Items from './pages/Items';
import Setting from './pages/Setting';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

// Main App content with theme toggle
function AppContent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Router>
      <div className={`app-container ${theme}-theme`}>
        <nav className="side-navigation">
          <div className="logo">ShopEaze</div>
          <div className="nav-links">
            <Link to="/" className="nav-link">
              <FontAwesomeIcon icon={faHome} />
              <span>Home</span>
            </Link>
            <Link to="/items" className="nav-link">
              <FontAwesomeIcon icon={faShoppingBag} />
              <span>Items</span>
            </Link>
            <Link to="/customers" className="nav-link">
              <FontAwesomeIcon icon={faUsers} />
              <span>Customers</span>
            </Link>
            <Link to="/invoices" className="nav-link">
              <FontAwesomeIcon icon={faFileInvoice} />
              <span>Invoices</span>
            </Link>
            <Link to="/settings" className="nav-link">
              <FontAwesomeIcon icon={faCog} />
              <span>Settings</span>
            </Link>
          </div>
          
          <button className="theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
            <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
          </button>
        </nav>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/items" element={<Items />} />
            <Route path="/customers" element={<Customer />} />
            <Route path="/invoices" element={<Invoice />} />
            <Route path="/settings" element={<Setting />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

// Wrap with ThemeProvider
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;