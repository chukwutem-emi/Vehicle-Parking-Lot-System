// Model
import {User, userRole} from "../../models/user.js";
// Express types
import type{Request, Response, NextFunction} from "express";


export const promoteUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId: number = Number(req.params.userId);

    try {
        if (isNaN(userId)) {
            return res.status(400).json({message: "Invalid user ID. User ID must be a number."});
        };
        const getSuperAdmin = await User.findByPk(req.userId);
        if (!getSuperAdmin) {
            return res.status(404).json({message: "We could not find the current logged-in user. Please ensure you are logged in."});
        }
        if (!getSuperAdmin.isAdmin && getSuperAdmin.userRole !== userRole.SUPER) {
            return res.status(401).json({message: "Unauthorized request. Only Super Admins can promote users to admin."});
        };
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({message: "User not found.  Please ensure the user ID is correct."});
        };
        user.isAdmin  = true;
        user.userRole = userRole.ADMIN;
        await user.save();
        return res.status(200).json({message: `${user.username} has been promoted to admin successfully!`}); 
    } catch (err: any) {
        next(err)
    };
};