import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { useAuthStore } from "../stores/auth.store";
import apiRequest from "../lib/apiRequest";
import { useNavigate } from "react-router-dom";

interface ChatInfo {
  _id: string;
  userIDs: string[];
}

interface ReceiverInfo {
  _id: string;
  username: string;
}

interface ChatCardProps {
  chatInfo: ChatInfo;
  lastMessage?: string;
  unreadCount?: number;
  lastMessageAt?: string;
  isActive?: boolean;
  
}

function ChatCard({
  chatInfo,
  lastMessage = "Start a conversation",
  unreadCount = 0,
  lastMessageAt,
  isActive = false,
  
}: ChatCardProps) {
  const [receiverInfo, setReceiverInfo] = useState<ReceiverInfo | null>(
    null
  );
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const {user} = useAuthStore();
  const onClick = async()=>{
    navigate(`/chat/${receiverInfo?._id}/message`)
  }

  useEffect(() => {
    if (!user?._id || !chatInfo?.userIDs?.length) {
      setLoading(false);
      return;
    }

    let cancelled = false;


    
    const receiverId = chatInfo.userIDs.find(
      (id) => id.toString() !== user?._id.toString()
    );

    if (!receiverId) {
      setReceiverInfo(null);
      setLoading(false);
      return;
    }

    const fetchReceiverInfo = async () => {
      setLoading(true);
      setError(false);

      try {
        const res = await apiRequest.get<ReceiverInfo>(
          `/users/${receiverId}`
        );

        if (!cancelled) {
          setReceiverInfo(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch receiver information:", err);

        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchReceiverInfo();

    return () => {
      cancelled = true;
    };
  }, [chatInfo._id, chatInfo.userIDs, user?._id]);

  const formattedTime = lastMessageAt
    ? new Date(lastMessageAt).toLocaleDateString([], {
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full min-w-0 items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors duration-200 ${
        isActive
          ? "bg-blue-100 ring-1 ring-blue-200"
          : "bg-white hover:bg-gray-50"
      }`}
    >
      {/* Profile */}
      <div className="relative shrink-0">
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-blue-700">
          <img
            src="/profile.png"
            alt=""
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <MessageCircle className="absolute h-5 w-5" />
        </div>
      </div>

      {/* User information */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-gray-900">
          {loading
            ? "Loading..."
            : error
              ? "Unable to load user"
              : receiverInfo?.username ?? "Unknown user"}
        </h3>

        <p className="mt-1 truncate text-sm text-gray-500">
          {lastMessage}
        </p>
      </div>

      {/* Timestamp and unread count */}
      <div className="flex shrink-0 flex-col items-end gap-2">
        {formattedTime && (
          <span className="text-xs text-gray-400">
            {formattedTime}
          </span>
        )}

        {unreadCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-medium text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </div>
    </button>
  );
}

export default ChatCard;