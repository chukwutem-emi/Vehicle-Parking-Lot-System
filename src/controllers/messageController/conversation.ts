import type {Request, Response, NextFunction} from "express"
import { initModels, User, Conversation } from "../../models/index.js";


const sequelize = initModels();
export const getConversationId = async (req: Request, res: Response, next: NextFunction) => {
    const type: string = "admin_global";

    try {
        if (!sequelize) throw new Error("Sequelize instance not initialized");
        const currentUser = await User.findByPk(req.userId);
        if (currentUser === undefined || currentUser === null) return;
        if (!currentUser.isAdmin) return;

        let conversation = await Conversation.findOne({
            where: {
                type: type
            }
        });
        if (!conversation) {
            conversation = await Conversation.create({
                type: type
            })
        };
        return res.status(200).json({conversationId: conversation.id});
    } catch (err: any) {
        next(err);
    }
};