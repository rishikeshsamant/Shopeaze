import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import mongoose from "mongoose";
import { app } from "./app.js";
import { PORT } from "./constants.js";

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MONGO DB connection failed:", err);
    process.exit(1);
  });
