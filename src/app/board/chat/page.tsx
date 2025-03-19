import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import { useRandomWord } from "@/hooks/use-randomWord";

function Chat() {
  const obj = useRandomWord()


  const handleSubmit=(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    if(formData.get("guessedWord")===obj?.randomWord)
    {
      alert("deleted")
      formData.delete("guessedWord")
      obj?.regenerate()
    }
  }


  return (
    <div className="border-8 border-teal-900 h-screen min-w-40 max-w-3xs rounded-md p-1 flex flex-col">
      <ScrollArea className="flex-grow">chat here</ScrollArea>
      <form onSubmit={handleSubmit}>
      <Input name="guessedWord" placeholder="Your Guess" className="mt-auto w-full" required />
      <Button type="submit">Send</Button>
      </form>
    </div>
  );
}

export default Chat;
