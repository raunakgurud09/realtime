// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import peer from "../service/peer";
import { useSocket } from "../context/SocketContext";
import { BiDotsVertical, BiMicrophone, BiMicrophoneOff, BiPhoneOff, BiVideo, BiVideoOff } from "react-icons/bi";
import { Time } from "../components/Room/Time";

const RoomPage = () => {
  const { io } = useSocket();

  const [myMic, setMyMic] = useState(true)
  const [myVid, setMyVid] = useState(true)

  const [myStream, setMyStream] = useState();

  
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [remoteEmail, setRemoteEmail] = useState('')
  const [remoteStream, setRemoteStream] = useState();

  const handleUserJoined = useCallback(({ email, id }: { email: string, id: string | any }) => {
    console.log(`Email ${email} joined room`);
    setRemoteEmail(email)
    setRemoteSocketId(id);



    // handleCallUser()
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    io.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, io]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      io.emit("call:accepted", { to: from, ans });
    },
    [io]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
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
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      io.emit("peer:nego:done", { to: from, ans });
    },
    [io]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  const handleToggleVideoSwitch = () => {
    setMyVid(prev => !prev)
  }

  const handleToggleAudioSwitch = () => {
    setMyMic(prev => !prev)
  }

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    io.on("user:joined", handleUserJoined);
    io.on("incomming:call", handleIncommingCall);
    io.on("call:accepted", handleCallAccepted);
    io.on("peer:nego:needed", handleNegoNeedIncomming);
    io.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      io.off("user:joined", handleUserJoined);
      io.off("incomming:call", handleIncommingCall);
      io.off("call:accepted", handleCallAccepted);
      io.off("peer:nego:needed", handleNegoNeedIncomming);
      io.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    io,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);


  return (
    <div>

      <div>
        {/* <AudioAnalyzer audio={myStream} /> */}
      </div>
      <h4>{remoteSocketId ? "Connected" : "No one in room"}</h4>
      {myStream && <button onClick={sendStreams}>Send Stream</button>}
      {remoteSocketId && <button onClick={handleCallUser}>CALL</button>}
      {myStream && (
        <>
          <h1>My Stream</h1>
          <ReactPlayer
            playing
            muted
            height="300px"
            width="500px"
            url={myStream}
            className=""
          />
        </>
      )}
      {remoteStream && (
        <>
          <h1>Remote Stream</h1>
          <ReactPlayer
            playing
            muted
            height="100px"
            width="200px"
            url={remoteStream}
          />
        </>
      )}

      <div className="w-full h-20 absolute p-4 bottom-0 flex items-center justify-between">

        <div className="flex items-center space-x-4">
          <Time />
        </div>

        <div className="w-[300px] h-14 bg-black rounded-full flex items-center justify-between p-2">
          <button className="bg-red-600 px-4 py-2 rounded-full">
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
          {remoteEmail}
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
