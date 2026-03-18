import type{ Request, Response, NextFunction } from "express";
import {User} from "../../models/user.js";
import { initModels } from "../../models/index.js";


const sequelize = initModels();
export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    try {
        if (!sequelize) throw new Error("Sequelize instance not initialized");
        console.log("Connecting database..........");
        await sequelize.authenticate();
        console.log("Database connected!");
        const getUserById = await User.findByPk(userId)
        if (!getUserById) {
            return res.status(404).json({message: "User not found!."});
        };
        return res.status(200).json({userDetails: getUserById});
    } catch (err: any) {
        next(err);
    };
};