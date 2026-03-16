// test-connection.ts
import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

export const handler = async () => {
  try {
    console.log("File in /var/task:", fs.readdirSync("/var/task"));
    console.log("Connecting to:", process.env.DB_HOST, process.env.DB_PORT);
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { ca: fs.readFileSync(path.join(process.cwd(), "certificate/ca.pem")) }, // path relative to Lambda
    });

    const [rows] = await connection.execute("SELECT 1");
    console.log("ROWS", rows);
    console.log("✅ Connected to Aiven MySQL!");
    await  connection.end();
    return rows;
  } catch (err) {
    console.error("❌ Connection failed:", err);
  }
};