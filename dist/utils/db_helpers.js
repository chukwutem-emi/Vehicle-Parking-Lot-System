import { Sequelize } from "sequelize";
import fs from "fs";
import path from "path";
//const caPath = path.join(process.cwd(), "certificate/ca.pem");
const lambdaCaPath = path.join(process.cwd(), "certificate/ca.pem");
const renderCaPath = path.resolve(process.cwd(), "src/certificate/ca.pem");
let sslCa;
if (fs.existsSync(lambdaCaPath)) {
    sslCa = fs.readFileSync(lambdaCaPath);
}
else if (fs.existsSync(renderCaPath)) {
    sslCa = fs.readFileSync(renderCaPath);
}
else if (process.env.CA_PEM) {
    sslCa = Buffer.from(process.env.CA_PEM.replace("/\\n/g", "\n"));
}
else {
    console.warn("[db_helpers] No SSL certificate found. MySQL connection will be unencrypted!");
}
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    dialect: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    define: {
        freezeTableName: true,
        underscored: true
    },
    dialectOptions: sslCa ? {
        ssl: {
            ca: sslCa,
            rejectUnauthorized: true
        }
    } : {},
    logging: false,
    pool: {
        max: 5,
        min: 0,
        idle: 10000,
        acquire: 30000
    }
});
export default sequelize;
