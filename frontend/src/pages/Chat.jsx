import { useEffect, useRef, useState } from "react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import ChatBox from "../components/ChatBox";
import AddFriendModal from "../components/AddFriendModal";
import CreateGroupModal from "../components/CreateGroupModal";
import { useAuth } from "../context/AuthContext";
import socket, { connectSocket, disconnectSocket } from "../socket/socket";
import { getMessagePreview, sortChats } from "../utils/chat";

const getApiMessage = (error) => {
  const apiMessage = error?.response?.data?.message;

  if (apiMessage) {
    return apiMessage;
  }

  if (error?.response?.status === 404) {
    return "User doesn't exist";
  }

  return error?.message || "Unable to complete the request.";
};

const sortMessages = (items = []) =>
  [...items].sort(
    (first, second) =>
      new Date(first.createdAt || 0).getTime() -
      new Date(second.createdAt || 0).getTime()
  );

const appendMessage = (currentState, message) => {
  const roomMessages = currentState[message.room] || [];

  if (
    message._id &&
    roomMessages.some((entry) => entry._id && entry._id === message._id)
  ) {
    return currentState;
  }

  return {
    ...currentState,
    [message.room]: sortMessages([...roomMessages, message]),
  };
};

const applyMessageToChats = (currentChats, message) =>
  sortChats(
    currentChats.map((chat) =>
      chat.id === message.room
        ? {
            ...chat,
            subtitle: getMessagePreview(message),
            lastMessage: {
              _id: message._id,
              sender: message.sender,
              text: message.text,
              imageUrl: message.imageUrl || "",
              imageName: message.imageName || "",
              messageType: message.messageType || (message.imageUrl ? "image" : "text"),
              createdAt: message.createdAt,
            },
            updatedAt: message.createdAt,
          }
        : chat
    )
  );

export default function Chat() {
  const { user, logout } = useAuth();
  const [chats, setChats] = useState([]);
  const [friends, setFriends] = useState([]);
  const [activeChatId, setActiveChatId] = useState("");
  const [messagesByRoom, setMessagesByRoom] = useState({});
  const [drafts, setDrafts] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const [loadingRoom, setLoadingRoom] = useState("");
  const [roomErrors, setRoomErrors] = useState({});
  const [connectionState, setConnectionState] = useState("Connecting");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const [hasSearchedUsers, setHasSearchedUsers] = useState(false);
  const [friendActionUserId, setFriendActionUserId] = useState("");
  const [addFriendError, setAddFriendError] = useState("");
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedGroupMemberIds, setSelectedGroupMemberIds] = useState([]);
  const [groupError, setGroupError] = useState("");
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const loadedRoomsRef = useRef(new Set());
  const activeRoomRef = useRef("");
  const previousRoomRef = useRef("");
  const typingTimerRef = useRef({});
  const typingEmitTimerRef = useRef(null);
  const activeChat = chats.find((chat) => chat.id === activeChatId) || null;
  const messages = activeChat ? messagesByRoom[activeChat.room] || [] : [];
  const draft = activeChat ? drafts[activeChat.room] || "" : "";
  const typingUser = activeChat ? typingUsers[activeChat.room] : "";
  const isLoading = activeChat && loadingRoom === activeChat.room && messages.length === 0;
  const loadingError = activeChat ? roomErrors[activeChat.room] : "";
  const isSendingDisabled =
    !activeChat ||
    connectionState !== "Live" ||
    (!draft.trim() && !selectedImage) ||
    isUploadingImage;

  useEffect(() => {
    return () => {
      if (selectedImage?.preview) {
        URL.revokeObjectURL(selectedImage.preview);
      }
    };
  }, [selectedImage]);

  const clearSelectedImage = () => {
    setSelectedImage((current) => {
      if (current?.preview) {
        URL.revokeObjectURL(current.preview);
      }

      return null;
    });
  };

  const handleSelectImage = (file) => {
    setSelectedImage((current) => {
      if (current?.preview) {
        URL.revokeObjectURL(current.preview);
      }

      if (!file) {
        return null;
      }

      return {
        file,
        preview: URL.createObjectURL(file),
      };
    });
  };

  const refreshChats = async (nextActiveId = "") => {
    const response = await api.get("/chats");
    const nextChats = sortChats(Array.isArray(response.data?.data) ? response.data.data : []);

    setChats(nextChats);
    setActiveChatId((current) => {
      if (nextActiveId && nextChats.some((chat) => chat.id === nextActiveId)) {
        return nextActiveId;
      }

      if (current && nextChats.some((chat) => chat.id === current)) {
        return current;
      }

      return nextChats[0]?.id || "";
    });

    return nextChats;
  };

  const refreshFriends = async () => {
    const response = await api.get("/users/friends");
    const nextFriends = Array.isArray(response.data?.data) ? response.data.data : [];

    setFriends(nextFriends);
    return nextFriends;
  };

  useEffect(() => {
    if (!user?._id) {
      return undefined;
    }

    let isCancelled = false;

    const bootstrap = async () => {
      try {
        setIsBootstrapping(true);
        await Promise.all([refreshChats(), refreshFriends()]);
      } catch (error) {
        if (!isCancelled) {
          console.error(getApiMessage(error));
        }
      } finally {
        if (!isCancelled) {
          setIsBootstrapping(false);
        }
      }
    };

    bootstrap();

    return () => {
      isCancelled = true;
    };
  }, [user?._id]);

  useEffect(() => {
    activeRoomRef.current = activeChat?.room || "";
    setIsSidebarOpen(false);
    clearSelectedImage();

    if (!socket.connected) {
      previousRoomRef.current = activeChat?.room || "";
      return;
    }

    if (
      previousRoomRef.current &&
      previousRoomRef.current !== activeChat?.room
    ) {
      socket.emit("leave_room", previousRoomRef.current);
    }

    if (activeChat?.room) {
      socket.emit("join_room", activeChat.room);
    }

    previousRoomRef.current = activeChat?.room || "";
  }, [activeChat?.room]);

  useEffect(() => {
    if (!activeChat?.room) {
      return undefined;
    }

    if (loadedRoomsRef.current.has(activeChat.room)) {
      return undefined;
    }

    let isCancelled = false;
    const room = activeChat.room;

    const fetchMessages = async () => {
      setLoadingRoom(room);
      setRoomErrors((current) => ({
        ...current,
        [room]: "",
      }));

      try {
        const response = await api.get(`/messages/${room}`);

        if (isCancelled) {
          return;
        }

        const history = Array.isArray(response.data?.data)
          ? response.data.data
          : [];

        setMessagesByRoom((current) => ({
          ...current,
          [room]: sortMessages(history),
        }));
        loadedRoomsRef.current.add(room);
      } catch (error) {
        if (!isCancelled) {
          setRoomErrors((current) => ({
            ...current,
            [room]: getApiMessage(error),
          }));
        }
      } finally {
        if (!isCancelled) {
          setLoadingRoom((current) => (current === room ? "" : current));
        }
      }
    };

    fetchMessages();

    return () => {
      isCancelled = true;
    };
  }, [activeChat?.room]);

  useEffect(() => {
    if (!user?._id || !user?.username) {
      return undefined;
    }

    const realtime = connectSocket();

    const handleConnect = () => {
      setConnectionState("Live");
      realtime.emit("join", {
        userId: user._id,
        username: user.username,
      });

      if (activeRoomRef.current) {
        realtime.emit("join_room", activeRoomRef.current);
      }
    };

    const handleDisconnect = () => {
      setConnectionState("Offline");
    };

    const handleConnectError = () => {
      setConnectionState("Offline");
    };

    const handleReceiveMessage = (message) => {
      setMessagesByRoom((current) => appendMessage(current, message));
      setChats((current) => applyMessageToChats(current, message));
    };

    const handleTyping = (username) => {
      const room = activeRoomRef.current;

      if (!room || username === user.username) {
        return;
      }

      setTypingUsers((current) => ({
        ...current,
        [room]: username,
      }));

      clearTimeout(typingTimerRef.current[room]);
      typingTimerRef.current[room] = setTimeout(() => {
        setTypingUsers((current) => {
          const next = { ...current };
          delete next[room];
          return next;
        });
      }, 1400);
    };

    const handleUserStatus = async () => {
      try {
        await Promise.all([refreshChats(), refreshFriends()]);
      } catch (error) {
        console.error(getApiMessage(error));
      }
    };

    realtime.on("connect", handleConnect);
    realtime.on("disconnect", handleDisconnect);
    realtime.on("connect_error", handleConnectError);
    realtime.on("receive_message", handleReceiveMessage);
    realtime.on("typing", handleTyping);
    realtime.on("user_status", handleUserStatus);

    if (realtime.connected) {
      handleConnect();
    } else {
      setConnectionState("Connecting");
      realtime.connect();
    }

    return () => {
      realtime.off("connect", handleConnect);
      realtime.off("disconnect", handleDisconnect);
      realtime.off("connect_error", handleConnectError);
      realtime.off("receive_message", handleReceiveMessage);
      realtime.off("typing", handleTyping);
      realtime.off("user_status", handleUserStatus);
      disconnectSocket();
      Object.values(typingTimerRef.current).forEach(clearTimeout);
      clearTimeout(typingEmitTimerRef.current);
    };
  }, [user?._id, user?.username]);

  useEffect(() => {
    if (!isAddFriendOpen) {
      return undefined;
    }

    const trimmedQuery = userSearchQuery.trim();

    if (!trimmedQuery) {
      setIsSearchingUsers(false);
      setHasSearchedUsers(false);
      setUserSearchResults([]);
      setAddFriendError("");
      return undefined;
    }

    let isCancelled = false;
    const timeoutId = setTimeout(async () => {
      try {
        setIsSearchingUsers(true);
        setHasSearchedUsers(true);
        setAddFriendError("");

        const response = await api.get("/users/search", {
          params: {
            query: trimmedQuery,
          },
        });
        const results = Array.isArray(response.data?.data) ? response.data.data : [];

        if (!isCancelled) {
          setUserSearchResults(results);
          setAddFriendError(results.length === 0 ? "User doesn't exist" : "");
        }
      } catch (error) {
        if (!isCancelled) {
          setAddFriendError(getApiMessage(error));
          setUserSearchResults([]);
        }
      } finally {
        if (!isCancelled) {
          setIsSearchingUsers(false);
        }
      }
    }, 250);

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [isAddFriendOpen, userSearchQuery]);

  const handleDraftChange = (value) => {
    if (!activeChat?.room) {
      return;
    }

    setDrafts((current) => ({
      ...current,
      [activeChat.room]: value,
    }));

    clearTimeout(typingEmitTimerRef.current);
    typingEmitTimerRef.current = setTimeout(() => {
      if (socket.connected && value.trim()) {
        socket.emit("typing", activeChat.room);
      }
    }, 120);
  };

  const handleSendMessage = async () => {
    if (!activeChat) {
      return;
    }

    const text = draft.trim();

    if ((!text && !selectedImage) || !socket.connected) {
      return;
    }

    try {
      let uploadedImage = null;

      setRoomErrors((current) => ({
        ...current,
        [activeChat.room]: "",
      }));

      if (selectedImage) {
        setIsUploadingImage(true);
        const formData = new FormData();
        formData.append("image", selectedImage.file);
        formData.append("room", activeChat.room);

        const response = await api.post("/messages/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        uploadedImage = response.data?.data || null;
      }

      socket.emit("send_message", {
        room: activeChat.room,
        text,
        imageUrl: uploadedImage?.imageUrl || "",
        imageName: uploadedImage?.imageName || "",
      });

      setDrafts((current) => ({
        ...current,
        [activeChat.room]: "",
      }));
      clearSelectedImage();
    } catch (error) {
      setRoomErrors((current) => ({
        ...current,
        [activeChat.room]: getApiMessage(error),
      }));
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      disconnectSocket();
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleAddFriend = async (targetUser) => {
    try {
      setFriendActionUserId(targetUser._id);
      setAddFriendError("");

      const response = await api.post("/users/friends", {
        userId: targetUser._id,
      });
      const nextActiveId = response.data?.data?.chat?.id || "";

      await Promise.all([refreshChats(nextActiveId), refreshFriends()]);
      setUserSearchResults((current) =>
        current.map((entry) =>
          entry._id === targetUser._id ? { ...entry, isFriend: true } : entry
        )
      );
      setIsAddFriendOpen(false);
    } catch (error) {
      setAddFriendError(getApiMessage(error));
    } finally {
      setFriendActionUserId("");
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      setGroupError("Group name is required.");
      return;
    }

    if (selectedGroupMemberIds.length < 2) {
      setGroupError("Select at least 2 friends to create a group.");
      return;
    }

    try {
      setIsCreatingGroup(true);
      setGroupError("");

      const response = await api.post("/chats/groups", {
        name: groupName.trim(),
        memberIds: selectedGroupMemberIds,
      });
      const nextActiveId = response.data?.data?.id || "";

      await refreshChats(nextActiveId);
      setIsCreateGroupOpen(false);
      setGroupName("");
      setSelectedGroupMemberIds([]);
    } catch (error) {
      setGroupError(getApiMessage(error));
    } finally {
      setIsCreatingGroup(false);
    }
  };

  return (
    <>
      <div className="relative min-h-screen overflow-hidden p-3 sm:p-5">
        {isSidebarOpen ? (
          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-slate-950/60 backdrop-blur-sm md:hidden"
            aria-label="Close sidebar overlay"
          />
        ) : null}

        <div className="relative mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[1800px] gap-4 sm:min-h-[calc(100vh-2.5rem)]">
          <Sidebar
            user={user}
            chats={chats}
            activeChatId={activeChatId}
            onSelectChat={setActiveChatId}
            onLogout={handleLogout}
            isLoggingOut={isLoggingOut}
            connectionState={connectionState}
            isMobileOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            onOpenAddFriend={() => {
              setAddFriendError("");
              setUserSearchQuery("");
              setUserSearchResults([]);
              setHasSearchedUsers(false);
              setIsAddFriendOpen(true);
            }}
            onOpenCreateGroup={() => {
              setGroupError("");
              setIsCreateGroupOpen(true);
            }}
          />

          {isBootstrapping ? (
            <div className="panel-surface flex min-h-[calc(100vh-1.5rem)] flex-1 items-center justify-center rounded-[30px] md:min-h-[calc(100vh-2.5rem)]">
              <div className="text-center">
                <div className="mx-auto mb-4 h-14 w-14 animate-pulse rounded-2xl bg-gradient-to-br from-cyan-400 to-sky-600" />
                <p className="font-display text-xl font-semibold text-white">
                  Loading chats
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  Syncing friends, groups, and recent messages.
                </p>
              </div>
            </div>
          ) : (
            <ChatBox
              chat={activeChat}
              messages={messages}
              currentUser={user}
              draft={draft}
              onDraftChange={handleDraftChange}
              onSendMessage={handleSendMessage}
              isSendingDisabled={isSendingDisabled}
              isLoading={Boolean(isLoading)}
              loadingError={loadingError}
              typingUser={typingUser}
              connectionState={connectionState}
              onOpenSidebar={() => setIsSidebarOpen(true)}
              onOpenAddFriend={() => {
                setAddFriendError("");
                setUserSearchQuery("");
                setUserSearchResults([]);
                setHasSearchedUsers(false);
                setIsAddFriendOpen(true);
              }}
              onOpenCreateGroup={() => setIsCreateGroupOpen(true)}
              selectedImage={selectedImage}
              onSelectImage={handleSelectImage}
              onClearImage={clearSelectedImage}
              isUploadingImage={isUploadingImage}
            />
          )}
        </div>
      </div>

      <AddFriendModal
        isOpen={isAddFriendOpen}
        onClose={() => setIsAddFriendOpen(false)}
        query={userSearchQuery}
        onQueryChange={setUserSearchQuery}
        results={userSearchResults}
        onAddFriend={handleAddFriend}
        loading={isSearchingUsers}
        submittingUserId={friendActionUserId}
        error={addFriendError}
        hasSearched={hasSearchedUsers}
      />

      <CreateGroupModal
        isOpen={isCreateGroupOpen}
        onClose={() => setIsCreateGroupOpen(false)}
        friends={friends}
        name={groupName}
        onNameChange={setGroupName}
        selectedMemberIds={selectedGroupMemberIds}
        onToggleMember={(memberId) => {
          setSelectedGroupMemberIds((current) =>
            current.includes(memberId)
              ? current.filter((entry) => entry !== memberId)
              : [...current, memberId]
          );
        }}
        onSubmit={handleCreateGroup}
        isSubmitting={isCreatingGroup}
        error={groupError}
      />
    </>
  );
}
