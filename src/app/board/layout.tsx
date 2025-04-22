'use client'
import React, { useEffect, useState } from "react";
import Chat from "./chat/page";
import { useRouter } from 'next/navigation';


export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const router = useRouter()
  //  useEffect(() => {
    
  //   if (window.location.pathname !== '/') {
     
  //     router.replace('/');
  //   }
  // }, [router]);

  return (
  <div className="h-screen w-full">
     {children}
  </div>
  )
}