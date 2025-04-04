import express from "express";
import cors from "cors";


const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());

// 404 Middleware (at the bottom)
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "404 Not Found: The requested resource could not be found."
    });
});

export { app };
