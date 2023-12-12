import React, {  useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'
import { LocalStorage } from '../utils/LocalStorage';
import { getChatObjectMetadata, requestHandler } from '../utils';
import { getChatMessage, getUserChats, sendMessage } from '../utils/axios';
import { ChatListItemInterface, ChatMessageInterface } from '../interface/chat';
import Input from '../components/Input';
import ChatItem from '../components/chat/ChatItem';
import MessageItem from '../components/chat/MessageItem';


const CONNECTED_EVENT = "connected";
const JOIN_CHAT_EVENT = "joinChat";
// const DISCONNECT_EVENT = "disconnect";
// const NEW_CHAT_EVENT = "newChat";
// const TYPING_EVENT = "typing";
// const STOP_TYPING_EVENT = "stopTyping";
const MESSAGE_RECEIVED_EVENT = "messageReceived";
// const LEAVE_CHAT_EVENT = "leaveChat";
// const UPDATE_GROUP_NAME_EVENT = "updateGroupName";

export const Chat = () => {

  const { user } = useAuth()
  const { socket } = useSocket()

  const [isConnected, setIsConnected] = useState(false)
  const [chats, setChats] = useState<ChatListItemInterface[]>([])

  const [loadingChats, setLoadingChats] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)

  const [messages, setMessages] = useState<ChatMessageInterface[]>([])

  const [message, setMessage] = useState(""); // To store the currently typed message
  const [localSearchQuery, setLocalSearchQuery] = useState(""); // For local search functionality
  const [unreadMessages, setUnreadMessages] = useState<ChatMessageInterface[]>(
    []
  );

  const currentChat = useRef<ChatListItemInterface | null>(null);

  const onConnect = () => {
    setIsConnected(true);
  };

  const getChats = async () => {
    requestHandler(
      async () => getUserChats(),
      setLoadingChats,
      (res) => {
        const { data } = res;
        setChats(data || [])
      },
      alert
    )
  }

  const getMessages = async () => {

    if (!currentChat.current?._id) return alert("No chat is selected");

    // Check if socket is available, if not, show an alert
    if (!socket) return alert("Socket not available");

    // Emit an event to join the current chat
    socket.emit(JOIN_CHAT_EVENT, currentChat.current?._id);


    requestHandler(
      async () => getChatMessage(currentChat.current?._id || ""),
      setLoadingMessages,
      (res) => {
        const { data } = res
        setMessages(data || [])
      },
      alert
    )
  }


  const sendChatMessage = async () => {
    
    if(message === "") return;
    console.log(message)

    await requestHandler(
      async () => sendMessage(
        currentChat.current?._id || "",
        message,
      ),
      null,
      (res) => {
        setMessage(""); // Clear the message input
        setMessages((prev) => [res.data, ...prev]); // Update messages in the UI
      },
      alert
    )

  }

  useEffect(() => {

    getChats()

    const _currentChat = LocalStorage.get("currentChat")

    if (_currentChat) {
      currentChat.current = _currentChat

      socket?.emit(JOIN_CHAT_EVENT, _currentChat.current?._id)

      getMessages()
    }

  }, [])


  const handleOnMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)

    if (!socket || !isConnected) return;
  }


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
    // updateChatLastMessage(message.chat || "", message);
  };


  useEffect(() => {

    if (!socket) return;

    socket.on(CONNECTED_EVENT, onConnect)
    socket.on(MESSAGE_RECEIVED_EVENT, onMessageReceived);


    return () => {
      socket.off(CONNECTED_EVENT, onConnect)
      socket.off(MESSAGE_RECEIVED_EVENT, onMessageReceived)
    }

  }, [socket])

  // useEffect(() => {
  //   console.log(isConnected)
  // })

  return (
    <div className='w-full flex min-h-screen'>
      <div className="w-1/3 relative ring-white overflow-y-auto px-4 border-r border-white/10">
        <div className="z-10 w-full sticky top-0 bg-dark py-4 flex justify-between items-center gap-4">
          <Input
            placeholder="Search user or group..."
            value={localSearchQuery}
            onChange={(e) =>
              setLocalSearchQuery(e.target.value.toLowerCase())
            }
          />
          <button
            // onClick={() => setOpenAddChat(true)}
            className="rounded-xl border-none bg-primary text-white py-4 px-5 flex flex-shrink-0"
          >
            + Add chat
          </button>
        </div>
        {loadingChats ? (
          <div className="flex justify-center items-center h-[calc(100%-88px)]">
            {/* <Typing /> */}
            <p className='animate-pulse'>Loading chats</p>
          </div>
        ) : (
          // Iterating over the chats array
          [...chats]
            // Filtering chats based on a local search query
            .filter((chat) =>
              // If there's a localSearchQuery, filter chats that contain the query in their metadata title
              localSearchQuery
                ? getChatObjectMetadata(chat, user!)
                  .title?.toLocaleLowerCase()
                  ?.includes(localSearchQuery)
                : // If there's no localSearchQuery, include all chats
                true
            )
            .map((chat) => {
              return (
                <ChatItem
                  chat={chat}
                  isActive={chat._id === currentChat.current?._id}
                  unreadCount={
                    unreadMessages.filter((n) => n.chat === chat._id).length
                  }
                  onClick={(chat: any) => {
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
      <div className='w-full  flex flex-col overflow-x-auto p-2'>
        <div className='w-full h-[calc(100%-88px)] '>
          {currentChat.current && currentChat.current._id ?
            (
              <div>
                {
                  loadingMessages
                    ? (
                      <div>
                        <p className='animate-pulse'>loading message</p>
                      </div>
                    ) : (
                      <div className='flex w-full flex-col-reverse'>
                        {/* <pre>{JSON.stringify(messages, null, 2)}</pre> */}
                        {messages?.map((msg: any) => {
                          return (
                            <MessageItem
                              key={msg._id}
                              isOwnMessage={msg.sender?._id === user?._id}
                              isGroupChatMessage={currentChat.current?.isGroupChat}
                              message={msg}
                            />
                          );
                        })}
                      </div>
                    )
                }
              </div>
            ) : (
              <div className='flex h-full w-full items-center justify-center'>No chat selected</div>
            )}
        </div>
        {/* send messages input bar */}
        <div className='flex-1 sticky bottom-0 flex flex-row '>
          <input type='text'
            className="block w-full rounded-xl outline outline-[1px] outline-zinc-400 border-0 py-4 px-5 bg-secondary text-white font-light placeholder:text-white/70"
            onChange={handleOnMessageChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendChatMessage()
              }
            }}
          />
          <button
            onClick={sendChatMessage}
            className='absolute right-0 bottom-0 top-0 px-4 bg-black rounded-xl '
          >send</button>
        </div>
      </div>
    </div>
  )
}
