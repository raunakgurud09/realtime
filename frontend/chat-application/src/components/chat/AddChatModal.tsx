import { Dialog, Switch, Transition } from "@headlessui/react";

import { MdGroups } from "react-icons/md";
import { CiCircleRemove } from "react-icons/ci";



import { Fragment, useEffect, useState } from "react";
import { classNames, requestHandler } from "../../utils";
import Input from "../Input";
import { ChatListItemInterface } from "../../interface/chat";
import { UserInterface } from "../../interface/user";
import Select from "../Select";
import { createGroupChat, createUserChat, getAvailableUsers } from "../../utils/axios";

const AddChatModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onSuccess: (chat: ChatListItemInterface) => void;
}> = ({ open, onClose, onSuccess }) => {

  const [users, setUsers] = useState<UserInterface[]>([]);
  const [groupName, setGroupName] = useState("");
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [groupParticipants, setGroupParticipants] = useState<string[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<null | string>(null);
  const [creatingChat, setCreatingChat] = useState(false);

  const getUsers = async () => {
    requestHandler(
      async () => await getAvailableUsers(),
      null, // No loading setter callback provided
      (res) => {
        const { data } = res; // Extract data from response
        setUsers(data || []); // Set users data or an empty array if data is absent
      },
      alert // Use the alert as the error handler
    );
  };

  const createNewChat = async () => {
    if (!selectedUserId) return alert("Please select a user");

    await requestHandler(
      async () => await createUserChat(selectedUserId),
      setCreatingChat, // Callback to handle loading state
      (res) => {
        const { data } = res; // Extract data from response
        if (res.statusCode === 200) {
          alert("Chat with selected user already exists");
          return;
        }
        onSuccess(data); // Execute the onSuccess function with received data
        handleClose(); // Close the modal or popup
      },
      alert // Use the alert as the error handler
    );
  };

  const createNewGroupChat = async () => {
    if (!groupName) return alert("Group name is required");
    if (!groupParticipants.length || groupParticipants.length < 2)
      return alert("There must be at least 2 group participants");

    await requestHandler(
      async () =>
        await createGroupChat({
          name: groupName,
          participants: groupParticipants,
        }),
      setCreatingChat, // Callback to handle loading state
      (res) => {
        const { data } = res; // Extract data from response
        onSuccess(data); // Execute the onSuccess function with received data
        handleClose(); // Close the modal or popup
      },
      alert // Use the alert as the error handler
    );
  };

  const handleClose = () => {
    setUsers([]);
    setSelectedUserId("");
    setGroupName("");
    setGroupParticipants([]);
    setIsGroupChat(false);
    onClose();
  };

  useEffect(() => {
    if (!open) return;
    getUsers();
  }, [open]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-visible">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className="relative transform border-[0.1px] border-white/30 shadow-current overflow-x-hidden rounded-lg bg-zinc-900 pb-4 pt-5 text-left transition-all sm:my-8 sm:w-full sm:max-w-xl "
                style={{
                  overflow: "inherit",
                }}
              >
                <div className="px-6 border-white/50 pb-6">
                  <div className="flex justify-between items-center">
                    <Dialog.Title
                      as="h3"
                      className="text-3xl font-semibold leading-6 text-white"
                    >
                      Create chat
                    </Dialog.Title>
                    <button
                      type="button"
                      className="bg-transparent text-xs focus:outline-none focus:ring-0 focus:ring-white focus:ring-offset-0 border px-2 py-1   rounded-md"
                      onClick={() => handleClose()}
                    >
                      {/* <span className="sr-only">Close</span> */}
                      {/* <IoClose className="h-6 w-6" aria-hidden="true" /> */}
                      ESC
                    </button>
                  </div>
                </div>

                <div className="px-6">
                  <Switch.Group as="div" className="flex items-center my-5">
                    <Switch
                      checked={isGroupChat}
                      onChange={setIsGroupChat}
                      className={classNames(
                        isGroupChat ? "bg-green-800/30 " : "bg-zinc-800/30",
                        "relative outline outline-[1px] outline-white inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-0"
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={classNames(
                          isGroupChat
                            ? "translate-x-5 bg-green-500"
                            : "translate-x-0 bg-white",
                          "pointer-events-none inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out"
                        )}
                      />
                    </Switch>
                    <Switch.Label as="span" className="ml-3 text-sm">
                      <span
                        className={classNames(
                          "text-white/80 ",
                          isGroupChat ? "" : "opacity-40"
                        )}
                      >
                        Is it a group chat?
                      </span>{" "}
                    </Switch.Label>
                  </Switch.Group>
                  {isGroupChat ? (
                    <div className="my-5">
                      <Input
                        placeholder={"Enter a group name..."}
                        value={groupName}
                        className='"block w-full h-10 rounded-md outline outline-[1px] text-white/80  focus:ring-1  drop-shadow-xl placeholder:text-sm placeholder:text-white/30  outline-zinc-400/30  px-5 bg-zinc-800/30 text-white  placeholder:text-white/70",'
                        onChange={(e) => {
                          setGroupName(e.target.value);
                        }}
                      />
                    </div>
                  ) : null}
                  <div className="my-5">
                    <Select
                      placeholder={
                        isGroupChat
                          ? "Select group participants..."
                          : "Select a user to chat..."
                      }
                      value={isGroupChat ? "" : selectedUserId || ""}
                      options={users.map((user) => {
                        return {
                          label: user.username,
                          value: user._id,
                        };
                      })}
                      onChange={({ value }) => {
                        if (isGroupChat && !groupParticipants.includes(value)) {
                          setGroupParticipants([...groupParticipants, value]);
                        } else {
                          setSelectedUserId(value);
                        }
                      }}
                    />
                  </div>
                  {isGroupChat ? (
                    <div className="my-5">
                      <span
                        className={classNames(
                          "inline-flex items-center text-white/80"
                        )}
                      >
                        <MdGroups className="h-5 w-5 mr-2" />
                        participant
                      </span>{" "}
                      <div className="flex justify-start items-center flex-wrap gap-2 mt-3">
                        {users
                          .filter((user) =>
                            groupParticipants.includes(user._id)
                          )
                          ?.map((participant) => {
                            return (
                              <div
                                className="inline-flex bg-secondary rounded-full p-2 border-[1px] border-zinc-400 items-center gap-2"
                                key={participant._id}
                              >
                                <img
                                  className="h-6 w-6 rounded-full object-cover"
                                  src={participant.avatar.url}
                                />
                                <p className="text-white">
                                  {participant.username}
                                </p>
                                <CiCircleRemove
                                  role="button"
                                  className="w-6 h-6 hover:text-primary cursor-pointer"
                                  onClick={() => {
                                    setGroupParticipants(
                                      groupParticipants.filter(
                                        (p) => p !== participant._id
                                      )
                                    );
                                  }}
                                />
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="px-6 mt-20 w-full flex justify-center items-center gap-4">
                  <button
                    disabled={creatingChat}
                    onClick={isGroupChat ? createNewGroupChat : createNewChat}
                    className="w-1/2 bg-violet-600/80 text-white rounded-md px-4 py-2 font-medium border-2  border-violet-900"
                  >
                    Create
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default AddChatModal;
