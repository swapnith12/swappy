'use client'

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { userFetch } from "@/(server)/actions/user/userFetch";
import { useRouter } from "next/navigation";
import socket from "@/lib/socket";
export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const roomID = formData.get("roomID")?.toString().trim();
    const action = (e.nativeEvent as SubmitEvent).submitter?.id;

    if (!roomID) {
      setError("Room ID is required");
      setLoading(false);
      return;
    }
    const session = await userFetch();
    try {
      
      if (!session || !session.sessionToken || !session.user) {
        throw new Error("Invalid session or user");
      }

      const endpoint =
        action === "create"
          ? "http://localhost:4000/createRoom"
          : "http://localhost:4000/joinRoom";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.sessionToken}`,
        },
        body: JSON.stringify({
          code: roomID,
          userId: session.user,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }


      console.log(`${action === "create" ? "Created" : "Joined"} room`, data.room);
      if (action==='create'){
        socket.emit("roomCreated", { roomCode: roomID, hostID: session.user });
        router.push(`/board?roomId=${roomID}&user=${session?.username}`)
      }
      else{
        socket.emit("joinRoom", { roomCode: roomID, userID: session.user });
        router.push(`/board?roomId=${roomID}&user=${session?.username}`)
      }
      // toast.success(`${action === "create" ? "Room created" : "Joined room"} successfully`)
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
      // toast.error(err.message || "Something went wrong")
    } 
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-60">
      <Image alt="game logo" src="/rickmorty.jpg" width={300} height={120} />
      <form onSubmit={handleSubmit} className="w-full space-y-2">
        <Input name="roomID" placeholder="Enter Room Code" required />
        <div className="flex justify-between">
          <Button id="create" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Room"}
          </Button>
          <Button id="join" type="submit" disabled={loading}>
            {loading ? "Joining..." : "Join Room"}
          </Button>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  );
}
