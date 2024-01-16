import moment from "moment";
import React, { useState } from "react";
import { HiDotsVertical } from "react-icons/hi";

import { deleteOneOnOneChat } from "../../utils/axios";
import { useAuth } from "../../context/AuthContext";
import { ChatListItemInterface } from "../../interface/chat";
import { classNames, getChatObjectMetadata, requestHandler } from "../../utils";

const ChatItem: React.FC<{
  chat: ChatListItemInterface;
  onClick: (chat: ChatListItemInterface) => void;
  isActive?: boolean;
  unreadCount?: number;
  onChatDelete: (chatId: string) => void;
}> = ({ chat, onClick, isActive, unreadCount = 0, onChatDelete }) => {

  const { user } = useAuth();
  const [openOptions, setOpenOptions] = useState(false);

  // Define an asynchronous function named 'deleteChat'.
  const deleteChat = async () => {
    await requestHandler(
      async () => await deleteOneOnOneChat(chat._id),
      null,
      () => {
        onChatDelete(chat._id);
      },
      alert
    );
  };

  if (!chat) return;

  return (
    <>
      <div
        role="button"
        onClick={() => onClick(chat)}
        onMouseLeave={() => setOpenOptions(false)}
        className={classNames(
          "group px-4 py-2 my-2 flex justify-between gap-3 items-start cursor-pointer rounded-lg hover:bg-secondary",
          isActive ? "border-[1px] border-zinc-500/40 bg-zinc-800" : "",
          unreadCount > 0
            ? "border-[1px] border-success bg-success/20 font-bold"
            : ""
        )}
      >
        <div className="h-full w-0 group-hover:w-3 transition-all ease-in-out duration-100" />
        <div className="flex justify-center items-center flex-shrink-0">
          {chat.isGroupChat ? (
            <div className="w-12 relative h-12 flex-shrink-0 flex justify-start items-center flex-nowrap">
              {chat.participants.slice(0, 3).map((participant, i) => {
                return (
                  <img
                    key={participant._id}
                    src={participant.avatar.url}
                    className={classNames(
                      "w-7 h-7 border-[1px] rounded-full absolute  outline-dark group-hover:outline-secondary",
                      i === 0
                        ? "left-0 z-[3]"
                        : i === 1
                          ? "left-2.5 z-[2]"
                          : i === 2
                            ? "left-[18px] z-[1]"
                            : ""
                    )}
                  />
                );
              })}
            </div>
          ) : (
            <img
              src={getChatObjectMetadata(chat, user!).avatar}
              className="w-12 h-12 rounded-full"
            />
          )}
        </div>

        <div className="w-full">
          <p className="truncate-1">
            {getChatObjectMetadata(chat, user!).title}
          </p>
          <div className="w-full inline-flex items-center text-left">
            {chat.lastMessage && chat.lastMessage.attachments.length > 0 ? (
              // If last message is an attachment show paperclip
              <p className="text-white/50 h-3 w-3 mr-2 flex flex-shrink-0" />
            ) : null}
            <small className="text-white/50 truncate-1 text-sm text-ellipsis inline-flex items-center">
              {getChatObjectMetadata(chat, user!).lastMessage}
            </small>
          </div>
        </div>

        <div className="flex text-white/50 h-full text-sm flex-col justify-between items-end">
          <small className="mb-2 inline-flex flex-shrink-0 w-max text-xs font-base">
            {moment(chat.updatedAt).add("TIME_ZONE", "seconds").fromNow(true)} ago
          </small>

          {/* Unread count will be > 0 when user is on another chat and there is new message in a chat which is not currently active on user's screen */}
          {unreadCount <= 0 ? null : (
            <span className="bg-green-800/30 text-green-500 h-2 w-2 aspect-square flex-shrink-0 p-2 text-xs rounded-full inline-flex justify-center items-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpenOptions(!openOptions);
          }}
          className="self-center p-1 relative h-full"
        >
          <div className="mr-2 h-6 group-hover:opacity-100 w-0  transition-all ease-in-out duration-100 text-zinc-300" >
            <HiDotsVertical size={20} />
          </div>
          <div
            className={classNames(
              "z-20 text-left absolute bottom-0 left-[-160px] translate-y-full text-sm w-44 bg-dark rounded-md p-1 bg-zinc-900 shadow-md border-[1px] border-secondary",
              openOptions ? "block" : "hidden"
            )}
          >
            {chat.isGroupChat ? (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                role="button"
                className="px-6 py-2 w-full rounded-md inline-flex items-center hover:font-medium hover:bg-white hover:text-black"
              >
                {/* <span className="h-4 w-4 " >About </span> */}
                About
              </div>
            ) : (
              null)}
            <p
              onClick={(e) => {
                e.stopPropagation();
                const ok = confirm(
                  "Are you sure you want to delete this chat?"
                );
                if (ok) {
                  deleteChat();
                }
              }}
              role="button"
              className="px-6 py-2 text-danger  rounded-md w-full inline-flex items-center hover:bg-red-600 hover:text-white"
            >
              {/* <p className="h-4 w-4 mr-2" /> */}
              Delete chat
            </p>
          </div>
        </button>
      </div>
    </>
  );
};

export default ChatItem;
