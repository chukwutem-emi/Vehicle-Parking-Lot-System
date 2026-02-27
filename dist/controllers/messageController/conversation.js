import { Conversation } from "../../models/conversation.js";
import { User } from "../../models/user.js";
export const getConversationId = async (req, res, next) => {
    const type = "admin_global";
    try {
        const currentUser = await User.findByPk(req.userId);
        if (!currentUser)
            return;
        if (!currentUser.isAdmin)
            return;
        let conversation = await Conversation.findOne({
            where: {
                type: type
            }
        });
        if (!conversation) {
            conversation = await Conversation.create({
                type: type
            });
        }
        ;
        return res.status(200).json({ conversationId: conversation.id });
    }
    catch (err) {
        next(err);
    }
};
