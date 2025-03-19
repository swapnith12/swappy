'use client'
import React, { useEffect, useState } from "react";
import Chat from "./chat/page";
import { RandomWordProvider } from "@/hooks/use-randomWord";


export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
  <RandomWordProvider>
  <div className="flex flex-row w-full justify-around">
    <div className="w-3/4 max-w-3xl p-4">{children}</div>
    <div className="w-1/4 max-w-md h-full">
      <Chat />
    </div>
  </div>
  </RandomWordProvider>
  )
}