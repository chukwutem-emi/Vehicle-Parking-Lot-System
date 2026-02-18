import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
    process.env.DATABASE_NAME as string,
    process.env.USER as string,
    process.env.PASSWORD as string,
    {
        dialect: "mysql",
        host: process.env.HOST as string,
        define: {
            freezeTableName: true,
            underscored: true
        }
    }
);

export default sequelize;