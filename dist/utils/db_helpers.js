import { Sequelize } from "sequelize";
console.log("ENV USER =", process.env.DB_USER);
console.log("ENV PASSWORD =", process.env.DB_PASSWORD);
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    dialect: "mysql",
    host: process.env.DB_HOST,
    define: {
        freezeTableName: true,
        underscored: true
    }
});
export default sequelize;
