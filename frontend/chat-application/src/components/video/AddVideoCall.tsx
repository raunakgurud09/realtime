import { Dialog, Transition } from "@headlessui/react";

// import { MdGroups } from "react-icons/md";
// import { CiCircleRemove } from "react-icons/ci";


import { Fragment, useCallback, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useAuth } from "../../context/AuthContext";
// import { SALT } from "../../constants";
// import { nanoid } from 'nanoid'
import { useNavigate } from "react-router-dom";
import { requestHandler } from "../../utils";
import { createIncomingCall } from "../../utils/axios";
// import { ChatListItemInterface } from "../../interface/chat";
import { useSocket } from "../../context/SocketContext";
import AudioAnalyzer from "../Audio/AudioAnalyzer";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";

// import { LiveAudioVisualizer } from 'react-audio-visualize';


export const AddVideoCall: React.FC<{
  open: boolean;
  onClose: () => void;
  rEmail: string
  currentChat: any
}> = ({ open, onClose, currentChat }) => {

  const { user } = useAuth()
  const { io } = useSocket();

  const [audio, setAudio] = useState<boolean>(false)
  const [video, setVideo] = useState<boolean>(false)

  // const [roomId, setRoomId] = useState<string>('')

  const [myStream, setMyStream] = useState<MediaStream | null>(null)
  // const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const navigate = useNavigate();

  const handleClose = async () => {
    if (myStream) {
      myStream.getTracks().forEach((track: any) => track.stop());
    }
    onClose();
  };

  useEffect(() => {
    if (!open) return;
  }, [open]);

  const handleSubmitForm = useCallback(
    (room: string) => {
      io.emit("room:join", { email: user?.email, room: room, user: user });
    },
    [user, io]
  );

  const handleJoinRoom = useCallback(
    (data: { email: string, room: string | number }) => {
      const { room } = data;

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

  useEffect(() => {
    const initStream = async () => {
      if (open && video) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
          });
          setMyStream(stream);
        } catch (error) {
          console.error("Error accessing user media:", error);
        }
      } else {
        setMyStream(null);
      }
    };

    initStream();

    return () => {
      if (myStream) {
        myStream.getTracks().forEach((track: any) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, video]);


  const handleToggleVideo = () => {
    setVideo(prevState => !prevState);

    if (myStream) {
      myStream.getTracks().forEach((track) => track.stop())
    }
  };

  const handleToggleAudio = () => {
    setAudio(prev => !prev);
  }


  const createNewCall = async () => {

    await requestHandler(
      async () => await createIncomingCall(currentChat?.current?._id || ""),
      null, // Callback to handle loading state
      async (res) => {

        const { data } = res; // Extract data from response
        if (res.statusCode === 200) {
          alert("Chat with selected user already exists");
          return;
        }

        // setRoomId(data)

        // await sleep(1)
        handleSubmitForm(data)
        // handleJoinRoom({ email: user?.email || "", room: data })
      },
      alert
    );
  };




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
                <div className="px-6 border-white/50  pb-6">
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
                  <div className="bg-black aspect-video min-h-54 relative rounded-lg">
                    {
                      <ReactPlayer
                        playing
                        muted
                        width=""
                        height="300px"
                        url={myStream ? myStream : ''}
                        className="aspect-video rounded-lg"
                      />
                    }
                    <div className="absolute bottom-4 left-4">
                      {myStream && audio && <AudioAnalyzer audio={myStream} />}
                    </div>

                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={handleToggleAudio}
                      className={`h-14 w-14 flex items-center justify-center rounded-full bg-green-600 ${!audio ? "bg-red-600" : ""}`}
                    >
                      {!audio ? <MicOff /> : <Mic />}
                    </button>
                    <button
                      onClick={handleToggleVideo}
                      className={`h-14 w-14 flex items-center justify-center rounded-full bg-green-600 ${!video ? "bg-red-600" : ""
                        }`}
                    >
                      {!video ? <VideoOff /> : <Video />}
                    </button>

                  </div>
                </div>


                <div className="px-6 w-full flex justify-center items-center gap-4">
                  <button
                    onClick={createNewCall}
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
