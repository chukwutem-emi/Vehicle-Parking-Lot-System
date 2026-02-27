// Third-parky module
import express from "express";
// Conversation-controller import
import { getConversationId } from "../controllers/messageController/conversation.js";
// Auth-Middleware imports
import { isAuth } from "../middleware/is-auth.js";
export const messageRouter = express.Router();
messageRouter.get("/conversation", isAuth, getConversationId);
