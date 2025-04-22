'use client';

import { useSearchParams } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useEffect, useRef, useState } from "react";
import socket from "@/lib/socket";

type ChatMessage = {
  message: string;
  sender: string;
};

function Chat({guessWord}:{guessWord:string}) {
  const searchParams = useSearchParams();
  const roomId = searchParams.get('roomId');
  const user = searchParams.get('user');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log("submit",roomId,user)
    e.preventDefault();
    if (!roomId || !user) return;

    const formData = new FormData(e.currentTarget);
    const guessedWord = formData.get("guessedWord")?.toString().trim();
    console.log(guessedWord,"guessedword")
    if (!guessedWord) return;
    console.log(roomId,guessedWord)
    socket.emit("chatMessage", {
      roomId,
      message: guessedWord,
      sender: user,
    });

    // setMessages(prev => [...prev, { message: guessedWord, sender: userId }]);

    if (guessedWord.toLowerCase() === guessWord) {
      alert("🎉 Correct guess!");
      
    }

    e.currentTarget.reset();
  };

  useEffect(() => {
    const handleReceiveMessage = ({ message, sender }: ChatMessage) => {
      console.log(`recieved message ${message}, sender ${sender}`)
      setMessages(prev => [...prev, { message, sender }]);

      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth"  });
      }, 100);
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, []);

  return (
    <div className="border-8 border-sky-900 h-screen min-w-40 max-w-3xs rounded-md p-1 flex flex-col">
      <ScrollArea className="flex-grow space-y-2 p-2">
        {messages.map((msg, i) => (
          <div key={i} className="text-sm font-bold bg-white px-2 py-1 rounded-md shadow">
            <strong>{msg.sender}:</strong> {msg.message}
          </div>
        ))}
        <div ref={scrollRef} />
      </ScrollArea>

      <form onSubmit={handleSubmit} className="flex gap-2 mt-auto p-1">
        <Input
          name="guessedWord"
          ref={inputRef}
          placeholder="Your Guess"
          required
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}

export default Chat;
