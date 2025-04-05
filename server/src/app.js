import express from "express";
import cors from "cors";

// Route imports (using default exports)
import userRoutes from "./routes/user.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import itemRoutes from "./routes/item.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

const app = express();

// Remove quotes from CORS_ORIGIN if they exist
const corsOrigin = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.replace(/"/g, '') : "http://localhost:5173";

// CORS setup
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);

// Configure body parsers with increased limits for file uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// API Routes
app.use("/api/user", userRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/dashboard", dashboardRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "404 Not Found: The requested resource could not be found.",
  });
});

export { app };
