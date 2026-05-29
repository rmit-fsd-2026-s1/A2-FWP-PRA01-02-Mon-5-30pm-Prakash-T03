import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables from .env
dotenv.config({ path: path.join(__dirname, "../.env") });

import { User } from "./entity/User";
import { Venue } from "./entity/Venue";
import { Application } from "./entity/Application";
import { HireHistory } from "./entity/HireHistory";
import { HirerDocument } from "./entity/HirerDocument";
import { VendorComment } from "./entity/VendorComment";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306", 10),
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "venue_vendors",
  synchronize: true, // Auto-creates table structure on sync (good for college projects)
  logging: false,
  entities: [User, Venue, Application, HireHistory, HirerDocument, VendorComment],
  migrations: [],
  subscribers: [],
});
