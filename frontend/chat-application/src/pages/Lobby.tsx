import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";

const LobbyScreen = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");

  const { user } = useAuth()



  const { io } = useSocket();
  const navigate = useNavigate();

  const handleSubmitForm = useCallback(
    (e: any) => {
      e.preventDefault();
      io.emit("room:join", { email, room });
    },
    [email, room, io]
  );

  const handleJoinRoom = useCallback(
    (data: { email: string, room: string | number }) => {
      const { email, room } = data;
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

  return (
    <div>
      <h1>Lobby</h1>
      <form onSubmit={handleSubmitForm}>
        <label htmlFor="email">Email ID</label>
        <input
          type="email"
          id="email"
          value={user ? user.email : email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label htmlFor="room">Room Number</label>
        <input
          type="text"
          id="room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <br />
        <button>Join</button>
      </form>
    </div>
  );
};

export default LobbyScreen;
