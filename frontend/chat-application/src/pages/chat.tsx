
import { useCallback, useEffect, useRef, useState } from "react";
import { getChatMessages, getUserChats, sendMessage } from "../utils/axios";

import { LuMessageSquarePlus } from "react-icons/lu";
import { IoMdSend } from "react-icons/io";
import { GoPaperclip } from "react-icons/go";
import { MdVideoCall } from "react-icons/md";


import ChatItem from "../components/chat/ChatItem";
import MessageItem from "../components/chat/MessageItem";
import Typing from "../components/chat/Typing";
import Input from "../components/Input";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

import {
  classNames,
  getChatObjectMetadata,
  requestHandler,
} from "../utils";
import { ChatListItemInterface, ChatMessageInterface } from "../interface/chat";
import { LocalStorage } from "../utils/LocalStorage";
import AddChatModal from "../components/chat/AddChatModal";
import { MyMenu } from "../components/chat/MenuDropDown";
import { ProfileEditModal } from "../components/chat/ProfileEditModal";
import { BiSearch } from "react-icons/bi";
import { AddVideoCall } from "../components/video/AddVideoCall";
import { useNavigate } from "react-router-dom";

const CONNECTED_EVENT = "connected";
const DISCONNECT_EVENT = "disconnect";
const JOIN_CHAT_EVENT = "joinChat";
const NEW_CHAT_EVENT = "newChat";
const TYPING_EVENT = "typing";
const STOP_TYPING_EVENT = "stopTyping";
const MESSAGE_RECEIVED_EVENT = "messageReceived";
const LEAVE_CHAT_EVENT = "leaveChat";
const UPDATE_GROUP_NAME_EVENT = "updateGroupName";
const INCOMING_CALL_EVENT = 'incomingCallEvent'

export const Chat = () => {
  const { user } = useAuth();
  const { socket, io } = useSocket();

  const currentChat = useRef<ChatListItemInterface | null>(null);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [openAddChat, setOpenAddChat] = useState(false)
  const [openVideoCall, setOpenVideoCall] = useState(false)
  const [openProfileEdit, setOpenProfileEdit] = useState(false)

  const [isConnected, setIsConnected] = useState(false);

  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const [chats, setChats] = useState<ChatListItemInterface[]>([]);
  const [messages, setMessages] = useState<ChatMessageInterface[]>([]);
  const [unreadMessages, setUnreadMessages] = useState<ChatMessageInterface[]>(
    []
  );

  const [isTyping, setIsTyping] = useState(false);
  const [selfTyping, setSelfTyping] = useState(false);

  const [message, setMessage] = useState("");
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const [incomingCall, setIncomingCall] = useState(false)
  const [callRoomId, setCallRoomId] = useState<string>('')

  /**
   *  A  function to update the last message of a specified chat to update the chat list
   */
  const updateChatLastMessage = (
    chatToUpdateId: string,
    message: ChatMessageInterface
  ) => {

    const chatToUpdate = chats.find((chat) => chat._id === chatToUpdateId)!;

    chatToUpdate.lastMessage = message;

    chatToUpdate.updatedAt = message?.updatedAt;

    setChats([
      chatToUpdate,
      ...chats.filter((chat) => chat._id !== chatToUpdateId),
    ]);
  };

  const getChats = async () => {
    requestHandler(
      async () => await getUserChats(),
      setLoadingChats,
      (res) => {
        const { data } = res;
        setChats(data || []);
      },
      alert
    );
  };

  const getMessages = async () => {
    // Check if a chat is selected, if not, show an alert
    if (!currentChat.current?._id) return alert("No chat is selected");

    // Check if socket is available, if not, show an alert
    if (!socket) return alert("Socket not available");

    // Emit an event to join the current chat
    socket.emit(JOIN_CHAT_EVENT, currentChat.current?._id);

    // Filter out unread messages from the current chat as those will be read
    setUnreadMessages(
      unreadMessages.filter((msg) => msg.chat !== currentChat.current?._id)
    );

    // Make an async request to fetch chat messages for the current chat
    requestHandler(
      // Fetching messages for the current chat
      async () => await getChatMessages(currentChat.current?._id || ""),
      // Set the state to loading while fetching the messages
      setLoadingMessages,
      // After fetching, set the chat messages to the state if available
      (res) => {
        const { data } = res;
        setMessages(data || []);
      },
      // Display any error alerts if they occur during the fetch
      alert
    );
  };

  // Function to send a chat message
  const sendChatMessage = async () => {
    if (!currentChat.current?._id || !socket) return;

    socket.emit(STOP_TYPING_EVENT, currentChat.current?._id);

    await requestHandler(
      async () =>
        await sendMessage(
          currentChat.current?._id || "", // Chat ID or empty string if not available
          message, // Actual text message
          attachedFiles // Any attached files
        ),
      null,
      (res) => {
        setMessage(""); // Clear the message input
        setAttachedFiles([]); // Clear the list of attached files
        setMessages((prev) => [res.data, ...prev]); // Update messages in the UI
        updateChatLastMessage(currentChat.current?._id || "", res.data); // Update the last message in the chat
      },
      alert
    );
  };

  const handleOnMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);

    if (!socket || !isConnected) return;

    if (!selfTyping) {
      setSelfTyping(true);
      socket.emit(TYPING_EVENT, currentChat.current?._id);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    const timerLength = 3000;

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit(STOP_TYPING_EVENT, currentChat.current?._id);

      setSelfTyping(false);
    }, timerLength);
  };

  const onConnect = () => {
    setIsConnected(true);
  };

  const onDisconnect = () => {
    setIsConnected(false);
  };

  const handleOnSocketTyping = (chatId: string) => {
    if (chatId !== currentChat.current?._id) return;

    setIsTyping(true);
  };

  const handleOnSocketStopTyping = (chatId: string) => {
    if (chatId !== currentChat.current?._id) return;

    setIsTyping(false);
  };

  const onMessageReceived = (message: ChatMessageInterface) => {
    // Check if the received message belongs to the currently active chat
    if (message?.chat !== currentChat.current?._id) {
      // If not, update the list of unread messages
      setUnreadMessages((prev) => [message, ...prev]);
    } else {
      // If it belongs to the current chat, update the messages list for the active chat
      setMessages((prev) => [message, ...prev]);
    }

    // Update the last message for the chat to which the received message belongs
    updateChatLastMessage(message.chat || "", message);
  };

  const onNewChat = (chat: ChatListItemInterface) => {
    setChats((prev) => [chat, ...prev]);
  };

  const navigate = useNavigate();

  // const handelCallToUser = (roomId: string) => {
  //   navigate(`/room/${roomId}`);
  //   return
  // }

  const onIncomingCall = useCallback(async (data: { chatId: string, roomId: string }) => {
    setIncomingCall(true)
    console.log(data.roomId)
    setCallRoomId(data.roomId)
  }, []);


  // This function handles the event when a user leaves a chat.
  const onChatLeave = (chat: ChatListItemInterface) => {
    // Check if the chat the user is leaving is the current active chat.
    if (chat._id === currentChat.current?._id) {
      // If the user is in the group chat they're leaving, close the chat window.
      currentChat.current = null;
      // Remove the currentChat from local storage.
      LocalStorage.remove("currentChat");
    }
    // Update the chats by removing the chat that the user left.
    setChats((prev) => prev.filter((c) => c._id !== chat._id));
  };

  const handleAcceptCall = () => {
    console.log('accept click')
    handleSubmitForm(callRoomId)
  }



  const handleSubmitForm = useCallback(
    (room: string) => {
      io.emit("room:join", { email: user?.email, room });
    },
    [user, io]
  );

  const handleJoinRoom = useCallback(
    (data: { email: string, room: string | number }) => {
      const { email, room } = data;
      console.log(email)
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  useEffect(() => {
    if (io == null) return;
    io.on("room:join", handleJoinRoom);
    return () => {
      io.off("room:join", handleJoinRoom);
    };
  }, [io, handleJoinRoom]);


  // Function to handle changes in group name
  const onGroupNameChange = (chat: ChatListItemInterface) => {
    // Check if the chat being changed is the currently active chat
    if (chat._id === currentChat.current?._id) {
      // Update the current chat with the new details
      currentChat.current = chat;

      // Save the updated chat details to local storage
      LocalStorage.set("currentChat", chat);
    }

    // Update the list of chats with the new chat details
    setChats((prev) => [
      // Map through the previous chats
      ...prev.map((c) => {
        // If the current chat in the map matches the chat being changed, return the updated chat
        if (c._id === chat._id) {
          return chat;
        }
        // Otherwise, return the chat as-is without any changes
        return c;
      }),
    ]);
  };

  useEffect(() => {
    getChats();

    const _currentChat = LocalStorage.get("currentChat");

    // If there's a current chat saved in local storage:
    if (_currentChat) {
      // Set the current chat reference to the one from local storage.
      currentChat.current = _currentChat;
      // If the socket connection exists, emit an event to join the specific chat using its ID.
      socket?.emit(JOIN_CHAT_EVENT, _currentChat.current?._id);
      // Fetch the messages for the current chat.
      getMessages();
    }
    // An empty dependency array ensures this useEffect runs only once, similar to componentDidMount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on(CONNECTED_EVENT, onConnect);
    socket.on(DISCONNECT_EVENT, onDisconnect);
    socket.on(TYPING_EVENT, handleOnSocketTyping);
    socket.on(STOP_TYPING_EVENT, handleOnSocketStopTyping);
    socket.on(MESSAGE_RECEIVED_EVENT, onMessageReceived);
    socket.on(NEW_CHAT_EVENT, onNewChat);
    socket.on(LEAVE_CHAT_EVENT, onChatLeave);
    socket.on(UPDATE_GROUP_NAME_EVENT, onGroupNameChange);
    socket.on(INCOMING_CALL_EVENT, onIncomingCall);

    return () => {
      // Remove all the event listeners we set up to avoid memory leaks and unintended behaviors.
      socket.off(CONNECTED_EVENT, onConnect);
      socket.off(DISCONNECT_EVENT, onDisconnect);
      socket.off(TYPING_EVENT, handleOnSocketTyping);
      socket.off(STOP_TYPING_EVENT, handleOnSocketStopTyping);
      socket.off(MESSAGE_RECEIVED_EVENT, onMessageReceived);
      socket.off(NEW_CHAT_EVENT, onNewChat);
      socket.off(LEAVE_CHAT_EVENT, onChatLeave);
      socket.off(UPDATE_GROUP_NAME_EVENT, onGroupNameChange);
      socket.off(INCOMING_CALL_EVENT, onIncomingCall);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, chats]);


  return (
    <>
      <AddChatModal
        open={openAddChat}
        onClose={() => {
          setOpenAddChat(false);
        }}
        onSuccess={() => {
          getChats();
        }}
      />


      <div className="w-full justify-between items-stretch h-screen flex flex-shrink-0 overflow-y-hidden">

        {/* All chats section */}
        <div className="w-3/12 relative ring-white overflow-y-auto">

          {/* profile icon */}
          <ProfileEditModal
            open={openProfileEdit}
            onClose={() => {
              setOpenProfileEdit(false)
            }}
          />
          <div className="h-20 border-b border-white/20 my-[9px] px-4 flex justify-between  items-center flex-row">
            <button
              onClick={() => setOpenProfileEdit(true)}
            >
              <img
                className="h-12 w-12 rounded-full flex flex-shrink-0 object-cover"
                src={user?.avatar.url}
                alt="user"
                width={200}
                height={200}
              />
            </button>
            <div className="flex flex-row justify-center items-center gap-1">

              <button
                onClick={() => setOpenAddChat(true)}
                className="rounded-full border-none -0 hover:bg-blue-200/5 focus:bg-blue-200/5 text-white p-3 flex flex-shrink-0"
              >
                <LuMessageSquarePlus size={20} />
              </button>

              <div
                className="rounded-full border-none hover:bg-blue-200/5 text-white p-3 flex flex-shrink-0"
              >
                <MyMenu />
              </div>
            </div>
          </div>

          {/* search chats */}
          <div className="z-10 px-4 w-full sticky top-0 bg-dark py-4 flex justify-between items-center gap-4">
            <BiSearch size={16} className="absolute left-8 text-white/80" />
            <input
              placeholder="Search user or group..."
              className="block w-full h-10 pl-10 rounded-md outline outline-[1px] text-white/80  focus:ring-1  drop-shadow-xl placeholder:text-sm placeholder:text-white/30  outline-zinc-400/30  px-5 bg-zinc-800/30 text-white"
              value={localSearchQuery}
              onChange={(e) =>
                setLocalSearchQuery(e.target.value.toLowerCase())
              }
            />
          </div>

          {/* all chats */}
          <div className="px-4">
            {loadingChats ? (
              <div className="flex justify-center items-center h-[calc(100%-88px)]">
                <Typing />
              </div>
            ) : (
              [...chats]
                .filter((chat) =>
                  localSearchQuery
                    ? getChatObjectMetadata(chat, user!)
                      .title?.toLocaleLowerCase()
                      ?.includes(localSearchQuery)
                    : true
                )
                .map((chat) => {
                  return (
                    <ChatItem
                      chat={chat}
                      isActive={chat._id === currentChat.current?._id}
                      unreadCount={
                        unreadMessages.filter((n) => n.chat === chat._id).length
                      }
                      onClick={(chat) => {
                        if (
                          currentChat.current?._id &&
                          currentChat.current?._id === chat._id
                        )
                          return;
                        LocalStorage.set("currentChat", chat);
                        currentChat.current = chat;
                        setMessage("");
                        getMessages();
                      }}
                      key={chat._id}
                      onChatDelete={(chatId) => {
                        setChats((prev) =>
                          prev.filter((chat) => chat._id !== chatId)
                        );
                        if (currentChat.current?._id === chatId) {
                          currentChat.current = null;
                          LocalStorage.remove("currentChat");
                        }
                      }}
                    />
                  );
                })
            )}
          </div>
        </div>

        {/* Main Chat */}
        <div className="w-9/12 border-l-[0.1px] border-white/20">
          {currentChat.current && currentChat.current?._id ? (
            <>
              <div className="p-4 sticky top-0 bg-dark z-20 flex justify-between items-center w-full border-b-[0.1px] border-white/20">
                <div className="flex justify-between  items-center w-full gap-3">
                  <div className="flex justify-between items-center w-max gap-3">
                    {currentChat.current.isGroupChat ? (
                      <div className="w-14 h-14 relative  flex-shrink-0 flex justify-start items-center flex-nowrap">
                        {currentChat.current.participants
                          .slice(0, 3)
                          .map((participant, i) => {
                            return (
                              <img
                                key={participant._id}
                                src={participant.avatar.url}
                                className={classNames(
                                  "w-9 h-9 border-[0.1px] rounded-full absolute outline-dark bg-white",
                                  i === 0
                                    ? "left-0 z-30"
                                    : i === 1
                                      ? "left-3 z-20"
                                      : i === 2
                                        ? "left-6 z-10"
                                        : ""
                                )}
                              />
                            );
                          })}
                      </div>
                    ) : (
                      <img
                        className="h-14 w-14 rounded-full flex flex-shrink-0 object-cover bg-white"
                        src={getChatObjectMetadata(currentChat.current, user!).avatar
                        }
                      />
                    )}
                    <div>
                      <p className="font-bold">
                        {getChatObjectMetadata(currentChat.current, user!).title}
                      </p>
                      <small className="text-zinc-400">
                        {
                          getChatObjectMetadata(currentChat.current, user!)
                            .description
                        }
                      </small>
                      <div className="text-xs">{isTyping ? <p>Typing...</p> : null}</div>
                    </div>
                  </div>

                  <AddVideoCall
                    open={openVideoCall}
                    onClose={() => {
                      setOpenVideoCall(false)
                    }}
                    currentChat={currentChat}
                    rEmail={getChatObjectMetadata(currentChat.current, user!).description || ""}
                  />
                  <button onClick={() => setOpenVideoCall(true)} className="px-6 py-2 rounded-full hover:bg-blue-200/10 cursor-pointer">
                    <MdVideoCall size={30} />
                  </button>
                </div>
              </div>
              <div
                className={classNames(
                  "p-8 overflow-y-auto flex flex-col-reverse gap-6 w-full",
                  attachedFiles.length > 0
                    ? "h-[calc(100vh-336px)]"
                    : "h-[calc(100vh-176px)]"
                )}
                id="message-window"
              >
                {loadingMessages ? (
                  <div className="flex justify-center items-center h-[calc(100%-88px)]">
                    <Typing />
                  </div>
                ) : (
                  <>
                    {isTyping ? <Typing /> : null}
                    {messages?.map((msg) => {
                      return (
                        <MessageItem
                          key={msg._id}
                          isOwnMessage={msg.sender?._id === user?._id}
                          isGroupChatMessage={currentChat.current?.isGroupChat}
                          message={msg}
                        />
                      );
                    })}
                  </>
                )}
              </div>
              {
                incomingCall && (
                  <div className="absolute right-0 top-[90px] h-24  w-72 bg-black border rounded-md m-3">

                    <div className="w-full h-max p-3">
                      <p className="font-bold text-center">Incoming Call</p>
                    </div>
                    <div className="w-full flex items-start justify-evenly">
                      <button className="w-1/3 border m-1 rounded-md px-4 py-1">Decline</button>
                      <button
                        onClick={handleAcceptCall}
                        className="w-1/3 border m-1 rounded-md px-4 py-1">Accept</button>
                    </div>
                  </div>
                )
              }
              {attachedFiles.length > 0 ? (
                <div className="grid gap-4 grid-cols-5 p-4 justify-start w-full min-w-fit  bg-black/30">
                  {attachedFiles.map((file, i) => {
                    return (
                      <div
                        key={i}
                        className="group w-32 h-32 relative aspect-square rounded-xl cursor-pointer"
                      >
                        <div className="absolute inset-0 flex justify-center items-center w-full h-full bg-black/40 group-hover:opacity-100 opacity-0 transition-opacity ease-in-out duration-150">
                          <button
                            onClick={() => {
                              setAttachedFiles(
                                attachedFiles.filter((_, ind) => ind !== i)
                              );
                            }}
                            className="absolute -top-2 -right-2"
                          >
                            {/* <XCircleIcon className="h-6 w-6 text-white" /> */}
                          </button>
                        </div>
                        <img
                          className="h-full rounded-xl w-full object-cover"
                          src={URL.createObjectURL(file)}
                          alt="attachment"
                        />
                      </div>
                    );
                  })}
                </div>
              ) : null}
              <div className="sticky top-full p-4 flex justify-between items-center w-full gap-2 border-t-[0.1px] border-white/20">
                <input
                  hidden
                  id="attachments"
                  type="file"
                  value=""
                  multiple
                  max={5}
                  onChange={(e) => {
                    if (e.target.files) {
                      setAttachedFiles([...e.target.files]);
                    }
                  }}
                />
                <label
                  htmlFor="attachments"
                  className="p-4 rounded-full bg-dark hover:bg-secondary"
                >
                  {/* <PaperClipIcon className="w-6 h-6" /> */}
                  <GoPaperclip size={30} />
                </label>
                <Input
                  placeholder="Message"
                  // className=""
                  className="block w-full h-12 pl-10 rounded-md outline outline-[1px] text-white/80  focus:ring-1  drop-shadow-xl placeholder:text-sm placeholder:text-white/30  outline-zinc-400/30  px-5 bg-zinc-800/30 text-white"
                  value={message}
                  onChange={handleOnMessageChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendChatMessage();
                    }
                  }}
                />
                <button
                  onClick={sendChatMessage}
                  disabled={!message && attachedFiles.length <= 0}
                  className="p-4 rounded-full bg-dark hover:bg-secondary disabled:opacity-50"
                >
                  {/* <PaperAirplaneIcon className="w-6 h-6" /> */}
                  <IoMdSend size={30} />
                </button>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              No chat selected
            </div>
          )}
        </div>
      </div>
    </>
  );
};

