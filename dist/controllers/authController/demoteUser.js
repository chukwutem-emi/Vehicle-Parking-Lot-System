import { initModels, User } from "../../models/index.js";
import { userRole } from "../../models/user.js";
const sequelize = initModels();
export const demoteUser = async (req, res, next) => {
    const userId = Number(req.params.userId);
    try {
        if (!sequelize)
            throw new Error("Sequelize instance not initialized");
        if (!userId || isNaN(userId)) {
            return res.status(400).json({ message: "Invalid user ID. User ID must be a number." });
        }
        ;
        const getSuperAdmin = await User.findByPk(req.userId);
        if (getSuperAdmin === undefined || getSuperAdmin === null) {
            return res.status(404).json({ message: "We could not find the current logged-in user. Please ensure you are logged in." });
        }
        if (getSuperAdmin.userRole !== userRole.SUPER) {
            return res.status(401).json({ message: "Unauthorized request. Only Super Admins can promote users to admin." });
        }
        ;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found.  Please ensure the user ID is correct." });
        }
        ;
        user.isAdmin = false;
        user.userRole = userRole.REGULAR;
        await user.save();
        return res.status(200).json({ message: `${user.username} has been demoted to a regular user successfully!` });
    }
    catch (err) {
        next(err);
    }
    ;
};
