import { messageModel } from "../lib/db.js";

export const createMessage = async ({ chatId, text, senderId }) => {
  return await messageModel.create({
    chatId,
    text,
    senderId
  });
};
