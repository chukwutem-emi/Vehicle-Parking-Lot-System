import {User, userRole} from "../models/user.js";
import type{Request, Response, NextFunction} from "express";


export const createUser = (req: Request, res: Response, next: NextFunction) => {
    const username: string = req.body.username;
    const password: string = req.body.password;
    const userAddress: string = req.body.userAddress;
    
};