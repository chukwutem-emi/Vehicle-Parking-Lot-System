import { Sequelize } from "sequelize";
import fs from "fs";
import path from "path";
const caPath = path.join(process.cwd(), "certificate/ca.pem");
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    dialect: "mysql",
    host: process.env.DB_HOST,
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
});
export default sequelize;
