// Model
import {User, userRole} from "../../models/user.js";
// Express types
import type{ Request, Response, NextFunction} from "express";


export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId: number = Number(req.params.userId);
    try {
        if (isNaN(userId)){
            return res.status(400).json({message: "Invalid user ID."});
        };
        const superAdmin = await User.findByPk(req.userId);
        if (!superAdmin) {
            return res.status(404).json({message: "We could not find the current logged-in user."});
        }
        if (!superAdmin.isAdmin && superAdmin.userRole !== userRole.SUPER) {
            return res.status(401).json({message: "Unauthorized request. Only Super Admins can delete users."});
        };
        const userInfo = await User.findByPk(userId);
        if (!userInfo) {
            return res.status(404).json({message: "User not found."});
        };
        userInfo.destroy();
        return res.status(200).json({message: `${userInfo.username} has been deleted!.`});
    } catch (err: any) {
        next(err);
    };
};