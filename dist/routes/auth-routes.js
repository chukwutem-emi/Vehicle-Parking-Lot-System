// Auth-Controller imports
import { createUser } from "../controllers/authController/signup.js";
import { login } from "../controllers/authController/login.js";
import { getUser } from "../controllers/authController/getUser.js";
import { getAllUsers } from "../controllers/authController/getAllUsers.js";
import { updateUserDetails } from "../controllers/authController/updateUserDetails.js";
import { promoteUser } from "../controllers/authController/promoteUser.js";
import { resetPassword, updatePassword } from "../controllers/authController/resetPassword.js";
import { deleteUser } from "../controllers/authController/deleteUser.js";
// Third-party imports
import express from "express";
import { demoteUser } from "../controllers/authController/demoteUser.js";
// Auth-Middleware import
import { isAuth } from "../middleware/is-auth.js";
export const authRouter = express.Router();
authRouter.post("/signup", createUser);
authRouter.post("/login", login);
authRouter.get("/user", isAuth, getUser);
authRouter.get("/users", isAuth, getAllUsers);
authRouter.put("/update-user/:userId", isAuth, updateUserDetails);
authRouter.put("/promote/:userId", isAuth, promoteUser);
authRouter.put("/demote/:userId", isAuth, demoteUser);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/update-password/:resetToken", updatePassword);
authRouter.delete("/user/:userId", isAuth, deleteUser);
