import Invoice from "../models/invoice.model.js";
import Customer from "../models/customer.model.js";

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const lastMonthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

    // Get current month invoices
    const currentMonthInvoices = await Invoice.find({
      user: userId,
      createdAt: { $gte: firstDayOfMonth }
    });

    // Get last month invoices
    const lastMonthInvoices = await Invoice.find({
      user: userId,
      createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
    });

    // Calculate total sales for current month
    const totalSales = currentMonthInvoices.reduce((sum, invoice) => sum + (invoice.totalAmount || 0), 0);
    
    // Calculate total sales for last month
    const lastMonthSales = lastMonthInvoices.reduce((sum, invoice) => sum + (invoice.totalAmount || 0), 0);
    
    // Calculate sales growth
    const salesGrowth = lastMonthSales > 0 
      ? parseFloat(((totalSales - lastMonthSales) / lastMonthSales * 100).toFixed(1))
      : 100;

    // Get total orders
    const totalOrders = currentMonthInvoices.length;
    const lastMonthOrders = lastMonthInvoices.length;
    const orderGrowth = lastMonthOrders > 0 
      ? parseFloat(((totalOrders - lastMonthOrders) / lastMonthOrders * 100).toFixed(1))
      : 100;

    // Get pending invoices
    const pendingInvoices = await Invoice.countDocuments({
      user: userId,
      status: { $in: ['unpaid', 'partial'] }
    });

    const lastMonthPendingInvoices = await Invoice.countDocuments({
      user: userId,
      status: { $in: ['unpaid', 'partial'] },
      createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
    });

    const pendingGrowth = lastMonthPendingInvoices > 0 
      ? parseFloat(((pendingInvoices - lastMonthPendingInvoices) / lastMonthPendingInvoices * 100).toFixed(1))
      : 0;

    // Get new customers for current month
    const newCustomers = await Customer.countDocuments({
      user: userId,
      createdAt: { $gte: firstDayOfMonth }
    });

    // Get new customers for last month
    const lastMonthNewCustomers = await Customer.countDocuments({
      user: userId,
      createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd }
    });

    // Calculate customer growth
    const customerGrowth = lastMonthNewCustomers > 0 
      ? parseFloat(((newCustomers - lastMonthNewCustomers) / lastMonthNewCustomers * 100).toFixed(1))
      : 100;

    res.json({
      totalSales,
      newCustomers,
      totalOrders,
      pendingInvoices,
      salesGrowth,
      customerGrowth,
      orderGrowth,
      pendingGrowth
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get sales data by period (daily, weekly, monthly)
export const getSalesData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period } = req.params; // daily, weekly, monthly
    const currentDate = new Date();
    let startDate, endDate;
    let format;
    let results = [];

    switch (period) {
      case 'daily':
        // Last 30 days
        startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - 30);
        format = day => `${day.getDate()}/${day.getMonth() + 1}`;
        break;
      case 'weekly':
        // Last 12 weeks
        startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - 84); // 12 weeks * 7 days
        format = day => `Week ${Math.ceil((day.getDate() + new Date(day.getFullYear(), day.getMonth(), 1).getDay()) / 7)}`;
        break;
      case 'monthly':
        // Last 12 months
        startDate = new Date(currentDate);
        startDate.setMonth(currentDate.getMonth() - 12);
        format = day => {
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return months[day.getMonth()];
        };
        break;
      default:
        return res.status(400).json({ message: "Invalid period specified" });
    }

    // Get all invoices in the date range
    const invoices = await Invoice.find({
      user: userId,
      createdAt: { $gte: startDate, $lte: currentDate }
    }).sort({ createdAt: 1 });

    if (period === 'daily') {
      // Group by day
      const dailyData = {};
      
      // Initialize all days in the range
      for (let i = 0; i < 30; i++) {
        const day = new Date(currentDate);
        day.setDate(currentDate.getDate() - i);
        dailyData[format(day)] = 0;
      }
      
      // Populate with actual data
      invoices.forEach(invoice => {
        const day = format(new Date(invoice.createdAt));
        if (dailyData[day] !== undefined) {
          dailyData[day] += invoice.totalAmount || 0;
        }
      });
      
      results = Object.entries(dailyData).map(([date, amount]) => ({ date, amount }));
    } else if (period === 'weekly') {
      // Group by week
      const weeklyData = {};
      
      // Initialize all weeks in the range
      for (let i = 0; i < 12; i++) {
        const day = new Date(currentDate);
        day.setDate(currentDate.getDate() - (i * 7));
        weeklyData[format(day)] = 0;
      }
      
      // Populate with actual data
      invoices.forEach(invoice => {
        const invoiceDate = new Date(invoice.createdAt);
        const week = format(invoiceDate);
        if (weeklyData[week] !== undefined) {
          weeklyData[week] += invoice.totalAmount || 0;
        }
      });
      
      results = Object.entries(weeklyData).map(([date, amount]) => ({ date, amount }));
    } else if (period === 'monthly') {
      // Group by month
      const monthlyData = {};
      
      // Initialize all months in the range
      for (let i = 0; i < 12; i++) {
        const day = new Date(currentDate);
        day.setMonth(currentDate.getMonth() - i);
        monthlyData[format(day)] = 0;
      }
      
      // Populate with actual data
      invoices.forEach(invoice => {
        const month = format(new Date(invoice.createdAt));
        if (monthlyData[month] !== undefined) {
          monthlyData[month] += invoice.totalAmount || 0;
        }
      });
      
      results = Object.entries(monthlyData).map(([date, amount]) => ({ date, amount }));
    }

    // Sort results chronologically
    results.sort((a, b) => {
      if (period === 'monthly') {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months.indexOf(a.date) - months.indexOf(b.date);
      }
      return a.date.localeCompare(b.date);
    });

    res.json(results);
  } catch (error) {
    console.error("Sales data error:", error);
    res.status(500).json({ message: error.message });
  }
}; 