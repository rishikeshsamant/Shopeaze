import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Sales.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faChartBar,
  faFilter,
  faDownload,
  faCalendarAlt,
  faChartLine,
  faArrowUp,
  faArrowDown
} from '@fortawesome/free-solid-svg-icons';

const Sales = () => {
  const [salesData, setSalesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [totalSales, setTotalSales] = useState(0);
  const [salesGrowth, setSalesGrowth] = useState(0);
  const [activeView, setActiveView] = useState('chart'); // 'chart' or 'table'
  const navigate = useNavigate();

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount).replace('₹', '₹');
  };

  // Fetch sales data by period
  const fetchSalesData = async (period) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/dashboard/sales/${period}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Get dashboard stats to get the growth percentage
      const statsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/dashboard/stats`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSalesData(response.data);
      const total = response.data.reduce((sum, item) => sum + item.amount, 0);
      setTotalSales(total);
      setSalesGrowth(statsResponse.data.salesGrowth);
    } catch (error) {
      console.error(`Failed to fetch ${period} sales data:`, error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchSalesData(selectedPeriod);
  }, []);

  // Reload data when period changes
  useEffect(() => {
    fetchSalesData(selectedPeriod);
  }, [selectedPeriod]);

  // Generate chart
  const renderChart = () => {
    const maxValue = Math.max(...salesData.map(item => item.amount), 1);
    
    return (
      <div className="sales-chart">
        <div className="sales-chart-inner">
          {salesData.map((item) => (
            <div
              key={item.date}
              className="sales-chart-bar"
              style={{
                height: `${(item.amount / maxValue) * 100}%`,
              }}
              aria-label={`${item.date}: ${formatCurrency(item.amount)}`}
            >
              <div className="sales-chart-tooltip">{formatCurrency(item.amount)}</div>
            </div>
          ))}
        </div>
        <div className="sales-chart-labels">
          {salesData.map(item => (
            <div key={item.date} className="sales-chart-label">{item.date}</div>
          ))}
        </div>
      </div>
    );
  };

  // Generate table view
  const renderTable = () => {
    return (
      <div className="sales-table-container">
        <table className="sales-data-table">
          <thead>
            <tr>
              <th>Period</th>
              <th>Amount</th>
              <th>% of Total</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map(item => (
              <tr key={item.date}>
                <td>{item.date}</td>
                <td>{formatCurrency(item.amount)}</td>
                <td>{totalSales > 0 ? ((item.amount / totalSales) * 100).toFixed(1) : '0'}%</td>
              </tr>
            ))}
            <tr className="sales-total-row">
              <td><strong>Total</strong></td>
              <td><strong>{formatCurrency(totalSales)}</strong></td>
              <td>100%</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const handlePeriodChange = (e) => {
    setSelectedPeriod(e.target.value);
  };

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  return (
    <div className="sales-page">
      <div className="sales-header">
        <button className="sales-back-button" onClick={() => navigate('/')} aria-label="Back to dashboard">
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Back to Dashboard</span>
        </button>
        <h1>Sales Analysis</h1>
        <div className="sales-period-container">
          <label htmlFor="period-select">View by: </label>
          <select 
            id="period-select"
            className="sales-period-selector" 
            value={selectedPeriod}
            onChange={handlePeriodChange}
            aria-label="Select time period"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      <div className="sales-summary">
        <div className="sales-summary-card">
          <h2>Total Sales</h2>
          <div className="sales-summary-value">{formatCurrency(totalSales)}</div>
          <div className={`sales-growth-indicator ${salesGrowth >= 0 ? 'positive' : 'negative'}`}>
            <FontAwesomeIcon icon={salesGrowth >= 0 ? faArrowUp : faArrowDown} />
            <span>{Math.abs(salesGrowth)}% vs previous period</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="sales-loading-container">
          <div className="sales-loading-spinner"></div>
          <p>Loading sales data...</p>
        </div>
      ) : (
        <div className="sales-content">
          <div className="sales-view-toggle">
            <button 
              className={`sales-view-button ${activeView === 'chart' ? 'active' : ''}`}
              onClick={() => handleViewChange('chart')}
              aria-label="Switch to chart view"
            >
              <FontAwesomeIcon icon={faChartBar} /> Chart View
            </button>
            <button 
              className={`sales-view-button ${activeView === 'table' ? 'active' : ''}`}
              onClick={() => handleViewChange('table')}
              aria-label="Switch to table view"
            >
              <FontAwesomeIcon icon={faFilter} /> Table View
            </button>
            <button 
              className="sales-view-button"
              aria-label="Export data"
            >
              <FontAwesomeIcon icon={faDownload} /> Export Data
            </button>
          </div>

          {activeView === 'chart' ? (
            <div className="sales-chart-container">
              <h2>{selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} Sales Performance</h2>
              {renderChart()}
            </div>
          ) : (
            <div className="sales-table-section">
              <h2>Sales Breakdown</h2>
              {renderTable()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Sales; 