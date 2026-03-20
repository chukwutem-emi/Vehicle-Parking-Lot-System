import type{Response, Request, NextFunction} from "express";
import * as validation from "../../utils/validation.js";
import {userRole} from "../../models/user.js";
import { initModels, User, VehicleType } from "../../models/index.js";



const sequelize = initModels();
/**
 * Fetch vehicle-types by their name.
*/
export const getVehicleByName = async (req: Request, res: Response, next: NextFunction) => {
    const vehicleName: string = req.body.vehicleName;
    try {
        if (!sequelize) throw new Error("Sequelize instance not initialized");
        console.log("Connecting database..........");
        await sequelize.authenticate();
        console.log("Database connected!");
        const vehicleNameInput: validation.ValidateAble = {
            value         : vehicleName,
            required      : true,
            maximumLength : 100,
            minimumLength : 2
        };
        if (!validation.validate(vehicleNameInput)) {
            return res.status(400).json({message: `Invalid input. Vehicle name is required and it must have a minimum of: ${vehicleNameInput.minimumLength} and a maximum of: ${vehicleNameInput.maximumLength} characters length.`});
        };
        const currentUser = await User.findByPk(req.userId);
        if (currentUser === undefined || currentUser === null) {
            return res.status(404).json({message: "User with the Logged-In ID not found!."});
        };
        if (!currentUser.isAdmin || ![userRole.ADMIN, userRole.SUPER].includes(currentUser.userRole)) {
            return res.status(401).json({message: "Unauthorized request. Only Admins can fetch other users"});
        };
        const vehicleDetails = await VehicleType.findOne({
            where: {
                vehicleName: vehicleName
            }
        });
        if (!vehicleDetails) {
            return res.status(404).json({message: "That type of vehicle is not allowed here."});
        }
        return res.status(200).json({vehicleDetails: vehicleDetails});
    } catch (err: any) {
        next(err);
    }
};
/**
 * Fetch all vehicle-types. 
 */
export const getAllVehicles = async (req: Request, res: Response, next: NextFunction) => {
    const sequelize = initModels();
    const limit = Number(req.query.limit) || 1;
    const sort = req.query.sort || "createdAt";
    const currentPage = Number(req.query.currentPage) || 1;
    const offset = (currentPage - 1) * limit;
    try {
        if (!sequelize) throw new Error("Sequelize instance not initialized");
        console.log("Connecting database..........");
        await sequelize.authenticate();
        console.log("Database connected!");
        const currentUser = await User.findByPk(req.userId);
        if (!currentUser) {
            return res.status(404).json({message: "We couldn't find the current logged-in user. Please ensure you are logged in."});
        };
        if (currentUser.userRole !== userRole.SUPER) {
            return res.status(401).json({message: "Unauthorized request. Only Super Admins can fetch all vehicle-types."});
        };
        let order: any = [["createdAt", "DESC"]];

        if (typeof sort === "string") {
            if (sort.startsWith("-")) {
                order = [[sort.substring(1), "DESC"]];
            } else {
                order = [[sort, "ASC"]];
            };
        };
        const {count, rows} = await VehicleType.findAndCountAll({
            offset: offset,
            limit: limit,
            order: order
        });
        if (rows.length === 0) {
            return res.status(200).json({message: "Vehicle database is empty.", fetchAllVehicles: []});
        };
        return res.status(200).json({
            data: rows,
            pagination: {
                currentPage,
                limit,
                total: count,
                totalPage: Math.ceil(count / limit)
            }
        });
    } catch (err: any) {
        next(err);
    }
};