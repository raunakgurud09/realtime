import { Dialog, Transition } from "@headlessui/react";

import { MdGroups } from "react-icons/md";
import { CiCircleRemove } from "react-icons/ci";


import { Fragment, useCallback, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useAuth } from "../../context/AuthContext";
import { SALT } from "../../constants";
// import { LiveAudioVisualizer } from 'react-audio-visualize';


export const AddVideoCall: React.FC<{
  open: boolean;
  onClose: () => void;
  rEmail: string
}> = ({ open, onClose, rEmail }) => {

  const { user } = useAuth()

  const [audio, setAudio] = useState(false)
  const [video, setVideo] = useState(false)

  const [myStream, setMyStream] = useState<MediaStream | any | null>(null)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const handleClose = async () => {
    onClose();
  };


  const generatedHash = () => {
    console.log(rEmail, user?.email, SALT)
    
  }

  generatedHash()
  useEffect(() => {
    if (!open) return;
  }, [open]);

  // const start = async () => {
  //   const stream = await navigator.mediaDevices.getUserMedia({
  //     audio: audio,
  //     video: video
  //   });


  //   setMyStream(stream)
  //   setMediaRecorder(myStream)
  // }




  useEffect(() => {

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    let stream = null;

    const s = async () => {
      console.log('stream started', video)
      stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: video
      })
      setMyStream(stream)
      return stream
    }

    s()

    return () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (stream) {
        // stream.onremovetrack = () => {
        //   console.log('stream removed')
        // }
      }
    }
  }, [video])


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
                className="relative transform border-[0.1px] border-white/30 shadow-current overflow-x-hidden rounded-lg bg-zinc-900 pb-4 pt-5 text-left transition-all sm:my-8 sm:w-full sm:max-w-3xl "
                style={{
                  overflow: "inherit",
                }}
              >
                <div className="px-6 border-white/50 border-b-[0.1px] pb-6">
                  <div className="flex justify-between items-center">
                    <Dialog.Title
                      as="h3"
                      className="text-3xl font-semibold leading-6 text-white"
                    >
                      Create video chat
                    </Dialog.Title>
                    <button
                      type="button"
                      className="bg-transparent text-xs focus:outline-none focus:ring-0 focus:ring-white focus:ring-offset-0 border px-2 py-1   rounded-md"
                      onClick={() => handleClose()}
                    >
                      ESC
                    </button>
                  </div>
                </div>


                <div className="flex flex-col items-center p-4 space-y-8">
                  <div className="bg-black aspect-video min-h-54">
                    {
                      <ReactPlayer
                        playing
                        muted
                        width=""
                        height=""
                        url={myStream}
                        className="aspect-video"
                      />
                    }
                    {/* {mediaRecorder && (
                      <LiveAudioVisualizer
                        mediaRecorder={mediaRecorder}
                        width={200}
                        height={75}
                      />
                    )} */}

                  </div>
                  <div className="space-x-6">
                    <button
                      // onClick={() => { setAudio(!audio); console.log(audio, video) }}
                      className="h-14 w-14 rounded-full bg-green-600"
                    >
                      mic
                    </button>
                    <button
                      onClick={() => { setVideo(!video) }}
                      className="h-14 w-14 rounded-full bg-green-600"
                    >
                      vid
                    </button>
                  </div>
                </div>


                <div className="px-6 w-full flex justify-center items-center gap-4">
                  <button
                    // disabled={creatingChat}
                    // onClick={isGroupChat ? createNewGroupChat : createNewChat}
                    className="w-1/2 bg-violet-600/80 text-white rounded-md px-4 py-2 font-medium border-2  border-violet-900"
                  >
                    Call
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root >
  );
};
