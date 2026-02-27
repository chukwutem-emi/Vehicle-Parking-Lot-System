// Model
import { User } from "../../models/user.js";
export const getUser = async (req, res, next) => {
    const userId = req.userId;
    try {
        const getUserById = await User.findByPk(userId);
        if (!getUserById) {
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
