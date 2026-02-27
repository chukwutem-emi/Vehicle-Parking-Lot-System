import {Server} from "socket.io";
import http from "http";
import {Message} from "./models/message.js";
import jwt from "jsonwebtoken";
import {v4} from "uuid"
import { Conversation } from "./models/conversation.js";
import { User } from "./models/user.js";

type MessageType = {
    conversationId: number,
    content: string,
    replyId?: number
};
interface JwtUser {
    userId: number
};
export const socketIOServer = (httpServer: http.Server) => {
    try {
        const io = new Server(httpServer);
        
        io.use((socket, next) => {
            const token = socket.handshake.auth.token;
            try {
                const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as JwtUser;
                socket.userId = decoded.userId;
                next()
            } catch (err: any) {
                next(new Error("Unauthorized"))
            }
        });
        io.on("connection", (socket) => {
            console.log(`Socket ${socket.userId} connected!.`);
    
            socket.on("join_conversation", async ({conversationId}) => {
                const conversation = await Conversation.findByPk(conversationId);
                if (!conversation) return;
                const room = `Conversation_${conversationId}`;
                socket.join(room);

                // send an existing message to this admin

                const messages = await Message.findAll({
                    where:{conversationId},
                    include: [{model: User, attributes: ["id", "username"]}],
                    order: [["createdAt", "ASC"]]
                });
                socket.emit("conversation_history", messages);
            });
            // send new messages
            socket.on("send_message", async ({conversationId, content, replyId}: MessageType) => {
                const message = await Message.create({
                    conversationId: conversationId,
                    senderId: socket.userId,
                    content: content,
                    replyTo: replyId
                })
                const fullMessage = await Message.findByPk(message.id, {
                    include: [{model: User, attributes: ["id", "username"]}]
                })
                // Broadcast to all admins in the conversation room
                io.to(`conversation_${conversationId}`).emit("new_message", fullMessage);
            })
            // Typing indicator
            socket.on("typing", ({conversationId}) => {
                socket.to(`conversation_${conversationId}`).emit("user_typing", socket.userId)
            });
            socket.on("disconnect", () => {
                console.log("User disconnected:", socket.userId)
            });
        });
    } catch (err: any) {
        console.log("SOCKET-ERROR:", err);
    };
};
