import { User, userRole } from "../models/user.js";
export const createUser = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const userAddress = req.body.userAddress;
};
