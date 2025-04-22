'use client'
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import socket from "@/lib/socket";
import { useSearchParams } from "next/navigation";
import Chat from "./chat/page";

export default function BoardPage() {
  const searchParams = useSearchParams()
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const isHost = searchParams.get("host")
  const roomId = searchParams.get("roomId")
  const [wordToDraw, setWordToDraw] = useState('Word to be drawn loading...')
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth * 0.5;
    canvas.height = window.innerHeight * 0.8;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.lineWidth = 2;
    context.lineCap = "round";
    context.strokeStyle = "black";
    ctxRef.current = context;

    socket.on("onDraw", ({ x, y }) => {
      if (ctxRef.current) {
        ctxRef.current.lineTo(x, y);
        ctxRef.current.stroke();
      }
    });

    socket.on('guessWord', (word) => {
      console.log('word to be guessed', word)
      setWordToDraw(word)
    })

    // When another player clears the canvas
    socket.on("clearBoard", () => {
      clearCanvas();
    });

    return () => {
      socket.off("onDraw");
      socket.off("clearBoard");
    };
  }, []);

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!ctxRef.current) return;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctxRef.current) return;

    const x = event.nativeEvent.offsetX;
    const y = event.nativeEvent.offsetY;

    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();

    // Emit draw event
    socket.emit("onDraw", { roomId, drawingData: { x, y } });
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      ctxRef.current?.beginPath(); // Optional: reset path to avoid sharp lines
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = ctxRef.current;

    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleClear = () => {
    clearCanvas();
    socket.emit("clearBoard");
  };

  return (
    <div className="flex flex-row justify-between items-center">
      <div className="flex flex-col m-auto">
        {isHost ? 
         <h1 className="text-white font-bold">`{wordToDraw} is your word to draw`</h1>
        : 
        <h1 className="text-white font-bold">Guess this word</h1>}
        {isHost ? <canvas
          ref={canvasRef}
          className="border border-gray-300 bg-white"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        /> : <canvas
          ref={canvasRef}
          className="border border-gray-300 bg-white"
        />}
        {isHost && <Button onClick={handleClear} className="mt-4 bg-sky-900 font-bold">Clear Board</Button>}
      </div>
      <Chat guessWord={wordToDraw} />
    </div>
  );
}
