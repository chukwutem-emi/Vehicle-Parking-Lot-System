// Express types
import type{Request, Response, NextFunction} from "express";
// Model
import {User, userRole} from "../../models/user.js";


export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    const currentUser = req.userId;
    try {
        const getUser = await User.findByPk(currentUser);
        if (!getUser) {
            return res.status(404).json({message: "We could not find the current logged-in user. Please ensure you are logged in."});
        };
        if (!getUser.isAdmin && getUser.userRole !== userRole.SUPER) {
            return res.status(401).json({message: "Unauthorized request. Only Admins and Super Admins can access the list of users."});
        };
        const usersDetails = await User.findAll();
        if (usersDetails.length === 0) {
            return res.status(200).json({message: "The user database is empty.", usersDetails: []});
        };
        return res.status(200).json({usersDetails: usersDetails});
    } catch (err: any) {
        next(err);
    };
};