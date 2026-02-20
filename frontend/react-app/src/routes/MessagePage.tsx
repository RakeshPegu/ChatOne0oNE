import { useLoaderData } from "react-router-dom";
import React, { useEffect, useState } from "react";
import MessageCard from "../cards/MessageCard";
import socket from "../lib/socket";

interface Chat {
  _id: string;
  userIDs: string[];
  isGroup: boolean;
}

interface Message {
  _id: string;
  chatId: string;
  text: string;
  senderId: string;
  createdAt:string,
  seenBy: string[]
}

function MessagePage() {
  const { chat, messages } = useLoaderData() as {
    chat: Chat | null;
    messages: Message[];
  };

  const [text, setText] = useState("");
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [chatMessages, setChatMessages] = useState<Message[]>(messages || []);

  const handleSendMessage = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!text.trim() || !chat?._id) return;

    const messagePayload = {
      chatId: chat._id,
      text: text.trim(),
    };

    socket.emit("msg", messagePayload);
    setText("");
  };

  useEffect(() => {
    if (!chat?._id) return;
    socket.emit("join-room", chat._id);

    const handleConnect = () => {
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleIncomingMessage = (newMessage: Message) => {
      if (newMessage.chatId === chat._id) {
        setChatMessages((prev) => [...prev, newMessage]);
      }
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("recieve-msg", handleIncomingMessage);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("recieve-msg", handleIncomingMessage);
    };
  }, [chat?._id, socket.connected]);


  return (
    <div className="flex flex-col h-[93vh] items-center">

      <div className="flex flex-row w-full justify-between bg-gray-500 p-3">
        <div className="flex gap-5 items-center">
          <img
            src="profile.png"
            className="rounded-full w-8 h-8"
            alt="profile"
          />
          <div className="flex flex-col">
            <p className="font-mono"> Rakesh pegu</p>
            <p>{isConnected ? "Online" : "Offline"}</p>
          </div>
        </div>
      </div>
      <div className="h-[85vh] overflow-y-scroll bg-gray-100 w-full p-3">
        {chatMessages.length === 0 ? (
          <p className="text-center text-gray-400 mt-4">
            No messages yet. Say hi 👋
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {chatMessages.map((msg) => (
              <li key={msg._id}>
                <MessageCard messages={msg} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* INPUT AREA */}
      <form
        className="flex w-full items-center gap-2 p-3 bg-white"
        onSubmit={handleSendMessage}
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your message…"
          className="flex-1 border p-2 rounded outline-none resize-none"
        />
        <button
          disabled={!text.trim()}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-40"
          type="submit"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default MessagePage;
