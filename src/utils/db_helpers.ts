import { Sequelize } from "sequelize";
import fs from "fs";
import path from "path";



const caPath = path.join(process.cwd(), "certificate/ca.pem");

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
        },
        dialectOptions: {
            ssl: {
                ca: fs.readFileSync(caPath),
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