import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useSelector } from "react-redux";
import { createSocketConnection } from "../utils/socket";

const getProfile = (user) => ({
  id: user._id,
  name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Developer",
  role: "Developer",
  skills: user.skills || [],
  avatar:
    user.photoUrl || `https://api.dicebear.com/9.x/thumbs/svg?seed=${user.firstName || "DevBridge"}`,
  online: true,
});

const Chat = () => {
  const user = useSelector((store) => store.user);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [messageByChat, setMessageByChat] = useState({});
  const [loadingChats, setLoadingChats] = useState(true);
  const [error, setError] = useState("");

  const [draft, setDraft] = useState("");
  const [tag, setTag] = useState("Discussion");
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [bookmarks, setBookmarks] = useState({});
  const [reactions, setReactions] = useState({});
  const listRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const fetchConnections = async () => {
      setLoadingChats(true);
      setError("");
      try {
        const res = await axios.get(BASE_URL + "/user/connections", { withCredentials: true });
        const users = res?.data?.data || [];
        const mapped = users.map(getProfile);
        setChats(mapped);
        if (mapped.length) {
          setActiveChatId(mapped[0].id);
          setMessageByChat((prev) => {
            const next = { ...prev };
            mapped.forEach((chat) => {
              if (!next[chat.id]) {
                next[chat.id] = [
                  {
                    id: `sys-${chat.id}`,
                    type: "system",
                    authorId: "system",
                    content: `${chat.name} is now available for chat.`,
                    createdAt: "Now",
                  },
                ];
              }
            });
            return next;
          });
        }
      } catch (err) {
        setError(err?.response?.data || "Unable to load your connections.");
      } finally {
        setLoadingChats(false);
      }
    };
    fetchConnections();
  }, []);

  useEffect(() => {
    const socket = createSocketConnection();
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("chatHistory", ({ chatId, messages }) => {
      if (!chatId) return;
      setMessageByChat((prev) => ({
        ...prev,
        [chatId]: Array.isArray(messages) ? messages : [],
      }));
    });

    socket.on("messageReceived", (incomingMessage) => {
      if (!incomingMessage?.chatId) return;
      setMessageByChat((prev) => {
        const current = prev[incomingMessage.chatId] || [];
        if (current.some((m) => m._id === incomingMessage._id)) {
          return prev;
        }
        return {
          ...prev,
          [incomingMessage.chatId]: [...current, incomingMessage],
        };
      });
    });

    socket.on("messageDeleted", ({ chatId, messageId }) => {
      if (!chatId || !messageId) return;
      setMessageByChat((prev) => ({
        ...prev,
        [chatId]: (prev[chatId] || []).filter(
          (message) => (message._id || message.id) !== messageId,
        ),
      }));
    });

    socket.on("chatError", (payload) => {
      setError(payload?.message || "Socket error occurred");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const setupActiveChat = async () => {
      if (!activeChatId || !user?._id || !socketRef.current) return;
      setError("");
      try {
        const res = await axios.get(BASE_URL + `/chat/${activeChatId}`, {
          withCredentials: true,
        });
        const roomId = res?.data?.chatId;
        const history = res?.data?.data || [];

        if (!roomId) return;
        setActiveRoomId(roomId);
        setMessageByChat((prev) => ({
          ...prev,
          [roomId]: history,
        }));

        socketRef.current.emit("joinChat", {
          chatId: roomId,
          userId: user._id,
        });
      } catch (err) {
        setError(err?.response?.data?.message || err?.response?.data || "Unable to load chat history");
      }
    };

    setupActiveChat();
  }, [activeChatId, user?._id]);

  const activeChat = useMemo(
    () => chats.find((c) => c.id === activeChatId) || null,
    [chats, activeChatId],
  );
  const messages = activeRoomId ? messageByChat[activeRoomId] || [] : [];

  const messageLookup = useMemo(() => {
    const map = {};
    messages.forEach((m) => {
      map[m._id || m.id] = m;
    });
    return map;
  }, [messages]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, activeChatId]);

  const handleSend = () => {
    const value = draft.trim();
    if (!value || !activeRoomId || !user?._id || !socketRef.current) return;

    socketRef.current.emit("sendMessage", {
      chatId: activeRoomId,
      senderId: user._id,
      text: value,
      type: isCodeMode ? "code" : "text",
      tag,
      replyTo: replyingTo?._id || replyingTo?.id || null,
    });
    setDraft("");
    setReplyingTo(null);
  };

  const toggleBookmark = (id) => setBookmarks((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleReaction = (id) => setReactions((prev) => ({ ...prev, [id]: !prev[id] }));
  const codeCount = messages.filter((m) => m.type === "code").length;
  const handleDeleteMessage = (messageId) => {
    if (!messageId || !activeRoomId || !user?._id || !socketRef.current) return;
    socketRef.current.emit("deleteMessage", {
      chatId: activeRoomId,
      messageId,
      userId: user._id,
    });
  };

  return (
    <div className="mx-auto grid h-[calc(100vh-8.5rem)] max-w-7xl grid-cols-12 gap-4 px-4 py-5">
      <aside className="col-span-12 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/90 shadow-sm lg:col-span-3">
        <div className="border-b border-slate-700 px-4 py-3">
          <h2 className="text-sm font-bold tracking-wide text-slate-100">Chats</h2>
        </div>
        <div className="space-y-1 p-2">
          {loadingChats && <p className="px-2 py-2 text-sm text-slate-300">Loading connections...</p>}
          {!loadingChats && chats.length === 0 && (
            <p className="px-2 py-2 text-sm text-slate-300">No connections yet. Start matching first.</p>
          )}
          {chats.map((chat) => {
            const selected = chat.id === activeChatId;
            return (
              <button
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition ${
                  selected ? "bg-violet-700/70" : "hover:bg-slate-800"
                }`}
              >
                <img src={chat.avatar} alt={chat.name} className="h-10 w-10 rounded-full border border-slate-600 object-cover" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-100">{chat.name}</p>
                  <p className="truncate text-xs text-slate-400">{chat.role}</p>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      <main className="col-span-12 flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-sm lg:col-span-6">
        <div className="border-b border-slate-700 px-4 py-3">
          <h2 className="text-sm font-bold text-slate-100">{activeChat?.name || "Chat"}</h2>
          <p className="text-xs text-slate-400">{activeChat?.role || "Select a connection"}</p>
        </div>

        <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-slate-900/70 px-4 py-4">
          {error && <p className="rounded-md bg-red-500/20 px-3 py-2 text-sm text-red-200">{error}</p>}
          {messages.map((message) => {
            const messageId = message._id || message.id;
            if (message.type === "system") {
              return (
                <div key={messageId} className="text-center text-xs text-slate-400">
                  <span className="rounded-full bg-slate-700 px-3 py-1">{message.content}</span>
                </div>
              );
            }
            const mine =
              message.authorId === "me" ||
              message.senderId?.toString?.() === user?._id ||
              message.senderId === user?._id;
            const author = mine
              ? {
                  name: "You",
                  avatar: "https://api.dicebear.com/9.x/thumbs/svg?seed=You",
                  role: "Developer",
                  skills: ["React", "Node.js"],
                }
              : activeChat;
            const replyMessage = message.replyTo ? messageLookup[message.replyTo] : null;

            return (
              <div key={messageId} className={`group flex ${mine ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[85%]">
                  <div className="relative mb-1 flex items-center gap-2">
                    {!mine && (
                      <img
                        src={author?.avatar}
                        alt={author?.name}
                        className="h-7 w-7 rounded-full border border-slate-600"
                      />
                    )}
                    <div className="group/profile relative">
                      <p className="cursor-default text-xs font-semibold text-slate-300">{author?.name}</p>
                      <div className="pointer-events-none absolute -top-1 left-0 z-10 mt-6 hidden min-w-52 rounded-xl border border-slate-700 bg-slate-900 p-3 text-xs shadow-lg group-hover/profile:block">
                        <p className="font-bold text-slate-100">{author?.name}</p>
                        <p className="text-slate-400">{author?.role}</p>
                        <p className="mt-2 text-slate-300">Skills: {(author?.skills || []).join(", ")}</p>
                      </div>
                    </div>
                  </div>
                  {replyMessage && (
                    <div className="mb-1 rounded-lg border border-slate-600 bg-slate-800 px-2 py-1 text-xs text-slate-300">
                      Replying to: {(replyMessage.text || replyMessage.content || "").slice(0, 55)}
                      {(replyMessage.text || replyMessage.content || "").length > 55 ? "..." : ""}
                    </div>
                  )}
                  <div
                    className={`rounded-2xl px-3 py-2 shadow-sm ${
                      message.type === "code"
                        ? "border border-slate-700 bg-black text-emerald-200"
                        : mine
                          ? "bg-violet-600 text-white"
                          : "bg-slate-800 text-slate-100"
                    }`}
                  >
                    {message.type === "code" ? (
                      <pre className="whitespace-pre-wrap font-mono text-xs leading-6">{message.text || message.content}</pre>
                    ) : (
                      <p className="text-sm leading-6">{message.text || message.content}</p>
                    )}
                    <div className="mt-1 flex items-center gap-2">
                      {message.tag && <span className="rounded-full bg-black/30 px-2 py-0.5 text-[10px] uppercase">{message.tag}</span>}
                      {reactions[messageId] && <span className="text-sm">🔥</span>}
                      <span className="ml-auto text-[10px] opacity-70">
                        {message.createdAt
                          ? new Date(message.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </span>
                    </div>
                  </div>
                  <div className="mt-1 flex gap-2 opacity-0 transition group-hover:opacity-100">
                    <button onClick={() => setReplyingTo(message)} className="rounded-md border border-slate-600 bg-slate-800 px-2 py-1 text-xs text-slate-200 hover:bg-slate-700">Reply</button>
                    <button onClick={() => toggleReaction(messageId)} className="rounded-md border border-slate-600 bg-slate-800 px-2 py-1 text-xs text-slate-200 hover:bg-slate-700">React</button>
                    <button
                      onClick={() => toggleBookmark(messageId)}
                      className={`rounded-md border px-2 py-1 text-xs ${
                        bookmarks[messageId]
                          ? "border-amber-300 bg-amber-700/30 text-amber-200"
                          : "border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700"
                      }`}
                    >
                      Save
                    </button>
                    {mine && (
                      <button
                        onClick={() => handleDeleteMessage(messageId)}
                        className="rounded-md border border-red-500/60 bg-red-500/15 px-2 py-1 text-xs text-red-200 hover:bg-red-500/25"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-slate-700 bg-slate-900 px-4 py-3">
          {replyingTo && (
            <div className="mb-2 flex items-center justify-between rounded-md border border-violet-500/40 bg-violet-500/20 px-2 py-1 text-xs text-violet-100">
              <span>
                Replying to: {(replyingTo.text || replyingTo.content || "").slice(0, 70)}
                {(replyingTo.text || replyingTo.content || "").length > 70 ? "..." : ""}
              </span>
              <button onClick={() => setReplyingTo(null)} className="font-semibold">Clear</button>
            </div>
          )}
          <textarea
            rows={3}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={isCodeMode ? "Paste code snippet..." : "Write a message..."}
            className="w-full resize-none rounded-xl border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
          />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsCodeMode((v) => !v)}
              className={`rounded-md px-3 py-2 text-xs font-semibold ${
                isCodeMode
                  ? "bg-slate-200 text-slate-900"
                  : "border border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700"
              }`}
            >
              {isCodeMode ? "Code mode ON" : "Attach code snippet"}
            </button>
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="rounded-md border border-slate-600 bg-slate-800 px-2 py-2 text-xs font-semibold text-slate-200 outline-none"
            >
              <option>Help</option>
              <option>Discussion</option>
              <option>Idea</option>
            </select>
            <button onClick={handleSend} className="ml-auto rounded-md bg-violet-600 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-700">
              Send
            </button>
          </div>
        </div>
      </main>

      <aside className="col-span-12 hidden overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/90 p-4 shadow-sm xl:col-span-3 xl:block">
        <h3 className="text-sm font-bold text-slate-100">Developer Profile</h3>
        {activeChat ? (
          <>
            <div className="mt-3 rounded-xl bg-slate-800 p-3">
              <div className="flex items-center gap-3">
                <img src={activeChat.avatar} alt={activeChat.name} className="h-12 w-12 rounded-full" />
                <div>
                  <p className="text-sm font-semibold text-slate-100">{activeChat.name}</p>
                  <p className="text-xs text-slate-400">{activeChat.role}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-400">Skills</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {(activeChat.skills || []).map((skill) => (
                  <span key={skill} className="rounded-full border border-violet-400/50 bg-violet-400/20 px-2 py-1 text-[10px] font-semibold text-violet-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-slate-700 p-3">
              <p className="text-xs font-semibold text-slate-300">Shared Content</p>
              <p className="mt-2 text-sm text-slate-300">
                Code snippets in thread: <span className="font-bold">{codeCount}</span>
              </p>
            </div>
          </>
        ) : (
          <p className="mt-3 text-sm text-slate-300">Select a connection to start chatting.</p>
        )}
      </aside>
    </div>
  );
};

export default Chat;

