
import { useEffect, useCallback, useState } from "react";
// import ReactPlayer from "react-player";
import peer from "../service/peer";
import { useSocket } from "../context/SocketContext";
import { BiDotsVertical, BiMicrophone, BiMicrophoneOff, BiPhoneOff, BiVideo, BiVideoOff } from "react-icons/bi";
import { Time } from "../components/Room/Time";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { VideoPlayer } from "../components/video/VideoPlayer";

const RoomPage = () => {
  const { io } = useSocket();

  const [myMic, setMyMic] = useState(true)
  const [myVid, setMyVid] = useState(true)

  const [videoPlayerBig, setVideoPlayerBig] = useState(false)

  const { user } = useAuth();

  const [myStream, setMyStream] = useState<MediaStream | null>(null);

  // const [endPopup, setEndPopup] = useState<boolean>(false)

  const [isCallReceiver, setIsCallReceiver] = useState(false)

  const [remoteSocketId, setRemoteSocketId] = useState<string>('');
  const [remoteSocketEmail, setRemoteSocketEmail] = useState<string>('')
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const navigate = useNavigate();


  const handleUserJoined = useCallback(async ({ email, id }: { email: string, id: string | any, user: any }) => {

    console.log(`Email ${email} joined room`);

    setRemoteSocketId(id);
    setRemoteSocketEmail(email)

  }, []);

  const handleCallUser = useCallback(async () => {

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: {
        width: { min: 1024, ideal: 1280, max: 1920 },
        height: { min: 576, ideal: 720, max: 1080 },
      },
    });
    setMyStream(stream);

    const offer = await peer.getOffer();
    io.emit("user:call", { to: remoteSocketId, email: user?.email, offer });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remoteSocketId, io]);


  // useEffect(() => {
  //   const initStream = async () => {
  //     if (myVid) {
  //       try {
  //         const stream = await navigator.mediaDevices.getUserMedia({
  //           audio: true,
  //           video: true
  //         });
  //         setMyStream(stream);
  //       } catch (error) {
  //         console.error("Error accessing user media:", error);
  //       }
  //     } else {
  //       setMyStream(null);
  //     }
  //   };

  //   initStream();

  //   return () => {
  //     if (myStream) {
  //       myStream.getTracks().forEach((track: any) => track.stop());
  //     }
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);


  const handleIncomingCall = useCallback(
    async ({ from, offer, email }: { from: string, email: string, offer: RTCSessionDescription }) => {

      setRemoteSocketId(from);
      setRemoteSocketEmail(email)
      setIsCallReceiver(true)

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: { min: 1024, ideal: 1280, max: 1920 },
          height: { min: 576, ideal: 720, max: 1080 },
        },
      });
      setMyStream(stream);

      console.log(`Incoming Call`, from,);
      const ans = await peer.getAnswer(offer);
      io.emit("call:accepted", { to: from, ans });
    },
    [io]
  );

  const sendStreams = useCallback(() => {
    if (!myStream) return;
    for (const track of myStream.getTracks()) {
      peer.peer?.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }: { from: string, ans: RTCSessionDescription }) => {

      console.log(from)
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    io.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, io]);

  useEffect(() => {
    peer.peer?.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer?.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncoming = useCallback(
    async ({ from, offer }: { from: string, offer: RTCSessionDescription }) => {
      const ans = await peer.getAnswer(offer);
      io.emit("peer:nego:done", { to: from, ans });
    },
    [io]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }: { ans: RTCSessionDescription }) => {
    await peer.setLocalDescription(ans);
  }, []);

  const handleToggleVideoSwitch = () => {
    setMyVid(prev => !prev)
  }

  const handleToggleAudioSwitch = () => {
    setMyMic(prev => !prev)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleCallLeave = () => {

    if (myStream) {
      myStream.getTracks().forEach((track: any) => track.stop());
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach((track: any) => track.stop());
    }

    // create a session end popup
    // cleanup anything remaining
    console.log('end popup')

    io.emit("call:ended", { to: remoteSocketId, end: 'abc' });
    navigate(`/chat`);
  }

  const handleSwitchVideoPlayer = () => {
    setVideoPlayerBig(prev => !prev)
  }

  useEffect(() => {
    // handleCallUser()
    console.log('mount')
    return () => {
      console.log('un-mount')
      // handleCallLeave()
    }
  }, [])

  useEffect(() => {
    peer.peer?.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    io.on("user:joined", handleUserJoined);
    io.on("incoming:call", handleIncomingCall);
    io.on("call:accepted", handleCallAccepted);
    io.on("peer:nego:needed", handleNegoNeedIncoming);
    io.on("peer:nego:final", handleNegoNeedFinal);
    io.on("call:ended", handleCallLeave)

    return () => {
      io.off("user:joined", handleUserJoined);
      io.off("incoming:call", handleIncomingCall);
      io.off("call:accepted", handleCallAccepted);
      io.off("peer:nego:needed", handleNegoNeedIncoming);
      io.off("peer:nego:final", handleNegoNeedFinal);
      io.off("call:ended", handleCallLeave)
    };
  }, [
    io,
    handleUserJoined,
    handleIncomingCall,
    handleCallAccepted,
    handleNegoNeedIncoming,
    handleNegoNeedFinal,
    handleCallLeave
  ]);


  return (
    <div>

      <div className="relative ">

        <div className="space-x-4 h-10 bg-green-500 w-full absolute top-0 z-10 ">
          <h4>{remoteSocketId ? "Connected" : "Waiting to join..."}</h4>
          {myStream && isCallReceiver && <button className="px-6 py-1 border border-white rounded-md" onClick={sendStreams}>Accept</button>}
          {remoteSocketId && !isCallReceiver && <button className="px-6 py-1 border border-white rounded-md" onClick={handleCallUser}>CALL</button>}
        </div>

        <div className="bg-black relative h-screen pt-16">

          <VideoPlayer
            email={user ? user?.email : ''}
            stream={myStream}
            xl={videoPlayerBig}
          />
          <VideoPlayer
            email={remoteSocketEmail}
            stream={remoteStream}
            xl={!videoPlayerBig}
          />

        </div>

      </div>

      <div className="absolute w-full h-20  p-4 bottom-0 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Time />
        </div>

        <div className="w-[300px] h-14 bg-white/10 rounded-full flex items-center justify-between p-2">
          <button
            onClick={handleCallLeave}
            className="bg-red-600 px-4 py-2 rounded-full">
            <BiPhoneOff size={18} />
          </button>

          <div className="space-x-4">
            {
              myMic
                ? (
                  <button
                    onClick={handleToggleAudioSwitch}
                    className="px-4 py-2 rounded-full bg-red-600"
                  >
                    <BiMicrophoneOff />
                  </button>
                )
                : (<button
                  onClick={handleToggleAudioSwitch}
                  className="px-4 py-2 rounded-full bg-green-600"
                >
                  <BiMicrophone />
                </button>)
            }
            {
              myVid
                ?
                <button
                  onClick={handleToggleVideoSwitch}
                  className="bg-red-600 px-4 py-2 rounded-full">
                  <BiVideoOff />
                </button>
                :
                <button
                  onClick={handleToggleVideoSwitch}
                  className="bg-green-600 px-4 py-2 rounded-full">
                  <BiVideo />
                </button>
            }

          </div>
          <button className="bg-white/10 px-2 py-2 rounded-full">
            <BiDotsVertical size={20} />
          </button>
        </div>

        <div>
          <button onClick={handleSwitchVideoPlayer}>options</button>
        </div>
      </div>

    </div>
  );
};

export default RoomPage;
