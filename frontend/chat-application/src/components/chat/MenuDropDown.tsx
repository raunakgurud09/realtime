import { Dispatch, Fragment, SetStateAction } from "react";
import { Menu } from "@headlessui/react";
import { HiDotsVertical } from "react-icons/hi";

import { MdGroupAdd } from "react-icons/md";
import { PiSignOutBold } from "react-icons/pi";
import { RiChatNewLine } from "react-icons/ri";
import { LuUserCog } from "react-icons/lu";

import { useAuth } from "../../context/AuthContext";

export function MyMenu({
  setOpenAddChat,
}: {
  setOpenAddChat: Dispatch<SetStateAction<boolean>>;
}) {
  const { logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
  };

  return (
    <Menu>
      <Menu.Button className="">
        <HiDotsVertical size={20} />
      </Menu.Button>
      <Menu.Items className="absolute z-20 flex flex-col top-16 cursor-pointer right-5 border-[0.1px] border-white/50 rounded-md bg-zinc-800 w-60">
        <div className="border-b border-white/50 p-1">
          <Menu.Item as={Fragment}>
            {({ active }) => (
              <div
                onClick={() => setOpenAddChat(true)}
                className={`px-4 py-2 flex flex-row item-end justify-start   rounded-md text-sm font-medium  ${
                  active ? "bg-white text-black" : "text-white"
                }`}
              >
                <RiChatNewLine size={14} className="mr-2 h-5 " />
                <p>New Chat</p>
              </div>
            )}
          </Menu.Item>
          <Menu.Item as={Fragment}>
            {({ active }) => (
              <div
                onClick={() => setOpenAddChat(true)}
                className={`px-4 py-2 flex flex-row item-end justify-start hover:cursor-pointer  rounded-md text-sm font-medium  ${
                  active ? "bg-white text-black" : "text-white"
                }`}
              >
                <MdGroupAdd size={14} className="mr-2 h-5 " />
                <p>New Group</p>
              </div>
            )}
          </Menu.Item>
        </div>

        <div className="border-b border-white/50 p-1">
          <Menu.Item as={Fragment}>
            {({ active }) => (
              <div
                className={`px-4 py-2 flex flex-row item-end justify-start hover:cursor-pointer  rounded-md text-sm font-medium  ${
                  active ? "bg-white text-black" : "text-white"
                }`}
              >
                <LuUserCog size={14} className="mr-2 h-5 " />
                <p className="">Profile</p>
              </div>
            )}
          </Menu.Item>
          <Menu.Item as={Fragment}>
            {({ active }) => (
              <div
                className={`px-4 py-2 flex flex-row item-end justify-start hover:cursor-pointer  rounded-md text-sm font-medium  ${
                  active ? "bg-white text-red-600" : "text-white"
                }`}
                onClick={handleSignOut}
              >
                <PiSignOutBold size={14} className="mr-2 h-5" />
                <p>Sign Out</p>
              </div>
            )}
          </Menu.Item>
        </div>

        <div className="p-1">
          <Menu.Item as={Fragment}>
            {({ active }) => (
              <p
                // href={link.href}
                className={`px-4 py-2 hover:cursor-pointer  rounded-md text-sm font-medium  ${
                  active ? "bg-red-600 text-white" : "text-white"
                }`}
              >
                Delete
              </p>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
}
