// Express types
import type{ Request, Response, NextFunction } from "express";
// Model
import {User} from "../../models/user.js";

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    try {
        const getUserById = await User.findByPk(userId)
        if (!getUserById) {
            return res.status(404).json({message: "User not found!."});
        };
        return res.status(200).json({userDetails: getUserById});
    } catch (err: any) {
        next(err);
    };
};