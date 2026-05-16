import { Sequelize } from "sequelize";
import fs from "fs";
import path from "path";
let sequelize;
const getSSL = () => {
    const lambdaCaPath = path.join(process.cwd(), "certificate/ca.pem");
    const renderCaPath = path.resolve(process.cwd(), "src/certificate/ca.pem");
    if (fs.existsSync(lambdaCaPath)) {
        return fs.readFileSync(lambdaCaPath);
    }
    if (fs.existsSync(renderCaPath)) {
        return fs.readFileSync(renderCaPath);
    }
    if (process.env.CA_PEM) {
        return Buffer.from(process.env.CA_PEM.replace(/\\n/g, "\n"));
    }
    console.warn("[db_helpers] No SSL certificate found.");
    return undefined;
};
export const getSequelize = () => {
    if (!sequelize) {
        console.log("Initializing Sequelize...");
        const sslCa = getSSL();
        sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
            dialect: "mysql",
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            define: {
                freezeTableName: true,
                underscored: true
            },
            dialectOptions: sslCa
                ? {
                    ssl: {
                        ca: sslCa,
                        rejectUnauthorized: true
                    }
                }
                : {},
            logging: false,
            pool: {
                max: 5,
                min: 0,
                idle: 10000,
                acquire: 30000
            }
        });
    }
    return sequelize;
};
