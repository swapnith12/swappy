'use client'
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Socket , io } from "socket.io-client";
import { useState } from "react";

export default function Home() {
  const socket = io({path:"/api/socket"})
  const [roomId , setRoomId] = useState<string>("")


  const createRoom = (roomId:string) => {
    socket.emit("create-room", roomId);
};

const joinRoom = (roomId:string) => {
  if (roomId) socket.emit("join-room", roomId);
};

const handleSubmit=(e:React.FormEvent<HTMLFormElement>)=>{
  e.preventDefault()
  const formData = new FormData(e.currentTarget)
  const newRoomId = Math.random().toString(36).substr(2, 5);
  setRoomId(formData.get("roomID")?.toString || newRoomId)

  const action = (e.nativeEvent as SubmitEvent ).submitter?.id

  if (action === "create") {
    createRoom(roomId);
  } else if (action === "join") {
    joinRoom(roomId);
  }

}


  return (
    <div className="flex flex-col justify-between h-60 w-60">
      <Image alt="game logo" src="/rickmorty.jpg" width={300} height={120} />
      <div className="flex flex-row justify-between">
        <form onSubmit={handleSubmit}><Input name="roomID" placeholder="Name" required />
          <Button id="create" type="submit">Create Room</Button>
          <Button id="join" type="submit">Join Room</Button>
        </form>
      </div>
    </div>
  );
}