'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useEffect, useRef, useState } from "react";
import { useRandomWord } from "@/hooks/use-randomWord";
import socket from "@/lib/socket";

type ChatMessage = {
  message: string;
  sender: string;
};

function Chat() {
  const obj = useRandomWord();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const guessedWord = formData.get("guessedWord")?.toString().trim();
    const roomId = localStorage.getItem("roomID");
    const userID = localStorage.getItem("userID") || "Anonymous";

    if (!guessedWord || !roomId) return;

    // Emit full message structure
    socket.emit("chatMessage", {
      roomId,
      message: guessedWord,
      sender: userID,
    });

    // Check for correct guess locally
    if (guessedWord.toLowerCase() === obj?.randomWord) {
      alert("🎉 Correct guess!");
      obj?.regenerate();
    }

    e.currentTarget.reset();
  };

  useEffect(() => {
    socket.on("receiveMessage", ({ message, sender }: ChatMessage) => {
      setMessages(prev => [...prev, { message, sender }]);

      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  return (
    <div className="border-8 border-teal-900 h-screen min-w-40 max-w-3xs rounded-md p-1 flex flex-col">
      <ScrollArea className="flex-grow space-y-2 p-2">
        {messages.map((msg, i) => (
          <div key={i} className="text-sm bg-white px-2 py-1 rounded-md shadow">
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
