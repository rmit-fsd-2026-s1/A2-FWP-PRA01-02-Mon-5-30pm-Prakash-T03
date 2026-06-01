import "reflect-metadata";
import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import * as path from "path";
import { AppDataSource } from "./data-source";
import { createDatabaseIfNotExists } from "./create-db";
import authRoutes from "./routes/auth";
import venueRoutes from "./routes/venues";
import applicationRoutes from "./routes/applications";
import documentRoutes from "./routes/documents";
import analyticsRoutes from "./routes/analytics";

// Load environment variables from .env
dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" })); // Support large base64 file uploads for documents

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/analytics", analyticsRoutes);

// Simple Health Check Endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date(),
    message: "Venue Vendors Backend is up and running"
  });
});

// Initialize Database & Start Server
const startServer = async () => {
  try {
    await createDatabaseIfNotExists();
    await AppDataSource.initialize();
    console.log("MySQL Database connection successfully established via TypeORM.");
    
    app.listen(PORT, () => {
      console.log(`Backend server is running in development mode on port ${PORT}.`);
    });
  } catch (error) {
    console.error("Error during database initialization/startup:", error);
    process.exit(1);
  }
};

startServer();
