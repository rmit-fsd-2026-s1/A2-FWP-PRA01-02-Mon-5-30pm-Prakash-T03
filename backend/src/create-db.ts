import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(__dirname, "../.env") });

export async function createDatabaseIfNotExists() {
  const host = process.env.DB_HOST || "localhost";
  const port = parseInt(process.env.DB_PORT || "3306", 10);
  const user = process.env.DB_USER || "root";
  const password = process.env.DB_PASSWORD || "password";
  const database = process.env.DB_NAME || "venue_vendors";

  try {
    const connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
    });

    console.log(`Connecting to MySQL server at ${host}:${port} to check/create database...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    console.log(`Database '${database}' is verified / successfully created.`);
    await connection.end();
  } catch (error) {
    console.error("Error creating database programmatically:", error);
    throw error;
  }
}
