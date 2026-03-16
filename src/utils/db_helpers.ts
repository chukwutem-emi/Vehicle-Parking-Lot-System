import { Sequelize } from "sequelize";
import fs from "fs";
import path from "path";



const caPath = path.join(process.cwd(), "certificate/ca.pem");
let caCert: Buffer;
try {
    caCert = fs.readFileSync(caPath);
} catch (err) {
    console.error("Failed to read ssl certificate:", err);
    throw err;
}

const sequelize = new Sequelize(
    process.env.DB_NAME as string,
    process.env.DB_USER as string,
    process.env.DB_PASSWORD as string,
    {
        dialect: "mysql",
        host: process.env.DB_HOST as string,
        port: Number(process.env.DB_PORT),
        define: {
            freezeTableName: true,
            underscored: true
        } as any,
        dialectOptions: {
            ssl: {
                ca: fs.readFileSync(caCert),
                rejectUnauthorized: true
            }
        },
        logging: false,
        pool: {
            max: 5,
            min: 0,
            idle: 10000,
            acquire: 30000
        }
    }
);

export default sequelize;