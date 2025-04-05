import express from "express";
import cors from "cors";

// Route imports (using default exports)
import userRoutes from "./routes/user.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import itemRoutes from "./routes/item.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js";
import settingsRoutes from "./routes/settings.routes.js";

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

// JSON parsing
app.use(express.json());

// API Routes
app.use("/api/user", userRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/settings", settingsRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "404 Not Found: The requested resource could not be found.",
  });
});

export { app };
