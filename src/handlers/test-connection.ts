// test-connection.ts
import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

export const handler = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { ca: fs.readFileSync(path.join(process.cwd(), "certificate/ca.pem")) }, // path relative to Lambda
    });

    await connection.execute("SELECT 1");
    console.log("✅ Connected to Aiven MySQL!");
    
    await connection.end(); // close connection
  } catch (err) {
    console.error("❌ Connection failed:", err);
  }
};