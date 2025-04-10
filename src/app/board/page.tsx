'use client'
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRandomWord } from "@/hooks/use-randomWord";
import socket from "@/lib/socket";

export default function BoardPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const obj = useRandomWord();

  useEffect(() => {
    const roomId = localStorage.getItem("roomID")
    const userID = localStorage.getItem("userID")
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
    socket.emit("draw", { x, y });
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
    <div>
      <h1 className="text-xl font-semibold mb-4">
        Guess Word: {Array.isArray(obj?.randomWord) ? obj.randomWord.join(", ") : obj?.randomWord}
      </h1>
      <canvas
        ref={canvasRef}
        className="border border-gray-300 bg-white"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <Button onClick={handleClear} className="mt-4">Clear Board</Button>
    </div>
  );
}
