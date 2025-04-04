import React, { useState, useEffect } from 'react';
import '../styles/Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShoppingCart, 
  faUsers, 
  faReceipt, 
  faMoneyBillWave,
  faChartLine,
  faArrowUp,
  faArrowDown,
  faFilter,
  faEllipsisV,
  faCreditCard,
  faChartBar,
  faBell,
  faExchangeAlt,
  faPlus
} from '@fortawesome/free-solid-svg-icons';

// Circular progress with label component
const CircularProgressWithLabel = ({ value, color, size = 70, thickness = 5 }) => {
  const circumference = 2 * Math.PI * ((size - thickness) / 2);
  const strokeDashoffset = circumference - (value / 100) * circumference;
  
  return (
    <div className="circular-progress-container">
      <svg className="circular-progress" width={size} height={size}>
        <circle
          className="circular-progress-background"
          cx={size / 2}
          cy={size / 2}
          r={(size - thickness) / 2}
          strokeWidth={thickness}
        />
        <circle
          className="circular-progress-value"
          cx={size / 2}
          cy={size / 2}
          r={(size - thickness) / 2}
          strokeWidth={thickness}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ stroke: color }}
        />
      </svg>
      <div className="circular-progress-label">
        {`${Math.round(value)}%`}
      </div>
    </div>
  );
};

// Enhanced Stat Card component
const StatCard = ({ title, value, change, icon, iconColor }) => {
  const isPositive = parseFloat(change) > 0;
  
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <p className="stat-card-title">{title}</p>
        <div className="stat-card-icon" style={{ backgroundColor: `rgba(${hexToRgb(iconColor)}, 0.1)`, color: iconColor }}>
          <FontAwesomeIcon icon={icon} />
        </div>
      </div>
      
      <h2 className="stat-card-value">{value}</h2>
      
      <div className="stat-card-footer">
        <div className={`stat-card-change ${isPositive ? 'positive' : 'negative'}`}>
          <FontAwesomeIcon icon={isPositive ? faChartLine : faArrowDown} />
          <span>{change.replace('-', '')}%</span>
        </div>
        <p className="stat-card-period">vs last month</p>
      </div>
    </div>
  );
};

// Revenue Card for data visualization
const RevenueCard = () => {
  // Mock data for visualization
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const values = [40, 65, 50, 80, 75, 90];
  const maxValue = Math.max(...values);
  
  return (
    <div className="revenue-card">
      <div className="revenue-card-header">
        <div>
          <h3 className="revenue-card-title">Revenue Trends</h3>
          <p className="revenue-card-subtitle">Monthly revenue performance</p>
        </div>
        <div className="revenue-card-actions">
          <button className="icon-button primary-light">
            <FontAwesomeIcon icon={faFilter} />
          </button>
          <button className="icon-button">
            <FontAwesomeIcon icon={faEllipsisV} />
          </button>
        </div>
      </div>
      
      <h2 className="revenue-card-amount">₹24,680.50</h2>
      
      <div className="revenue-card-change">
        <div className="change-indicator positive">
          <FontAwesomeIcon icon={faArrowUp} />
          <span>18.2%</span>
        </div>
        <p className="change-period">vs previous period</p>
      </div>
      
      <div className="chart-container">
        {months.map((month, index) => (
          <div 
            key={month} 
            className={`chart-bar ${index === 5 ? 'active' : ''}`}
            style={{ 
              height: `${(values[index] / maxValue) * 200}px`,
            }} 
          >
            <div className="chart-tooltip">{`₹${values[index] * 100}`}</div>
          </div>
        ))}
      </div>
      <div className="chart-labels">
        {months.map(month => (
          <div key={month} className="chart-label">{month}</div>
        ))}
      </div>
    </div>
  );
};

// Performance Metrics Card
const PerformanceCard = () => {
  const metrics = [
    { name: 'Sales Target', value: 78, color: '#896790' },
    { name: 'Customer Retention', value: 92, color: '#bfadcc' },
    { name: 'New Customers', value: 62, color: '#f2bae4' },
  ];
  
  return (
    <div className="performance-card">
      <div className="performance-card-header">
        <h3 className="performance-card-title">Performance Metrics</h3>
        <button className="icon-button">
          <FontAwesomeIcon icon={faEllipsisV} />
        </button>
      </div>
      
      <div className="metrics-container">
        {metrics.map((metric) => (
          <div className="metric-item" key={metric.name}>
            <div className="metric-header">
              <span className="metric-name">{metric.name}</span>
              <span className="metric-value">{metric.value}%</span>
            </div>
            <div className="progress-container">
              <div 
                className="progress-bar" 
                style={{ 
                  width: `${metric.value}%`, 
                  backgroundColor: metric.color 
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Quick Actions Card
const QuickActionsCard = () => {
  const actions = [
    { name: 'New Invoice', icon: faReceipt, color: '#896790' },
    { name: 'Add Product', icon: faShoppingCart, color: '#bfadcc' },
    { name: 'Record Payment', icon: faCreditCard, color: '#dfbbda' },
    { name: 'Sales Report', icon: faChartBar, color: '#f2bae4' },
  ];
  
  return (
    <div className="quick-actions-card">
      <h3 className="quick-actions-title">Quick Actions</h3>
      
      <div className="actions-grid">
        {actions.map((action) => (
          <button
            key={action.name}
            className="action-button"
            style={{
              borderColor: `rgba(${hexToRgb(action.color)}, 0.3)`,
              color: action.color,
            }}
          >
            <FontAwesomeIcon icon={action.icon} />
            <span>{action.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Recent Activities Card
const ActivitiesCard = () => {
  const activities = [
    { 
      label: 'New invoice created', 
      value: 'Invoice #12345', 
      time: '10 min ago',
      icon: faReceipt,
      color: '#896790'
    },
    { 
      label: 'New customer added', 
      value: 'Sarah Johnson', 
      time: '1 hour ago',
      icon: faUsers,
      color: '#bfadcc'
    },
    { 
      label: 'Payment received', 
      value: '₹1,250.00', 
      time: '3 hours ago',
      icon: faMoneyBillWave,
      color: '#dfbbda'
    }
  ];
  
  return (
    <div className="activities-card">
      <div className="activities-header">
        <h3 className="activities-title">Recent Activities</h3>
        <button className="icon-button">
          <FontAwesomeIcon icon={faBell} />
        </button>
      </div>
      
      <div className="activities-list">
        {activities.map((activity, index) => (
          <React.Fragment key={index}>
            <div className="activity-item">
              <div className="activity-icon" style={{ backgroundColor: activity.color }}>
                <FontAwesomeIcon icon={activity.icon} />
              </div>
              <div className="activity-content">
                <div className="activity-header">
                  <span className="activity-label">{activity.label}</span>
                  <span className="activity-time">{activity.time}</span>
                </div>
                <div className="activity-value">{activity.value}</div>
              </div>
            </div>
            {index < activities.length - 1 && <div className="activity-divider"></div>}
          </React.Fragment>
        ))}
      </div>
      
      <button className="view-all-button">
        View All Activities
      </button>
    </div>
  );
};

// Helper function to convert hex color to RGB
function hexToRgb(hex) {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `${r}, ${g}, ${b}`;
}

const Home = () => {
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  
  // Mock data for demonstration
  useEffect(() => {
    const mockStats = [
      {
        title: 'Total Sales',
        value: '₹14,528.25',
        change: '18.2',
        icon: faMoneyBillWave,
        iconColor: '#896790',
      },
      {
        title: 'New Customers',
        value: '124',
        change: '12.5',
        icon: faUsers,
        iconColor: '#bfadcc',
      },
      {
        title: 'Total Orders',
        value: '956',
        change: '8.4',
        icon: faShoppingCart,
        iconColor: '#dfbbda',
      },
      {
        title: 'Pending Invoices',
        value: '28',
        change: '-5.2',
        icon: faReceipt,
        iconColor: '#f2bae4',
      },
    ];
    
    // Simulate loading delay
    setTimeout(() => {
      setStats(mockStats);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Function to fetch actual stats from API (mocked)
  const fetchStats = async () => {
    setIsLoading(true);
    try {
      // Mock API call
      // In a real app, this would be:
      // const response = await fetch('/api/dashboard/stats');
      // const data = await response.json();
      
      // Using mock data for demonstration
      const data = {
        totalSales: 14528.25,
        newCustomers: 124,
        totalOrders: 956,
        pendingInvoices: 28,
        salesGrowth: 18.2,
        customerGrowth: 12.5,
        orderGrowth: 8.4,
        pendingGrowth: -5.2,
      };
      
      setStats([
        {
          title: 'Total Sales',
          value: formatCurrency(data.totalSales),
          change: data.salesGrowth.toString(),
          icon: faMoneyBillWave,
          iconColor: '#896790',
        },
        {
          title: 'New Customers',
          value: data.newCustomers.toString(),
          change: data.customerGrowth.toString(),
          icon: faUsers,
          iconColor: '#bfadcc',
        },
        {
          title: 'Total Orders',
          value: data.totalOrders.toString(),
          change: data.orderGrowth.toString(),
          icon: faShoppingCart,
          iconColor: '#dfbbda',
        },
        {
          title: 'Pending Invoices',
          value: data.pendingInvoices.toString(),
          change: data.pendingGrowth.toString(),
          icon: faReceipt,
          iconColor: '#f2bae4',
        },
      ]);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };
  
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back, Merchant!</p>
        </div>
        <div className="header-actions">
          <button className="icon-button">
            <FontAwesomeIcon icon={faBell} />
          </button>
          <button className="primary-button">
            <FontAwesomeIcon icon={faPlus} />
            Add New Sale
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading dashboard data...</p>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                change={stat.change}
                icon={stat.icon}
                iconColor={stat.iconColor}
              />
            ))}
          </div>
          
          <div className="dashboard-grid">
            <div className="grid-item large">
              <RevenueCard />
            </div>
            <div className="grid-item">
              <PerformanceCard />
            </div>
            <div className="grid-item">
              <QuickActionsCard />
            </div>
            <div className="grid-item large">
              <ActivitiesCard />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;