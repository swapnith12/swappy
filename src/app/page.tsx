import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div className="flex flex-col justify-between h-60 w-60">

      <Image alt="game logo" src="/rickmorty.jpg" width={300} height={120} />
      <div className="flex flex-row justify-between">
        <form><Input placeholder="Name" required/>
          <Button type="submit">Create Room</Button>
          <Button type="submit">Join Room</Button>
        </form>
      </div>
    </div>
  );
}