import { useState } from "react";
import { useAuthStore } from "../stores/auth.store";

interface Messages {
  _id: string;
  text: string;
  senderId:string
}

interface MessageCardProps {
  messages: Messages;
  isOwnMessage?: boolean;
}

function MessageCard({
  messages
}: MessageCardProps) {
  const {user} = useAuthStore()
  const isOwnMessage = user?._id !== messages.senderId ? true : false 

  return (
    <div
      className={`flex w-full px-4 py-1 ${
        isOwnMessage ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[75%] sm:max-w-[65%] wrap-break-word whitespace-pre-wrap rounded-2xl px-4 py-2 text-sm leading-relaxed shadow-sm ${
          isOwnMessage
            ? "bg-blue-600 text-white rounded-br-sm"
            : "bg-gray-700 text-gray-100 rounded-bl-sm"
        }`}
      >
        {messages.text}
      </div>
    </div>
  );
}

export default MessageCard;