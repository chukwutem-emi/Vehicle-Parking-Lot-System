import { initModels, User } from "../../models/index.js";
const sequelize = initModels();
export const getUser = async (req, res, next) => {
    const userId = req.userId;
    try {
        if (!sequelize)
            throw new Error("Sequelize instance not initialized");
        const getUserById = await User.findByPk(userId);
        if (getUserById === undefined || getUserById === null) {
            return res.status(404).json({ message: "User not found!." });
        }
        ;
        return res.status(200).json({ userDetails: getUserById });
    }
    catch (err) {
        next(err);
    }
    ;
};
