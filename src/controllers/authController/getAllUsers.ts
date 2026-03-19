import type{Request, Response, NextFunction} from "express";
import {userRole} from "../../models/user.js";
import { initModels, User } from "../../models/index.js";


const sequelize = initModels();
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    const currentPage = Number(req.query.currentPage) || 1;
    const limit = Number(req.query.limit) || 1;
    const offset = (currentPage - 1) * limit;
    const role = req.query.role;
    const sort = req.query.sort || "createdAt"
    const currentUser = req.userId;
    try {
        if (!sequelize) throw new Error("Sequelize instance not initialized");
        console.log("Connecting database..........");
        await sequelize.authenticate();
        console.log("Database connected!");
        const getUser = await User.findByPk(currentUser);
        if (getUser === undefined || getUser === null) {
            return res.status(404).json({message: "We could not find the current logged-in user. Please ensure you are logged in."});
        };
        if (!getUser.isAdmin || ![userRole.ADMIN, userRole.SUPER].includes(getUser.userRole)) {
            return res.status(401).json({message: "Unauthorized request. Only Admins and Super Admins can access the list of users."});
        };
        const where: any = {};

        if (role) {
            where.userRole = role;
        };
        let order: any = [["createdAt", "DESC"]];

        if (typeof sort === "string") {
            if (sort.startsWith("-")) {
                order = [[sort.substring(1), "DESC"]]
            } else {
                order = [sort, "ASC"]
            }
        };
        const {count, rows} = await User.findAndCountAll({
            where: where,
            offset: offset,
            limit: limit,
            order: order
        });
        if (rows.length === 0) {
            return res.status(200).json({message: "The user database is empty.", usersDetails: []});
        };
        return res.status(200).json({
            data: rows,
            pagination: {
                total: count,
                currentPage,
                limit,
                totalPages: Math.ceil(count / limit),
            }
        });
    } catch (err: any) {
        next(err);
    };
};