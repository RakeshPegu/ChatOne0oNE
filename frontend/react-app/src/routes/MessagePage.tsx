import { useLoaderData } from "react-router-dom";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import MessageCard from "../cards/MessageCard";
import socket from "../lib/socket";
import defaultPic from "../../public/profile.png";
import { Send } from "lucide-react";
import apiRequest from "../lib/apiRequest";

interface Chat {
  existingChat: {
    _id: string;
    username: string;
    userIDs: string[];
    isGroup: boolean;
  };
  username: string;
}

interface Message {
  _id: string;
  chatId: string;
  text: string;
  senderId: string;
  createdAt: string;
  seenBy: string[];
}

// What to do with the scroll position after the next messages render
type PendingScroll =
  | { type: "bottom" }
  | { type: "restore"; prevHeight: number; prevTop: number }
  | null;

function MessagePage() {
  const { chat } = useLoaderData() as { chat: Chat | null };
  const chatId = chat?.existingChat._id;

  const [text, setText] = useState("");
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoaded, setInitialLoaded] = useState(false);

  // Refs hold the "logic" state so callbacks never read stale values
  const cursorRef = useRef<string | null>(null);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const requestIdRef = useRef(0); // ignores responses from a previous chat
  const pendingScrollRef = useRef<PendingScroll>(null);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const topSentinelRef = useRef<HTMLDivElement | null>(null);

  /* ------------------------------ SEND MESSAGE ------------------------------ */
  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim() || !chatId) return;

    socket.emit("msg", { chatId, text: text.trim() });
    setText("");
  };

  /* ----------------------------- FETCH MESSAGES ----------------------------- */
  const fetchMessages = useCallback(
    async (initial = false) => {
      if (!chatId || loadingRef.current) return;
      if (!initial && !hasMoreRef.current) return;

      loadingRef.current = true;
      const reqId = ++requestIdRef.current;
      const container = scrollContainerRef.current;

      try {
        setError("");
        setLoading(true);

        const cursor = initial ? null : cursorRef.current;
        const url =
          `/messages/get_all_messages/${chatId}?limit=30` +
          (cursor ? `&cursor=${encodeURIComponent(cursor)}` : "");

        const res = await apiRequest.get(url);
        if (reqId !== requestIdRef.current) return; // chat changed meanwhile

        const { messages, nextCursor, hasMore: more } = res.data as {
          messages: Message[];
          nextCursor: string | null;
          hasMore: boolean;
        };

        // Decide scroll behaviour BEFORE the state update renders
        pendingScrollRef.current = initial
          ? { type: "bottom" }
          : {
              type: "restore",
              prevHeight: container?.scrollHeight ?? 0,
              prevTop: container?.scrollTop ?? 0,
            };

        // Backend must return each page oldest -> newest
        setChatMessages((prev) => (initial ? messages : [...messages, ...prev]));

        cursorRef.current = nextCursor ?? null;
        hasMoreRef.current = !!more && !!nextCursor;
        setHasMore(hasMoreRef.current);
        if (initial) setInitialLoaded(true);
      } catch (err) {
        if (reqId !== requestIdRef.current) return;
        setError(err instanceof Error ? err.message : "Something went wrong");
        console.error("fetchMessages error:", err);
      } finally {
        if (reqId === requestIdRef.current) {
          loadingRef.current = false;
          setLoading(false);
        }
      }
    },
    [chatId]
  );

  /* ----------------------- RESET + INITIAL FETCH PER CHAT ------------------- */
  useEffect(() => {
    if (!chatId) return;

    requestIdRef.current++; // invalidate any in-flight request
    loadingRef.current = false;
    cursorRef.current = null;
    hasMoreRef.current = true;
    pendingScrollRef.current = null;

    setChatMessages([]);
    setHasMore(true);
    setInitialLoaded(false);
    setError("");

    fetchMessages(true);
  }, [chatId, fetchMessages]);

  /* ------------------------- APPLY SCROLL AFTER RENDER ---------------------- */
  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    const pending = pendingScrollRef.current;
    if (!container || !pending) return;

    if (pending.type === "bottom") {
      container.scrollTop = container.scrollHeight;
    } else {
      // keep the same message in view after older ones are prepended
      container.scrollTop =
        pending.prevTop + (container.scrollHeight - pending.prevHeight);
    }
    pendingScrollRef.current = null;
  }, [chatMessages]);

  /* ---------------------- INFINITE SCROLL (TOP SENTINEL) -------------------- */
  useEffect(() => {
    const sentinel = topSentinelRef.current;
    const root = scrollContainerRef.current;

    // Don't observe until the first page is in and scrolled to the bottom,
    // otherwise the sentinel is visible at scrollTop = 0 and fires immediately.
    if (!sentinel || !root || !initialLoaded || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchMessages(false);
      },
      { root, threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
    // Re-created after every load, so if the sentinel is still visible
    // (page too short to fill the container) it fires again.
  }, [initialLoaded, hasMore, loading, fetchMessages]);

  /* --------------------------------- SOCKET --------------------------------- */
  useEffect(() => {
    if (!chatId) return;

    socket.emit("join-room", chatId);

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    const handleIncomingMessage = (newMessage: Message) => {
      if (newMessage.chatId !== chatId) return;

      pendingScrollRef.current = { type: "bottom" };
      setChatMessages((prev) =>
        prev.some((m) => m._id === newMessage._id) ? prev : [...prev, newMessage]
      );
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("recieve-msg", handleIncomingMessage); // (sic) must match your server event name

    return () => {
      // socket.emit("leave-room", chatId); // enable if your server supports it
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("recieve-msg", handleIncomingMessage);
    };
  }, [chatId]);

  /* --------------------------------- RENDER --------------------------------- */
  return (
    <div className="flex flex-col h-[93vh] items-center">
      {/* HEADER */}
      <div className="flex flex-row w-full justify-between bg-gray-500 p-3 shrink-0">
        <div className="flex gap-5 items-center">
          <img
            src={defaultPic}
            className="rounded-full w-8 h-8"
            alt="profile"
          />
          <div className="flex flex-col">
            <p className="font-mono">{chat?.username}</p>
            <p>{isConnected ? "Online" : "Offline"}</p>
          </div>
        </div>
      </div>

      {/* MESSAGES (this is the element that scrolls) */}
      <div
        className="flex-1 min-h-0 overflow-y-auto bg-gray-100 w-full p-3"
        ref={scrollContainerRef}
      >
        {hasMore && (
          <div
            ref={topSentinelRef}
            className="h-4 w-full text-center text-xs text-gray-400"
          >
            {loading ? "Loading history..." : ""}
          </div>
        )}

        {error && <p className="text-center text-red-500 text-sm">{error}</p>}

        {!loading && initialLoaded && chatMessages.length === 0 ? (
          <p className="text-center text-gray-400 mt-4">
            No messages yet. Start chatting
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
        className="flex w-full items-center gap-2 p-3 bg-white shrink-0"
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
          <Send />
        </button>
      </form>
    </div>
  );
}

export default MessagePage;