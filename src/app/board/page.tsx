'use client'
import React, { useState , useRef , useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRandomWord } from "@/hooks/use-randomWord";


export default function page(){
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const obj = useRandomWord();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth * 0.5; 
      canvas.height = window.innerHeight * 0.8; 
      const context = canvas.getContext("2d");
      if (context) {
        context.lineWidth = 2;
        context.lineCap = "round";
        context.strokeStyle = "black";
      }
    }
  }, []);

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.beginPath();
        context.moveTo(
          event.nativeEvent.offsetX,
          event.nativeEvent.offsetY
        );
        setIsDrawing(true);
      }
    }
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.lineTo(
          event.nativeEvent.offsetX,
          event.nativeEvent.offsetY
        );
        context.stroke();
      }
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  return (
    <div>
      <h1>Guess Word: {Array.isArray(obj?.randomWord) ? obj?.randomWord.join(", ") : obj?.randomWord}</h1>
      <canvas
        ref={canvasRef}
        className="border border-gray-300 bg-grey"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <Button onClick={clearCanvas}>
        Clear Board
        </Button>
    </div>
  );
}