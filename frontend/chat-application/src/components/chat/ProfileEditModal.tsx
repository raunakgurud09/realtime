import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react'

import { IoArrowBack } from "react-icons/io5";
import { BiSolidCameraPlus } from "react-icons/bi";
import { FaPen } from "react-icons/fa";



import { useAuth } from '../../context/AuthContext';


export const ProfileEditModal: React.FC<{
  open: boolean,
  onClose: () => void
}> = ({ open, onClose }) => {

  const { user } = useAuth()

  const [attachedImage, setAttachedImage] = useState<File>()


  useEffect(() => {
    if (!open) return;
  }, [open]);

  const handleClose = () => {
    onClose()
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed left-0 top-0 bottom-0 z-10 overflow-y-visible w-full rounded-r-full">
          <div className="flex min-h-full w-3/12 items-end justify-center text-center sm:items-center sm:p-0 rounded-r-full">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel
                className="relative transform overflow-x-hidden rounded-lg  h-screen text-left shadow-xl transition-all sm:w-full "
                style={{ 
                  overflow: "inherit",
                }}
              >
                <div className='flex justify-start items-center bg-black gap-4 pt-20 pb-5 px-6 border-b border-white/20 rounded-tr-3xl'>
                  <IoArrowBack size={20}
                    className="hover:cursor-pointer"
                    onClick={() => handleClose()}
                  />
                  <p className='text-2xl'>Profile</p>
                </div>
                <div className='flex flex-col justify-start items-center bg-zinc-900 w-full h-full'>
                  <div className='relative flex items-center justify-center m-8 group group-hover:border-[1px] border-white hover:cursor-pointer'>
                    <img
                      className="h-60 w-60 rounded-full flex flex-shrink-0 object-contain bg-white"
                      src={user?.avatar.url}
                      alt="user"
                    />
                    <input
                      hidden
                      id="profile"
                      type="file"
                      value=""
                      max={1}
                      onChange={(e) => {
                        if (e.target.files) {
                          setAttachedImage(e.target.files[0]);
                        }
                      }}
                      placeholder='hi'
                      className='absolute flex flex-col item-center justify-center w-full rounded-full z-40  h-full opacity-0'
                    />

                    <div
                      onClick={() => console.log(attachedImage)}
                      className='absolute flex flex-col item-center justify-center w-full text-white  z-30 opacity-0 group-hover:opacity-90 h-full  group-hover:bg-black rounded-full'
                    >
                      <span className='w-full flex justify-center'>
                        <BiSolidCameraPlus size={20} />
                      </span>
                      <span className='text-center text-sm'>
                        EDIT PROFILE IMAGE
                      </span>
                    </div>
                  </div>
                  <div className='w-full h-40 flex flex-col p-6'>
                    <div>
                      <span className='text-purple-700'>Name</span>
                      <div className='flex items-center justify-between'>
                        <p>{user?.username}</p>
                        <FaPen />
                      </div>
                    </div>
                    <div>
                      <span className='text-purple-700'>Email</span>
                      <div className='flex items-center justify-between'>
                        <p>{user?.email}</p>
                        <FaPen />
                      </div>
                    </div>
                  </div>
                  <div className=' w-full bottom-0 flex flex-row items-center justify-center'>
                    {attachedImage &&
                      <>
                        <img
                          className="h-full rounded-xl w-full object-cover"
                          src={URL.createObjectURL(attachedImage)}
                          alt="attachment"
                        />
                      </>
                    }
                    <button
                      onClick={() => { console.log(attachedImage) }}
                      className='bg-red-600 px-8 py-2 rounded-full'
                    >
                      Delete account
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
